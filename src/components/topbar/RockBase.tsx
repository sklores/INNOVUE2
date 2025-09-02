// src/components/topbar/RockBase.tsx
import React from "react";

type Props = {
  /** Width/height of the rock SVG viewport (in px of the stage). */
  size?: { width: number; height: number };
};

/**
 * Foreground rock shelf / peninsula. Stylized to look like weathered granite:
 * - Base shape with soft curvature
 * - Darker shadow lip along the waterline
 * - Subtle top highlight for “wet” sheen
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
      {/* gradient for subtle depth */}
      <defs>
        <linearGradient id="rockFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#444B51" />   {/* cooler, drier top */}
          <stop offset="100%" stopColor="#2F353A" /> {/* darker, wetter base */}
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
        fill="url(#rockFill)"
      />

      {/* Shadow lip along waterline (gives “shelf” feel) */}
      <path
        d={[
          `M 0 ${h * 0.72}`,
          `C ${w * 0.25} ${h * 0.64}, ${w * 0.55} ${h * 0.64}, ${w} ${h * 0.70}`,
          `L ${w} ${h * 0.86}`,
          `C ${w * 0.60} ${h * 0.78}, ${w * 0.28} ${h * 0.78}, 0 ${h * 0.84}`,
          "Z",
        ].join(" ")}
        fill="rgba(0,0,0,0.28)"
      />

      {/* Subtle highlight curve on the top plate (wet sheen) */}
      <path
        d={[
          `M ${w * 0.10} ${h * 0.42}`,
          `C ${w * 0.32} ${h * 0.28}, ${w * 0.52} ${h * 0.22}, ${w * 0.70} ${h * 0.28}`,
        ].join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default RockBase;