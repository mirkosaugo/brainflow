// Node type colors
export const NODE_COLORS = {
  text: "#64748b",
  conceptCard: "#A78BFA",
  imageUpload: "#38BDF8",
  run: "#34D399",
} as const;

// Default edge styling
export const DEFAULT_EDGE_STYLE = {
  stroke: "var(--edge-stroke)",
  strokeWidth: 2,
} as const;

// Canvas
export const SNAP_GRID: [number, number] = [16, 16];

// Glass-morphism UI classes (for app overlays — NOT canvas nodes)
export const GLASS_CONTAINER_CLASS =
  "bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-[var(--glass-shadow)]";

// Icon button class shared across toolbars
export const ICON_BTN_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-muted active:scale-95 text-foreground";
