// src/components/topbar/Weather.tsx
import React from "react";

export type Condition = "clear" | "cloudy" | "rain" | "thunder" | "fog";

type Props = {
  condition?: Condition;
  intensity?: number; // 0..1
  reducedMotion?: boolean;
};

/**
 * Minimal, smooth weather visuals:
 * - cloudy: soft drifting clouds
 * - rain: falling streaks
 * - thunder: rain + brief flashes
 * - fog: layered fog bands
 * - clear: renders nothing
 */
const Weather: React.FC<Props> = ({
  condition = "clear",
  intensity = 0.6,
  reducedMotion,
}) => {
  const t = Math.max(0, Math.min(1, intensity));

  if (condition === "clear") return null;

  const durFactor = reducedMotion ? 1.6 : 1; // slower if reduced motion

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* CLOUDS (cloudy / rain / thunder) */}
      {(condition === "cloudy" || condition === "rain" || condition === "thunder") && (
        <>
          {Array.from({ length: 2 + Math.round(t * 2) }).map((_, i) => {
            const left = 12 + i * 24 + Math.random() * 6;
            const top = 12 + (i % 2) * 10;
            const w = 62 + i * 12 + t * 16;
            const h = 18 + (i % 2) * 6 + t * 6;
            const dur = (22 + i * 4 - t * 6) * durFactor;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top,
                  width: w,
                  height: h,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.90)",
                  filter: "blur(0.2px)",
                  animation: `wx-cloud ${dur}s linear -${Math.random() * dur}s infinite`,
                }}
              />
            );
          })}
        </>
      )}

      {/* RAIN (rain / thunder) */}
      {(condition === "rain" || condition === "thunder") && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.9 }}>
          {Array.from({ length: 24 + Math.round(t * 24) }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const speed = (1.3 - t * 0.4) * durFactor;
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
              background: "linear-gradient(180deg, rgba(230,238,245,0.85), rgba(230,238,245,0.3))",
              filter: "blur(1px)",
              animation: `wx-fog ${18 * durFactor}s ease-in-out infinite`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 26,
              height: 24 + t * 8,
              background: "linear-gradient(180deg, rgba(230,238,245,0.65), rgba(230,238,245,0.2))",
              filter: "blur(1px)",
              animation: `wx-fog ${22 * durFactor}s ease-in-out -4s infinite`,
            }}
          />
        </>
      )}

      {/* keyframes */}
      <style>{`
        @keyframes wx-cloud   { 0% { transform: translateX(0) } 100% { transform: translateX(60px) } }
        @keyframes wx-rain    { 0% { transform: translateY(-10px) rotate(10deg); opacity: .95 } 100% { transform: translateY(120px) rotate(10deg); opacity: .2 } }
        @keyframes wx-flash   { 0%,88%,100% { opacity: 0 } 90% { opacity: .85 } 92% { opacity: 0 } 94% { opacity: .65 } 96% { opacity: 0 } }
        @keyframes wx-fog     { 0%,100% { transform: translateX(0) } 50% { transform: translateX(16px) } }
      `}</style>
    </div>
  );
};

export default Weather;