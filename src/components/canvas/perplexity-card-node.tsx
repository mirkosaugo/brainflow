"use client";

import { memo, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import { HelpCircle } from "lucide-react";
import type { PerplexityCardData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";
import { NodeViewTrigger, NodeViewDialog } from "./node-view-dialog";

function PerplexityCardNodeComponent({ id, data, selected }: NodeProps) {
  const [nodeData] = useNodeData<PerplexityCardData>(id, data);
  const [viewOpen, setViewOpen] = useState(false);

  return (
    <>
      <div
        className="group relative w-64 rounded-2xl overflow-hidden shadow-lg transition-shadow bg-[var(--node-bg)]"
        style={getCardStyle(nodeData.color, selected)}
      >
        <NodeActions nodeId={id}>
          <NodeViewTrigger onClick={() => setViewOpen(true)} />
        </NodeActions>
        <NodeHeader icon={HelpCircle} label="Open Question" color={nodeData.color}>
          {nodeData.isBlocking && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: "rgba(0,0,0,0.2)" }}>
              ⚠ blocking
            </span>
          )}
        </NodeHeader>

        {/* Question */}
        <div className="px-4 pt-3 pb-2">
          <p className="text-sm font-medium text-foreground line-clamp-3">
            {nodeData.question || <span className="text-muted-foreground/40 italic">What don't you know yet?</span>}
          </p>
        </div>

        {/* Context */}
        {nodeData.context && (
          <div className="px-4 pb-4">
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {nodeData.context}
            </p>
          </div>
        )}
      </div>

      <NodeViewDialog open={viewOpen} onOpenChange={setViewOpen} icon={HelpCircle} label="Open Question" color={nodeData.color}>
        {nodeData.isBlocking && (
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white bg-red-500 mb-3">
            ⚠ Blocking
          </span>
        )}
        <p className="text-lg font-medium text-foreground mb-4">
          {nodeData.question || "No question"}
        </p>
        {nodeData.context && (
          <div className="pt-3 border-t border-border/30">
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Context</h4>
            <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
              {nodeData.context}
            </p>
          </div>
        )}
      </NodeViewDialog>
    </>
  );
}

export const PerplexityCardNodeComponent_ = memo(PerplexityCardNodeComponent);
