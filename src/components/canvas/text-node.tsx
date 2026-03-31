"use client";

import { memo, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import { Type } from "lucide-react";
import type { TextNodeData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";
import { NodeViewTrigger, NodeViewDialog } from "./node-view-dialog";

function TextNodeComponent({ id, data, selected }: NodeProps) {
  const [nodeData] = useNodeData<TextNodeData>(id, data);
  const [viewOpen, setViewOpen] = useState(false);

  return (
    <>
      <div
        className="group relative w-72 rounded-2xl overflow-hidden shadow-lg transition-shadow bg-[var(--node-bg)]"
        style={getCardStyle(nodeData.color, selected)}
      >
        <NodeActions nodeId={id}>
          <NodeViewTrigger onClick={() => setViewOpen(true)} />
        </NodeActions>
        <NodeHeader icon={Type} label="Text" color={nodeData.color} />

        <div className="px-4 py-3">
          <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">
            {nodeData.text || <span className="text-muted-foreground/40 italic">Empty note</span>}
          </p>
        </div>
      </div>

      <NodeViewDialog open={viewOpen} onOpenChange={setViewOpen} icon={Type} label="Text" color={nodeData.color}>
        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
          {nodeData.text || "Empty note"}
        </p>
      </NodeViewDialog>
    </>
  );
}

export const TextNodeComponent_ = memo(TextNodeComponent);
