// src/components/topbar/TopBarShell.tsx
import React from "react";
import { TOPBAR } from "./tuning";
import SkyLayer from "./SkyLayer";
import SunMoon from "./SunMoon";
import Weather from "./Weather";           // ✅ use WEATHER layer here
import "../../styles/topbar.css";

const TopBarShell: React.FC = () => {
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

        {/* Weather visuals (for now hard-coded to 'cloudy' so you can see it) */}
        <div className="topbar-layer" style={{ zIndex: 2 }}>
          <Weather condition="cloudy" intensity={0.6} />
          {/*
            Later: wire this to a weather API fetch by zip and pass the real condition:
            <Weather condition={weather.condition} intensity={weather.intensity} />
          */}
        </div>

        <div className="topbar-layer" style={{ zIndex: 3 }}>
          <div style={{ position: "absolute", right: 10, top: 8 }}>
            <SunMoon size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarShell;