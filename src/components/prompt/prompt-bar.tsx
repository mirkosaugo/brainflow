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
  MessageSquare,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function useGradientId(prefix: string, colors: string[]) {
  return `${prefix}-${colors.join("-").replace(/#/g, "")}`;
}

function GradientDefs({ id, colors, animate }: { id: string; colors: string[]; animate?: boolean }) {
  if (colors.length === 0) return null;
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          {colors.map((c, i) => (
            <stop key={c} offset={`${(i / Math.max(colors.length - 1, 1)) * 100}%`} stopColor={c}>
              {animate && (
                <animate attributeName="stop-color" values={`${c};${colors[(i + 1) % colors.length]};${c}`} dur="2s" repeatCount="indefinite" />
              )}
            </stop>
          ))}
        </linearGradient>
      </defs>
    </svg>
  );
}

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
  onDebate: (color: string) => Promise<void>;
  runningAction: "idle" | "synthesize" | "debate";
  availableColors: string[];
  debateColors: string[];
  twinPairColors: string[];
}

const nodeActions = [
  { type: "text" as const, icon: Type, label: "Text" },
  { type: "conceptCard" as const, icon: Lightbulb, label: "Concept" },
  { type: "goalCard" as const, icon: Target, label: "Goal" },
  { type: "perplexityCard" as const, icon: HelpCircle, label: "Question" },
  { type: "digitalTwin" as const, icon: Bot, label: "Digital Twin" },
  { type: "imageUpload" as const, icon: ImagePlus, label: "Image" },
];

export function PromptBar({ onAddNode, onSmartCreate, onRunByColor, onDebate, runningAction, availableColors, debateColors, twinPairColors }: PromptBarProps) {
  const isRunning = runningAction !== "idle";
  const synthGradientId = useGradientId("synth", availableColors);
  const debateGradientId = useGradientId("debate", twinPairColors);
  const [promptText, setPromptText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showSynthesizeMenu, setShowSynthesizeMenu] = useState(false);
  const [showDebateMenu, setShowDebateMenu] = useState(false);
  const synthesizeRef = useRef<HTMLDivElement>(null);
  const debateRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    if (!showSynthesizeMenu && !showDebateMenu) return;
    const handler = (e: MouseEvent) => {
      if (showSynthesizeMenu && synthesizeRef.current && !synthesizeRef.current.contains(e.target as Node)) {
        setShowSynthesizeMenu(false);
      }
      if (showDebateMenu && debateRef.current && !debateRef.current.contains(e.target as Node)) {
        setShowDebateMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSynthesizeMenu, showDebateMenu]);

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

  const handleSynthesize = useCallback(
    async (color: string) => {
      setShowSynthesizeMenu(false);
      await onRunByColor(color);
    },
    [onRunByColor]
  );

  const handleDebate = useCallback(
    async (color: string) => {
      setShowDebateMenu(false);
      await onDebate(color);
    },
    [onDebate]
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

          {/* Synthesize by color */}
          <div className="relative" ref={synthesizeRef}>
            <GradientDefs id={synthGradientId} colors={availableColors} animate={runningAction === "synthesize"} />
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors active:scale-95",
                  isRunning ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-muted",
                )}
                onClick={() => { if (!isRunning) { setShowSynthesizeMenu((v) => !v); setShowDebateMenu(false); } }}
              >
                <Sparkles className="h-5 w-5" style={availableColors.length > 0 ? { stroke: `url(#${synthGradientId})` } : undefined} />
              </TooltipTrigger>
              <TooltipContent>{runningAction === "synthesize" ? "Synthesizing..." : "Synthesize"}</TooltipContent>
            </Tooltip>

            {showSynthesizeMenu && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-[var(--glass-shadow)] px-2.5 py-1.5">
                {availableColors.length === 0 ? (
                  <span className="text-xs text-muted-foreground px-2 whitespace-nowrap">No cards on canvas</span>
                ) : (
                  availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleSynthesize(color)}
                      className="h-6 w-6 rounded-full cursor-pointer transition-transform hover:scale-125 active:scale-95"
                      style={{ backgroundColor: color }}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Debate by color */}
          <div className="relative" ref={debateRef}>
            <GradientDefs id={debateGradientId} colors={twinPairColors} animate={runningAction === "debate"} />
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors active:scale-95",
                  isRunning ? "cursor-not-allowed opacity-40"
                    : debateColors.length === 0 ? "text-muted-foreground/30 cursor-not-allowed"
                    : "cursor-pointer hover:bg-muted",
                )}
                onClick={() => { if (!isRunning && debateColors.length > 0) { setShowDebateMenu((v) => !v); setShowSynthesizeMenu(false); } }}
              >
                <MessageSquare className="h-5 w-5" style={debateColors.length > 0 ? { stroke: `url(#${debateGradientId})` } : undefined} />
              </TooltipTrigger>
              <TooltipContent>
                {runningAction === "debate" ? "Debating..."
                  : debateColors.length === 0
                    ? twinPairColors.length === 0
                      ? "Debate (needs 2+ twins of same color)"
                      : "Debate (twins must Think first)"
                    : "Debate"}
              </TooltipContent>
            </Tooltip>

            {showDebateMenu && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-[var(--glass-shadow)] px-2.5 py-1.5">
                {debateColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleDebate(color)}
                    className="h-6 w-6 rounded-full cursor-pointer transition-transform hover:scale-125 active:scale-95"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
