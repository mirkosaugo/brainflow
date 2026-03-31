"use client";

import { useState, useCallback, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import {
  Type,
  Lightbulb,
  Target,
  HelpCircle,
  Bot,
  ImagePlus,
  Play,
  Sparkles,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNodeEditor } from "@/hooks/use-node-editor";
import { NODE_COLORS } from "@/config/constants";
import { tintBg } from "@/lib/node-style";
import { ColorSwatchPicker } from "@/components/ui/color-picker";
import type {
  TextNodeData,
  ConceptCardData,
  GoalCardData,
  PerplexityCardData,
  DigitalTwinData,
  ImageUploadData,
  RunNodeData,
  SynthesisOutputData,
} from "@/types/canvas";

const NODE_META: Record<
  string,
  { icon: typeof Type; label: string; color: string }
> = {
  text: { icon: Type, label: "Text", color: NODE_COLORS.text },
  conceptCard: { icon: Lightbulb, label: "Concept Card", color: NODE_COLORS.conceptCard },
  goalCard: { icon: Target, label: "Goal Card", color: NODE_COLORS.goalCard },
  perplexityCard: { icon: HelpCircle, label: "Open Question", color: NODE_COLORS.perplexityCard },
  digitalTwin: { icon: Bot, label: "Digital Twin", color: NODE_COLORS.digitalTwin },
  imageUpload: { icon: ImagePlus, label: "Image", color: NODE_COLORS.imageUpload },
  run: { icon: Play, label: "Run Node", color: NODE_COLORS.run },
  synthesisOutput: { icon: Sparkles, label: "Generated", color: NODE_COLORS.run },
};

const PRIORITY_OPTIONS: { value: GoalCardData["priority"]; label: string; color: string }[] = [
  { value: "high", label: "High", color: "#F43F5E" },
  { value: "medium", label: "Medium", color: "#FBBF24" },
  { value: "low", label: "Low", color: "#64748b" },
];

const TWIN_MODES: { id: DigitalTwinData["mode"]; label: string; color: string }[] = [
  { id: "contraddici", label: "Challenge", color: "#FF6B9D" },
  { id: "collabora", label: "Collaborate", color: "#34D399" },
  { id: "analizza", label: "Analyze", color: "#FBBF24" },
  { id: "provoca", label: "Provoke", color: "#A78BFA" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
      {children}
    </label>
  );
}

function FieldInput({
  value,
  onChange,
  placeholder,
  multiline,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoFocus?: boolean;
}) {
  const cls =
    "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/30 transition-colors";
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`${cls} min-h-20 resize-none`}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={cls}
    />
  );
}

function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <FieldLabel>Color</FieldLabel>
      <ColorSwatchPicker value={value} onChange={onChange} />
    </div>
  );
}

// --- Per-type form components ---

function TextForm({
  data,
  onChange,
}: {
  data: TextNodeData;
  onChange: (patch: Partial<TextNodeData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Text</FieldLabel>
        <FieldInput
          value={data.text}
          onChange={(text) => onChange({ text })}
          placeholder="Write your note..."
          multiline
          autoFocus
        />
      </div>
      <ColorField value={data.color} onChange={(color) => onChange({ color })} />
    </div>
  );
}

function ConceptForm({
  data,
  onChange,
}: {
  data: ConceptCardData;
  onChange: (patch: Partial<ConceptCardData>) => void;
}) {
  const [tagInput, setTagInput] = useState("");

  const addTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !data.tags.includes(tag)) {
      onChange({ tags: [...data.tags, tag] });
    }
    setTagInput("");
  }, [tagInput, data.tags, onChange]);

  const removeTag = useCallback(
    (tag: string) => onChange({ tags: data.tags.filter((t) => t !== tag) }),
    [data.tags, onChange]
  );

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Title</FieldLabel>
        <FieldInput
          value={data.title}
          onChange={(title) => onChange({ title })}
          placeholder="Concept title..."
          autoFocus
        />
      </div>
      <div>
        <FieldLabel>Description</FieldLabel>
        <FieldInput
          value={data.description}
          onChange={(description) => onChange({ description })}
          placeholder="Describe the concept..."
          multiline
        />
      </div>
      <div>
        <FieldLabel>Tags</FieldLabel>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ background: `${data.color}20`, color: data.color }}
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:opacity-70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Add tag..."
            className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-ring"
          />
          {tagInput && (
            <Button variant="ghost" size="icon-sm" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <ColorField value={data.color} onChange={(color) => onChange({ color })} />
    </div>
  );
}

