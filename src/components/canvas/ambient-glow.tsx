"use client";

import { memo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const noop = () => () => {};
const getTrue = () => true;
const getFalse = () => false;
function useIsMounted() {
  return useSyncExternalStore(noop, getTrue, getFalse);
}

const orbs = [
  // Top — full width waves sliding horizontally
  { color: "#A78BFA", w: "100%", h: "32px", x: "0", y: "0", anim: "ambient-wave-h", dur: 6, delay: 0 },
  { color: "#38BDF8", w: "100%", h: "32px", x: "0", y: "0", anim: "ambient-wave-h", dur: 8, delay: -2 },
  { color: "#34D399", w: "100%", h: "32px", x: "0", y: "0", anim: "ambient-wave-h", dur: 10, delay: -5 },
  // Bottom — full width waves sliding horizontally reversed
  { color: "#FF6B9D", w: "100%", h: "32px", x: "0", y: "auto", anim: "ambient-wave-h-rev", dur: 7, delay: -1, bottom: "0" },
  { color: "#A78BFA", w: "100%", h: "32px", x: "0", y: "auto", anim: "ambient-wave-h-rev", dur: 9, delay: -4, bottom: "0" },
  { color: "#38BDF8", w: "100%", h: "32px", x: "0", y: "auto", anim: "ambient-wave-h-rev", dur: 11, delay: -6, bottom: "0" },
  // Left — full height waves sliding vertically
  { color: "#34D399", w: "32px", h: "100%", x: "0", y: "0", anim: "ambient-wave-v", dur: 7, delay: -1 },
  { color: "#FF6B9D", w: "32px", h: "100%", x: "0", y: "0", anim: "ambient-wave-v", dur: 9, delay: -3 },
  { color: "#A78BFA", w: "32px", h: "100%", x: "0", y: "0", anim: "ambient-wave-v", dur: 11, delay: -7 },
  // Right — full height waves sliding vertically reversed
  { color: "#38BDF8", w: "32px", h: "100%", x: "auto", y: "0", anim: "ambient-wave-v-rev", dur: 8, delay: -2, right: "0" },
  { color: "#34D399", w: "32px", h: "100%", x: "auto", y: "0", anim: "ambient-wave-v-rev", dur: 10, delay: -5, right: "0" },
  { color: "#FF6B9D", w: "32px", h: "100%", x: "auto", y: "0", anim: "ambient-wave-v-rev", dur: 6, delay: -1, right: "0" },
];

interface AmbientGlowProps {
  active: boolean;
}

function AmbientGlowComponent({ active }: AmbientGlowProps) {
  const isMounted = useIsMounted();
  if (!isMounted) return null;

  return createPortal(
    <div
      id="ambient-glow"
      className="pointer-events-none fixed inset-0 transition-opacity duration-1000"
      style={{ opacity: active ? 1 : 0, zIndex: 9998 }}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "right" in orb ? "auto" : orb.x,
            top: "bottom" in orb ? "auto" : orb.y,
            right: "right" in orb ? (orb as { right: string }).right : undefined,
            bottom: "bottom" in orb ? (orb as { bottom: string }).bottom : undefined,
            width: orb.w,
            height: orb.h,
            opacity: 0.8,
            background: `radial-gradient(ellipse, ${orb.color} 0%, ${orb.color}80 40%, transparent 70%)`,
            filter: "blur(50px)",
            animationName: active ? orb.anim : "none",
            animationDuration: `${orb.dur}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>,
    document.body
  );
}

export const AmbientGlow = memo(AmbientGlowComponent);
