"use client";

import { memo, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import { Lightbulb } from "lucide-react";
import type { ConceptCardData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";
import { NodeViewTrigger, NodeViewDialog } from "./node-view-dialog";

function ConceptCardNodeComponent({ id, data, selected }: NodeProps) {
  const [nodeData] = useNodeData<ConceptCardData>(id, data);
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
        <NodeHeader icon={Lightbulb} label="Concept" color={nodeData.color} />

        {/* Title */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-sm font-semibold text-foreground">
            {nodeData.title || <span className="text-muted-foreground/40 italic">Untitled concept</span>}
          </p>
        </div>

        {/* Description */}
        {nodeData.description && (
          <div className="px-4 pb-2">
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
              {nodeData.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {nodeData.tags.length > 0 && (
          <div className="px-4 pb-4 flex flex-wrap gap-1.5">
            {nodeData.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: `${nodeData.color}20`, color: nodeData.color }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <NodeViewDialog open={viewOpen} onOpenChange={setViewOpen} icon={Lightbulb} label={nodeData.title || "Concept"} color={nodeData.color}>
        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
          {nodeData.description || "No description"}
        </p>
        {nodeData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-border/30 mt-3">
            {nodeData.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: `${nodeData.color}20`, color: nodeData.color }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </NodeViewDialog>
    </>
  );
}

export const ConceptCardNodeComponent_ = memo(ConceptCardNodeComponent);
