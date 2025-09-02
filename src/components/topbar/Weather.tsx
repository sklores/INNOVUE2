// src/components/topbar/Weather.tsx
import React from "react";

/**
 * Weather layer (single file):
 * - Renders visual effects based on `condition`
 * - Everything is absolutely positioned and self-contained
 *
 * Supported conditions:
 *  - "clear"    -> nothing rendered
 *  - "cloudy"   -> drifting clouds
 *  - "rain"     -> light rain + clouds
 *  - "thunder"  -> rain + clouds + occasional lightning flash
 *  - "fog"      -> soft moving fog bands
 *
 * You can later feed this `condition` from a weather API by zip.
 */
type Condition = "clear" | "cloudy" | "rain" | "thunder" | "fog";

type Props = {
  condition?: Condition;
  intensity?: number; // 0..1 (optional simple scaler)
};

const Weather: React.FC<Props> = ({ condition = "clear", intensity = 0.6 }) => {
  // clamp intensity
  const t = Math.max(0, Math.min(1, intensity));

  if (condition === "clear") {
    return null;
  }

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* CLOUDS (used by cloudy / rain / thunder) */}
      {(condition === "cloudy" || condition === "rain" || condition === "thunder") && (
        <>
          <div
            style={{
              position: "absolute",
              left: "18%",
              top: 16,
              width: 80 + 40 * t,
              height: 24 + 8 * t,
              borderRadius: 999,
              background: "rgba(255,255,255,0.92)",
              filter: "blur(0.2px)",
              animation: `wx-cloud-a ${26 - 8 * t}s linear infinite`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "56%",
              top: 22,
              width: 64 + 36 * t,
              height: 20 + 8 * t,
              borderRadius: 999,
              background: "rgba(255,255,255,0.85)",
              filter: "blur(0.2px)",
              animation: `wx-cloud-b ${30 - 8 * t}s linear infinite`,
            }}
          />
        </>
      )}

      {/* RAIN (used by rain / thunder) */}
      {(condition === "rain" || condition === "thunder") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            opacity: 0.85,
          }}
        >
          {Array.from({ length: 28 + Math.round(20 * t) }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const dur = 1.2 - 0.4 * t; // faster with intensity
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: -10,
                  width: 1.5,
                  height: 14 + 6 * t,
                  background: "rgba(160,190,220,0.9)",
                  transform: "rotate(10deg)",
                  animation: `wx-raindrop ${dur}s linear ${delay}s infinite`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* LIGHTNING (thunder only) */}
      {condition === "thunder" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(255,255,200,0.55), transparent 40%)",
            mixBlendMode: "screen",
            opacity: 0,
            animation: "wx-flash 4.5s ease-in-out infinite",
          }}
        />
      )}

      {/* FOG (fog only) */}
      {condition === "fog" && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 10,
              height: 38 + 10 * t,
              background:
                "linear-gradient(180deg, rgba(230,238,245,0.85), rgba(230,238,245,0.3))",
              filter: "blur(1px)",
              animation: "wx-fog 18s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 28,
              height: 26 + 8 * t,
              background:
                "linear-gradient(180deg, rgba(230,238,245,0.65), rgba(230,238,245,0.2))",
              filter: "blur(1px)",
              animation: "wx-fog 22s ease-in-out -4s infinite",
            }}
          />
        </>
      )}

      {/* keyframes */}
      <style>{`
        @keyframes wx-cloud-a { 0% { transform: translateX(0) } 100% { transform: translateX(60px) } }
        @keyframes wx-cloud-b { 0% { transform: translateX(0) } 100% { transform: translateX(60px) } }
        @keyframes wx-raindrop { 
          0% { transform: translateY(-10px) rotate(10deg); opacity: 0.9; }
          100% { transform: translateY(120px) rotate(10deg); opacity: 0.2; }
        }
        @keyframes wx-flash {
          0%, 88%, 100% { opacity: 0; }
          90% { opacity: .85; }
          92% { opacity: 0; }
          94% { opacity: .65; }
          96% { opacity: 0; }
        }
        @keyframes wx-fog {
          0%, 100% { transform: translateX(0) }
          50% { transform: translateX(16px) }
        }
      `}</style>
    </div>
  );
};

export default Weather;