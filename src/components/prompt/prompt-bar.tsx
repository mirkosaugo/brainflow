"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Type,
  Lightbulb,
  ImagePlus,
  Sparkles,
  Send,
  Target,
  HelpCircle,
  Bot,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
interface PromptBarProps {
  onAddNode: (
    type:
      | "text"
      | "conceptCard"
      | "imageUpload"
      | "goalCard"
      | "perplexityCard"
      | "digitalTwin",
  ) => void;
  onSmartCreate: (prompt: string) => Promise<void>;
  onRunByColor: (color: string) => Promise<void>;
  isRunning: boolean;
  availableColors: string[];
}

const nodeActions = [
  { type: "text" as const, icon: Type, label: "Text" },
  { type: "conceptCard" as const, icon: Lightbulb, label: "Concept" },
  { type: "goalCard" as const, icon: Target, label: "Goal" },
  { type: "perplexityCard" as const, icon: HelpCircle, label: "Question" },
  { type: "digitalTwin" as const, icon: Bot, label: "Digital Twin" },
  { type: "imageUpload" as const, icon: ImagePlus, label: "Image" },
];

export function PromptBar({ onAddNode, onSmartCreate, onRunByColor, isRunning, availableColors }: PromptBarProps) {
  const [promptText, setPromptText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!showColorMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowColorMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showColorMenu]);

  const handleSubmit = useCallback(async () => {
    const text = promptText.trim();
    if (!text || isCreating) return;

    setIsCreating(true);
    setPromptText("");
    try {
      await onSmartCreate(text);
    } catch {
      // silently fail
    } finally {
      setIsCreating(false);
    }
  }, [promptText, isCreating, onSmartCreate]);

  const handleColorRun = useCallback(
    async (color: string) => {
      setShowColorMenu(false);
      await onRunByColor(color);
    },
    [onRunByColor]
  );

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
            placeholder="Describe what you want to create..."
            disabled={isCreating}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!promptText.trim() || isCreating}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
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

          {/* Generate by color */}
          <div className="relative" ref={menuRef}>
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer active:scale-95",
                  isRunning ? "text-amber-400" : "text-foreground hover:bg-muted",
                )}
                onClick={() => !isRunning && setShowColorMenu((v) => !v)}
                disabled={isRunning}
              >
                {isRunning ? (
                  <div className="h-5 w-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </TooltipTrigger>
              <TooltipContent>Generate</TooltipContent>
            </Tooltip>

            {/* Color dropdown */}
            {showColorMenu && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-[var(--glass-shadow)] px-2.5 py-1.5">
                {availableColors.length === 0 ? (
                  <span className="text-xs text-muted-foreground px-2 whitespace-nowrap">No cards on canvas</span>
                ) : (
                  availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorRun(color)}
                      className="h-6 w-6 rounded-full cursor-pointer transition-transform hover:scale-125 active:scale-95"
                      style={{ backgroundColor: color }}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
