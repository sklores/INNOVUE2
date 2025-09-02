// src/components/topbar/RockBase.tsx
import React from "react";

type Props = {
  /** Width/height of the rock SVG viewport (in px of the stage). */
  size?: { width: number; height: number };
};

/**
 * Foreground rock shelf / peninsula (light granite):
 * - Lighter grey body
 * - Softer shadow lip
 * - No highlight line on top
 */
const RockBase: React.FC<Props> = ({ size }) => {
  const w = size?.width ?? 180;
  const h = size?.height ?? 80;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* subtle, light granite gradient */}
      <defs>
        <linearGradient id="rockFillLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#AAB3BA" />  {/* light grey top */}
          <stop offset="100%" stopColor="#7F8991" /> {/* mid grey base */}
        </linearGradient>
      </defs>

      {/* Main bedrock shape (rounded, slightly undercut) */}
      <path
        d={[
          `M 0 ${h * 0.55}`,
          `C ${w * 0.12} ${h * 0.30}, ${w * 0.35} ${h * 0.15}, ${w * 0.58} ${h * 0.22}`,
          `S ${w * 0.95} ${h * 0.40}, ${w} ${h * 0.50}`,
          `L ${w} ${h}`,
          `L 0 ${h}`,
          "Z",
        ].join(" ")}
        fill="url(#rockFillLight)"
      />

      {/* Softer shadow lip along waterline (reduced contrast, no hard line) */}
      <path
        d={[
          `M 0 ${h * 0.72}`,
          `C ${w * 0.25} ${h * 0.64}, ${w * 0.55} ${h * 0.64}, ${w} ${h * 0.70}`,
          `L ${w} ${h * 0.86}`,
          `C ${w * 0.60} ${h * 0.78}, ${w * 0.28} ${h * 0.78}, 0 ${h * 0.84}`,
          "Z",
        ].join(" ")}
        fill="rgba(0,0,0,0.12)"
      />

      {/* Removed the top highlight stroke to avoid any visible line */}
    </svg>
  );
};

export default RockBase;