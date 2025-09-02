// src/components/topbar/ClientLogo.tsx
import React from "react";
import { BADGE as B } from "./tuning";

/**
 * Always-centered GCDC logo.
 * - Centers on both axes using left/top 50% + translate(-50%, -50%)
 * - Size comes from tuning.BADGE.width/height
 */
const ClientLogo: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: B.width,
        height: B.height,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <img
        src={B.imgSrc}
        alt="GCDC"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: B.opacity ?? 1,
          maxWidth: "none",
          maxHeight: "none",
        }}
      />
    </div>
  );
};

export default ClientLogo;