function GoalForm({
  data,
  onChange,
}: {
  data: GoalCardData;
  onChange: (patch: Partial<GoalCardData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Goal</FieldLabel>
        <FieldInput
          value={data.title}
          onChange={(title) => onChange({ title })}
          placeholder="Main objective..."
          autoFocus
        />
      </div>
      <div>
        <FieldLabel>Success Criteria</FieldLabel>
        <FieldInput
          value={data.successCriteria}
          onChange={(successCriteria) => onChange({ successCriteria })}
          placeholder="How do you know you've achieved it?"
          multiline
        />
      </div>
      <div>
        <FieldLabel>Timeframe</FieldLabel>
        <FieldInput
          value={data.timeframe}
          onChange={(timeframe) => onChange({ timeframe })}
          placeholder="e.g. Q3 2025, 2 weeks..."
        />
      </div>
      <div>
        <FieldLabel>Priority</FieldLabel>
        <div className="flex gap-2">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ priority: opt.value })}
              className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
              style={
                data.priority === opt.value
                  ? { background: opt.color, color: "#fff" }
                  : { background: `${opt.color}15`, color: opt.color }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <ColorField value={data.color} onChange={(color) => onChange({ color })} />
    </div>
  );
}

function PerplexityForm({
  data,
  onChange,
}: {
  data: PerplexityCardData;
  onChange: (patch: Partial<PerplexityCardData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Question</FieldLabel>
        <FieldInput
          value={data.question}
          onChange={(question) => onChange({ question })}
          placeholder="What don't you know yet?"
          multiline
          autoFocus
        />
      </div>
      <div>
        <FieldLabel>Context</FieldLabel>
        <FieldInput
          value={data.context}
          onChange={(context) => onChange({ context })}
          placeholder="Additional context..."
        />
      </div>
      <div>
        <FieldLabel>Blocking</FieldLabel>
        <button
          onClick={() => onChange({ isBlocking: !data.isBlocking })}
          className="flex items-center gap-2 text-sm text-foreground"
        >
          <div
            className="h-4 w-4 rounded border-2 transition-colors flex items-center justify-center"
            style={{
              borderColor: data.isBlocking ? "#F43F5E" : "var(--border)",
              background: data.isBlocking ? "#F43F5E" : "transparent",
            }}
          >
            {data.isBlocking && (
              <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          This question blocks progress
        </button>
      </div>
      <ColorField value={data.color} onChange={(color) => onChange({ color })} />
    </div>
  );
}

function DigitalTwinForm({
  data,
  onChange,
}: {
  data: DigitalTwinData;
  onChange: (patch: Partial<DigitalTwinData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Name</FieldLabel>
        <FieldInput
          value={data.name}
          onChange={(name) => onChange({ name })}
          placeholder="Twin name..."
          autoFocus
        />
      </div>
      <div>
        <FieldLabel>Mode</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {TWIN_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onChange({ mode: mode.id })}
              className="rounded-lg px-3 py-2 text-xs font-semibold transition-all"
              style={
                data.mode === mode.id
                  ? { background: mode.color, color: "#fff" }
                  : { background: `${mode.color}15`, color: mode.color }
              }
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Personality</FieldLabel>
        <FieldInput
          value={data.personality}
          onChange={(personality) => onChange({ personality })}
          placeholder="Describe the character..."
          multiline
        />
      </div>
      <ColorField value={data.color} onChange={(color) => onChange({ color })} />
    </div>
  );
}

function ImageForm({
  data,
  onChange,
}: {
  data: ImageUploadData;
  onChange: (patch: Partial<ImageUploadData>) => void;
}) {
  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => onChange({ src: e.target?.result as string });
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Image</FieldLabel>
        {data.src ? (
          <div className="relative">
            <img src={data.src} alt={data.caption || "uploaded"} className="w-full rounded-lg object-cover max-h-48" />
            <button
              onClick={() => onChange({ src: null })}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-8 cursor-pointer hover:border-ring transition-colors">
            <ImagePlus className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <span className="text-xs text-muted-foreground/60">Click to upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </label>
        )}
      </div>
      <div>
        <FieldLabel>Caption</FieldLabel>
        <FieldInput
          value={data.caption}
          onChange={(caption) => onChange({ caption })}
          placeholder="Image caption..."
        />
      </div>
      <ColorField value={data.color} onChange={(color) => onChange({ color })} />
    </div>
  );
}

function RunForm({
  data,
  onChange,
  takenColors,
}: {
  data: RunNodeData;
  onChange: (patch: Partial<RunNodeData>) => void;
  takenColors: string[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Title</FieldLabel>
        <FieldInput
          value={data.label}
          onChange={(label) => onChange({ label })}
          placeholder="Run node title..."
          autoFocus
        />
      </div>
      <div>
        <FieldLabel>Color</FieldLabel>
        <ColorSwatchPicker
          value={data.color}
          onChange={(color) => onChange({ color })}
          disabledColors={takenColors}
        />
      </div>
    </div>
  );
}

function SynthesisForm({
  data,
  onChange,
}: {
  data: SynthesisOutputData;
  onChange: (patch: Partial<SynthesisOutputData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Label</FieldLabel>
        <FieldInput
          value={data.label}
          onChange={(label) => onChange({ label })}
          placeholder="Card label..."
          autoFocus
        />
      </div>
      <div>
        <FieldLabel>Synthesis</FieldLabel>
        <FieldInput
          value={data.synthesis}
          onChange={(synthesis) => onChange({ synthesis })}
          placeholder="Generated content..."
          multiline
        />
      </div>
      <ColorField value={data.color} onChange={(color) => onChange({ color })} />
    </div>
  );
}

// --- Main drawer ---

export function NodeEditDrawer() {
  const { editingNodeId, isNewNode, closeEditor } = useNodeEditor();
  const { getNode, getNodes, updateNodeData, deleteElements } = useReactFlow();

  // Local draft state — initialized from node data when editing starts
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [initialSnapshot, setInitialSnapshot] = useState<Record<string, unknown>>({});
  const [activeNodeType, setActiveNodeType] = useState("");

  useEffect(() => {
    if (!editingNodeId) {
      setActiveNodeType("");
      return;
    }
    // The node might not be available on the first frame (just created).
    // Poll briefly until React Flow has it.
    let attempts = 0;
    const tryInit = () => {
      const n = getNode(editingNodeId);
      if (n) {
        const data = { ...n.data } as Record<string, unknown>;
        setDraft(data);
        setInitialSnapshot(data);
        setActiveNodeType(n.type ?? "");
      } else if (attempts < 5) {
        attempts++;
        requestAnimationFrame(tryInit);
      }
    };
    tryInit();
  }, [editingNodeId, getNode]);

  const meta = NODE_META[activeNodeType];

  const patchDraft = useCallback(
    (patch: Record<string, unknown>) => {
      setDraft((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const handleSave = useCallback(() => {
    if (editingNodeId) {
      updateNodeData(editingNodeId, draft);
    }
    closeEditor();
  }, [editingNodeId, draft, updateNodeData, closeEditor]);

  const handleCancel = useCallback(() => {
    if (isNewNode && editingNodeId) {
      // Delete the node that was just created
      deleteElements({ nodes: [{ id: editingNodeId }] });
    } else if (editingNodeId) {
      // Revert to initial snapshot
      updateNodeData(editingNodeId, initialSnapshot);
    }
    closeEditor();
  }, [isNewNode, editingNodeId, initialSnapshot, deleteElements, updateNodeData, closeEditor]);

  const handleDelete = useCallback(() => {
    if (editingNodeId) {
      deleteElements({ nodes: [{ id: editingNodeId }] });
    }
    closeEditor();
  }, [editingNodeId, deleteElements, closeEditor]);

  const Icon = meta?.icon ?? Type;
  const color = (draft as { color?: string }).color ?? meta?.color ?? NODE_COLORS.text;

  return (
    <Sheet open={!!editingNodeId} onOpenChange={(open) => { if (!open) handleCancel(); }}>
      <SheetContent side="left" showCloseButton={false} className="flex flex-col">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={tintBg(color, "20")}
            >
              <Icon className="h-4.5 w-4.5" style={{ color }} />
            </div>
            <div>
              <SheetTitle>{isNewNode ? `New ${meta?.label ?? "Node"}` : `Edit ${meta?.label ?? "Node"}`}</SheetTitle>
              <SheetDescription>
                {isNewNode ? "Fill in the details and save." : "Modify the fields below."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {activeNodeType === "text" && (
            <TextForm data={draft as unknown as TextNodeData} onChange={patchDraft} />
          )}
          {activeNodeType === "conceptCard" && (
            <ConceptForm data={draft as unknown as ConceptCardData} onChange={patchDraft} />
          )}
          {activeNodeType === "goalCard" && (
            <GoalForm data={draft as unknown as GoalCardData} onChange={patchDraft} />
          )}
          {activeNodeType === "perplexityCard" && (
            <PerplexityForm data={draft as unknown as PerplexityCardData} onChange={patchDraft} />
          )}
          {activeNodeType === "digitalTwin" && (
            <DigitalTwinForm data={draft as unknown as DigitalTwinData} onChange={patchDraft} />
          )}
          {activeNodeType === "imageUpload" && (
            <ImageForm data={draft as unknown as ImageUploadData} onChange={patchDraft} />
          )}
          {activeNodeType === "run" && (
            <RunForm
              data={draft as unknown as RunNodeData}
              onChange={patchDraft}
              takenColors={
                getNodes()
                  .filter((n) => n.type === "run" && n.id !== editingNodeId)
                  .map((n) => (n.data as unknown as RunNodeData).color)
              }
            />
          )}
          {activeNodeType === "synthesisOutput" && (
            <SynthesisForm data={draft as unknown as SynthesisOutputData} onChange={patchDraft} />
          )}
        </div>

        <SheetFooter className="flex-row gap-2 border-t border-border pt-4">
          {!isNewNode && (
            <Button variant="destructive" size="sm" onClick={handleDelete} className="mr-auto">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
