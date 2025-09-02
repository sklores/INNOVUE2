// src/components/topbar/tuning.ts

export const TOPBAR = {
  width: 360,
  height: 220,
  radius: 12,
};

export const TIME = {
  sunriseHour: 6,
  sunsetHour: 18,
};

// ===== Sun knobs =====
export const SUN = {
  size: 46,
  raysCount: 12,
  spinSeconds: 8,
  rayLengthScale: 0.8,
  // Top-right anchored
  offsetX: -28, // negative = LEFT
  offsetY: 12,  // positive = DOWN
};

// ===== Lighthouse (left) =====
export const LIGHTHOUSE = {
  imgSrc: "/logos/innovuegrey.png",
  height: 156,       // px
  offsetLeft: 10,    // px from left of scene
  offsetBottom: 2,   // px from bottom of scene

  beamOn: true,
  beamSweepSeconds: 6,
  beamWidthDeg: 26,
  beamColor: "rgba(255,255,180,0.65)",
  beamBlurPx: 1.2,
};

// ===== GCDC logo (centered by ClientLogo.tsx) =====
export const BADGE = {
  imgSrc: "/logos/gcdclogo.png",
  width: 86,
  height: 86,
  opacity: 0.98,
};

// ===== Frame (double-mat gallery style) =====
export const FRAME = {
  strokeColor: "#E6EBF3",
  strokeWidth: 1,
  outerRadius: 16,
  innerRadius: 12,
  mat1: { min: 8, max: 16, vw: "3vw", color: "#FFFFFF" },
  mat2: { min: 6, max: 12, vw: "2.2vw", color: "#FAFBFD" },
  shadow: "0 10px 22px rgba(0,0,0,0.08)",
  sceneInsetShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
};

// ===== Beam flash on refresh =====
export const BEAM_FLASH = {
  enable: true,
  durationMs: 1600,            // total time for sweep + glow (increase if you want longer)
  delayMs: 50,                  // small delay after mount
  beamColor: "rgba(255, 247, 180, 0.70)",
  beamWidthDeg: 34,            // slightly wider than normal sweep
  glowColor: "rgba(255, 247, 180, 0.95)",
  glowSpreadPx: 24,            // logo glow thickness

  // optional: span of rotation around the target angle (defaults to 44deg if omitted)
  sweepSpanDeg: 52,
};

// ===== INNOVUE text fill area (scene coordinates) =====
// This is a soft highlight that appears over the word "INNOVUE" while the beam sweeps.
// Tweak left/top/width/height to align with your logo art.
export const INNOVUE_FILL = {
  enable: true,
  left: 86,            // px from left of scene
  top: 72,             // px from top of scene
  width: 170,          // px
  height: 54,          // px
  radius: 10,          // corner radius
  color: "rgba(255, 247, 180, 0.45)", // warm light
  blurPx: 1.2,
  opacity: 0.0,        // start opacity (do not change)
  peakOpacity: 0.85,   // how bright it gets at mid sweep
};