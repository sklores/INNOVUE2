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

// find a row by its first-cell label
const findRowByLabel = (rows: string[][], ...labels: string[]) => {
  const wants = labels.map((s) => s.trim().toLowerCase());
  for (const r of rows ?? []) {
    const label = String(r?.[0] ?? "").trim().toLowerCase();
    if (wants.includes(label)) return r;
  }
  return null;
};

const TopBarShell: React.FC = () => {
  const sunRight = 10 - (SUN.offsetX ?? 0);
  const sunTop = 8 + (SUN.offsetY ?? 0);

  // Scene size (for responsive container if you wire it later)
  const [w, setW] = useState(TOPBAR.width);
  const [h, setH] = useState(TOPBAR.height);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setW(rect.width);
      setH(rect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ===== Live values from Google Sheets =====
  const [salesRatio, setSalesRatio] = useState(0.5);
  const [laborActivity, setLaborActivity] = useState(0); // 0..1 for birds

  // Sales ratio example (not detailed here—left as in your file)
  const computeSalesRatio = (rows: string[][]) => {
    try {
      // Example mapping: read a labeled “sales” row (B col)
      const r = findRowByLabel(rows, "sales", "revenue");
      if (!r) return 0.5;
      const val = toNum(r[1]);
      if (val == null) return 0.5;

      // Optional percent detection via trailing token in col F/G etc.
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
      // Primary: read B4 (0-indexed row 2, col 1) because RANGE starts at A2
      let raw = rows?.[2]?.[1]; // <-- FIXED: was rows?.[3]?.[1] (B5). Correct is B4.
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
        return (pct / 0.10) * 0.10; // linear 0..0.10
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

  // Initial + on-demand refresh
  useEffect(() => {
    refreshData();
    const onRefresh = () => refreshData();
    window.addEventListener("innovue:refresh", onRefresh);
    return () => window.removeEventListener("innovue:refresh", onRefresh);
  }, []);

  // One-shot flash on mount/refresh (beam/glow)
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!BEAM_FLASH.enable) return;
    const t1 = setTimeout(() => setFlash(true), BEAM_FLASH.delayMs);
    const t2 = setTimeout(() => setFlash(false), BEAM_FLASH.delayMs + BEAM_FLASH.durationMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  useEffect(() => {
    const onRefresh = () => {
      if (!BEAM_FLASH.enable) return;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), BEAM_FLASH.durationMs);
      return () => clearTimeout(t);
    };
    window.addEventListener("innovue:refresh", onRefresh);
    return () => window.removeEventListener("innovue:refresh", onRefresh);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="topbar-wrap"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: TOPBAR.radius,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="topbar-frame"
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <div className="topbar-scene" style={{ position: "absolute", inset: 0 }}>
          {/* Sky */}
          <div className="topbar-layer" style={{ zIndex: 1 }}>
            <SkyLayer width={w} height={h} />
          </div>

          {/* Sun / Moon */}
          <div
            className="topbar-layer"
            style={{
              zIndex: 2,
              position: "absolute",
              right: `${sunRight}px`,
              top: `${sunTop}px`,
            }}
          >
            <SunMoon />
          </div>

          {/* Lighthouse + beam */}
          <div className="topbar-layer" style={{ zIndex: 3 }}>
            <Lighthouse width={w} height={h} />
            <LightBeam width={w} height={h} flash={flash} />
          </div>

          {/* Weather (rain/clouds) */}
          {WEATHER.enable && (
            <div className="topbar-layer" style={{ zIndex: 4 }}>
              <Weather width={w} height={h} />
            </div>
          )}

          {/* Birds (labor-driven) */}
          <div className="topbar-layer" style={{ zIndex: 5 }}>
            <Birds sceneWidth={w} activity={laborActivity} />
          </div>

          {/* Waves & rock base */}
          <div className="topbar-layer" style={{ zIndex: 6 }}>
            <WavesBack width={w} height={h} />
            <RockBase width={w} height={h} />
            <WavesFront width={w} height={h} />
          </div>

          {/* Centered logo + glow */}
          <div className="topbar-layer" style={{ zIndex: 10 }}>
            <GlowLogo boost={false} />
            <ClientLogo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarShell;