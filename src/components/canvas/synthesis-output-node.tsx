"use client";

import { memo, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";
import type { SynthesisOutputData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";
import { NodeViewTrigger, NodeViewDialog } from "./node-view-dialog";

function SynthesisOutputNodeComponent({ id, data, selected }: NodeProps) {
  const [nodeData] = useNodeData<SynthesisOutputData>(id, data);
  const [viewOpen, setViewOpen] = useState(false);

  return (
    <>
      <div
        className="group relative w-80 rounded-2xl overflow-hidden shadow-lg transition-shadow bg-[var(--node-bg)]"
        style={getCardStyle(nodeData.color, selected)}
      >
        <NodeActions nodeId={id}>
          <NodeViewTrigger onClick={() => setViewOpen(true)} />
        </NodeActions>
        <NodeHeader icon={Sparkles} label="Synthesis" color={nodeData.color} />

        {/* Title */}
        {nodeData.title && (
          <div className="px-4 pt-3 pb-1">
            <p className="text-sm font-semibold text-foreground">{nodeData.title}</p>
          </div>
        )}

        <div className="px-4 py-3 max-h-[200px] overflow-y-auto pointer-events-none">
          <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {nodeData.synthesis || <span className="text-muted-foreground/40 italic">No synthesis</span>}
          </p>
        </div>

        <div className="px-4 pb-3">
          <span className="text-[9px] text-muted-foreground/50">
            Generated · {new Date(nodeData.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <NodeViewDialog open={viewOpen} onOpenChange={setViewOpen} icon={Sparkles} label={nodeData.title || "Synthesis"} color={nodeData.color}>
        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
          {nodeData.synthesis || "No synthesis"}
        </p>
        <div className="pt-3 border-t border-border/30 mt-3">
          <span className="text-xs text-muted-foreground/50">
            Generated · {new Date(nodeData.timestamp).toLocaleString()}
          </span>
        </div>
      </NodeViewDialog>
    </>
  );
}

export const SynthesisOutputNodeComponent_ = memo(SynthesisOutputNodeComponent);
