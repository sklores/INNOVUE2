// src/components/topbar/GlowLogo.tsx
import React from "react";
import { BADGE } from "./tuning";

/**
 * GlowLogo
 * - Constant subtle warm halo behind the centered client logo
 * - When boost=true (tied to beam flash), add a strong burst glow
 */
const GlowLogo: React.FC<{ boost?: boolean }> = ({ boost = false }) => {
  const glowSize = Math.max(BADGE.width, BADGE.height) + 40; // idle halo diameter
  const colorBase = "rgba(255, 247, 180, 0.40)"; // warm, subtle
  const colorEdge = "rgba(255, 247, 180, 0.08)";

  const styles = {
    wrap: {
      position: "absolute" as const,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: glowSize,
      height: glowSize,
      borderRadius: "50%",
      pointerEvents: "none" as const,
      animation: "glowPulse 5.5s ease-in-out infinite",
      filter: "blur(8px)",
      zIndex: 0,
    },
    inner: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: `radial-gradient(ellipse at center, ${colorBase} 0%, ${colorEdge} 55%, rgba(255, 247, 180, 0) 75%)`,
    },

    // Burst layer (appears only when boost=true)
    burstWrap: {
      position: "absolute" as const,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: glowSize + 28,
      height: glowSize + 28,
      borderRadius: "50%",
      pointerEvents: "none" as const,
      animation: "glowBurst 1.2s ease-out 1",
      filter: "blur(10px)",
      zIndex: 0,
    },
    burstInner: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      // Stronger center, wider falloff
      background:
        "radial-gradient(ellipse at center, rgba(255, 247, 180, 0.95) 0%, rgba(255, 247, 180, 0.40) 38%, rgba(255, 247, 180, 0.0) 72%)",
    },
  };

  return (
    <>
      {/* Idle gentle halo */}
      <div style={styles.wrap}>
        <div style={styles.inner} />
      </div>

      {/* Strong burst on boost */}
      {boost && (
        <div style={styles.burstWrap}>
          <div style={styles.burstInner} />
        </div>
      )}

      <style>{`
        @keyframes glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.98); opacity: 0.55; }
          50%      { transform: translate(-50%, -50%) scale(1.04); opacity: 0.75; }
        }
        @keyframes glowBurst {
          0%   { transform: translate(-50%, -50%) scale(0.90); opacity: 0.00; }
          15%  { transform: translate(-50%, -50%) scale(1.25); opacity: 1.00; }
          40%  { transform: translate(-50%, -50%) scale(1.15); opacity: 0.70; }
          100% { transform: translate(-50%, -50%) scale(1.00); opacity: 0.00; }
        }
      `}</style>
    </>
  );
};

export default GlowLogo;