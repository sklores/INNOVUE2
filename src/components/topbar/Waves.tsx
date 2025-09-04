// src/components/topbar/Waves.tsx
import React, { useMemo } from "react";

type Props = {
  sceneWidth: number;
  salesRatio: number; // 0..1
  reducedMotion?: boolean;
};

const BAND_H = 64; // fixed band height

function buildWavePath(totalWidth: number, bandHeight: number, amplitude: number, baseline: number) {
  const seg = totalWidth / 4;
  const yBase = bandHeight - baseline;
  let d = `M 0 ${yBase}`;
  d += ` C ${seg * 0.5} ${yBase - amplitude}, ${seg * 0.5} ${yBase + amplitude}, ${seg} ${yBase}`;
  d += ` S ${seg * 1.5} ${yBase + amplitude}, ${seg * 2} ${yBase}`;
  d += ` S ${seg * 2.5} ${yBase + amplitude}, ${seg * 3} ${yBase}`;
  d += ` S ${seg * 3.5} ${yBase + amplitude}, ${seg * 4} ${yBase}`;
  d += ` L ${totalWidth} ${bandHeight} L 0 ${bandHeight} Z`;
  return d;
}

export function WavesBack({ sceneWidth, salesRatio, reducedMotion }: Props) {
  const scrollW = sceneWidth * 2;

  // Calm baseline and amplitude — stable visuals for demo
  const baseline = 14; // px from band bottom
  const amplitude = (reducedMotion ? 3 : 4) + salesRatio * 2;

  const path = useMemo(
    () => buildWavePath(scrollW, BAND_H, amplitude, baseline),
    [scrollW, amplitude]
  );

  return (
    <div className="tb-waves" aria-hidden style={{ height: BAND_H }}>
      <div className="tb-wave-strip" style={{ animationDuration: reducedMotion ? "20s" : "16s", height: BAND_H }}>
        <svg viewBox={`0 0 ${scrollW} ${BAND_H}`} width={scrollW} height={BAND_H} preserveAspectRatio="none">
          <path d={path} fill="rgba(180, 220, 255, 0.35)" />
        </svg>
      </div>
    </div>
  );
}

export function WavesFront({ sceneWidth, salesRatio, reducedMotion }: Props) {
  const scrollW = sceneWidth * 2;

  const baseline = 10; // a touch higher than back
  const amplitude = (reducedMotion ? 4 : 6) + salesRatio * 3;

  const path = useMemo(
    () => buildWavePath(scrollW, BAND_H, amplitude, baseline),
    [scrollW, amplitude]
  );

  return (
    <div className="tb-waves" aria-hidden style={{ height: BAND_H }}>
      <div
        className="tb-wave-strip tb-wave-front"
        style={{ animationDuration: reducedMotion ? "14s" : "12s", height: BAND_H }}
      >
        <svg viewBox={`0 0 ${scrollW} ${BAND_H}`} width={scrollW} height={BAND_H} preserveAspectRatio="none">
          <path d={path} fill="rgba(120, 200, 255, 0.55)" />
        </svg>
      </div>
    </div>
  );
}