// src/components/topbar/ClientLogo.tsx
import React from "react";
import { BADGE as B } from "./tuning";

/**
 * GCDC logo sized/positioned by a wrapper div.
 * Wrapper width/height come from tuning; the <img> just fills the wrapper.
 */
const ClientLogo: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: B.offsetLeft,   // px from left edge of the scene
        top: B.offsetTop,     // px from top edge of the scene
        width: B.width,       // px
        height: B.height,     // px
        pointerEvents: "none",
        // make sure nothing else sneaks in
        maxWidth: "none",
        maxHeight: "none",
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
          transform: "none",
          boxSizing: "content-box",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default ClientLogo;