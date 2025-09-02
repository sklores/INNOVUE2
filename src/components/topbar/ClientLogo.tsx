// src/components/topbar/ClientLogo.tsx
import React from "react";
import { BADGE as B } from "./tuning";

const ClientLogo: React.FC = () => {
  const size = B.size;
  const ring = B.showRing ? `${B.ringWidth}px solid ${B.ringColor}` : "none";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: B.offsetTop,
          transform: "translateX(-50%)",
          width: size,
          height: size,
          borderRadius: "50%",
          background: B.background,
          border: ring,
          display: "grid",
          placeItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,.06)",
          overflow: "hidden",
        }}
      >
        {B.imgSrc ? (
          <img
            src={B.imgSrc}
            alt="Client Logo"
            style={{
              height: Math.round(size * 0.66),
              width: "auto",
              objectFit: "contain",
              opacity: 0.95,
              pointerEvents: "none",
            }}
          />
        ) : (
          <span
            style={{
              fontWeight: 700,
              color: "#7a8aa8",
              letterSpacing: 0.5,
              fontSize: Math.round(size * 0.28),
            }}
          >
            {B.textFallback}
          </span>
        )}
      </div>
    </div>
  );
};

export default ClientLogo;