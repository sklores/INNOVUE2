// src/components/topbar/Birds.tsx
import React, { useMemo } from "react";

type Props = {
  sceneWidth: number;
  /** 0..1 (higher labor => more birds) */
  activity?: number;
  reducedMotion?: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Minimal single-path bird (chevron curve), with soft bob/tilt */
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

/** Winged bird (classic “V” with tiny body), gentle flap */
const BirdVMark: React.FC<{
  size: number;
  color: string;
  flapSeconds: number;
  flapDelay: number;
  tiltDeg: number;
}> = ({ size, color, flapSeconds, flapDelay, tiltDeg }) => {
  const stroke = 2;
  const bodyLen = Math.max(6, Math.round(size * 0.9));
  const wingLen = Math.max(8, Math.round(size * 1.2));

  const anim = useMemo(() => `wingflap_${Math.random().toString(36).slice(2)}`, []);
  const commonWing: React.CSSProperties = {
    position: "absolute",
    top: 0,
    height: 0,
    borderTop: `${stroke}px solid ${color}`,
    transformOrigin: "left center",
    willChange: "transform",
  };

  return (
    <div
      style={{
        position: "relative",
        width: wingLen * 2,
        height: size,
        transform: `rotate(${tiltDeg}deg)`,
      }}
    >
      {/* BODY */}
      <span
        style={{
          position: "absolute",
          top: size * 0.4,
          left: wingLen - bodyLen / 2,
          width: bodyLen,
          height: 0,
          borderTop: `${stroke}px solid ${color}`,
          opacity: 0.95,
        }}
      />
      {/* LEFT WING */}
      <span
        style={{
          ...commonWing,
          left: wingLen - bodyLen / 2,
          top: size * 0.4,
          width: wingLen,
          animation: `${anim}_L ${flapSeconds}s ease-in-out ${flapDelay}s infinite`,
        }}
      />
      {/* RIGHT WING */}
      <span
        style={{
          ...commonWing,
          left: wingLen + bodyLen / 2,
          top: size * 0.4,
          width: wingLen,
          transformOrigin: "right center",
          animation: `${anim}_R ${flapSeconds}s ease-in-out ${flapDelay + 0.04}s infinite`,
        }}
      />
      <style>{`
        @keyframes ${anim}_L {
          0%   { transform: rotate(16deg) }
          50%  { transform: rotate(28deg) }
          100% { transform: rotate(16deg) }
        }
        @keyframes ${anim}_R {
          0%   { transform: rotate(-16deg) }
          50%  { transform: rotate(-28deg) }
          100% { transform: rotate(-16deg) }
        }
      `}</style>
    </div>
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
  direction: 1 | -1;       // 1 = left->right, -1 = right->left
}> = ({ topPct, size, cols, rows, duration, delay, hSpread, vSpread, color, reducedMotion, direction }) => {
  const birds: { x: number; y: number; bob: number; phase: number; tilt: number; kind: "glyph" | "vmark" }[] = [];

  // build a small staggered grid (rows/cols) → better “stacking”
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / Math.max(1, cols - 1)) * hSpread;
      const y = (r / Math.max(1, rows - 1)) * vSpread + (r % 2 === 0 ? 0 : 3);
      const bob = reducedMotion ? 1.2 : 0.9 + (r + c) * 0.02;
      const phase = (r * 0.08) + (c * 0.05);
      const tilt = (direction === 1 ? -8 : 8) + (r - rows / 2) * 2;
      // Randomly choose bird kind to mix silhouettes
      const kind = Math.random() < 0.55 ? "glyph" : "vmark";
      birds.push({ x, y, bob, phase, tilt, kind });
    }
  }

  const anim = useMemo(() => `flock_${direction === 1 ? "lr" : "rl"}_${Math.random().toString(36).slice(2)}`, [direction]);

  const containerStyle: React.CSSProperties = direction === 1
    ? {
        position: "absolute",
        left: -160,
        top: `${topPct}%`,
        width: hSpread + 380,
        height: vSpread + size * 3,
        pointerEvents: "none",
        animation: `${anim} ${duration}s linear ${delay}s infinite`,
        willChange: "transform",
        opacity: 0.95,
      }
    : {
        position: "absolute",
        left: -160,              // we animate from +110% to -10% in transform
        top: `${topPct}%`,
        width: hSpread + 380,
        height: vSpread + size * 3,
        pointerEvents: "none",
        animation: `${anim} ${duration}s linear ${delay}s infinite`,
        willChange: "transform",
        opacity: 0.95,
      };

  return (
    <div style={containerStyle}>
      {birds.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b.x, top: b.y }}>
          {b.kind === "glyph" ? (
            <BirdGlyph size={size} color={color} bobSec={b.bob} bobDelay={b.phase} tiltDeg={b.tilt} />
          ) : (
            <BirdVMark size={size} color={color} flapSeconds={b.bob} flapDelay={b.phase} tiltDeg={b.tilt} />
          )}
        </div>
      ))}

      <style>{`
        @keyframes ${anim} {
          ${direction === 1
            ? `0%   { transform: translateX(0) }
               100% { transform: translateX(110%) }`
            : `0%   { transform: translateX(110%) }
               100% { transform: translateX(-10%) }`}
        }
      `}</style>
    </div>
  );
};

const Birds: React.FC<Props> = ({ sceneWidth, activity = 0.4, reducedMotion }) => {
  // Higher labor => more activity
  const t = clamp01(activity);

  // flocks 1..4
  const flocks = 1 + Math.round(t * 3);

  // base sizes & spreads
  const sizeBase = 7 + Math.round(t * 5);               // 7..12 px
  const hSpread = Math.min(280, sceneWidth * 0.65);
  const vSpreadBase = 16;                                // vertical stacking band
  const durBase = reducedMotion ? 15 : 11;

  const groups = useMemo(() => {
    return Array.from({ length: flocks }).map((_, i) => {
      const topPct = 22 + i * (22 / Math.max(1, flocks - 1)) + Math.random() * 6;
      const size = sizeBase + (i % 2);
      const duration = Math.max(7, durBase + i * 1.4 - t * 3);
      const delay = -Math.random() * duration;

      // rows/cols scale gently with activity
      const rows = 2;                                 // two stacked rows
      const cols = 3 + Math.round(t * 2);             // 3..5 per row
      const vSpread = vSpreadBase + (i * 2);

      // Random direction: bias ~30-40% to right->left for variety
      const dir = Math.random() < 0.4 ? -1 : 1;

      return { topPct, size, cols, rows, duration, delay, vSpread, dir };
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
          direction={g.dir as 1 | -1}
        />
      ))}
    </div>
  );
};

export default Birds;