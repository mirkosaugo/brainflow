"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import { Target } from "lucide-react";
import type { GoalCardData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";

const PRIORITY_COLORS = {
  high: "#F43F5E",
  medium: "#FBBF24",
  low: "#64748b",
} as const;

function GoalCardNodeComponent({ id, data, selected }: NodeProps) {
  const [nodeData] = useNodeData<GoalCardData>(id, data);
  return (
    <div
      className="group relative w-64 rounded-2xl overflow-hidden shadow-lg transition-shadow bg-[var(--node-bg)]"
      style={getCardStyle(nodeData.color, selected)}
    >
      <NodeActions nodeId={id} />
      <NodeHeader icon={Target} label="Goal" color={nodeData.color}>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            background: "rgba(0,0,0,0.2)",
            color: "#fff",
          }}
        >
          {nodeData.priority}
        </span>
      </NodeHeader>

      {/* Title */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-sm font-semibold text-foreground">
          {nodeData.title || <span className="text-muted-foreground/40 italic">Main objective</span>}
        </p>
      </div>

      {/* Success Criteria */}
      {nodeData.successCriteria && (
        <div className="px-4 pb-2">
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {nodeData.successCriteria}
          </p>
        </div>
      )}

      {/* Timeframe */}
      {nodeData.timeframe && (
        <div className="px-4 pb-4">
          <p className="text-[11px] text-muted-foreground/70 italic">{nodeData.timeframe}</p>
        </div>
      )}
    </div>
  );
}

export const GoalCardNodeComponent_ = memo(GoalCardNodeComponent);
