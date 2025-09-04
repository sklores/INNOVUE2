import React, { useMemo } from "react";

type Props = {
  sceneSize: { width: number; height: number };
  salesRatio: number;
  baseline: number;   // px offset for waterline
  amplitude: number;  // px wave height
  reducedMotion?: boolean;
};

function buildWavePath(
  totalWidth: number,
  bandHeight: number,
  amplitudePx: number,
  baseline: number
) {
  const seg = totalWidth / 4;
  const yBase = bandHeight - baseline;

  let d = `M 0 ${yBase}`;
  d += ` C ${seg * 0.5} ${yBase - amplitudePx}, ${seg * 0.5} ${yBase + amplitudePx}, ${seg} ${yBase}`;
  d += ` S ${seg * 1.5} ${yBase + amplitudePx}, ${seg * 2} ${yBase}`;
  d += ` S ${seg * 2.5} ${yBase + amplitudePx}, ${seg * 3} ${yBase}`;
  d += ` S ${seg * 3.5} ${yBase + amplitudePx}, ${seg * 4} ${yBase}`;
  d += ` L ${totalWidth} ${bandHeight} L 0 ${bandHeight} Z`;

  return d;
}

export function WavesBack({ sceneSize, baseline, amplitude, reducedMotion }: Props) {
  const bandH = sceneSize.height;
  const scrollW = sceneSize.width * 2;

  const path = useMemo(
    () => buildWavePath(scrollW, bandH, amplitude, baseline),
    [scrollW, bandH, amplitude, baseline]
  );

  return (
    <div className="tb-waves" aria-hidden>
      <div
        className="tb-wave-strip"
        style={{
          animationDuration: reducedMotion ? "20s" : "16s",
        }}
      >
        <svg
          viewBox={`0 0 ${scrollW} ${bandH}`}
          width={scrollW}
          height={bandH}
          preserveAspectRatio="none"
        >
          <path d={path} fill="rgba(120, 180, 255, 0.35)" />
        </svg>
      </div>
    </div>
  );
}

export function WavesFront({ sceneSize, baseline, amplitude, reducedMotion }: Props) {
  const bandH = sceneSize.height;
  const scrollW = sceneSize.width * 2;

  const path = useMemo(
    () => buildWavePath(scrollW, bandH, amplitude, baseline),
    [scrollW, bandH, amplitude, baseline]
  );

  return (
    <div className="tb-waves" aria-hidden>
      <div
        className="tb-wave-strip tb-wave-front"
        style={{
          animationDuration: reducedMotion ? "14s" : "12s",
        }}
      >
        <svg
          viewBox={`0 0 ${scrollW} ${bandH}`}
          width={scrollW}
          height={bandH}
          preserveAspectRatio="none"
        >
          <path d={path} fill="rgba(100, 160, 255, 0.55)" />
        </svg>
      </div>
    </div>
  );
}