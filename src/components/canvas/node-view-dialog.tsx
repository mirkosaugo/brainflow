"use client";

import type { ReactNode } from "react";
import { Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

export function NodeViewTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger className={ICON_BTN_CLASS} onClick={onClick}>
        <Eye className="h-3.5 w-3.5" />
      </TooltipTrigger>
      <TooltipContent side="right">View</TooltipContent>
    </Tooltip>
  );
}

interface NodeViewDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  icon: LucideIcon;
  label: string;
  color: string;
  children: ReactNode;
}

export function NodeViewDialog({ open, onOpenChange, icon: Icon, label, color, children }: NodeViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-4 w-4" style={{ color }} />
            {label}
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
