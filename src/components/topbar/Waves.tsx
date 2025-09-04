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
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * MAX_WATERLINE_PX:
 *  The highest baseline we allow at salesRatio = 1.0 (px from scene bottom).
 *  Increase to let the water rise higher; decrease to lower the cap.
 *  Tune by eye — ~72..84 usually hits "just under the first window".
 */
const MAX_WATERLINE_PX = 76;

/** Back wave sits a bit lower than front to keep depth */
const PARALLAX_BACK_PX = 4;

/** Height of the wave band (must also match CSS .tb-waves height via inline style) */
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

/** Internal layer that renders exactly one wave strip (either "back" or "front"). */
const WavesLayer: React.FC<CommonProps & { variant: Variant }> = ({
  sceneSize,
  salesRatio,
  reducedMotion,
  variant,
}) => {
  const sceneW = sceneSize.width;
  const r = clamp01(salesRatio);

  // Use a fixed band (stable layout)
  const bandH = BAND_HEIGHT;
  const scrollW = sceneW * 2; // 2x width so it can scroll

  // --- amplitude mapping (same feel; front bigger than back) ---
  const baseBackLow = 3;   // px at r=0
  const baseFrontLow = 4;  // px at r=0
  const targetBack   = 22; // px at r=1
  const targetFront  = 28; // px at r=1
  const ampBack  = Math.round(lerp(baseBackLow,  targetBack,  r));
  const ampFront = Math.round(lerp(baseFrontLow, targetFront, r));

  // --- low-sales baseline (yFromBottom) inside the band ---
  const baseBackYLow  = 20;
  const baseFrontYLow = 10;

  // Desired waterline at this sales:
  // raise smoothly from low baseline toward MAX_WATERLINE_PX, but never exceed a safe
  // value that preserves wave shape (need some headroom above the baseline).
  const minBaselineBack  = ampBack  + 4; // safety: baseline must be above crest bottom
  const minBaselineFront = ampFront + 4;

  // Target for this sales, capped so front/back remain visible.
  const targetYFront = clamp(MAX_WATERLINE_PX, minBaselineFront, bandH - 2);
  const targetYBack  = clamp(MAX_WATERLINE_PX - PARALLAX_BACK_PX, minBaselineBack, bandH - 2);

  const yFromBottomBack  = clamp(Math.round(lerp(baseBackYLow,  targetYBack,  r)),  minBaselineBack,  bandH - 2);
  const yFromBottomFront = clamp(Math.round(lerp(baseFrontYLow, targetYFront, r)), minBaselineFront, bandH - 2);

  // --- speed: a touch faster with high sales (still calm) ---
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

// Public exports: two layers so you can sandwich the rock between them.
export const WavesBack: React.FC<CommonProps> = (p) => (
  <WavesLayer {...p} variant="back" />
);
export const WavesFront: React.FC<CommonProps> = (p) => (
  <WavesLayer {...p} variant="front" />
);