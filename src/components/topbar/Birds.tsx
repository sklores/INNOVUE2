// src/components/topbar/Birds.tsx
import React, { useMemo } from "react";

type Props = {
  sceneWidth: number;
  activity?: number;     // 0..1 (how many flocks / how fast)
  reducedMotion?: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** One bird composed of 3 strokes: LEFT wing, BODY, RIGHT wing.
 *  Wings flap around the BODY as the pivot (no visible gap).
 */
const BirdMark: React.FC<{
  size: number;           // base size in px
  color: string;
  flapSeconds: number;    // flap period
  flapDelay: number;      // phase offset
  tiltDeg: number;        // base tilt of the whole bird
}> = ({ size, color, flapSeconds, flapDelay, tiltDeg }) => {
  const bodyLen = Math.max(6, Math.round(size * 0.9));   // body stroke length
  const wingLen = Math.max(8, Math.round(size * 1.2));   // each wing stroke
  const stroke = 2;

  // Keyframe name unique per instance to avoid collisions
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
      {/* BODY (center short stroke) */}
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

      {/* LEFT WING (flaps up/down around body's left end) */}
      <span
        style={{
          ...commonWing,
          left: wingLen - bodyLen / 2,
          top: size * 0.4,
          width: wingLen,
          animation: `${anim}_L ${flapSeconds}s ease-in-out ${flapDelay}s infinite`,
        }}
      />

      {/* RIGHT WING (mirrored, pivots around body's right end) */}
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
          0%   { transform: rotate(18deg) }
          50%  { transform: rotate(30deg) }  /* gentle amplitude */
          100% { transform: rotate(18deg) }
        }
        @keyframes ${anim}_R {
          0%   { transform: rotate(-18deg) }
          50%  { transform: rotate(-30deg) }
          100% { transform: rotate(-18deg) }
        }
      `}</style>
    </div>
  );
};

/** A flock flying left->right as a set of small BirdMarks. */
const Flock: React.FC<{
  topPct: number;          // vertical placement (0..100%) of the scene
  size: number;            // base bird size in px
  count: number;           // number of birds in the flock
  duration: number;        // seconds to cross the scene
  delay: number;           // animation delay (s)
  spread: number;          // horizontal spread of flock in px
  color: string;           // stroke color
  reducedMotion?: boolean;
}> = ({ topPct, size, count, duration, delay, spread, color, reducedMotion }) => {
  const birds = Array.from({ length: count }).map((_, i) => {
    const offset = (i / Math.max(1, count - 1)) * spread;
    const yJitter = (Math.sin(i) * size) / 3;
    const tilt = -10 + (i % 3) * 5;                 // subtle variation
    const flap = reducedMotion ? 1.1 : 0.85 + (i % 4) * 0.06; // compact, natural speed
    const phase = (i % 5) * 0.08;
    return { offset, yJitter, tilt, flap, phase };
  });

  const animName = useMemo(
    () => `flockfly_${Math.random().toString(36).slice(2)}`,
    []
  );

  return (
    <div
      style={{
        position: "absolute",
        left: -140,
        top: `${topPct}%`,
        height: size * 3,
        width: spread + 360,
        pointerEvents: "none",
        animation: `${animName} ${duration}s linear ${delay}s infinite`,
        willChange: "transform",
        opacity: 0.95,
      }}
    >
      {birds.map((b, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: b.offset,
            top: b.yJitter,
          }}
        >
          <BirdMark
            size={size}
            color={color}
            flapSeconds={b.flap}
            flapDelay={b.phase}
            tiltDeg={b.tilt}
          />
        </div>
      ))}

      <style>{`
        @keyframes ${animName} {
          0%   { transform: translateX(0) }
          100% { transform: translateX(110%) }
        }
      `}</style>
    </div>
  );
};

const Birds: React.FC<Props> = ({ sceneWidth, activity = 0.4, reducedMotion }) => {
  const t = clamp01(activity);
  const durBase = reducedMotion ? 14 : 10;      // slower if reduced-motion
  const flocks = 1 + Math.round(t * 2);         // 1..3 flocks
  const sizeBase = 7 + Math.round(t * 5);       // 7..12 px
  const spreadBase = Math.min(260, sceneWidth * 0.6);

  const groups = useMemo(() => {
    return Array.from({ length: flocks }).map((_, i) => {
      const topPct = 20 + i * (24 / Math.max(1, flocks - 1)) + Math.random() * 6;
      const size = sizeBase + (i % 2);
      const count = 4 + Math.round(1 + t * 2);     // 5..7 birds/flock
      const duration = durBase + i * 1.6 - t * 2;  // slightly different speeds
      const delay = -Math.random() * duration;
      const spread = spreadBase - i * 28 + Math.random() * 18;
      return { topPct, size, count, duration, delay, spread };
    });
  }, [flocks, sizeBase, spreadBase, durBase, t]);

  const strokeColor = "rgba(40, 60, 80, 0.95)";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {groups.map((g, idx) => (
        <Flock
          key={idx}
          topPct={g.topPct}
          size={g.size}
          count={g.count}
          duration={g.duration}
          delay={g.delay}
          spread={g.spread}
          color={strokeColor}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
};

export default Birds;