"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import { Bot } from "lucide-react";
import type { DigitalTwinData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";

const MODES = [
  { id: "contraddici" as const, label: "Challenge", color: "#FF6B9D" },
  { id: "collabora" as const, label: "Collaborate", color: "#34D399" },
  { id: "analizza" as const, label: "Analyze", color: "#FBBF24" },
  { id: "provoca" as const, label: "Provoke", color: "#A78BFA" },
] as const;

function DigitalTwinNodeComponent({ id, data, selected }: NodeProps) {
  const [nodeData] = useNodeData<DigitalTwinData>(id, data);
  const activeMode = MODES.find((m) => m.id === nodeData.mode) ?? MODES[0];

  return (
    <div
      className="group relative w-72 rounded-2xl overflow-hidden shadow-lg transition-shadow bg-[var(--node-bg)]"
      style={getCardStyle(nodeData.color, selected)}
    >
      <NodeActions nodeId={id} />
      <div className="pointer-events-none">
      <NodeHeader icon={Bot} label="Digital Twin" color={nodeData.color} />

      {/* Name */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-sm font-semibold text-foreground">
          {nodeData.name || <span className="text-muted-foreground/40 italic">Twin name...</span>}
        </p>
      </div>

      {/* Mode badge */}
      <div className="px-4 py-1.5">
        <span
          className="inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold"
          style={{ background: activeMode.color, color: "#fff" }}
        >
          {activeMode.label}
        </span>
      </div>

      {/* Personality */}
      {nodeData.personality && (
        <div className="px-4 pb-2">
          <p className="text-[11px] text-muted-foreground/70 italic line-clamp-2">{nodeData.personality}</p>
        </div>
      )}

      {/* Response area */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] p-3 min-h-[60px] max-h-[120px] overflow-y-auto">
          {nodeData.status === "thinking" ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div
                className="h-3.5 w-3.5 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${activeMode.color} transparent ${activeMode.color} ${activeMode.color}` }}
              />
              Thinking...
            </div>
          ) : nodeData.lastResponse ? (
            <div>
              <span
                className="inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide mb-1"
                style={{ background: `${activeMode.color}20`, color: activeMode.color }}
              >
                {activeMode.label}
              </span>
              <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {nodeData.lastResponse}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/40 italic">
              The twin will respond on Run Flow...
            </p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export const DigitalTwinNodeComponent_ = memo(DigitalTwinNodeComponent);
