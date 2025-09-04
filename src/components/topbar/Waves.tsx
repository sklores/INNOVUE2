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

  // --- Band height: expand at high sales so crests can rise over the rock ---
  // 48px normally; up to 64px when sales high.
  const bandH = Math.round(48 + r * 16); // 48..64

  const scrollW = sceneW * 2; // 2x width so it can scroll

  // --- amplitude mapping (storm surge at r=1) ---
  // Baseline at r=0 (very low red)
  const baseBackLow = 3;    // px
  const baseFrontLow = 4;   // px
  // Targets at r=1 (top green)
  const targetBack = 22;    // px
  const targetFront = 28;   // px

  // Ease amplitude toward target
  const ease = (a: number, b: number, t: number) => a + (b - a) * t;
  const ampBack = Math.round(ease(baseBackLow, targetBack, r));
  const ampFront = Math.round(ease(baseFrontLow, targetFront, r));

  // --- Baseline height: raise waterline as sales increase ---
  // yFromBottom (within band): lower number = closer to bottom, higher = baseline up
  const baseBackY = Math.round(20 - r * 6);   // 20→14
  const baseFrontY = Math.round(10 - r * 4);  // 10→6

  // --- speed: a touch faster with high sales (still calm) ---
  const durBack = Math.max(8, (reducedMotion ? 18 : 16) - r * 5);
  const durFront = Math.max(6, (reducedMotion ? 14 : 12) - r * 5);

  const isBack = variant === "back";
  const amp = isBack ? ampBack : ampFront;
  const dur = isBack ? durBack : durFront;
  const yFromBottom = isBack ? baseBackY : baseFrontY;

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