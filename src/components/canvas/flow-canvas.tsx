"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
  useViewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type {
  ToolMode,
  CanvasNode,
  TextNodeData,
  ConceptCardData,
  ImageUploadData,
  GoalCardData,
  PerplexityCardData,
  DigitalTwinData,
  DebateOutputData,
  NodeInput,
} from "@/types/canvas";
import { initialNodes, initialColorLabels } from "@/config/initial-data";
import { NODE_COLORS, SNAP_GRID } from "@/config/constants";
import { loadCanvas, useCanvasStorage } from "@/hooks/use-canvas-storage";
import type { ColorLabels } from "@/hooks/use-canvas-storage";
import { NodeEditorContext } from "@/hooks/use-node-editor";
import { CanvasActionsContext } from "@/hooks/use-canvas-actions";
import { NodeEditDrawer } from "./node-edit-drawer";
import { TextNodeComponent_ } from "./text-node";
import { ConceptCardNodeComponent_ } from "./concept-card-node";
import { ImageNodeComponent_ } from "./image-node";
import { GoalCardNodeComponent_ } from "./goal-card-node";
import { PerplexityCardNodeComponent_ } from "./perplexity-card-node";
import { DigitalTwinNodeComponent_ } from "./digital-twin-node";
import { SynthesisOutputNodeComponent_ } from "./synthesis-output-node";
import { DebateOutputNodeComponent_ } from "./debate-output-node";
import { AmbientGlow } from "./ambient-glow";
import { DotGlowBackground } from "./dot-glow-background";
import { CanvasToolbar } from "./canvas-toolbar";
import { ColorFilterBar } from "./color-filter-bar";
import { PromptBar } from "@/components/prompt/prompt-bar";
import { StatusBar } from "@/components/panels/status-bar";
import type { FlowTemplate } from "@/config/flow-templates";

let nodeIdCounter = 100;
function nextId() {
  return `node-${++nodeIdCounter}`;
}

function buildNodeData(type: string) {
  switch (type) {
    case "text":
      return { text: "", color: NODE_COLORS.text };
    case "conceptCard":
      return { title: "", description: "", tags: [], color: NODE_COLORS.conceptCard };
    case "imageUpload":
      return { src: null, caption: "", color: NODE_COLORS.imageUpload };
    case "goalCard":
      return { title: "", successCriteria: "", timeframe: "", priority: "medium" as const, color: NODE_COLORS.goalCard };
    case "perplexityCard":
      return { question: "", context: "", isBlocking: false, color: NODE_COLORS.perplexityCard };
    case "digitalTwin":
      return { name: "", mode: "collabora" as const, personality: "", lastResponse: "", status: "idle" as const, color: NODE_COLORS.digitalTwin };
    default:
      return {};
  }
}

function nodeToInput(node: CanvasNode): NodeInput | null {
  if (node.type === "text") {
    const d = node.data as unknown as TextNodeData;
    return d.text ? { nodeId: node.id, nodeType: "text", role: "context", content: d.text } : null;
  }
  if (node.type === "conceptCard") {
    const d = node.data as unknown as ConceptCardData;
    return (d.title || d.description)
      ? { nodeId: node.id, nodeType: "conceptCard", role: "idea", content: `${d.title}: ${d.description}`, metadata: { tags: d.tags.join(", ") } }
      : null;
  }
  if (node.type === "imageUpload") {
    const d = node.data as unknown as ImageUploadData;
    return d.caption ? { nodeId: node.id, nodeType: "imageUpload", role: "evidence", content: d.caption } : null;
  }
  if (node.type === "goalCard") {
    const d = node.data as unknown as GoalCardData;
    return d.title
      ? { nodeId: node.id, nodeType: "goalCard", role: "goal", content: `${d.title} (success: ${d.successCriteria})`, metadata: { priority: d.priority, timeframe: d.timeframe } }
      : null;
  }
  if (node.type === "perplexityCard") {
    const d = node.data as unknown as PerplexityCardData;
    return d.question
      ? { nodeId: node.id, nodeType: "perplexityCard", role: "question", content: d.question, metadata: { isBlocking: String(d.isBlocking), ...(d.context ? { context: d.context } : {}) } }
      : null;
  }
  if (node.type === "digitalTwin") {
    const d = node.data as unknown as DigitalTwinData;
    return { nodeId: node.id, nodeType: "digitalTwin", role: "perspective", content: `[${d.mode.toUpperCase()} - ${d.name || "Unnamed"}]`, metadata: { mode: d.mode, personality: d.personality } };
  }
  return null;
}

function FlowCanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [activeTool, setActiveTool] = useState<ToolMode>("select");
  const [runningAction, setRunningAction] = useState<"idle" | "synthesize" | "debate">("idle");
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [isNewNode, setIsNewNode] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [colorLabels, setColorLabels] = useState<ColorLabels>(initialColorLabels);
  const { zoomIn, zoomOut, fitView, screenToFlowPosition, getNodes } = useReactFlow();
  const viewport = useViewport();
  const { save, exportJSON, importJSON } = useCanvasStorage();

  // Hydrate from localStorage after mount
  useEffect(() => {
    const saved = loadCanvas();
    if (saved.nodes !== initialNodes) {
      setNodes(saved.nodes);
    }
    setColorLabels(saved.colorLabels);
    for (const n of saved.nodes) {
      const match = n.id.match(/^node-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= nodeIdCounter) nodeIdCounter = num + 1;
      }
    }
    setHydrated(true);
  }, [setNodes]);

  // Auto-save on every node change (only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    save(nodes, colorLabels);
  }, [nodes, colorLabels, save, hydrated]);

  const openEditor = useCallback((nodeId: string, isNew = false) => {
    setEditingNodeId(nodeId);
    setIsNewNode(isNew);
  }, []);

  const closeEditor = useCallback(() => {
    setEditingNodeId(null);
    setIsNewNode(false);
  }, []);

  const nodeTypes = useMemo(
    () => ({
      text: TextNodeComponent_,
      conceptCard: ConceptCardNodeComponent_,
      imageUpload: ImageNodeComponent_,
      goalCard: GoalCardNodeComponent_,
      perplexityCard: PerplexityCardNodeComponent_,
      digitalTwin: DigitalTwinNodeComponent_,
      synthesisOutput: SynthesisOutputNodeComponent_,
      debateOutput: DebateOutputNodeComponent_,
    }),
    [],
  );

  const getColorColumnBottom = useCallback(
    (color: string) => {
      const siblings = getNodes().filter((n) => (n.data as { color?: string }).color === color);
      if (siblings.length === 0) return screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      const bottom = siblings.reduce((a, b) => (b.position.y > a.position.y ? b : a));
      return { x: bottom.position.x, y: bottom.position.y + 250 };
    },
    [getNodes, screenToFlowPosition],
  );

  const handleAddNode = useCallback(
    (type: "text" | "conceptCard" | "imageUpload" | "goalCard" | "perplexityCard" | "digitalTwin") => {
      const id = nextId();
      const newData = buildNodeData(type);
      const pos = getColorColumnBottom((newData as { color?: string }).color!);

      setNodes((nds) => [...nds, { id, type, position: pos, data: newData } as CanvasNode]);
      requestAnimationFrame(() => openEditor(id, true));
    },
    [getColorColumnBottom, setNodes, openEditor],
  );

  const handleSmartCreate = useCallback(
    async (prompt: string) => {
      const res = await fetch("/api/smart-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("AI generation failed");
      const { nodeType, data } = await res.json();

      const defaults = buildNodeData(nodeType) as Record<string, unknown>;
      const mergedData = { ...defaults, ...data };

      const pos = getColorColumnBottom((mergedData as { color?: string }).color!);
      setNodes((nds) => [...nds, { id: nextId(), type: nodeType, position: pos, data: mergedData } as CanvasNode]);
    },
    [getColorColumnBottom, setNodes],
  );

  // Think: a single twin generates its opinion based on same-color content cards
  const handleThinkTwin = useCallback(
    async (twinNodeId: string) => {
      const twinNode = nodes.find((n) => n.id === twinNodeId);
      if (!twinNode || twinNode.type !== "digitalTwin") return;

      const d = twinNode.data as unknown as DigitalTwinData;
      const color = d.color;

      // Collect content cards of the same color (no twins, no synthesis, no debate, no run)
      const contentTypes = new Set(["text", "conceptCard", "imageUpload", "goalCard", "perplexityCard"]);
      const contentNodes = nodes.filter((n) => contentTypes.has(n.type!) && (n.data as { color?: string }).color === color);
      const inputs = contentNodes.map(nodeToInput).filter(Boolean) as NodeInput[];
      if (inputs.length === 0) return;

      const boardContext = inputs.map((i) => `[${i.role.toUpperCase()}] ${i.content}`).join("\n");

      // Set twin to thinking
      setNodes((nds) =>
        nds.map((n) =>
          n.id === twinNodeId
            ? { ...n, data: { ...n.data, status: "thinking", lastResponse: "" } as DigitalTwinData } as CanvasNode
            : n
        ),
      );

      try {
        const res = await fetch("/api/twin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: d.name || "Unnamed",
            mode: d.mode,
            personality: d.personality,
            synthesis: "",
            boardContext,
          }),
        });

        if (!res.ok) throw new Error(`Twin API error: ${res.status}`);
        const json = await res.json();

        setNodes((nds) =>
          nds.map((n) =>
            n.id === twinNodeId
              ? { ...n, data: { ...n.data, status: "done", lastResponse: json.response } as DigitalTwinData } as CanvasNode
              : n
          ),
        );
      } catch (err) {
        console.error("Think failed:", err);
        setNodes((nds) =>
          nds.map((n) =>
            n.id === twinNodeId
              ? { ...n, data: { ...n.data, status: "idle" } as DigitalTwinData } as CanvasNode
              : n
          ),
        );
      }
    },
    [nodes, setNodes],
  );

  // Synthesize: content cards + debate output of a color → structured synthesis
  const handleRunByColor = useCallback(
    async (color: string) => {
      // Content types + debateOutput (which feeds into synthesis)
      const inputTypes = new Set(["text", "conceptCard", "imageUpload", "goalCard", "perplexityCard", "debateOutput"]);
      const contentNodes = nodes.filter((n) => inputTypes.has(n.type!) && (n.data as { color?: string }).color === color);

      const inputs: NodeInput[] = contentNodes.map((n) => {
        if (n.type === "debateOutput") {
          const dd = n.data as unknown as DebateOutputData;
          const transcript = dd.transcript.map((t) => `${t.name}: ${t.text}`).join("\n\n");
          return { nodeId: n.id, nodeType: "debateOutput", role: "context" as const, content: `[DEBATE TRANSCRIPT]\n${transcript}` };
        }
        return nodeToInput(n);
      }).filter(Boolean) as NodeInput[];

      if (inputs.length === 0) return;

      setRunningAction("synthesize");

      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputs }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const json = await res.json();
        const synthesis = json.result || "No result";
        const title = json.title || "";

        const pos = getColorColumnBottom(color);
        const newNode: CanvasNode = {
          id: nextId(),
          type: "synthesisOutput",
          position: pos,
          data: {
            sourceRunNodeId: "",
            title,
            synthesis,
            timestamp: Date.now(),
            label: "Synthesis",
            color,
          },
        } as CanvasNode;
        setNodes((nds) => [...nds, newNode]);
      } catch (err) {
        console.error("Synthesize failed:", err);
      }

      setRunningAction("idle");
    },
    [nodes, setNodes, getColorColumnBottom],
  );

  // Debate: twins with responses discuss in turns, then create a Debate Output card
  const handleDebate = useCallback(
    async (color: string) => {
      // Only twins that have already generated a response
      const twinNodes = nodes.filter((n) => {
        if (n.type !== "digitalTwin") return false;
        const d = n.data as unknown as DigitalTwinData;
        return d.color === color && d.lastResponse;
      });
      if (twinNodes.length < 2) return;

      const twinNodeIds = twinNodes.map((n) => n.id);

      setRunningAction("debate");

      // Set twins to debating (keep lastResponse for context)
      setNodes((nds) =>
        nds.map((n) =>
          twinNodeIds.includes(n.id)
            ? { ...n, data: { ...n.data, status: "debating" } as DigitalTwinData } as CanvasNode
            : n
        ),
      );

      // Build board context from content cards + twin opinions
      const contentTypes = new Set(["text", "conceptCard", "imageUpload", "goalCard", "perplexityCard"]);
      const contentNodes = nodes.filter((n) => contentTypes.has(n.type!) && (n.data as { color?: string }).color === color);
      const inputs = contentNodes.map(nodeToInput).filter(Boolean) as NodeInput[];
      const boardLines = inputs.map((i) => `[${i.role.toUpperCase()}] ${i.content}`);

      // Include each twin's prior opinion
      for (const tn of twinNodes) {
        const d = tn.data as unknown as DigitalTwinData;
        boardLines.push(`[OPINION - ${d.name}] ${d.lastResponse}`);
      }
      const boardContext = boardLines.join("\n");

      const twins = twinNodes.map((n) => {
        const d = n.data as unknown as DigitalTwinData;
        return { nodeId: n.id, name: d.name || "Unnamed", mode: d.mode, personality: d.personality };
      });

      try {
        const res = await fetch("/api/debate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ twins, boardContext, rounds: 1 }),
        });

        if (!res.ok) throw new Error(`Debate API error: ${res.status}`);
        const json = await res.json();
        const responses: Record<string, string> = json.responses || {};
        const transcript: Array<{ name: string; text: string }> = json.transcript || [];

        // Update twin responses
        setNodes((nds) =>
          nds.map((n) =>
            responses[n.id]
              ? { ...n, data: { ...n.data, status: "done", lastResponse: responses[n.id] } as DigitalTwinData } as CanvasNode
              : n
          ),
        );

        // Create Debate Output card
        const pos = getColorColumnBottom(color);
        const debateNode: CanvasNode = {
          id: nextId(),
          type: "debateOutput",
          position: pos,
          data: {
            transcript: transcript.map((t) => ({ name: t.name, text: t.text })),
            summary: transcript.map((t) => `${t.name}: ${t.text}`).join("\n\n"),
            timestamp: Date.now(),
            label: "Debate",
            color,
          },
        } as CanvasNode;
        setNodes((nds) => [...nds, debateNode]);
      } catch (err) {
        console.error("Debate failed:", err);
        setNodes((nds) =>
          nds.map((n) =>
            twinNodeIds.includes(n.id)
              ? { ...n, data: { ...n.data, status: "idle" } as DigitalTwinData } as CanvasNode
              : n
          ),
        );
      }

      setRunningAction("idle");
    },
    [nodes, setNodes, getColorColumnBottom],
  );

  const handleLoadTemplate = useCallback(
    (template: FlowTemplate) => {
      setNodes(template.nodes);
      requestAnimationFrame(() => fitView({ padding: 0.2 }));
    },
    [setNodes, fitView],
  );

  const handleExport = useCallback(() => {
    exportJSON(nodes);
  }, [nodes, exportJSON]);

  const handleImport = useCallback(async () => {
    const imported = await importJSON();
    if (imported) {
      setNodes(imported);
      requestAnimationFrame(() => fitView({ padding: 0.2 }));
    }
  }, [importJSON, setNodes, fitView]);

  // Unique colors present on canvas (excluding synthesis outputs)
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    for (const n of nodes) {
      if (n.type === "synthesisOutput") continue;
      const c = (n.data as { color?: string }).color;
      if (c) set.add(c);
    }
    return Array.from(set);
  }, [nodes]);

  // Colors that have 2+ twins (for gradient display)
  const twinPairColors = useMemo(() => {
    const countByColor = new Map<string, number>();
    for (const n of nodes) {
      if (n.type !== "digitalTwin") continue;
      const c = (n.data as { color?: string }).color;
      if (c) countByColor.set(c, (countByColor.get(c) || 0) + 1);
    }
    return Array.from(countByColor.entries())
      .filter(([, count]) => count >= 2)
      .map(([hex]) => hex);
  }, [nodes]);

  // Colors that have 2+ twins with a generated response (eligible for debate click)
  const debateColors = useMemo(() => {
    const readyByColor = new Map<string, number>();
    for (const n of nodes) {
      if (n.type !== "digitalTwin") continue;
      const d = n.data as unknown as DigitalTwinData;
      if (d.lastResponse) {
        readyByColor.set(d.color, (readyByColor.get(d.color) || 0) + 1);
      }
    }
    return Array.from(readyByColor.entries())
      .filter(([, count]) => count >= 2)
      .map(([hex]) => hex);
  }, [nodes]);

  const nodeEditorValue = useMemo(
    () => ({ editingNodeId, isNewNode, openEditor, closeEditor }),
    [editingNodeId, isNewNode, openEditor, closeEditor],
  );

  const canvasActionsValue = useMemo(
    () => ({ onThinkTwin: handleThinkTwin }),
    [handleThinkTwin],
  );

  return (
    <CanvasActionsContext value={canvasActionsValue}>
    <NodeEditorContext value={nodeEditorValue}>
      <div className="relative h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={[]}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          panOnDrag={activeTool === "hand" ? true : [1]}
          selectionOnDrag={activeTool === "select"}
          nodesConnectable={false}
          snapToGrid
          snapGrid={SNAP_GRID}
          minZoom={0.3}
          maxZoom={2}
          fitView
          fitViewOptions={{ padding: 0.2, includeHiddenNodes: true }}
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={["Backspace", "Delete"]}
          style={{
            ["--xy-background-color" as string]: "var(--color-background)",
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1}
            color="#666"
          />
          <DotGlowBackground />
        </ReactFlow>

        <AmbientGlow active={runningAction !== "idle"} />

        {/* Overlays */}
        <ColorFilterBar nodes={nodes} colorLabels={colorLabels} onColorLabelChange={(hex, label) => setColorLabels((prev) => ({ ...prev, [hex]: label }))} />
        <CanvasToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onLoadTemplate={handleLoadTemplate}
          onExport={handleExport}
          onImport={handleImport}
          hasContent={nodes.length > 0}
        />
        <PromptBar
          onAddNode={handleAddNode}
          onSmartCreate={handleSmartCreate}
          onRunByColor={handleRunByColor}
          onDebate={handleDebate}
          runningAction={runningAction}
          availableColors={availableColors}
          debateColors={debateColors}
          twinPairColors={twinPairColors}
        />
        <StatusBar
          zoom={viewport.zoom}
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFitView={() => fitView({ padding: 0.1 })}
        />
        <NodeEditDrawer />
      </div>
    </NodeEditorContext>
    </CanvasActionsContext>
  );
}

export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
