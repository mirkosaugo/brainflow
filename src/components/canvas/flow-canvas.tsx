"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type OnConnect,
  type NodeMouseHandler,
  addEdge,
  useViewport,
  getIncomers,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { ToolMode, CanvasNode, RunNodeData, TextNodeData, ConceptCardData, ImageUploadData } from "@/types/canvas";
import { initialNodes, initialEdges } from "@/config/initial-data";
import { NODE_COLORS, SNAP_GRID, DEFAULT_EDGE_STYLE } from "@/config/constants";
import { getBestHandle } from "@/lib/node-style";
import { ConnectModeContext } from "@/hooks/use-connect-mode";
import { TextNodeComponent_ } from "./text-node";
import { ConceptCardNodeComponent_ } from "./concept-card-node";
import { ImageNodeComponent_ } from "./image-node";
import { RunNodeComponent_ } from "./run-node";
import { CustomEdge } from "./custom-edge";
import { AmbientGlow } from "./ambient-glow";
import { DotGlowBackground } from "./dot-glow-background";
import { ConnectionLinePreview } from "./connection-line-preview";
import { CanvasToolbar } from "./canvas-toolbar";
import { PromptBar } from "@/components/prompt/prompt-bar";
import { StatusBar } from "@/components/panels/status-bar";

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
    case "run":
      return { label: "Run AI", status: "idle" as const, result: "", color: NODE_COLORS.run };
    default:
      return {};
  }
}

function FlowCanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeTool, setActiveTool] = useState<ToolMode>("select");
  const [isRunning, setIsRunning] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [hoveringNode, setHoveringNode] = useState<string | null>(null);
  const { zoomIn, zoomOut, fitView, screenToFlowPosition, getNode } = useReactFlow();
  const viewport = useViewport();

  const nodeTypes = useMemo(
    () => ({
      text: TextNodeComponent_,
      conceptCard: ConceptCardNodeComponent_,
      imageUpload: ImageNodeComponent_,
      run: RunNodeComponent_,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({ custom: CustomEdge }),
    []
  );

  // --- Connect mode ---

  const startConnect = useCallback(
    (nodeId: string) => {
      setConnectingFrom(nodeId);
      // Deselect all so toolbar disappears
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
    },
    [setNodes]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (!connectingFrom) return;
      if (connectingFrom === node.id) {
        // Clicked same node — cancel
        setConnectingFrom(null);
        return;
      }

      // Compute best handles based on node positions
      const sourceNode = getNode(connectingFrom);
      const targetNode = node;
      const handles = sourceNode ? getBestHandle(
        { x: sourceNode.position.x, y: sourceNode.position.y, w: sourceNode.measured?.width ?? 250, h: sourceNode.measured?.height ?? 150 },
        { x: targetNode.position.x, y: targetNode.position.y, w: targetNode.measured?.width ?? 250, h: targetNode.measured?.height ?? 150 },
      ) : { sourceHandle: "right", targetHandle: "left" };

      // Create edge
      setEdges((eds) =>
        addEdge(
          {
            id: `e-${connectingFrom}-${node.id}-${Date.now()}`,
            source: connectingFrom,
            target: node.id,
            sourceHandle: handles.sourceHandle,
            targetHandle: handles.targetHandle,
            type: "custom",
            animated: true,
            style: DEFAULT_EDGE_STYLE,
          },
          eds
        )
      );
      setConnectingFrom(null);
      setHoveringNode(null);
    },
    [connectingFrom, setEdges]
  );

  // Prevent node selection while connecting
  const onNodeMouseEnter: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (connectingFrom && connectingFrom !== node.id) {
        setHoveringNode(node.id);
      }
    },
    [connectingFrom]
  );

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveringNode(null);
  }, []);

  const cancelConnect = useCallback(() => {
    setConnectingFrom(null);
    setHoveringNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    if (connectingFrom) cancelConnect();
  }, [connectingFrom, cancelConnect]);

  // Escape key cancels connect mode
  useEffect(() => {
    if (!connectingFrom) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelConnect();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [connectingFrom, cancelConnect]);

  // Deselect all nodes while in connect mode
  const styledNodes = useMemo(() => {
    if (!connectingFrom) return nodes;
    return nodes.map((n) => ({ ...n, selected: false }));
  }, [nodes, connectingFrom]);

  // --- Standard handlers ---

  const onConnect: OnConnect = useCallback(
    (params) => {
      const sNode = params.source ? getNode(params.source) : null;
      const tNode = params.target ? getNode(params.target) : null;
      const handles = sNode && tNode ? getBestHandle(
        { x: sNode.position.x, y: sNode.position.y, w: sNode.measured?.width ?? 250, h: sNode.measured?.height ?? 150 },
        { x: tNode.position.x, y: tNode.position.y, w: tNode.measured?.width ?? 250, h: tNode.measured?.height ?? 150 },
      ) : {};

      setEdges((eds) =>
        addEdge(
          { ...params, ...handles, type: "custom", animated: true, style: DEFAULT_EDGE_STYLE },
          eds
        )
      );
    },
    [setEdges, getNode]
  );

  // Auto-select best handles when nodes move
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) return edge;

        const s = {
          x: sourceNode.position.x,
          y: sourceNode.position.y,
          w: sourceNode.measured?.width ?? 250,
          h: sourceNode.measured?.height ?? 150,
        };
        const t = {
          x: targetNode.position.x,
          y: targetNode.position.y,
          w: targetNode.measured?.width ?? 250,
          h: targetNode.measured?.height ?? 150,
        };
        const { sourceHandle, targetHandle } = getBestHandle(s, t);

        if (edge.sourceHandle === sourceHandle && edge.targetHandle === targetHandle) {
          return edge;
        }
        return { ...edge, sourceHandle, targetHandle };
      })
    );
  }, [nodes, setEdges]);

  const defaultEdgeOptions = useMemo(
    () => ({ type: "custom", animated: true, style: DEFAULT_EDGE_STYLE }),
    []
  );

  const handleAddNode = useCallback(
    (type: "text" | "conceptCard" | "imageUpload" | "run") => {
      const center = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 100,
      });
      const offset = { x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 150 };

      const newNode: CanvasNode = {
        id: nextId(),
        type,
        position: { x: center.x + offset.x, y: center.y + offset.y },
        data: buildNodeData(type),
      } as CanvasNode;

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  const gatherInputs = useCallback(
    (runNodeId: string) => {
      const visited = new Set<string>();
      const contents: string[] = [];

      function walk(nodeId: string) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        if (node.type === "text") {
          const d = node.data as unknown as TextNodeData;
          if (d.text) contents.push(`[Text] ${d.text}`);
        } else if (node.type === "conceptCard") {
          const d = node.data as unknown as ConceptCardData;
          if (d.title || d.description) {
            contents.push(`[Concept: ${d.title}] ${d.description} (tags: ${d.tags.join(", ")})`);
          }
        } else if (node.type === "imageUpload") {
          const d = node.data as unknown as ImageUploadData;
          if (d.caption) contents.push(`[Image] ${d.caption}`);
        }

        const incomers = getIncomers(node, nodes, edges);
        incomers.forEach((inc) => walk(inc.id));
      }

      const runNode = nodes.find((n) => n.id === runNodeId);
      if (runNode) {
        const incomers = getIncomers(runNode, nodes, edges);
        incomers.forEach((inc) => walk(inc.id));
      }

      return contents;
    },
    [nodes, edges]
  );

  const handleRunAI = useCallback(async () => {
    const runNodes = nodes.filter((n) => n.type === "run");
    if (runNodes.length === 0) return;

    setIsRunning(true);

    for (const runNode of runNodes) {
      const inputs = gatherInputs(runNode.id);
      if (inputs.length === 0) continue;

      setNodes((nds) =>
        nds.map((n) =>
          n.id === runNode.id ? { ...n, data: { ...n.data, status: "running", result: "" } as RunNodeData } as CanvasNode : n
        )
      );

      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputs }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const json = await res.json();
        const result = json.result || "No result";

        setNodes((nds) =>
          nds.map((n) =>
            n.id === runNode.id ? { ...n, data: { ...n.data, status: "done", result } as RunNodeData } as CanvasNode : n
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setNodes((nds) =>
          nds.map((n) =>
            n.id === runNode.id ? { ...n, data: { ...n.data, status: "error", result: message } as RunNodeData } as CanvasNode : n
          )
        );
      }
    }

    setIsRunning(false);
  }, [nodes, gatherInputs, setNodes]);

  const connectModeValue = useMemo(
    () => ({ connectingFrom, hoveringNode, startConnect }),
    [connectingFrom, hoveringNode, startConnect]
  );

  return (
    <ConnectModeContext value={connectModeValue}>
      <div
        className="relative h-full w-full"
        style={{ cursor: connectingFrom ? "crosshair" : undefined }}
      >
        <ReactFlow
          nodes={connectingFrom ? styledNodes : nodes}
          edges={edges}
          onNodesChange={connectingFrom ? undefined : onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          panOnDrag={connectingFrom ? false : activeTool === "hand" ? true : [1]}
          selectionOnDrag={connectingFrom ? false : activeTool === "select"}
          nodesDraggable={!connectingFrom}
          nodesConnectable={!connectingFrom}
          elementsSelectable={!connectingFrom}
          snapToGrid
          snapGrid={SNAP_GRID}
          fitView
          fitViewOptions={{ padding: 0.2, includeHiddenNodes: true }}
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={connectingFrom ? [] : ["Backspace", "Delete"]}
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

        {/* Connection preview line */}
        {connectingFrom && <ConnectionLinePreview sourceNodeId={connectingFrom} />}


        <AmbientGlow active={isRunning} />

        {/* Overlays */}
        <CanvasToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        <PromptBar onAddNode={handleAddNode} onRunAI={handleRunAI} isRunning={isRunning} />
        <StatusBar
          zoom={viewport.zoom}
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFitView={() => fitView({ padding: 0.1 })}
        />
      </div>
    </ConnectModeContext>
  );
}

export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
