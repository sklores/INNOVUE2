import React from "react";
import { TOPBAR } from "./tuning";
import SkyLayer from "./SkyLayer";
import SunMoon from "./SunMoon";

// ✅ use ONLY this stylesheet
import "../../styles/topbar.css";

const TopBarShell: React.FC = () => {
  return (
    <div style={{ width: TOPBAR.width, padding: "0 12px" }}>
      <div
        className="topbar-scene"
        style={{
          width: TOPBAR.width,
          height: TOPBAR.height,
          borderRadius: TOPBAR.radius ?? 12,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
        }}
      >
        {/* back -> front */}
        <div className="topbar-layer" style={{ zIndex: 1 }}>
          <SkyLayer />
        </div>

        <div className="topbar-layer" style={{ zIndex: 2, pointerEvents: "none" }}>
          <div style={{ position: "absolute", right: 10, top: 8 }}>
            <SunMoon size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarShell;