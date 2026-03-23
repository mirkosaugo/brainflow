"use client";

import { memo, useState, useCallback } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { Type } from "lucide-react";
import type { TextNodeData } from "@/types/canvas";

function TextNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as TextNodeData;
  const [editing, setEditing] = useState(false);
  const { updateNodeData } = useReactFlow();

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setEditing(false);
      updateNodeData(id, { text: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <div
      className="group relative w-72 rounded-2xl overflow-hidden shadow-lg transition-shadow bg-[var(--node-bg)]"
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
          <Type className="h-4 w-4" style={{ color: nodeData.color }} />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Text</h3>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        {editing ? (
          <textarea
            autoFocus
            defaultValue={nodeData.text}
            onBlur={handleBlur}
            className="w-full min-h-16 resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
            placeholder="Write your ideas here..."
          />
        ) : (
          <p
            className="min-h-8 cursor-text text-sm leading-relaxed text-foreground whitespace-pre-wrap"
            onDoubleClick={() => setEditing(true)}
          >
            {nodeData.text || "Double click to write..."}
          </p>
        )}
      </div>
    </div>
  );
}

export const TextNodeComponent_ = memo(TextNodeComponent);
