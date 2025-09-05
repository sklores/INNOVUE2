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
  BIRDS, // default knob only; not used for live labor
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
import GlowLogo from "./GlowLogo";
import "../../styles/topbar.css";

// Pull Google Sheets values (same as KPI tiles)
import { fetchSheetValues } from "../../features/data/sheets/fetch";
import { sheetMap } from "../../config/sheetMap";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const toNum = (v: unknown) => {
  const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

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

  // Waves ← Sales (0..1). (Kept intact; not central to this change)
  const [salesRatio, setSalesRatio] = useState(0.10);

  // Birds ← Labor activity (0..1), driven by cell B4
  const [laborActivity, setLaborActivity] = useState(0); // 0 labor => 0 birds

  // ----- Helpers -----
  // SALES (unchanged: uses labeled row from sheetMap if you need it elsewhere)
  const computeSalesRatio = (rows: string[][]) => {
    try {
      let salesRow: string[] | undefined = undefined;
      for (const idx of sheetMap.kpiRows) {
        const r = rows[idx] || [];
        const label = String(r[0] ?? "").trim().toLowerCase();
        if (!label) continue;
        if (label === "sales") { salesRow = r; break; }
      }
      if (!salesRow) return 0.1;

      const val = toNum(salesRow[1]);
      const greenAt = toNum(salesRow[2]);
      const redAt = toNum(salesRow[3]);
      if (val == null) return 0.1;

      if (greenAt != null && redAt != null && greenAt !== redAt) {
        const t = (val - redAt) / (greenAt - redAt);
        return clamp01(t);
      }

      const unitToken = String(salesRow[5] ?? "").trim().toLowerCase();
      if (unitToken === "%" || unitToken === "percent") {
        return clamp01((val as number) / 100);
      }
      return clamp01((val as number) > 0 ? 0.6 : 0.1);
    } catch {
      return 0.1;
    }
  };

  // LABOR from Google Sheets **cell B4** => rows[3][1]
  const computeLaborActivityFromB4 = (rows: string[][]) => {
    try {
      const raw = rows?.[3]?.[1]; // B4 (0-indexed row 3, col 1)
      const val = toNum(raw);
      if (val == null || val <= 0) return 0; // strict 0 => zero birds

      // If B4 is a percent like "54" → 54%
      // If it's already 0..1 we still clamp properly.
      const pct = clamp01(val > 1 ? val / 100 : val);

      // Map % → activity with a calm low end.
      // Below ~35% => ~0.0; 50% => ~0.25–0.3; 85–100% => ~0.9–1.0
      const start = 0.35;  // threshold where birds start appearing
      const span = 0.50;   // ramp range
      const t = clamp01((pct - start) / span);
      const eased = Math.pow(t, 1.2);
      return eased;
    } catch {
      return 0;
    }
  };

  const refreshData = async () => {
    try {
      const rows = await fetchSheetValues();
      setSalesRatio(computeSalesRatio(rows));
      setLaborActivity(computeLaborActivityFromB4(rows));
    } catch {
      // keep previous values
    }
  };

  // Fetch on mount
  useEffect(() => {
    refreshData();
  }, []);

  // Refresh on "innovue:refresh"
  useEffect(() => {
    const onRefresh = () => { refreshData(); };
    window.addEventListener("innovue:refresh", onRefresh);
    return () => window.removeEventListener("innovue:refresh", onRefresh);
  }, []);

  // One-shot flash on mount/refresh
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!BEAM_FLASH.enable) return;
    const t1 = setTimeout(() => setFlash(true), BEAM_FLASH.delayMs);
    const t2 = setTimeout(
      () => setFlash(false),
      BEAM_FLASH.delayMs + BEAM_FLASH.durationMs
    );
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Re-trigger beam flash on refresh
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

  // Lighthouse beam targeting (unchanged)
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

            {/* Waves behind the rock (behind lighthouse) */}
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

            {/* Waves in front of the rock */}
            <div className="topbar-layer" style={{ zIndex: 9 }}>
              <WavesFront
                sceneSize={{ width: sceneW, height: TOPBAR.height }}
                salesRatio={salesRatio}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Birds (behind lighthouse) — now driven by Labor from B4 */}
            <div className="topbar-layer" style={{ zIndex: 6 }}>
              <Birds
                sceneWidth={sceneW}
                activity={laborActivity}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Lighthouse (rotating beam pauses during flash) */}
            <div className="topbar-layer" style={{ zIndex: 7 }}>
              <Lighthouse beamActive={!false && LIGHTHOUSE.beamOn} />
            </div>

            {/* Sun/Moon (top-right) */}
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

            {/* (Optional) beam flash aimed — unchanged */}
            {false && (
              <LightBeam
                originX={lanternX}
                originY={TOPBAR.height - (LIGHTHOUSE.offsetBottom + LIGHTHOUSE.height - 22)}
                startDeg={startDeg}
                sweepDeg={sweepDeg}
                durationMs={BEAM_FLASH.durationMs}
                beamColor={BEAM_FLASH.beamColor}
                beamWidthDeg={BEAM_FLASH.beamWidthDeg}
              />
            )}

            {/* Centered client logo + glow */}
            <div className="topbar-layer" style={{ zIndex: 10 }}>
              <GlowLogo boost={false} />
              <ClientLogo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarShell;