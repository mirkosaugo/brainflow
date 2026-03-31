"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Background, BackgroundVariant } from "@xyflow/react";

const GLOW_RADIUS = 250;
const IDLE_TIMEOUT = 1000;

export function DotGlowBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [maskPos, setMaskPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideGlow = useCallback(() => {
    setVisible(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      mouseRef.current = pos;
      setMaskPos(pos);
      setVisible(true);

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(hideGlow, IDLE_TIMEOUT);
    },
    [hideGlow]
  );

  const handleMouseLeave = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    const parent = containerRef.current?.closest(".react-flow") as HTMLElement;
    if (!parent) return;

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Mask always points at last known position — opacity controls visibility
  const maskImage = `radial-gradient(circle ${GLOW_RADIUS}px at ${maskPos.x}px ${maskPos.y}px, black 0%, transparent 100%)`;

  return (
    <div
      ref={containerRef}
      className="react-flow__background"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: visible ? "opacity 0.15s ease-in" : "opacity 0.6s ease-out",
        maskImage,
        WebkitMaskImage: maskImage,
      }}
    >
      <Background
        id="dot-glow-bg"
        variant={BackgroundVariant.Dots}
        gap={16}
        size={2}
        color="var(--dot-glow-color)"
      />
    </div>
  );
}
