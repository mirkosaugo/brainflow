"use client";

import { useState, useCallback } from "react";
import {
  MousePointer2,
  Hand,
  LayoutTemplate,
  Download,
  Upload,
  Type,
  Lightbulb,
  Target,
  HelpCircle,
  Bot,
  Play,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ToolMode } from "@/types/canvas";
import { cn } from "@/lib/utils";
import {
  GLASS_CONTAINER_CLASS,
  ICON_BTN_CLASS,
  NODE_COLORS,
} from "@/config/constants";
import { FLOW_TEMPLATES, type FlowTemplate } from "@/config/flow-templates";

interface CanvasToolbarProps {
  activeTool: ToolMode;
  onToolChange: (tool: ToolMode) => void;
  onLoadTemplate?: (template: FlowTemplate) => void;
  onExport?: () => void;
  onImport?: () => void;
  hasContent?: boolean;
}

const tools: { id: ToolMode; icon: typeof MousePointer2; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select (V)" },
  { id: "hand", icon: Hand, label: "Hand tool (H)" },
];

const NODE_TYPE_ICONS: Record<string, { icon: typeof Type; color: string }> = {
  text: { icon: Type, color: NODE_COLORS.text },
  conceptCard: { icon: Lightbulb, color: NODE_COLORS.conceptCard },
  goalCard: { icon: Target, color: NODE_COLORS.goalCard },
  perplexityCard: { icon: HelpCircle, color: NODE_COLORS.perplexityCard },
  digitalTwin: { icon: Bot, color: NODE_COLORS.digitalTwin },
  run: { icon: Play, color: NODE_COLORS.run },
};

function getNodeTypeCounts(template: FlowTemplate) {
  const counts: Record<string, number> = {};
  for (const node of template.nodes) {
    const type = node.type ?? "unknown";
    counts[type] = (counts[type] || 0) + 1;
  }
  return counts;
}

export function CanvasToolbar({
  activeTool,
  onToolChange,
  onLoadTemplate,
  onExport,
  onImport,
  hasContent,
}: CanvasToolbarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirming, setConfirming] = useState<FlowTemplate | null>(null);

  const handleSelectTemplate = useCallback(
    (template: FlowTemplate) => {
      if (hasContent) {
        setConfirming(template);
      } else {
        onLoadTemplate?.(template);
        setDialogOpen(false);
      }
    },
    [hasContent, onLoadTemplate],
  );

  const handleConfirm = useCallback(() => {
    if (confirming) {
      onLoadTemplate?.(confirming);
      setConfirming(null);
      setDialogOpen(false);
    }
  }, [confirming, onLoadTemplate]);

  return (
    <>
      <div className="absolute right-4 top-1/2 z-40 -translate-y-1/2">
        <div
          className={`flex flex-col items-center gap-2 rounded-full p-1.5 ${GLASS_CONTAINER_CLASS}`}
        >
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger
                className={cn(
                  ICON_BTN_CLASS,
                  activeTool === tool.id
                    ? "bg-foreground text-background hover:text-white"
                    : "text-foreground",
                )}
                onClick={() => onToolChange(tool.id)}
              >
                <tool.icon className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent side="left">{tool.label}</TooltipContent>
            </Tooltip>
          ))}

          {/* <div className="w-5 border-t border-border/30" /> */}

          {/* <Tooltip>
            <TooltipTrigger
              className={ICON_BTN_CLASS}
              onClick={() => setDialogOpen(true)}
            >
              <LayoutTemplate className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent side="left">Templates</TooltipContent>
          </Tooltip>
          */}

          {/* <Tooltip>
            <TooltipTrigger className={ICON_BTN_CLASS} onClick={onExport}>
              <Download className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent side="left">Export JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className={ICON_BTN_CLASS} onClick={onImport}>
              <Upload className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent side="left">Import JSON</TooltipContent>
          </Tooltip> */}
        </div>
      </div>

      {/* Template picker dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-background border-border">
          <DialogHeader>
            <DialogTitle>Flow Templates</DialogTitle>
            <DialogDescription>
              Start from a pre-built structure with goals, twins, and
              connections.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {FLOW_TEMPLATES.map((template) => {
              const counts = getNodeTypeCounts(template);
              return (
                <div
                  key={template.id}
                  className="rounded-xl border border-border p-4 hover:border-ring/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground">
                        {template.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {Object.entries(counts).map(([type, count]) => {
                          const meta = NODE_TYPE_ICONS[type];
                          if (!meta) return null;
                          const Icon = meta.icon;
                          return (
                            <span
                              key={type}
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                background: `${meta.color}15`,
                                color: meta.color,
                              }}
                            >
                              <Icon className="h-3 w-3" />
                              {count}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      Use
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm overwrite */}
          {confirming && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs text-foreground font-medium mb-2">
                This will replace the current canvas. Continue?
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setConfirming(null)}
                >
                  Cancel
                </Button>
                <Button size="xs" onClick={handleConfirm}>
                  Replace
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
