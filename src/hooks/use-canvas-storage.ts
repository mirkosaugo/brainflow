import { useCallback, useRef } from "react";
import type { CanvasNode } from "@/types/canvas";
import { initialNodes, initialColorLabels } from "@/config/initial-data";

const STORAGE_KEY = "symposiumai-canvas";

/**
 * Serializable canvas state stored in localStorage.
 */
export interface ColorLabels {
  [hex: string]: string;
}

interface CanvasState {
  nodes: CanvasNode[];
  colorLabels?: ColorLabels;
  savedAt: number;
}

/**
 * Load saved nodes from localStorage, falling back to initialNodes.
 */
export function loadCanvas(): { nodes: CanvasNode[]; colorLabels: ColorLabels } {
  if (typeof window === "undefined") return { nodes: initialNodes, colorLabels: initialColorLabels };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { nodes: initialNodes, colorLabels: initialColorLabels };
    const state: CanvasState = JSON.parse(raw);
    if (Array.isArray(state.nodes) && state.nodes.length > 0) {
      return { nodes: state.nodes, colorLabels: state.colorLabels ?? {} };
    }
  } catch {
    // corrupted data — fall back
  }
  return { nodes: initialNodes, colorLabels: initialColorLabels };
}

/** @deprecated Use loadCanvas() instead */
export function loadNodes(): CanvasNode[] {
  return loadCanvas().nodes;
}

/**
 * Hook that returns save and export helpers.
 * Call `save(nodes)` whenever the canvas changes.
 */
export function useCanvasStorage() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Debounced save to localStorage (500ms) */
  const save = useCallback((nodes: CanvasNode[], colorLabels?: ColorLabels) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      try {
        const state: CanvasState = { nodes, colorLabels, savedAt: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // storage full or unavailable
      }
    }, 500);
  }, []);

  /** Export current canvas as a downloadable .json file */
  const exportJSON = useCallback((nodes: CanvasNode[]) => {
    const state: CanvasState = { nodes, savedAt: Date.now() };
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `symposiumai-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  /** Import nodes from a .json file */
  const importJSON = useCallback((): Promise<CanvasNode[] | null> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const state: CanvasState = JSON.parse(e.target?.result as string);
            if (Array.isArray(state.nodes) && state.nodes.length > 0) {
              resolve(state.nodes);
            } else {
              resolve(null);
            }
          } catch {
            resolve(null);
          }
        };
        reader.readAsText(file);
      };
      input.click();
    });
  }, []);

  return { save, exportJSON, importJSON };
}
