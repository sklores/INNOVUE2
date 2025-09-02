// src/components/topbar/Birds.tsx
import React, { useMemo } from "react";

type Props = {
  sceneWidth: number;
  activity?: number;     // 0..1 (how many flocks / how fast); default from tuning
  reducedMotion?: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** One animated flock flying left->right as a set of small "V" birds. */
const Flock: React.FC<{
  topPct: number;          // vertical placement (0..100%) of the scene
  size: number;            // base bird size in px
  count: number;           // number of birds in the flock
  duration: number;        // seconds to cross the scene
  delay: number;           // animation delay (s)
  spread: number;          // horizontal spread of flock in px
  color: string;           // stroke color
}> = ({ topPct, size, count, duration, delay, spread, color }) => {
  const birds = Array.from({ length: count }).map((_, i) => {
    const offset = (i / Math.max(1, count - 1)) * spread;
    const yJitter = (Math.sin(i) * size) / 3;
    const tilt = -12 + (i % 3) * 6; // subtle variation
    return { offset, yJitter, tilt };
  });

  const animName = useMemo(
    () => `birds-fly-${Math.random().toString(36).slice(2)}`,
    []
  );

  return (
    <div
      style={{
        position: "absolute",
        left: -120,
        top: `${topPct}%`,
        height: size * 3,
        width: spread + 300,
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
            width: size * 2,
            height: size,
            transform: `rotate(${b.tilt}deg)`,
          }}
        >
          {/* simple "V" shape using two strokes */}
          <span
            style={{
              position: "absolute",
              left: 0,
              top: size * 0.4,
              width: size,
              height: 0,
              borderTop: `2px solid ${color}`,
              transform: "rotate(18deg)",
              transformOrigin: "left center",
              opacity: 0.9,
            }}
          />
          <span
            style={{
              position: "absolute",
              left: size,
              top: size * 0.4,
              width: size,
              height: 0,
              borderTop: `2px solid ${color}`,
              transform: "rotate(-18deg)",
              transformOrigin: "right center",
              opacity: 0.9,
            }}
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
      const topPct = 18 + i * (26 / Math.max(1, flocks - 1)) + Math.random() * 6;
      const size = sizeBase + (i % 2);
      const count = 3 + Math.round(2 + t * 3);   // 5..8-ish
      const duration = durBase + i * 1.5 - t * 2; // slightly different speeds
      const delay = -Math.random() * duration;
      const spread = spreadBase - i * 30 + Math.random() * 20;
      return { topPct, size, count, duration, delay, spread };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        />
      ))}
    </div>
  );
};

export default Birds;