"use client";

import { useCallback } from "react";
import { NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GLASS_CONTAINER_CLASS, ICON_BTN_CLASS } from "@/config/constants";
import { useNodeEditor } from "@/hooks/use-node-editor";

interface NodeActionsProps {
  nodeId: string;
  /** @deprecated Use drawer-based editing via context instead */
  onEdit?: () => void;
  hideEdit?: boolean;
  children?: React.ReactNode;
}

export function NodeActions({ nodeId, onEdit, hideEdit, children }: NodeActionsProps) {
  const { deleteElements } = useReactFlow();
  const { openEditor } = useNodeEditor();

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit();
    } else {
      openEditor(nodeId);
    }
  }, [nodeId, onEdit, openEditor]);

  return (
    <NodeToolbar position={Position.Right} offset={12} align="center">
      <div className={`flex flex-col items-center gap-1 rounded-full p-1.5 ${GLASS_CONTAINER_CLASS}`}>
        {!hideEdit && (
          <Tooltip>
            <TooltipTrigger className={ICON_BTN_CLASS} onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent side="right">Edit</TooltipContent>
          </Tooltip>
        )}

        {children}

        <Tooltip>
          <TooltipTrigger
            className={ICON_BTN_CLASS}
            onClick={() => deleteElements({ nodes: [{ id: nodeId }] })}
          >
            <Trash2 className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Delete</TooltipContent>
        </Tooltip>
      </div>
    </NodeToolbar>
  );
}
