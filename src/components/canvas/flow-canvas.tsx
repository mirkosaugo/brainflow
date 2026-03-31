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
  NodeInput,
} from "@/types/canvas";
import { initialNodes } from "@/config/initial-data";
import { NODE_COLORS, SNAP_GRID } from "@/config/constants";
import { loadNodes, useCanvasStorage } from "@/hooks/use-canvas-storage";
import { NodeEditorContext } from "@/hooks/use-node-editor";
import { NodeEditDrawer } from "./node-edit-drawer";
import { TextNodeComponent_ } from "./text-node";
import { ConceptCardNodeComponent_ } from "./concept-card-node";
import { ImageNodeComponent_ } from "./image-node";
import { GoalCardNodeComponent_ } from "./goal-card-node";
import { PerplexityCardNodeComponent_ } from "./perplexity-card-node";
import { DigitalTwinNodeComponent_ } from "./digital-twin-node";
import { SynthesisOutputNodeComponent_ } from "./synthesis-output-node";
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
  const [isRunning, setIsRunning] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [isNewNode, setIsNewNode] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { zoomIn, zoomOut, fitView, screenToFlowPosition, getNodes } = useReactFlow();
  const viewport = useViewport();
  const { save, exportJSON, importJSON } = useCanvasStorage();

  // Hydrate from localStorage after mount
  useEffect(() => {
    const saved = loadNodes();
    if (saved !== initialNodes) {
      setNodes(saved);
    }
    for (const n of saved) {
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
    save(nodes);
  }, [nodes, save, hydrated]);

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

  // Generate synthesis for all nodes of a given color
  const handleRunByColor = useCallback(
    async (color: string) => {
      const colorNodes = nodes.filter((n) => {
        if (n.type === "synthesisOutput") return false;
        const c = (n.data as { color?: string }).color;
        return c === color;
      });

      const inputs = colorNodes.map(nodeToInput).filter(Boolean) as NodeInput[];
      if (inputs.length === 0) return;

      setIsRunning(true);

      // Set twins to thinking
      const twinNodeIds = inputs.filter((i) => i.nodeType === "digitalTwin").map((i) => i.nodeId);
      if (twinNodeIds.length > 0) {
        setNodes((nds) =>
          nds.map((n) =>
            twinNodeIds.includes(n.id)
              ? { ...n, data: { ...n.data, status: "thinking", lastResponse: "" } as DigitalTwinData } as CanvasNode
              : n
          ),
        );
      }

      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputs }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const json = await res.json();
        const synthesis = json.result || "No result";
        const twinResponses: Record<string, string> = json.twinResponses || {};

        // Update twin responses
        if (Object.keys(twinResponses).length > 0) {
          setNodes((nds) =>
            nds.map((n) =>
              twinResponses[n.id]
                ? { ...n, data: { ...n.data, status: "done", lastResponse: twinResponses[n.id] } as DigitalTwinData } as CanvasNode
                : n
            ),
          );
        }

        const pos = getColorColumnBottom(color);

        const newNode: CanvasNode = {
          id: nextId(),
          type: "synthesisOutput",
          position: pos,
          data: {
            sourceRunNodeId: "",
            synthesis,
            timestamp: Date.now(),
            label: "Generated",
            color,
          },
        } as CanvasNode;

        setNodes((nds) => [...nds, newNode]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Run by color failed:", message);

        // Reset twins
        if (twinNodeIds.length > 0) {
          setNodes((nds) =>
            nds.map((n) =>
              twinNodeIds.includes(n.id)
                ? { ...n, data: { ...n.data, status: "idle" } as DigitalTwinData } as CanvasNode
                : n
            ),
          );
        }
      }

      setIsRunning(false);
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

  const nodeEditorValue = useMemo(
    () => ({ editingNodeId, isNewNode, openEditor, closeEditor }),
    [editingNodeId, isNewNode, openEditor, closeEditor],
  );

  return (
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

        <AmbientGlow active={isRunning} />

        {/* Overlays */}
        <ColorFilterBar nodes={nodes} />
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
          isRunning={isRunning}
          availableColors={availableColors}
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
  );
}

export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
