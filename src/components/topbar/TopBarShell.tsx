// TopBarShell.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// NOTE: These imports assume this file sits in the SAME FOLDER as these modules.
// If your files are elsewhere, tell me the exact paths and I'll swap them.
import { fetchSheetValues } from "./fetch";
import { sheetMap } from "./sheetMap";

// Scene pieces (adjust paths only if yours differ)
import SunMoon from "./SunMoon";
import Birds from "./Birds";
import Lighthouse from "./Lighthouse";
import LightBeam from "./LightBeam";
import RockBase from "./RockBase";
import SkyLayer from "./SkyLayer";
import { WavesBack, WavesFront } from "./Waves";
import Weather from "./Weather";
import GlowLogo from "./GlowLogo";
import ClientLogo from "./ClientLogo";

import "./topbar.css";

// Tuning knobs (adjust path only if your tuning.ts is elsewhere)
import {
  TOPBAR,
  SUN,
  BEAM_FLASH,
  WEATHER as WEATHER_CFG,
} from "./tuning";

/** ---------- small utils ---------- */
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const toNum = (v: unknown) => {
  const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const findRowByLabel = (rows: string[][], ...labels: string[]) => {
  const wants = labels.map((s) => s.trim().toLowerCase());
  for (const r of rows ?? []) {
    const label = String(r?.[0] ?? "").trim().toLowerCase();
    if (wants.includes(label)) return r;
  }
  return null;
};

/** ---------- main component ---------- */
const TopBarShell: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(TOPBAR?.width ?? 1200);
  const [h, setH] = useState(TOPBAR?.height ?? 180);
  const [err, setErr] = useState<string | null>(null);

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

  /** ----- live values from Google Sheets ----- */
  const [salesRatio, setSalesRatio] = useState(0.5);
  const [laborActivity, setLaborActivity] = useState(0);

  const computeSalesRatio = (rows: string[][]) => {
    try {
      // example heuristic: read a labeled row "sales" or "revenue"
      const r = findRowByLabel(rows, "sales", "revenue");
      if (!r) return 0.5;
      const val = toNum(r[1]);
      if (val == null) return 0.5;

      // If the sheet stores percent-style values (>1), normalize
      const unitToken = String(r[5] ?? "").trim().toLowerCase();
      if (unitToken === "%" || unitToken === "percent") return clamp01((val as number) / 100);
      return clamp01((val as number) > 0 ? 0.6 : 0.1);
    } catch {
      return 0.1;
    }
  };

  /**
   * Labor from **cell B4** (with RANGE starting at A2)
   * Mapping:
   *   0%  -> 0.00
   *   10% -> 0.10
   *   50% -> 1.00
   * Linear between 10%..50%, clamped outside.
   */
  const computeLaborActivityFromB4 = (rows: string[][]) => {
    try {
      // Since sheetMap.RANGE starts at A2, B4 is rows[2][1]:
      let raw = rows?.[2]?.[1]; // <-- IMPORTANT: B4
      let val = toNum(raw);

      // Optional fallback by label if B4 is blank:
      if (val == null) {
        const r = findRowByLabel(rows, "labor", "labour");
        if (r) val = toNum(r[1]);
      }
      if (val == null) return 0;

      const pct = clamp01(val > 1 ? val / 100 : val); // accept 12 or 0.12
      if (pct <= 0) return 0;
      if (pct <= 0.10) return (pct / 0.10) * 0.10; // 0..0.10
      if (pct >= 0.50) return 1.0;
      const t = (pct - 0.10) / 0.40; // 0..1 from 10%..50%
      return 0.10 + t * 0.90;
    } catch {
      return 0;
    }
  };

  const refreshData = async () => {
    try {
      setErr(null);
      // This uses your existing fetch.ts + sheetMap.ts
      const rows = await fetchSheetValues(sheetMap);
      setSalesRatio(computeSalesRatio(rows));
      setLaborActivity(computeLaborActivityFromB4(rows));
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Data refresh failed.");
    }
  };

  useEffect(() => {
    refreshData();
    const onRefresh = () => refreshData();
    window.addEventListener("innovue:refresh", onRefresh);
    return () => window.removeEventListener("innovue:refresh", onRefresh);
  }, []);

  /** ----- one-shot beam flash ----- */
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!BEAM_FLASH?.enable) return;
    const t1 = setTimeout(() => setFlash(true), BEAM_FLASH.delayMs ?? 400);
    const t2 = setTimeout(() => setFlash(false), (BEAM_FLASH.delayMs ?? 400) + (BEAM_FLASH.durationMs ?? 600));
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /** ----- helpers for layout ----- */
  const sunRight = 10 - (SUN?.offsetX ?? 0);
  const sunTop = 8 + (SUN?.offsetY ?? 0);

  return (
    <div ref={wrapRef} className="topbar-wrap" style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", borderRadius: TOPBAR?.radius ?? 12 }}>
      {/* If anything fails, show an on-screen banner instead of a blank page */}
      {err && (
        <div style={{ position: "absolute", top: 8, left: 8, right: 8, zIndex: 9999, padding: 10, background: "#ffefef", border: "1px solid #ffb3b3", color: "#c00", borderRadius: 8, fontSize: 12 }}>
          <strong>TopBar error:</strong> {err}
        </div>
      )}

      <div className="topbar-frame" style={{ position: "absolute", inset: 0 }}>
        <div className="topbar-scene" style={{ position: "absolute", inset: 0 }}>
          {/* Sky */}
          <div className="topbar-layer" style={{ zIndex: 1 }}>
            <SkyLayer width={w} height={h} />
          </div>

          {/* Sun / Moon */}
          <div className="topbar-layer" style={{ zIndex: 2, position: "absolute", right: `${sunRight}px`, top: `${sunTop}px` }}>
            <SunMoon />
          </div>

          {/* Lighthouse + beam */}
          <div className="topbar-layer" style={{ zIndex: 3 }}>
            <Lighthouse width={w} height={h} />
            <LightBeam width={w} height={h} flash={flash} />
          </div>

          {/* Weather */}
          {WEATHER_CFG?.enable && (
            <div className="topbar-layer" style={{ zIndex: 4 }}>
              <Weather width={w} height={h} />
            </div>
          )}

          {/* Birds (labor-driven) */}
          <div className="topbar-layer" style={{ zIndex: 5 }}>
            <Birds sceneWidth={w} activity={laborActivity} />
          </div>

          {/* Waves + Rock base */}
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