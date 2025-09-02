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
 * - Soft lighting via gradient + night tint
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
  // day → night color
  const topCol   = `rgba(${Math.round(255 - 30*hue)}, ${Math.round(255 - 35*hue)}, ${Math.round(255 - 55*hue)}, 0.95)`;
  const midCol   = `rgba(${Math.round(245 - 45*hue)}, ${Math.round(250 - 50*hue)}, ${Math.round(255 - 60*hue)}, 0.95)`;
  const shadowCol= `rgba(${Math.round(140 - 30*hue)}, ${Math.round(160 - 30*hue)}, ${Math.round(180 - 30*hue)}, 0.25)`;

  // cloud geometry (five lobes)
  const R = 22 * scale;
  const offsets = [
    { cx: 0,    cy: 0,    r: R * 1.05 },
    { cx: -R,   cy: 6,    r: R * 0.90 },
    { cx:  R,   cy: 4,    r: R * 0.95 },
    { cx: -R*1.6, cy: 10, r: R * 0.75 },
    { cx:  R*1.6, cy: 12, r: R * 0.70 },
  ];

  const id = useMemo(() => `goo-${Math.random().toString(36).slice(2)}`, []);

  return (
    <div
      style={{
        position: "absolute",
        left: `${xPct}%`,
        top: yPx,
        transform: "translateX(-50%)",
        animation: `cloud-drift ${driftSec}s linear ${-delay}s infinite`,
        willChange: "transform",
        filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.05))",
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
            <stop offset="55%" stopColor={midCol} />
            <stop offset="100%" stopColor={midCol} />
          </radialGradient>

          {/* gentle underside shadow band */}
          <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
            <stop offset="70%"  stopColor={shadowCol} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>

        <g filter={`url(#${id})`}>
          {/* main puffy body */}
          <g fill={`url(#${id}-fill)`}>
            {offsets.map((o, i) => (
              <circle key={i} cx={o.cx} cy={o.cy} r={o.r} />
            ))}
          </g>
          {/* soft underside shadow */}
          <rect
            x={-R*2.6}
            y={R*0.6}
            width={R*5.2}
            height={R*1.0}
            fill={`url(#${id}-shade)`}
          />
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

  // night heuristic: darker sky elsewhere usually, but we can tint clouds a hair at night
  const isNight = false; // hook up to your SkyLayer time if you want
  const hue = isNight ? 1 : 0;

  const cloudCount = 2 + Math.round(2 * t); // 2..4 clouds
  const clouds = useMemo(() => {
    return Array.from({ length: cloudCount }).map((_, i) => {
      const x = 18 + i * (60 / cloudCount) + Math.random() * 8;  // stagger
      const y = 12 + (i % 2) * 10 + Math.random() * 6;           // px from top
      const sc = 0.95 + Math.random() * 0.6;                      // 0.95..1.55
      const drift = (22 + Math.random() * 8) * (reducedMotion ? 1.4 : 1); // seconds
      const bob = (10 + Math.random() * 6) * (reducedMotion ? 1.4 : 1);
      const delay = Math.random() * 6;
      return { x, y, sc, drift, bob, delay };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudCount, reducedMotion, hue]);

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