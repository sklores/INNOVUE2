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
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * TARGET_LEVEL_PX:
 * The waterline (baseline) height above the *bottom of the scene* when salesRatio = 1.0.
 * Increase if you want it to climb higher (e.g., up the lighthouse), decrease to lower.
 * Tune this by eye after you paste: 110 is a good starting guess for your screenshot.
 */
const TARGET_LEVEL_PX = 110;

/** Build a wave path sized to the *band height* (not the full scene). */
function buildWavePath(
  totalWidth: number,
  bandHeight: number,
  amplitudePx: number,
  yFromBottom: number
) {
  const seg = totalWidth / 4;
  const yBase = bandHeight - yFromBottom; // path baseline
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

  // --- Band height ---
  // Keep a big enough band that we can raise the waterline without hitting the top of the band.
  // Using a constant makes the layout stable and prevents “jumping” as sales change.
  const bandH = Math.max(64, TARGET_LEVEL_PX + 40); // 40px buffer above the target
  const scrollW = sceneW * 2; // 2x width so it can scroll

  // --- amplitude mapping (same feel you liked) ---
  // Baseline at r=0 (very low red)
  const baseBackLow = 3;    // px
  const baseFrontLow = 4;   // px
  // Targets at r=1 (top green) – strong crests
  const targetBack = 22;    // px
  const targetFront = 28;   // px

  const ampBack = Math.round(lerp(baseBackLow, targetBack, r));
  const ampFront = Math.round(lerp(baseFrontLow, targetFront, r));

  // --- low-sales waterline (yFromBottom) inside the band ---
  const baseBackYLow = 20;
  const baseFrontYLow = 10;

  // --- desired waterline at max sales (yFromBottom) inside the band ---
  // Since the band is bottom-aligned to the scene, yFromBottom at target is simply TARGET_LEVEL_PX.
  const targetY = TARGET_LEVEL_PX;

  // A tiny parallax so the back layer sits slightly lower than the front at all times
  const parallaxBack = 4; // px

  // Smooth proportional climb from low baseline to target level
  const yFromBottomBack = Math.min(
    bandH - 2, // never exceed bandH (keep 2px safety)
    Math.max(0, Math.round(lerp(baseBackYLow, targetY - parallaxBack, r)))
  );
  const yFromBottomFront = Math.min(
    bandH - 2,
    Math.max(0, Math.round(lerp(baseFrontYLow, targetY, r)))
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