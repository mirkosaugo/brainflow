"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Play, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { RunNodeData } from "@/types/canvas";
import { cn } from "@/lib/utils";

const statusConfig = {
  idle: { icon: Play, label: "Ready", iconClass: "text-emerald-400" },
  running: { icon: Loader2, label: "Processing...", iconClass: "text-amber-400 animate-spin" },
  done: { icon: CheckCircle2, label: "Completed", iconClass: "text-emerald-400" },
  error: { icon: AlertCircle, label: "Error", iconClass: "text-red-400" },
};

function RunNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as RunNodeData;
  const { icon: StatusIcon, label: statusLabel, iconClass } = statusConfig[nodeData.status];

  return (
    <div
      className={cn(
        "group relative w-72 rounded-2xl border shadow-lg overflow-hidden transition-all bg-[var(--node-bg)] border-[var(--node-border)]",
        nodeData.status === "running" && "ring-2 ring-amber-400/30"
      )}
      style={{
        borderColor: selected ? nodeData.color : undefined,
        boxShadow: selected ? `0 0 8px ${nodeData.color}15` : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-700" />
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-700" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-700" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-700" />

      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: `${nodeData.color}15` }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: `${nodeData.color}25` }}
        >
          <Play className="h-4 w-4" style={{ color: nodeData.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {nodeData.label}
          </h3>
          {nodeData.status !== "idle" && (
            <div className="flex items-center gap-1.5">
              <StatusIcon className={cn("h-3 w-3", iconClass)} />
              <span className="text-[10px] text-muted-foreground">{statusLabel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Result area */}
      {nodeData.result && (
        <div className="px-4 py-3 border-t border-border/10">
          <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
            {nodeData.result}
          </p>
        </div>
      )}

      {nodeData.status === "idle" && !nodeData.result && (
        <div className="px-4 py-3 border-t border-border/10">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            Connect your content and press Run in the toolbar
          </p>
        </div>
      )}
    </div>
  );
}

export const RunNodeComponent_ = memo(RunNodeComponent);
