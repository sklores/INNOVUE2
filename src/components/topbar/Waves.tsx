// src/components/topbar/Waves.tsx
import React, { useMemo } from "react";

type Props = {
  sceneSize: { width: number; height: number };
  salesRatio: number; // 0..1
  reducedMotion?: boolean;
};

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

const Waves: React.FC<Props> = ({ sceneSize, salesRatio, reducedMotion }) => {
  const sceneW = sceneSize.width;
  const bandH = 48; // 👈 must match CSS .tb-waves { height: 48px }
  const scrollW = sceneW * 2; // 2x width so it can scroll

  const r = clamp(salesRatio ?? 0, 0, 1);

  // amplitude inside a 48px band (keep subtle but visible)
  const ampBack = reducedMotion ? 4 : Math.round(3 + r * 6); // 3..9 px
  const ampFront = reducedMotion ? 6 : Math.round(4 + r * 9); // 4..13 px

  // animation speed (lower = faster)
  const durBack = reducedMotion ? 18 : 16 - r * 6; // 10..16s
  const durFront = reducedMotion ? 14 : 12 - r * 6; // 6..12s

  // where they sit from the bottom *of the band*
  const baseBack = 20;
  const baseFront = 10;

  const pathBack = useMemo(
    () => buildWavePath(scrollW, bandH, ampBack, baseBack),
    [scrollW, bandH, ampBack, baseBack]
  );
  const pathFront = useMemo(
    () => buildWavePath(scrollW, bandH, ampFront, baseFront),
    [scrollW, bandH, ampFront, baseFront]
  );

  const commonStyle: React.CSSProperties = {
    animationTimingFunction: "linear",
  };

  return (
    <div className="tb-waves" aria-hidden>
      {/* Back wave */}
      <div
        className="tb-wave-strip"
        style={{ ...commonStyle, animationDuration: `${durBack}s` }}
      >
        <svg
          viewBox={`0 0 ${scrollW} ${bandH}`}
          width={scrollW}
          height={bandH}
          preserveAspectRatio="none"
        >
          <path d={pathBack} fill="rgba(180, 220, 255, 0.35)" />
        </svg>
      </div>

      {/* Front wave */}
      <div
        className="tb-wave-strip tb-wave-front"
        style={{ ...commonStyle, animationDuration: `${durFront}s` }}
      >
        <svg
          viewBox={`0 0 ${scrollW} ${bandH}`}
          width={scrollW}
          height={bandH}
          preserveAspectRatio="none"
        >
          <path d={pathFront} fill="rgba(120, 200, 255, 0.55)" />
        </svg>
      </div>
    </div>
  );
};

export default Waves;