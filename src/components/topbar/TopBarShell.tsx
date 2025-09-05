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
  BIRDS, // default knob (unused for live birds now)
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

// Sheets API (same hook used by KPI tiles)
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

  // Waves ← Sales (0..1). (Kept; not changed here)
  const [salesRatio, setSalesRatio] = useState(0.10);

  // Birds ← Labor activity (0..1) from Google Sheets cell B4
  const [laborActivity, setLaborActivity] = useState(0);

  // -------- Helpers ----------
  const findRowByLabel = (rows: string[][], ...labels: string[]) => {
    const norm = (s: string) => s.toLowerCase().trim();
    const wanted = labels.map(norm);
    for (const idx of sheetMap.kpiRows) {
      const r = rows[idx] || [];
      const label = norm(String(r[0] ?? ""));
      if (wanted.includes(label)) return r;
    }
    return null;
  };

  const computeSalesRatio = (rows: string[][]) => {
    try {
      const r = findRowByLabel(rows, "sales");
      if (!r) return 0.1;
      const val = toNum(r[1]);
      const greenAt = toNum(r[2]);
      const redAt = toNum(r[3]);
      if (val == null) return 0.1;

      if (greenAt != null && redAt != null && greenAt !== redAt) {
        return clamp01((val - redAt) / (greenAt - redAt));
      }
      const unitToken = String(r[5] ?? "").trim().toLowerCase();
      if (unitToken === "%" || unitToken === "percent") return clamp01((val as number) / 100);
      return clamp01((val as number) > 0 ? 0.6 : 0.1);
    } catch {
      return 0.1;
    }
  };

  /**
   * Labor from Google Sheets **cell B4** → bird activity
   * - 0%  => 0.00 (no birds)
   * - 10% => 0.10 (very little birds)
   * - 50% => 1.00 (max birds)
   * - linear mapping between 10%..50%, clamped outside
   */
  const computeLaborActivityFromB4 = (rows: string[][]) => {
    try {
      // Primary: read B4 (0-indexed row 3, col 1)
      let raw = rows?.[3]?.[1];
      let val = toNum(raw);

      // Fallback: if B4 missing, try labeled "labor"/"labour" row
      if (val == null) {
        const r = findRowByLabel(rows, "labor", "labour");
        if (r) val = toNum(r[1]);
      }

      // If still missing, no birds
      if (val == null) return 0;

      // Interpret as % if >1 (e.g., "12" => 12% => 0.12)
      const pct = clamp01(val > 1 ? val / 100 : val);

      // Piecewise mapping: 0..10% ⇒ 0..0.10 ; 10..50% ⇒ 0.10..1.0 ; >50% ⇒ 1.0
      if (pct <= 0) return 0;
      if (pct <= 0.10) {
        // ramp from ~0 at 0% to 0.10 at 10%
        return pct / 0.10 * 0.10; // linear 0..0.10
      }
      if (pct >= 0.50) return 1.0;
      // 10%..50% → 0.10..1.00
      const t = (pct - 0.10) / 0.40; // 0..1 over [0.10, 0.50]
      return 0.10 + t * 0.90;
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

  // Initial fetch
  useEffect(() => { refreshData(); }, []);

  // Refresh on app "Refresh" event
  useEffect(() => {
    const onRefresh = () => { refreshData(); };
    window.addEventListener("innovue:refresh", onRefresh);
    return () => window.removeEventListener("innovue:refresh", onRefresh);
  }, []);

  // One-shot flash on mount/refresh (beam/glow)
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!BEAM_FLASH.enable) return;
    const t1 = setTimeout(() => setFlash(true), BEAM_FLASH.delayMs);
    const t2 = setTimeout(() => setFlash(false), BEAM_FLASH.delayMs + BEAM_FLASH.durationMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  useEffect(() => {
    const onRefresh = () => {
      setFlash(false);
      setTimeout(() => setFlash(true), 20);
      setTimeout(() => setFlash(false), BEAM_FLASH.delayMs + BEAM_FLASH.durationMs + 30);
    };
    window.addEventListener("innovue:refresh", onRefresh);
    return () => window.removeEventListener("innovue:refresh", onRefresh);
  }, []);

  // Beam targeting (unchanged)
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
          ["--mat2-color" as any]: FRAME.mat2.color,
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

            {/* Weather */}
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

            {/* Waves front (in front of lighthouse) */}
            <div className="topbar-layer" style={{ zIndex: 9 }}>
              <WavesFront
                sceneSize={{ width: sceneW, height: TOPBAR.height }}
                salesRatio={salesRatio}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Birds (behind lighthouse) — driven by Labor from B4 now */}
            <div className="topbar-layer" style={{ zIndex: 6 }}>
              <Birds
                sceneWidth={sceneW}
                activity={laborActivity}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Lighthouse */}
            <div className="topbar-layer" style={{ zIndex: 7 }}>
              <Lighthouse beamActive={LIGHTHOUSE.beamOn} />
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

            {/* Optional flash */}
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

            {/* Centered logo + glow */}
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