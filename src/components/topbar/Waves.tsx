// src/components/topbar/Waves.tsx
import React, { useMemo } from "react";

type CommonProps = {
  sceneSize: { width: number; height: number };
  salesRatio: number; // 0..1
  reducedMotion?: boolean;
};

type Variant = "back" | "front";

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

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
  const bandH = 48; // 👈 must match CSS .tb-waves { height: 48px }
  const scrollW = sceneW * 2; // 2x width so it can scroll
  const r = clamp(salesRatio ?? 0, 0, 1);

  // amplitudes within a 48px band
  const ampBack = reducedMotion ? 4 : Math.round(3 + r * 6); // 3..9
  const ampFront = reducedMotion ? 6 : Math.round(4 + r * 9); // 4..13

  // speeds (lower = faster)
  const durBack = reducedMotion ? 18 : 16 - r * 6; // 10..16s
  const durFront = reducedMotion ? 14 : 12 - r * 6; // 6..12s

  // baseline within the band
  const baseBack = 20;
  const baseFront = 10;

  const isBack = variant === "back";
  const amp = isBack ? ampBack : ampFront;
  const dur = isBack ? durBack : durFront;
  const base = isBack ? baseBack : baseFront;
  const fill = isBack
    ? "rgba(180, 220, 255, 0.35)"
    : "rgba(120, 200, 255, 0.55)";
  const extraClass = isBack ? "" : " tb-wave-front";

  const path = useMemo(
    () => buildWavePath(scrollW, bandH, amp, base),
    [scrollW, bandH, amp, base]
  );

  return (
    <div className={"tb-waves"} aria-hidden>
      <div
        className={"tb-wave-strip" + extraClass}
        style={{ animationDuration: `${dur}s`, animationTimingFunction: "linear" }}
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

// Public exports: use these two so we can place them in different z-index layers.
export const WavesBack: React.FC<CommonProps> = (p) => (
  <WavesLayer {...p} variant="back" />
);
export const WavesFront: React.FC<CommonProps> = (p) => (
  <WavesLayer {...p} variant="front" />
);