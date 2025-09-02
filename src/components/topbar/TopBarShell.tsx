// src/components/topbar/TopBarShell.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TOPBAR, SUN, FRAME, LIGHTHOUSE, BEAM_FLASH, BADGE, INNOVUE_FILL } from "./tuning";
import SkyLayer from "./SkyLayer";
import SunMoon from "./SunMoon";
import Weather from "./Weather";
import Lighthouse from "./Lighthouse";
import ClientLogo from "./ClientLogo";
import LightBeam from "./LightBeam";
import Waves from "./Waves";            // ✅ NEW
import "../../styles/topbar.css";

const TopBarShell: React.FC = () => {
  const sunRight = 10 - (SUN.offsetX ?? 0);
  const sunTop = 8 + (SUN.offsetY ?? 0);

  // Measure scene width so we can compute sizes for waves/beam targeting
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

  // Lighthouse lantern point (approx) in scene coords
  const lanternX = LIGHTHOUSE.offsetLeft + Math.round(LIGHTHOUSE.height * 0.28);
  const lanternY_fromBottom = LIGHTHOUSE.offsetBottom + LIGHTHOUSE.height - 22;
  const lanternY = TOPBAR.height - lanternY_fromBottom; // convert to "from top"

  // Target: INNOVUE text rectangle center (from tuning)
  const targetRect = INNOVUE_FILL;
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  // Angle from lantern to target (deg)
  const dx = targetX - lanternX;
  const dy = targetY - lanternY;
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  // Sweep centered around angleDeg
  const span = BEAM_FLASH.sweepSpanDeg ?? 44;
  const startDeg = angleDeg - span / 2;
  const sweepDeg = span;

  // Reduced motion hint
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Temporary sales value (0..1). We’ll wire to KPI later.
  const salesRatio = 0.62;

  // Fill animation name (for opacity ramp)
  const fillAnim = `iv-fill-${Math.round(Math.random() * 1e6)}`;

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

            {/* ✅ Waves at the very bottom */}
            <div className="topbar-layer" style={{ zIndex: 2 }}>
              <Waves
                sceneSize={{ width: sceneW, height: TOPBAR.height }}
                salesRatio={salesRatio}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* lighthouse (left) */}
            <div className="topbar-layer" style={{ zIndex: 3 }}>
              <Lighthouse beamActive={!flash && LIGHTHOUSE.beamOn} />
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

            {/* beam flash on page refresh — sweep aimed at INNOVUE text */}
            {flash && (
              <LightBeam
                originX={lanternX}
                originY={lanternY}
                startDeg={startDeg}
                sweepDeg={sweepDeg}
                durationMs={BEAM_FLASH.durationMs}
                beamColor={BEAM_FLASH.beamColor}
                beamWidthDeg={BEAM_FLASH.beamWidthDeg}
              />
            )}

            {/* centered GCDC logo + optional glow */}
            <div className="topbar-layer" style={{ zIndex: 10 }}>
              {/* soft glow on the logo during flash */}
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

            {/* INNOVUE text fill during sweep */}
            {flash && INNOVUE_FILL.enable && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: INNOVUE_FILL.left,
                    top: INNOVUE_FILL.top,
                    width: INNOVUE_FILL.width,
                    height: INNOVUE_FILL.height,
                    borderRadius: INNOVUE_FILL.radius,
                    background: INNOVUE_FILL.color,
                    filter: `blur(${INNOVUE_FILL.blurPx}px)`,
                    opacity: 0,
                    animation: `${fillAnim} ${BEAM_FLASH.durationMs}ms ease-out 1`,
                    pointerEvents: "none",
                    zIndex: 8,
                  }}
                />
                <style>{`
                  @keyframes ${fillAnim} {
                    0%   { opacity: 0 }
                    45%  { opacity: ${INNOVUE_FILL.peakOpacity} }
                    100% { opacity: 0 }
                  }
                `}</style>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarShell;