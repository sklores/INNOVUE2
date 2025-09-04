// src/components/topbar/GlowLogo.tsx
import React from "react";
import { BADGE } from "./tuning";

/**
 * GlowLogo
 * A subtle warm halo behind the centered client logo.
 * - Positioned at the same center as the badge
 * - Low alpha + gentle pulse
 * - Sits behind the logo layer
 */
const GlowLogo: React.FC = () => {
  const glowSize = Math.max(BADGE.width, BADGE.height) + 40; // halo diameter
  const color = "rgba(255, 247, 180, 0.55)"; // warm beam vibe

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
      // subtle breathing pulse
      animation: "glowPulse 5.5s ease-in-out infinite",
      // extra softness
      filter: "blur(8px)",
    },
    inner: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: `radial-gradient(ellipse at center, ${color} 0%, rgba(255, 247, 180, 0.08) 55%, rgba(255, 247, 180, 0.0) 75%)`,
    },
  };

  return (
    <>
      <div style={styles.wrap}>
        <div style={styles.inner} />
      </div>
      <style>{`
        @keyframes glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.98); opacity: 0.9; }
          50% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default GlowLogo;