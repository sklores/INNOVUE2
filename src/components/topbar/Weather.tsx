// src/components/topbar/Weather.tsx
import React, { useMemo } from "react";

export type Condition = "clear" | "cloudy" | "rain" | "thunder" | "fog";

type Props = {
  condition?: Condition;
  intensity?: number;    // 0..1 (density / strength)
  reducedMotion?: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * PuffyCloud
 * - Organic "metaball" cloud using SVG circles + gooey filter
 * - Subtle top light via radial gradient (no blocky rect underlay)
 */
const PuffyCloud: React.FC<{
  xPct: number;          // left position in %
  yPx: number;           // top position in px
  scale: number;         // 0.8..1.6 typical
  hue: number;           // 0=day (blue-white), 1=night (cool-grey)
  driftSec: number;      // horizontal drift duration
  bobSec: number;        // vertical bob duration
  delay: number;         // animation delay (s)
}> = ({ xPct, yPx, scale, hue, driftSec, bobSec, delay }) => {
  // day → night tint
  const topCol   = `rgba(${Math.round(255 - 30*hue)}, ${Math.round(255 - 35*hue)}, ${Math.round(255 - 55*hue)}, 0.95)`;
  const midCol   = `rgba(${Math.round(245 - 45*hue)}, ${Math.round(250 - 50*hue)}, ${Math.round(255 - 60*hue)}, 0.95)`;

  // cloud geometry (five lobes)
  const R = 22 * scale;
  const offsets = [
    { cx: 0,      cy: 0,   r: R * 1.05 },
    { cx: -R,     cy: 6,   r: R * 0.90 },
    { cx:  R,     cy: 4,   r: R * 0.95 },
    { cx: -R*1.6, cy: 10,  r: R * 0.75 },
    { cx:  R*1.6, cy: 12,  r: R * 0.70 },
  ];

  const id = useMemo(() => `cloud-${Math.random().toString(36).slice(2)}`, []);

  return (
    <div
      style={{
        position: "absolute",
        left: `${xPct}%`,
        top: yPx,
        transform: "translateX(-50%)",
        animation: `cloud-drift ${driftSec}s linear ${-delay}s infinite`,
        willChange: "transform",
        filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.06))",
        pointerEvents: "none",
      }}
    >
      <svg
        width={R * 6}
        height={R * 3.6}
        viewBox={[-R*3, -R*1.2, R*6, R*3.6].join(" ")}
        preserveAspectRatio="xMidYMid meet"
        style={{
          display: "block",
          animation: `cloud-bob ${bobSec}s ease-in-out ${-delay}s infinite`,
        }}
      >
        <defs>
          {/* Gooey filter merges circles for organic shape */}
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 20 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>

          {/* soft top light */}
          <radialGradient id={`${id}-fill`} cx="40%" cy="30%" r="80%">
            <stop offset="0%"  stopColor={topCol} />
            <stop offset="60%" stopColor={midCol} />
            <stop offset="100%" stopColor={midCol} />
          </radialGradient>
        </defs>

        <g filter={`url(#${id})`}>
          <g fill={`url(#${id}-fill)`}>
            {offsets.map((o, i) => (
              <circle key={i} cx={o.cx} cy={o.cy} r={o.r} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};

const Weather: React.FC<Props> = ({
  condition = "clear",
  intensity = 0.6,
  reducedMotion,
}) => {
  const t = clamp01(intensity);
  if (condition === "clear") return null;

  // Basic night tint: if you have a phase hook, wire it here instead of constant false
  const isNight = false;
  const hue = isNight ? 1 : 0;

  // --- Cloud placement logic ---
  // Ensure we cover LEFT / MID / RIGHT at least once,
  // then add extra clouds randomly as intensity grows.
  const baseClouds = Math.min(3, 2 + Math.round(t * 2)); // 2..3
  const extra = Math.max(0, Math.round(t * 1));          // +0..1
  const total = baseClouds + extra;

  const clouds = useMemo(() => {
    const buckets = [
      { min: 6,  max: 34 }, // LEFT
      { min: 35, max: 65 }, // MID
      { min: 55, max: 90 }, // RIGHT
    ];
    const pick = (min: number, max: number) => min + Math.random() * (max - min);

    const arr: { x: number; y: number; sc: number; drift: number; bob: number; delay: number }[] = [];

    // Seed left/mid/right at least once if we have >=3 clouds
    if (total >= 3) {
      buckets.forEach(({ min, max }) => {
        arr.push({
          x: pick(min, max),
          y: 12 + Math.random() * 10,
          sc: 0.95 + Math.random() * 0.5,
          drift: (22 + Math.random() * 8) * (reducedMotion ? 1.4 : 1),
          bob:   (10 + Math.random() * 6) * (reducedMotion ? 1.4 : 1),
          delay: Math.random() * 6,
        });
      });
    } else {
      // With fewer clouds, still allow left placement
      arr.push({
        x: pick(8, 60),
        y: 12 + Math.random() * 10,
        sc: 0.95 + Math.random() * 0.5,
        drift: (22 + Math.random() * 8) * (reducedMotion ? 1.4 : 1),
        bob:   (10 + Math.random() * 6) * (reducedMotion ? 1.4 : 1),
        delay: Math.random() * 6,
      });
    }

    // Add any extras randomly across the full span
    for (let i = arr.length; i < total; i++) {
      arr.push({
        x: pick(6, 90),
        y: 12 + Math.random() * 10,
        sc: 0.95 + Math.random() * 0.5,
        drift: (22 + Math.random() * 8) * (reducedMotion ? 1.4 : 1),
        bob:   (10 + Math.random() * 6) * (reducedMotion ? 1.4 : 1),
        delay: Math.random() * 6,
      });
    }
    return arr;
  }, [total, reducedMotion]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* CLOUDS for cloudy / rain / thunder */}
      {(condition === "cloudy" || condition === "rain" || condition === "thunder") && (
        <>
          {clouds.map((c, i) => (
            <PuffyCloud
              key={i}
              xPct={c.x}
              yPx={c.y}
              scale={c.sc}
              hue={hue}
              driftSec={c.drift}
              bobSec={c.bob}
              delay={c.delay}
            />
          ))}
        </>
      )}

      {/* RAIN (streaks) */}
      {(condition === "rain" || condition === "thunder") && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.9 }}>
          {Array.from({ length: 26 + Math.round(24 * t) }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const speed = (1.2 - t * 0.4) * (reducedMotion ? 1.4 : 1);
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: -10,
                  width: 1.5,
                  height: 12 + t * 8,
                  background: "rgba(155,185,215,0.95)",
                  transform: "rotate(10deg)",
                  animation: `wx-rain ${speed}s linear ${delay}s infinite`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* THUNDER FLASH */}
      {condition === "thunder" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 28% 18%, rgba(255,255,210,0.55), transparent 40%)",
            mixBlendMode: "screen",
            opacity: 0,
            animation: "wx-flash 4.6s ease-in-out infinite",
          }}
        />
      )}

      {/* FOG */}
      {condition === "fog" && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 10,
              height: 36 + t * 10,
              background:
                "linear-gradient(180deg, rgba(230,238,245,0.85), rgba(230,238,245,0.3))",
              filter: "blur(1px)",
              animation: `wx-fog ${18 * (reducedMotion ? 1.4 : 1)}s ease-in-out infinite`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 26,
              height: 24 + t * 8,
              background:
                "linear-gradient(180deg, rgba(230,238,245,0.65), rgba(230,238,245,0.2))",
              filter: "blur(1px)",
              animation: `wx-fog ${22 * (reducedMotion ? 1.4 : 1)}s ease-in-out -4s infinite`,
            }}
          />
        </>
      )}

      {/* keyframes */}
      <style>{`
        @keyframes cloud-drift { 0% { transform: translateX(0) } 100% { transform: translateX(60px) } }
        @keyframes cloud-bob   { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }

        @keyframes wx-rain  {
          0% { transform: translateY(-10px) rotate(10deg); opacity: .95 }
          100% { transform: translateY(120px) rotate(10deg); opacity: .2 }
        }
        @keyframes wx-flash { 0%,88%,100% { opacity: 0 } 90% { opacity: .85 } 92% { opacity: 0 } 94% { opacity: .65 } 96% { opacity: 0 } }
        @keyframes wx-fog   { 0%,100% { transform: translateX(0) } 50% { transform: translateX(16px) } }
      `}</style>
    </div>
  );
};

export default Weather;