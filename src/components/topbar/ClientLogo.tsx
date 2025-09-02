// src/components/topbar/ClientLogo.tsx
import React from "react";
import { BADGE as B } from "./tuning";

const ClientLogo: React.FC = () => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <img
        src={B.imgSrc}
        alt="GCDC"
        style={{
          position: "absolute",
          left: B.offsetLeft,      // px from left
          top: B.offsetTop,        // px from top
          width: B.width,          // px
          height: B.height,        // px
          objectFit: "contain",
          opacity: B.opacity ?? 1,
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.06))",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default ClientLogo;