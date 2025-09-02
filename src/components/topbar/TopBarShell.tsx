// src/components/topbar/TopBarShell.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TOPBAR, SUN, FRAME, LIGHTHOUSE, BEAM_FLASH, BADGE } from "./tuning";
import SkyLayer from "./SkyLayer";
import SunMoon from "./SunMoon";
import Weather from "./Weather";
import Lighthouse from "./Lighthouse";
import ClientLogo from "./ClientLogo";
import LightBeam from "./LightBeam";
import "../../styles/topbar.css";

const TopBarShell: React.FC = () => {
  const sunRight = 10 - (SUN.offsetX ?? 0);
  const sunTop = 8 + (SUN.offsetY ?? 0);

  // Measure scene width so we can aim the beam at center
  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneW, setSceneW] = useState(360);
  useLayoutEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const set = () => setSceneW(el.clientWidth);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  // Flash state (runs once on mount / page refresh)
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!BEAM_FLASH.enable) return;
    const t1 = setTimeout(() => setFlash(true), BEAM_FLASH.delayMs);
    const t2 = setTimeout(() => setFlash(false), BEAM_FLASH.delayMs + BEAM_FLASH.durationMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Compute lighthouse lantern point (approx) in scene coords
  const lanternX = LIGHTHOUSE.offsetLeft + Math.round(LIGHTHOUSE.height * 0.28);
  const lanternY_fromBottom = LIGHTHOUSE.offsetBottom + LIGHTHOUSE.height - 22;
  const lanternY = TOPBAR.height - lanternY_fromBottom; // convert to "from top"

  // Target: center of the scene (and the centered GCDC logo)
  const centerX = sceneW / 2;
  const centerY = TOPBAR.height / 2;

  // Angle from lantern to center
  const dx = centerX - lanternX;
  const dy = centerY - lanternY;
  const angleRad = Math.atan2(dy, dx);           // canvas-style angle from +x
  const angleDeg = (angleRad * 180) / Math.PI;   // degrees

  // We’ll sweep ~45 degrees across the target angle
  const sweepStartDeg = angleDeg - 22;
  const sweepTotalDeg = 44;

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        paddingInline: 12,
        marginTop: 6,
      }}
    >
      <div
        className="topbar-frame-outer"
        style={{
          ["--frame-outer-radius" as any]: `${FRAME.outerRadius}px`,
          ["--frame-stroke" as any]: FRAME.strokeColor,
          ["--frame-stroke-width" as any]: `${FRAME.strokeWidth}px`,
          ["--frame-shadow" as any]: FRAME.shadow,
          ["--mat1-color" as any]: FRAME.mat1.color,
          ["--mat1-min" as any]: `${FRAME.mat1.min}px`,
          ["--mat1-max" as any]: `${FRAME.mat1.max}px`,
          ["--mat1-vw" as any]: FRAME.mat1.vw,
          ["--mat2-color" as any]: FRAME.mat2.color,
          ["--mat2-min" as any]: `${FRAME.mat2.min}px`,
          ["--mat2-max" as any]: `${FRAME.mat2.max}px`,
          ["--mat2-vw" as any]: FRAME.mat2.vw,
          ["--frame-inner-radius" as any]: `${FRAME.innerRadius}px`,
          ["--scene-inset-shadow" as any]: FRAME.sceneInsetShadow,
        }}
      >
        <div className="topbar-frame-mat2">
          <div
            ref={sceneRef}
            className="topbar-scene"
            style={{
              width: "100%",
              height: TOPBAR.height,
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

            {/* lighthouse (left) */}
            <div className="topbar-layer" style={{ zIndex: 3 }}>
              <Lighthouse />
            </div>

            {/* sun/moon (top-right) */}
            <div className="topbar-layer" style={{ zIndex: 4 }}>
              <div style={{ position: "absolute", right: sunRight, top: sunTop }}>
                <SunMoon
                  size={SUN.size}
                  raysCount={SUN.raysCount}
                  spinSeconds={SUN.spinSeconds}
                  rayLengthScale={SUN.rayLengthScale}
                />
              </div>
            </div>

            {/* beam flash on page refresh */}
            {flash && (
              <LightBeam
                originX={lanternX}
                originY={lanternY}
                sweepDeg={sweepTotalDeg}
                durationMs={BEAM_FLASH.durationMs}
                beamColor={BEAM_FLASH.beamColor}
                beamWidthDeg={BEAM_FLASH.beamWidthDeg}
              />
            )}

            {/* centered GCDC logo */}
            <div className="topbar-layer" style={{ zIndex: 10 }}>
              {/* glow during flash */}
              {flash && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: BADGE.width,
                    height: BADGE.height,
                    borderRadius: 8,
                    boxShadow: `0 0 ${BEAM_FLASH.glowSpreadPx}px ${BEAM_FLASH.glowColor}`,
                    filter: "blur(0.2px)",
                    pointerEvents: "none",
                  }}
                />
              )}
              <ClientLogo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarShell;