"use client";

import { createContext, use } from "react";

export interface CanvasActionsState {
  onThinkTwin: (nodeId: string) => void;
}

export const CanvasActionsContext = createContext<CanvasActionsState>({
  onThinkTwin: () => {},
});

export function useCanvasActions() {
  return use(CanvasActionsContext);
}
