// src/components/topbar/SunMoon.tsx
import React from "react";
import { TIME, SUN as SUN_DEFAULTS } from "./tuning";

type Props = {
  // All props are optional; if omitted, values come from tuning.SUN
  size?: number;
  raysCount?: number;
  spinSeconds?: number;
  rayLengthScale?: number; // 0..1
};

const SunMoon: React.FC<Props> = (props) => {
  const hour = new Date().getHours();
  const isDay = hour >= TIME.sunriseHour && hour < TIME.sunsetHour;

  const size = props.size ?? SUN_DEFAULTS.size;
  const raysCount = Math.max(0, Math.round(props.raysCount ?? SUN_DEFAULTS.raysCount));
  const spinSeconds = Math.max(0.1, props.spinSeconds ?? SUN_DEFAULTS.spinSeconds);
  const rayLengthScale = Math.max(0, Math.min(1, props.rayLengthScale ?? SUN_DEFAULTS.rayLengthScale));

  const wrap: React.CSSProperties = {
    position: "relative",
    width: size,
    height: size,
  };

  if (isDay) {
    const rayLen = Math.round(size * rayLengthScale);

    return (
      <div style={wrap}>
        {/* sun core */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(#fff9b1 0%, #ffd66e 60%, #ffbd3c 100%)",
            boxShadow: "0 0 10px rgba(255, 200, 70, 0.7)",
            zIndex: 2,
          }}
        />

        {/* ray wheel */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 0,
            height: 0,
            transform: "translate(-50%, -50%)",
            animation: `iv-ray-spin ${spinSeconds}s linear infinite`,
            zIndex: 1,
          }}
        >
          {Array.from({ length: raysCount }).map((_, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                left: -1,             // center 2px line
                bottom: 0,            // pivot at bottom center (the sun center)
                width: 2,
                height: rayLen,
                transformOrigin: "50% 100%",
                transform: `rotate(${(360 / Math.max(1, raysCount)) * i}deg)`,
                background:
                  "linear-gradient(to top, rgba(255,205,90,0) 0%, rgba(255,205,90,0.95) 70%)",
                borderRadius: 1,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes iv-ray-spin { 
            from { transform: translate(-50%, -50%) rotate(0deg); } 
            to   { transform: translate(-50%, -50%) rotate(360deg); } 
          }
        `}</style>
      </div>
    );
  }

  // NIGHT (moon)
  return (
    <div style={wrap}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(#dfe9f6 0%, #b9c6dd 60%, #93a3c1 100%)",
          animation: "iv-float 4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: size * 0.08,
          top: size * 0.08,
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: "50%",
          background: "#87a0c5",
          filter: "blur(0.2px)",
        }}
      />
      {Array.from({ length: 3 }).map((_, i) => {
        const left = [8, 2, 22][i] / 36 * size;
        const top = [2, 18, 6][i] / 36 * size;
        const delay = i * 0.5;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left,
              top,
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "white",
              opacity: 0.8,
              animation: `iv-twinkle 2.4s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes iv-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }
        @keyframes iv-twinkle { 0%,100% { opacity:.2; transform: scale(.8) } 50% { opacity:.9; transform: scale(1) } }
      `}</style>
    </div>
  );
};

export default SunMoon;