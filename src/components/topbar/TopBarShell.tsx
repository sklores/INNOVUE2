// src/components/topbar/TopBarShell.tsx
import React from "react";
import { TOPBAR, SUN } from "./tuning";
import SkyLayer from "./SkyLayer";
import SunMoon from "./SunMoon";
import Weather from "./Weather";
import "../../styles/topbar.css";

const TopBarShell: React.FC = () => {
  // base anchor is top-right (10px, 8px); apply tuning offsets
  const sunRight = 10 - (SUN.offsetX ?? 0); // +offsetX moves RIGHT, so reduce "right"
  const sunTop = 8 + (SUN.offsetY ?? 0);    // +offsetY moves DOWN

  return (
    <div style={{ width: TOPBAR.width, padding: "0 12px" }}>
      <div
        className="topbar-scene"
        style={{
          width: TOPBAR.width,
          height: TOPBAR.height,
          borderRadius: TOPBAR.radius,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
        }}
      >
        {/* back -> front */}
        <div className="topbar-layer" style={{ zIndex: 1 }}>
          <SkyLayer />
        </div>

        <div className="topbar-layer" style={{ zIndex: 2 }}>
          {/* set any of: "clear" | "cloudy" | "rain" | "thunder" | "fog" */}
          <Weather condition="cloudy" intensity={0.6} />
        </div>

        <div className="topbar-layer" style={{ zIndex: 3, pointerEvents: "none" }}>
          <div style={{ position: "absolute", right: sunRight, top: sunTop }}>
            <SunMoon
              size={SUN.size}
              raysCount={SUN.raysCount}
              spinSeconds={SUN.spinSeconds}
              rayLengthScale={SUN.rayLengthScale}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarShell;