"use client";

import { memo, useState, useCallback, useRef } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { ImagePlus, X } from "lucide-react";
import type { ImageUploadData } from "@/types/canvas";

function ImageNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as ImageUploadData;
  const [dragging, setDragging] = useState(false);
  const [editingCaption, setEditingCaption] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { updateNodeData } = useReactFlow();

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        updateNodeData(id, { src: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    },
    [id, updateNodeData]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearImage = useCallback(() => {
    updateNodeData(id, { src: null });
  }, [id, updateNodeData]);

  return (
    <div
      className="group relative w-64 rounded-2xl overflow-hidden shadow-lg transition-shadow bg-[var(--node-bg)]"
      style={{
        borderWidth: 1,
        borderTopColor: selected ? nodeData.color : "var(--node-border)",
        borderRightColor: selected ? nodeData.color : "var(--node-border)",
        borderBottomColor: selected ? nodeData.color : "var(--node-border)",
        borderLeftWidth: 4,
        borderLeftColor: nodeData.color,
        borderRadius: "4px 16px 16px 4px",
        boxShadow: selected ? `0 0 8px ${nodeData.color}15` : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-neutral-500 !border-2 !border-neutral-700" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-neutral-500 !border-2 !border-neutral-700" />
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-neutral-500 !border-2 !border-neutral-700" style={{ left: -2 }} />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-neutral-500 !border-2 !border-neutral-700" />

      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: `${nodeData.color}15` }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: `${nodeData.color}25` }}
        >
          <ImagePlus className="h-4 w-4" style={{ color: nodeData.color }} />
        </div>
        <h3 className="flex-1 text-sm font-semibold text-foreground">Image</h3>
        {nodeData.src && (
          <button
            onClick={clearImage}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Image area */}
      {nodeData.src ? (
        <div className="px-3 py-2">
          <img
            src={nodeData.src}
            alt={nodeData.caption || "uploaded"}
            className="w-full rounded-xl object-cover max-h-40"
          />
        </div>
      ) : (
        <div
          className="mx-3 my-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 cursor-pointer transition-colors"
          style={{
            borderColor: dragging ? nodeData.color : "var(--node-border)",
            background: dragging ? `${nodeData.color}10` : "transparent",
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <span className="text-[10px] text-muted-foreground/60">
            Drop or click to upload
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {/* Caption */}
      <div className="px-4 pb-3">
        {editingCaption ? (
          <input
            autoFocus
            defaultValue={nodeData.caption}
            onBlur={(e) => {
              setEditingCaption(false);
              updateNodeData(id, { caption: e.target.value });
            }}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className="w-full bg-transparent text-xs text-muted-foreground outline-none"
            placeholder="Add caption..."
          />
        ) : (
          <p
            className="text-xs text-muted-foreground cursor-text min-h-4"
            onDoubleClick={() => setEditingCaption(true)}
          >
            {nodeData.caption || "Double click for caption..."}
          </p>
        )}
      </div>
    </div>
  );
}

export const ImageNodeComponent_ = memo(ImageNodeComponent);
