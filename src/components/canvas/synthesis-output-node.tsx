"use client";

import { memo, useState } from "react";
import { type NodeProps } from "@xyflow/react";
import { Sparkles, Eye } from "lucide-react";
import type { SynthesisOutputData } from "@/types/canvas";
import { useNodeData } from "@/hooks/use-node-data";
import { getCardStyle } from "@/lib/node-style";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ICON_BTN_CLASS } from "@/config/constants";

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
          <Tooltip>
            <TooltipTrigger
              className={ICON_BTN_CLASS}
              onClick={() => setViewOpen(true)}
            >
              <Eye className="h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent side="top">View</TooltipContent>
          </Tooltip>
        </NodeActions>
        <NodeHeader icon={Sparkles} label={nodeData.label} color={nodeData.color} />

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

      {/* Full view dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: nodeData.color }} />
              {nodeData.label}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {nodeData.synthesis || "No synthesis"}
            </p>
          </div>
          <div className="pt-2 border-t border-border/30">
            <span className="text-xs text-muted-foreground/50">
              Generated · {new Date(nodeData.timestamp).toLocaleString()}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const SynthesisOutputNodeComponent_ = memo(SynthesisOutputNodeComponent);
