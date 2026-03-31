"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import { HelpCircle } from "lucide-react";
import type { PerplexityCardData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";

function PerplexityCardNodeComponent({ id, data, selected }: NodeProps) {
  const [nodeData] = useNodeData<PerplexityCardData>(id, data);
  return (
    <div
      className="group relative w-64 rounded-2xl overflow-hidden shadow-lg transition-shadow bg-[var(--node-bg)]"
      style={getCardStyle(nodeData.color, selected)}
    >
      <NodeActions nodeId={id} />
      <NodeHeader icon={HelpCircle} label="Open Question" color={nodeData.color}>
        {nodeData.isBlocking && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: "rgba(0,0,0,0.2)" }}>
            ⚠ blocking
          </span>
        )}
      </NodeHeader>

      {/* Question */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-sm font-medium text-foreground">
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
  );
}

export const PerplexityCardNodeComponent_ = memo(PerplexityCardNodeComponent);
