// src/components/topbar/TopBarShell.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  TOPBAR,
  SUN,
  FRAME,
  LIGHTHOUSE,
  BEAM_FLASH,
  BADGE,
  INNOVUE_FILL,
  ROCK,
  WEATHER,
  BIRDS,
} from "./tuning";
import SkyLayer from "./SkyLayer";
import SunMoon from "./SunMoon";
import Lighthouse from "./Lighthouse";
import ClientLogo from "./ClientLogo";
import LightBeam from "./LightBeam";
import { WavesBack, WavesFront } from "./Waves";
import RockBase from "./RockBase";
import Weather from "./Weather";
import Birds from "./Birds";
import "../../styles/topbar.css";

const TopBarShell: React.FC = () => {
  const sunRight = 10 - (SUN.offsetX ?? 0);
  const sunTop = 8 + (SUN.offsetY ?? 0);

  // Scene size (for waves/birds width)
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

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // One-shot flash on mount/refresh
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!BEAM_FLASH.enable) return;
    const t1 = setTimeout(() => setFlash(true), BEAM_FLASH.delayMs);
    const t2 = setTimeout(
      () => setFlash(false),
      BEAM_FLASH.delayMs + BEAM_FLASH.durationMs
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Listen for global "refresh" to retrigger beam flash
  useEffect(() => {
    const onRefresh = () => {
      setFlash(false);
      setTimeout(() => setFlash(true), 20);
      setTimeout(
        () => setFlash(false),
        BEAM_FLASH.delayMs + BEAM_FLASH.durationMs + 30
      );
    };
    window.addEventListener("innovue:refresh", onRefresh);
    return () => window.removeEventListener("innovue:refresh", onRefresh);
  }, []);

  // Lighthouse lantern → INNOVUE target
  const lanternX =
    LIGHTHOUSE.offsetLeft + Math.round(LIGHTHOUSE.height * 0.28);
  const lanternY_fromBottom =
    LIGHTHOUSE.offsetBottom + LIGHTHOUSE.height - 22;
  const lanternY = TOPBAR.height - lanternY_fromBottom;

  const targetX = INNOVUE_FILL.left + INNOVUE_FILL.width / 2;
  const targetY = INNOVUE_FILL.top + INNOVUE_FILL.height / 2;

  const dx = targetX - lanternX;
  const dy = targetY - lanternY;
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  const span = BEAM_FLASH.sweepSpanDeg ?? 44;
  const startDeg = angleDeg - span / 2;
  const sweepDeg = span;

  // Placeholder until wired to KPI
  const salesRatio = 0.62;

  const fillAnim = `iv-fill-${Math.random().toString(36).slice(2)}`;

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

            {/* Weather (clouds/rain/fog) */}
            <div className="topbar-layer" style={{ zIndex: 2 }}>
              {WEATHER.enable && (
                <Weather
                  condition={WEATHER.condition as any}
                  intensity={WEATHER.intensity}
                  reducedMotion={reducedMotion}
                />
              )}
            </div>

            {/* Waves behind rock (behind lighthouse) */}
            <div className="topbar-layer" style={{ zIndex: 3 }}>
              <WavesBack
                sceneSize={{ width: sceneW, height: TOPBAR.height }}
                salesRatio={salesRatio}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Rock base */}
            <div className="topbar-layer" style={{ zIndex: 4 }}>
              <div
                style={{
                  position: "absolute",
                  left: ROCK.offsetLeft,
                  bottom: ROCK.offsetBottom,
                  width: ROCK.width,
                  height: ROCK.height,
                  pointerEvents: "none",
                }}
              >
                <RockBase size={{ width: ROCK.width, height: ROCK.height }} />
              </div>
            </div>

            {/* Front waves in front of lighthouse */}
            <div className="topbar-layer" style={{ zIndex: 9 }}>
              <WavesFront
                sceneSize={{ width: sceneW, height: TOPBAR.height }}
                salesRatio={salesRatio}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Birds behind lighthouse */}
            <div className="topbar-layer" style={{ zIndex: 6 }}>
              <Birds
                sceneWidth={sceneW}
                activity={BIRDS.activity}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Lighthouse */}
            <div className="topbar-layer" style={{ zIndex: 7 }}>
              <Lighthouse beamActive={!flash && LIGHTHOUSE.beamOn} />
            </div>

            {/* Sun/Moon */}
            <div className="topbar-layer" style={{ zIndex: 8 }}>
              <div style={{ position: "absolute", right: sunRight, top: sunTop }}>
                <SunMoon
                  size={SUN.size}
                  raysCount={SUN.raysCount}
                  spinSeconds={SUN.spinSeconds}
                  rayLengthScale={SUN.rayLengthScale}
                />
              </div>
            </div>

            {/* Flash beam */}
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

            {/* GCDC logo */}
            <div className="topbar-layer" style={{ zIndex: 10 }}>
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