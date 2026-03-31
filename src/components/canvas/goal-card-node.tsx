"use client";

import { memo, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import { Target } from "lucide-react";
import type { GoalCardData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";
import { NodeViewTrigger, NodeViewDialog } from "./node-view-dialog";

const PRIORITY_COLORS = {
  high: "#F43F5E",
  medium: "#FBBF24",
  low: "#64748b",
} as const;

function GoalCardNodeComponent({ id, data, selected }: NodeProps) {
  const [nodeData] = useNodeData<GoalCardData>(id, data);
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

      <NodeViewDialog open={viewOpen} onOpenChange={setViewOpen} icon={Target} label={nodeData.title || "Goal"} color={nodeData.color}>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
            style={{ background: PRIORITY_COLORS[nodeData.priority] }}
          >
            {nodeData.priority} priority
          </span>
          {nodeData.timeframe && (
            <span className="text-sm text-muted-foreground italic">{nodeData.timeframe}</span>
          )}
        </div>
        {nodeData.successCriteria && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Success Criteria</h4>
            <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
              {nodeData.successCriteria}
            </p>
          </div>
        )}
      </NodeViewDialog>
    </>
  );
}

export const GoalCardNodeComponent_ = memo(GoalCardNodeComponent);
