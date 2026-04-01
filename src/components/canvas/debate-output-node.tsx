"use client";

import { memo, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import { MessageSquare } from "lucide-react";
import type { DebateOutputData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";
import { NodeViewTrigger, NodeViewDialog } from "./node-view-dialog";

function DebateOutputNodeComponent({ id, data, selected }: NodeProps) {
  const [nodeData] = useNodeData<DebateOutputData>(id, data);
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
        <NodeHeader icon={MessageSquare} label={nodeData.label} color={nodeData.color} />

        <div className="px-4 py-3 max-h-[200px] overflow-y-auto pointer-events-none space-y-2">
          {nodeData.transcript.length > 0 ? (
            nodeData.transcript.map((turn, i) => (
              <div key={i}>
                <span className="text-[10px] font-semibold text-foreground/70">{turn.name}:</span>
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{turn.text}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground/40 italic">No debate transcript</p>
          )}
        </div>

        <div className="px-4 pb-3">
          <span className="text-[9px] text-muted-foreground/50">
            Debate · {new Date(nodeData.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <NodeViewDialog open={viewOpen} onOpenChange={setViewOpen} icon={MessageSquare} label={nodeData.label} color={nodeData.color}>
        <div className="space-y-4">
          {nodeData.transcript.map((turn, i) => (
            <div key={i}>
              <span className="text-sm font-semibold text-foreground">{turn.name}</span>
              <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap mt-1">{turn.text}</p>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-border/30 mt-3">
          <span className="text-xs text-muted-foreground/50">
            Debate · {new Date(nodeData.timestamp).toLocaleString()}
          </span>
        </div>
      </NodeViewDialog>
    </>
  );
}

export const DebateOutputNodeComponent_ = memo(DebateOutputNodeComponent);
