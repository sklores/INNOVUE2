// src/components/topbar/TopBarShell.tsx
import React from "react";
import { TOPBAR, SUN, FRAME } from "./tuning";
import SkyLayer from "./SkyLayer";
import SunMoon from "./SunMoon";
import Weather from "./Weather";
import "../../styles/topbar.css";

const TopBarShell: React.FC = () => {
  const sunRight = 10 - (SUN.offsetX ?? 0);
  const sunTop = 8 + (SUN.offsetY ?? 0);

  return (
    <div style={{ width: "100%" }}>
      {/* === Frame (double-mat) with responsive thickness === */}
      <div
        className="topbar-frame-outer"
        style={{
          // feed CSS vars from tuning so you can tweak without touching CSS
          // outer frame
          ["--frame-outer-radius" as any]: `${FRAME.outerRadius}px`,
          ["--frame-stroke" as any]: FRAME.strokeColor,
          ["--frame-stroke-width" as any]: `${FRAME.strokeWidth}px`,
          ["--frame-shadow" as any]: FRAME.shadow,

          // mat 1 (outer)
          ["--mat1-color" as any]: FRAME.mat1.color,
          ["--mat1-min" as any]: `${FRAME.mat1.min}px`,
          ["--mat1-max" as any]: `${FRAME.mat1.max}px`,
          ["--mat1-vw" as any]: FRAME.mat1.vw,

          // mat 2 (inner)
          ["--mat2-color" as any]: FRAME.mat2.color,
          ["--mat2-min" as any]: `${FRAME.mat2.min}px`,
          ["--mat2-max" as any]: `${FRAME.mat2.max}px`,
          ["--mat2-vw" as any]: FRAME.mat2.vw,

          // inner scene
          ["--frame-inner-radius" as any]: `${FRAME.innerRadius}px`,
          ["--scene-inset-shadow" as any]: FRAME.sceneInsetShadow,
        }}
      >
        <div className="topbar-frame-mat2">
          <div
            className="topbar-scene"
            style={{
              width: "100%",
              height: TOPBAR.height,   // scene stays fixed height (your “painting”)
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* back -> front */}
            <div className="topbar-layer" style={{ zIndex: 1 }}>
              <SkyLayer />
            </div>

            <div className="topbar-layer" style={{ zIndex: 2 }}>
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
      </div>
      {/* === /Frame === */}
    </div>
  );
};

export default TopBarShell;