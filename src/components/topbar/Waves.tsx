// src/components/topbar/Waves.tsx
import React, { useMemo } from "react";

type Props = {
  sceneWidth: number;
  salesRatio: number; // 0..1
  reducedMotion?: boolean;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

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
  const bandH = 80; // fixed band
  const scrollW = sceneWidth * 2;

  const baseline = 10 + salesRatio * 30; // waterline climb
  const amplitude = reducedMotion ? 4 : 6 + salesRatio * 12; // taller peaks at higher sales

  const path = useMemo(
    () => buildWavePath(scrollW, bandH, amplitude, baseline),
    [scrollW, bandH, amplitude, baseline]
  );

  return (
    <div className="tb-waves" aria-hidden>
      <div className="tb-wave-strip" style={{ animationDuration: reducedMotion ? "20s" : "16s" }}>
        <svg viewBox={`0 0 ${scrollW} ${bandH}`} width={scrollW} height={bandH} preserveAspectRatio="none">
          <path d={path} fill="rgba(120, 180, 255, 0.35)" />
        </svg>
      </div>
    </div>
  );
}

export function WavesFront({ sceneWidth, salesRatio, reducedMotion }: Props) {
  const bandH = 80;
  const scrollW = sceneWidth * 2;

  const baseline = 5 + salesRatio * 30;
  const amplitude = reducedMotion ? 6 : 8 + salesRatio * 14;

  const path = useMemo(
    () => buildWavePath(scrollW, bandH, amplitude, baseline),
    [scrollW, bandH, amplitude, baseline]
  );

  return (
    <div className="tb-waves" aria-hidden>
      <div
        className="tb-wave-strip tb-wave-front"
        style={{ animationDuration: reducedMotion ? "14s" : "12s" }}
      >
        <svg viewBox={`0 0 ${scrollW} ${bandH}`} width={scrollW} height={bandH} preserveAspectRatio="none">
          <path d={path} fill="rgba(100, 160, 240, 0.55)" />
        </svg>
      </div>
    </div>
  );
}