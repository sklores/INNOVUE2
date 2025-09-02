// src/components/topbar/SkyLayer.tsx
import React, { useMemo } from "react";
import { TIME } from "./tuning";

/**
 * Minimal, safe Sky layer:
 * - Day/night gradient from system time
 * - One simple drifting cloud so we can see movement
 * No external CSS required (works with your existing .topbar-layer container).
 */
const SkyLayer: React.FC = () => {
  const hour = new Date().getHours();
  const isDay = hour >= TIME.sunriseHour && hour < TIME.sunsetHour;

  const background = useMemo(() => {
    return isDay
      ? "linear-gradient(180deg, #aee0ff 0%, #cfeaff 55%, #eaf5ff 100%)"
      : "linear-gradient(180deg, #0d274d 0%, #1b3c66 60%, #264b7a 100%)";
  }, [isDay]);

  // a single small cloud — harmless if duplicated on HMR
  const cloudStyle: React.CSSProperties = {
    position: "absolute",
    left: "18%",
    top: 16,
    width: 80,
    height: 24,
    borderRadius: 999,
    background: isDay ? "rgba(255,255,255,0.92)" : "rgba(230,240,255,0.78)",
    filter: "blur(0.2px)",
    animation: "iv-cloud 28s linear infinite",
  };

  return (
    <div style={{ position: "absolute", inset: 0, background }}>
      <div style={cloudStyle} />
      <style>{`
        @keyframes iv-cloud {
          0% { transform: translateX(0); }
          100% { transform: translateX(60px); }
        }
      `}</style>
    </div>
  );
};

export default SkyLayer;