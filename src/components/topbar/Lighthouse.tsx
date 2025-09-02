// src/components/topbar/Lighthouse.tsx
import React from "react";
import { LIGHTHOUSE as L } from "./tuning";

const Lighthouse: React.FC = () => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* tower image */}
      <img
        src={L.imgSrc}
        alt="Innovue Lighthouse"
        style={{
          position: "absolute",
          left: L.offsetLeft,
          bottom: L.offsetBottom,
          height: L.height,
          objectFit: "contain",
          opacity: 0.98,
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.06))",
          pointerEvents: "none",
        }}
      />

      {/* rotating beam */}
      {L.beamOn && (
        <div
          style={{
            position: "absolute",
            left: L.offsetLeft + Math.round(L.height * 0.28), // approx lantern center
            bottom: L.offsetBottom + L.height - 22,           // approx lantern height
            width: 140,
            height: 140,
            transformOrigin: "left bottom",
            animation: `iv-beam-sweep ${L.beamSweepSeconds}s linear infinite`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              background: `conic-gradient(from 0deg, ${L.beamColor}, transparent ${L.beamWidthDeg}deg)`,
              clipPath: "polygon(0% 60%, 100% 43%, 100% 57%, 0% 40%)",
              filter: `blur(${L.beamBlurPx}px)`,
              opacity: 0.95,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes iv-beam-sweep {
          0%   { transform: rotate(-18deg); }
          100% { transform: rotate(342deg); }
        }
      `}</style>
    </div>
  );
};

export default Lighthouse;