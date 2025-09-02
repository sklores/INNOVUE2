// src/components/topbar/LightBeam.tsx
import React from "react";

type Props = {
  originX: number;  // px from left within the scene
  originY: number;  // px from top within the scene
  sweepDeg: number; // degrees to sweep across (positive = clockwise)
  durationMs: number;
  beamColor: string;
  beamWidthDeg: number;
};

/**
 * Renders a conic-gradient wedge that rotates around the lighthouse lantern point.
 * We draw a big square anchored at the origin and rotate it.
 */
const LightBeam: React.FC<Props> = ({
  originX,
  originY,
  sweepDeg,
  durationMs,
  beamColor,
  beamWidthDeg,
}) => {
  const animName = `iv-beam-${Math.round(Math.random() * 1e6)}`;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9, // under the centered logo (which we’ll put at 10)
      }}
    >
      <div
        style={{
          position: "absolute",
          left: originX,
          top: originY,
          width: 800,
          height: 800,
          transformOrigin: "0 0", // rotate around top-left corner (the origin)
          animation: `${animName} ${durationMs}ms ease-out 1`,
          mixBlendMode: "screen",
          opacity: 0.98,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -400,
            top: -400,
            width: 800,
            height: 800,
            background: `conic-gradient(${beamColor}, transparent ${beamWidthDeg}deg)`,
            filter: "blur(1.2px)",
          }}
        />
      </div>

      <style>{`
        @keyframes ${animName} {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(${sweepDeg}deg); }
        }
      `}</style>
    </div>
  );
};

export default LightBeam;