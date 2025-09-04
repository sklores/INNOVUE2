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

/**
 * Controls how high the waterline rises at salesRatio = 1.0 (in pixels).
 * Increase to raise the final water level; decrease to lower it.
 * This is a delta relative to the low-sales baseline inside the band.
 */
const LIGHTHOUSE_BASE_OFFSET = 46;

/** Build a wave path sized to the *band height* (not the full scene). */
function buildWavePath(
  totalWidth: number,
  bandHeight: number,
  amplitudePx: number,
  yFromBottom: number
) {
  const seg = totalWidth / 4;
  const yBase = bandHeight - yFromBottom;
  let d = `M 0 ${yBase}`;
  d += ` C ${seg * 0.5} ${yBase - amplitudePx}, ${seg * 0.5} ${
    yBase + amplitudePx
  }, ${seg} ${yBase}`;
  d += ` S ${seg * 1.5} ${yBase + amplitudePx}, ${seg * 2} ${yBase}`;
  d += ` S ${seg * 2.5} ${yBase + amplitudePx}, ${seg * 3} ${yBase}`;
  d += ` S ${seg * 3.5} ${yBase + amplitudePx}, ${seg * 4} ${yBase}`;
  // Close down to the band bottom so there is NEVER a gap
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

  // Band height — we keep it at 64 for generous vertical room
  const bandH = 64;
  const scrollW = sceneW * 2; // 2x width so it can scroll

  // --- amplitude mapping (same feel you liked) ---
  // Baseline at r=0 (very low red)
  const baseBackLow = 3;    // px
  const baseFrontLow = 4;   // px
  // Targets at r=1 (top green)
  const targetBack = 22;    // px
  const targetFront = 28;   // px

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const ampBack = Math.round(lerp(baseBackLow, targetBack, r));
  const ampFront = Math.round(lerp(baseFrontLow, targetFront, r));

  // --- baseline height inside the band ---
  // Low-sales baselines (yFromBottom): higher value -> lower baseline (further from top)
  const baseBackYLow = 20;
  const baseFrontYLow = 10;

  // We raise the waterline smoothly with sales.
  // Convert the LIGHTHOUSE_BASE_OFFSET (px) into a delta in "yFromBottom" units.
  // Since the band is in pixels, we can subtract a delta directly (raising the baseline).
  const deltaY = Math.min(LIGHTHOUSE_BASE_OFFSET, bandH - 4); // safety clamp

  // Slight parallax offset so back layer sits a touch lower
  const parallaxBack = 4; // px

  const yFromBottomBack = Math.max(
    0,
    Math.round(baseBackYLow - r * (deltaY) + parallaxBack)
  );
  const yFromBottomFront = Math.max(
    0,
    Math.round(baseFrontYLow - r * (deltaY))
  );

  // --- speed: a touch faster with high sales (still calm) ---
  const durBack = Math.max(8, (reducedMotion ? 18 : 16) - r * 5);
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