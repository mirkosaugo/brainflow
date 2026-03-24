"use client";

import { useState, useCallback } from "react";
import {
  Type,
  Lightbulb,
  ImagePlus,
  Play,
  Sparkles,
  Send,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PromptBarProps {
  onAddNode: (type: "text" | "conceptCard" | "imageUpload" | "run") => void;
  onRunAI: () => void;
  isRunning: boolean;
}

const nodeActions = [
  { type: "text" as const, icon: Type, label: "Testo" },
  { type: "conceptCard" as const, icon: Lightbulb, label: "Concept" },
  { type: "imageUpload" as const, icon: ImagePlus, label: "Immagine" },
  { type: "run" as const, icon: Play, label: "Run Node" },
];

export function PromptBar({ onAddNode, onRunAI, isRunning }: PromptBarProps) {
  const [promptText, setPromptText] = useState("");

  const handleSubmit = useCallback(() => {
    if (promptText.trim()) {
      onAddNode("text");
      setPromptText("");
    }
  }, [promptText, onAddNode]);

  return (
    <div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 w-full max-w-lg px-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-[var(--glass-shadow)] p-2">
        {/* Input row */}
        <div className="flex items-center gap-2 px-2">
          <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Write an idea..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          <button
            onClick={handleSubmit}
            disabled={!promptText.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <Separator className="opacity-20" />

        {/* Icons only row */}
        <div className="flex items-center justify-center gap-1">
          {nodeActions.map((action) => (
            <Tooltip key={action.type}>
              <TooltipTrigger
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-muted active:scale-95 text-foreground"
                onClick={() => onAddNode(action.type)}
              >
                <action.icon className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent>{action.label}</TooltipContent>
            </Tooltip>
          ))}

          <Separator orientation="vertical" className="mx-1 h-6 opacity-20" />

          {/* Run AI */}
          <Tooltip>
            <TooltipTrigger
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer active:scale-95",
                isRunning
                  ? "text-amber-400"
                  : "text-foreground hover:bg-muted"
              )}
              onClick={onRunAI}
              disabled={isRunning}
            >
              {isRunning ? (
                <div className="h-5 w-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </TooltipTrigger>
            <TooltipContent>Run AI</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
