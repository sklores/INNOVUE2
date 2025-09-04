// src/components/topbar/Birds.tsx
import React, { useMemo } from "react";

type Props = {
  sceneWidth: number;
  activity?: number;     // 0..1 (how many flocks / how fast)
  reducedMotion?: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Minimal single-path bird (no wing gaps), with soft bob/tilt */
const BirdGlyph: React.FC<{
  size: number;
  color: string;
  bobSec: number;
  bobDelay: number;
  tiltDeg: number;
}> = ({ size, color, bobSec, bobDelay, tiltDeg }) => {
  const w = size * 2.2;
  const h = size * 1.2;

  // a simple chevron curve path
  const path = `M 0 ${h*0.6} Q ${w*0.35} ${h*0.2}, ${w*0.55} ${h*0.6} Q ${w*0.8} ${h*0.95}, ${w} ${h*0.6}`;

  const anim = useMemo(() => `birdbob_${Math.random().toString(36).slice(2)}`, []);

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        display: "block",
        transform: `rotate(${tiltDeg}deg)`,
        animation: `${anim} ${bobSec}s ease-in-out ${bobDelay}s infinite`,
      }}
    >
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <style>{`
        @keyframes ${anim} {
          0%, 100% { transform: translateY(0) }
          50%      { transform: translateY(-1.5px) }
        }
      `}</style>
    </svg>
  );
};

const Flock: React.FC<{
  topPct: number;
  size: number;
  cols: number;            // birds per row
  rows: number;            // number of staggered rows
  duration: number;
  delay: number;
  hSpread: number;         // horizontal spread
  vSpread: number;         // vertical spread (stacking)
  color: string;
  reducedMotion?: boolean;
}> = ({ topPct, size, cols, rows, duration, delay, hSpread, vSpread, color, reducedMotion }) => {
  const birds: { x: number; y: number; bob: number; phase: number; tilt: number }[] = [];

  // build a small staggered grid (rows/cols) → better “stacking” than a single line
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / Math.max(1, cols - 1)) * hSpread;
      const y = (r / Math.max(1, rows - 1)) * vSpread + (r % 2 === 0 ? 0 : 3); // staggered
      const bob = reducedMotion ? 1.2 : 0.9 + (r + c) * 0.02;
      const phase = (r * 0.08) + (c * 0.05);
      const tilt = -8 + (r - rows / 2) * 2;
      birds.push({ x, y, bob, phase, tilt });
    }
  }

  const anim = useMemo(() => `flock_${Math.random().toString(36).slice(2)}`, []);

  return (
    <div
      style={{
        position: "absolute",
        left: -160,
        top: `${topPct}%`,
        width: hSpread + 380,
        height: vSpread + size * 3,
        pointerEvents: "none",
        animation: `${anim} ${duration}s linear ${delay}s infinite`,
        willChange: "transform",
        opacity: 0.95,
      }}
    >
      {birds.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b.x, top: b.y }}>
          <BirdGlyph
            size={size}
            color={color}
            bobSec={b.bob}
            bobDelay={b.phase}
            tiltDeg={b.tilt}
          />
        </div>
      ))}

      <style>{`
        @keyframes ${anim} {
          0%   { transform: translateX(0) }
          100% { transform: translateX(110%) }
        }
      `}</style>
    </div>
  );
};

const Birds: React.FC<Props> = ({ sceneWidth, activity = 0.4, reducedMotion }) => {
  const t = clamp01(activity);
  const durBase = reducedMotion ? 14 : 10;
  const flocks = 1 + Math.round(t * 2);                 // 1..3 flocks
  const sizeBase = 7 + Math.round(t * 5);               // 7..12 px
  const hSpread = Math.min(260, sceneWidth * 0.6);
  const vSpreadBase = 16;                                // vertical stacking band

  const groups = useMemo(() => {
    return Array.from({ length: flocks }).map((_, i) => {
      const topPct = 22 + i * (22 / Math.max(1, flocks - 1)) + Math.random() * 6;
      const size = sizeBase + (i % 2);
      const duration = durBase + i * 1.6 - t * 2;
      const delay = -Math.random() * duration;

      // rows/cols scale gently with activity
      const rows = 2;                     // two stacked rows looks tidy
      const cols = 3 + Math.round(t * 1); // 3..4 per row
      const vSpread = vSpreadBase + (i * 2);

      return { topPct, size, cols, rows, duration, delay, vSpread };
    });
  }, [flocks, sizeBase, hSpread, vSpreadBase, durBase, t]);

  const strokeColor = "rgba(40, 60, 80, 0.9)";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {groups.map((g, idx) => (
        <Flock
          key={idx}
          topPct={g.topPct}
          size={g.size}
          cols={g.cols}
          rows={g.rows}
          duration={g.duration}
          delay={g.delay}
          hSpread={hSpread}
          vSpread={g.vSpread}
          color={strokeColor}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
};

export default Birds;