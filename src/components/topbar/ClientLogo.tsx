// src/components/topbar/ClientLogo.tsx
import React from "react";
import { BADGE as B } from "./tuning";

/**
 * Renders ONLY the raw GCDC image.
 * Size/position come straight from tuning.BADGE.
 */
const ClientLogo: React.FC = () => {
  return (
    <img
      src={B.imgSrc}
      alt="GCDC"
      style={{
        position: "absolute",
        left: B.offsetLeft,  // px from left edge of the scene
        top: B.offsetTop,    // px from top edge of the scene
        width: B.width,      // px
        height: B.height,    // px
        objectFit: "contain",
        opacity: B.opacity ?? 1,
        pointerEvents: "none",
        // remove any inherited transforms or max-width rules
        transform: "none",
        maxWidth: "none",
        maxHeight: "none",
      }}
    />
  );
};

export default ClientLogo;