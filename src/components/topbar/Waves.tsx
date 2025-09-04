// src/components/topbar/Waves.tsx
import React, { useMemo } from "react";

type CommonProps = {
  sceneSize: { width: number; height: number };
  /** 0..1 sales score (0 = red/low, 1 = top green) */
  salesRatio: number;
  reducedMotion?: boolean;
};

type Variant = "back" | "front";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * MAX_WATERLINE_PX:
 *  Highest baseline allowed at salesRatio = 1.0 (px from scene bottom).
 *  Tune by eye — ~68..74 usually lands just under the lighthouse first window.
 */
const MAX_WATERLINE_PX = 70;

/** Back wave sits a bit lower than front to keep depth */
const PARALLAX_BACK_PX = 5;

/** Height of the wave band (pixels). */
const BAND_HEIGHT = 64;

/** Build a wave path sized to the *band height* (not the full scene). */
function buildWavePath(
  totalWidth: number,
  bandHeight: number,
  amplitudePx: number,
  yFromBottom: number
) {
  const seg = totalWidth / 4;
  const yBase = bandHeight - yFromBottom; // path baseline inside band
  let d = `M 0 ${yBase}`;
  d += ` C ${seg * 0.5} ${yBase - amplitudePx}, ${seg * 0.5} ${
    yBase + amplitudePx
  }, ${seg} ${yBase}`;
  d += ` S ${seg * 1.5} ${yBase + amplitudePx}, ${seg * 2} ${yBase}`;
  d += ` S ${seg * 2.5} ${yBase + amplitudePx}, ${seg * 3} ${yBase}`;
  d += ` S ${seg * 3.5} ${yBase + amplitudePx}, ${seg * 4} ${yBase}`;
  // Always close to band bottom so there is NEVER a gap
  d += ` L ${totalWidth} ${bandHeight} L 0 ${bandHeight} Z`;
  return d;
}

const WavesLayer: React.FC<CommonProps & { variant: Variant }> = ({
  sceneSize,
  salesRatio,
  reducedMotion,
  variant,
}) => {
  const sceneW = sceneSize.width;
  const rRaw = clamp01(salesRatio);

  // Slightly non-linear ramp so “bigness” shows more near the top
  const r = Math.pow(rRaw, 0.85);

  const bandH = BAND_HEIGHT;           // fixed band for stability
  const scrollW = sceneW * 2;          // 2x width so it can scroll

  // --- amplitude mapping (bigger waves at high sales) ---
  // very low baseline
  const baseBackLow  = 3;
  const baseFrontLow = 4;
  // stronger targets
  const targetBack   = 26;   // was 22
  const targetFront  = 32;   // was 28

  const ampBack  = Math.round(baseBackLow  + (targetBack  - baseBackLow)  * r);
  const ampFront = Math.round(baseFrontLow + (targetFront - baseFrontLow) * r);

  // --- baseline yFromBottom — smooth climb with cap ---
  const baseBackYLow  = 20;
  const baseFrontYLow = 10;

  // desired waterline for this sales, capped
  const targetYFront = clamp(MAX_WATERLINE_PX, ampFront + 4, bandH - 2);
  const targetYBack  = clamp(MAX_WATERLINE_PX - PARALLAX_BACK_PX, ampBack + 4, bandH - 2);

  const yFromBottomBack  = clamp(Math.round(baseBackYLow  + (targetYBack  - baseBackYLow)  * r), ampBack  + 4, bandH - 2);
  const yFromBottomFront = clamp(Math.round(baseFrontYLow + (targetYFront - baseFrontYLow) * r), ampFront + 4, bandH - 2);

  // --- speed: modestly faster with higher sales (still calm) ---
  const durBack  = Math.max(8, (reducedMotion ? 18 : 16) - r * 5);
  const durFront = Math.max(6, (reducedMotion ? 14 : 12) - r * 5);

  const isBack = variant === "back";
  const amp = isBack ? ampBack : ampFront;
  const dur = isBack ? durBack : durFront;
  const yFromBottom = isBack ? yFromBottomBack : yFromBottomFront;

  const fill = isBack
    ? "rgba(180, 220, 255, 0.35)"
    : "rgba(120, 200, 255, 0.55)";
  const extraClass = isBack ? "" : " tb-wave-front";

  const path = useMemo(
    () => buildWavePath(scrollW, bandH, amp, yFromBottom),
    [scrollW, bandH, amp, yFromBottom]
  );

  return (
    <div className={"tb-waves"} aria-hidden style={{ height: bandH }}>
      <div
        className={"tb-wave-strip" + extraClass}
        style={{ animationDuration: `${dur}s`, animationTimingFunction: "linear", height: bandH }}
      >
        <svg
          viewBox={`0 0 ${scrollW} ${bandH}`}
          width={scrollW}
          height={bandH}
          preserveAspectRatio="none"
        >
          <path d={path} fill={fill} />
        </svg>
      </div>
    </div>
  );
};

export const WavesBack: React.FC<CommonProps> = (p) => (
  <WavesLayer {...p} variant="back" />
);
export const WavesFront: React.FC<CommonProps> = (p) => (
  <WavesLayer {...p} variant="front" />
);