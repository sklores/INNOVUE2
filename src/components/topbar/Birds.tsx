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

  // smooth chevron curve
  const d = `M 0 ${h*0.6} 
             Q ${w*0.35} ${h*0.2}, ${w*0.55} ${h*0.6} 
             Q ${w*0.8} ${h*0.95}, ${w} ${h*0.6}`;

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
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <style>{`
        @keyframes ${anim} {
          0%, 100% { transform: translateY(0) }
          50%      { transform: translateY(-1.5px) }
        }
      `}</style>
    </svg>
  );
};

/** Classic 'V' bird (single path), micro flap via scaleY; smaller than chevron */
const BirdVMark: React.FC<{
  size: number;
  color: string;
  flapSec: number;
  flapDelay: number;
  tiltDeg: number;
}> = ({ size, color, flapSec, flapDelay, tiltDeg }) => {
  const s = size * 0.75;       // smaller V birds
  const w = s * 2.0;
  const h = s * 1.1;

  // single path V (no body stroke)
  const d = `M 0 ${h*0.65} 
             L ${w*0.45} ${h*0.25} 
             L ${w} ${h*0.65}`;

  const anim = useMemo(() => `vflap_${Math.random().toString(36).slice(2)}`, []);

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        display: "block",
        transform: `rotate(${tiltDeg}deg)`,
        animation: `${anim} ${flapSec}s ease-in-out ${flapDelay}s infinite`,
        transformOrigin: "50% 60%",
      }}
    >
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <style>{`
        /* gentle "flap" by scaling Y a touch (no wing gaps, no extra lines) */
        @keyframes ${anim} {
          0%, 100% { transform: translateY(0) scaleY(1.00) }
          50%      { transform: translateY(-1px) scaleY(0.94) }
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
  direction: 1 | -1;       // 1 = left->right, -1 = right->left
}> = ({
  topPct, size, cols, rows, duration, delay, hSpread, vSpread, color, reducedMotion, direction
}) => {
  // build staggered grid with extra randomness
  const birds: {
    x: number; y: number; bob: number; phase: number; tilt: number;
    kind: "glyph" | "vmark";
  }[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // base position
      let x = (c / Math.max(1, cols - 1)) * hSpread;
      let y = (r / Math.max(1, rows - 1)) * vSpread + (r % 2 === 0 ? 0 : 3);
      // jitter to avoid rigid patterns
      x += (Math.random() * 12 - 6);          // -6..+6 px
      y += (Math.random() * 4 - 2);           // -2..+2 px

      // timing/tilt
      const bob = reducedMotion ? 1.2 : 0.9 + (r + c) * 0.02 + Math.random() * 0.04;
      const phase = (r * 0.08) + (c * 0.05) + Math.random() * 0.06;
      const tilt = (direction === 1 ? -8 : 8) + (r - rows / 2) * 2 + (Math.random() * 4 - 2);

      // mix bird kinds (more V marks at smaller size)
      const kind = Math.random() < 0.5 ? "vmark" : "glyph";
      birds.push({ x, y, bob, phase, tilt, kind });
    }
  }

  const anim = useMemo(
    () => `flock_${direction === 1 ? "lr" : "rl"}_${Math.random().toString(36).slice(2)}`,
    [direction]
  );

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: -200,                            // generous runway
    top: `${topPct}%`,
    width: hSpread + 420,
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
            <BirdVMark size={size} color={color} flapSec={b.bob} flapDelay={b.phase} tiltDeg={b.tilt} />
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
      `}</style>
    </div>
  );
};

const Birds: React.FC<Props> = ({ sceneWidth, activity = 0.4, reducedMotion }) => {
  // Higher labor => more activity
  const t = clamp01(activity);

  // 1..4 flocks (more with higher labor)
  const flocks = 1 + Math.round(t * 3);

  // base sizes & spreads
  const sizeBase = 7 + Math.round(t * 5);                 // 7..12 px
  const hSpreadBase = Math.min(300, sceneWidth * 0.7);
  const vSpreadBase = 16;                                  // base vertical band
  const durBase = reducedMotion ? 15 : 11;

  const groups = useMemo(() => {
    return Array.from({ length: flocks }).map((_, i) => {
      const topPct = 20 + i * (22 / Math.max(1, flocks - 1)) + Math.random() * 8;  // more jitter
      const size = sizeBase + (i % 2);
      const duration = Math.max(7, (durBase + i * 1.4 - t * 3) + (Math.random() * 1.5 - 0.75));
      const delay = -Math.random() * duration;

      // rows/cols with randomness
      const rows = Math.max(1, 1 + Math.round(Math.random() + t));         // often 1–2
      const cols = 3 + Math.round(t * 2) + (Math.random() < 0.3 ? 1 : 0);  // 3..6

      // per-flock spread variance
      const hSpread = hSpreadBase * (0.9 + Math.random() * 0.25);
      const vSpread = vSpreadBase + (i * 2) + Math.random() * 6;

      // random direction (≈40% right→left)
      const dir = Math.random() < 0.4 ? -1 : 1;

      return { topPct, size, cols, rows, duration, delay, hSpread, vSpread, dir };
    });
  }, [flocks, sizeBase, hSpreadBase, vSpreadBase, durBase, t]);

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
          hSpread={g.hSpread}
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