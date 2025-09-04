// src/components/topbar/tuning.ts

export const TOPBAR = {
  width: 360,
  height: 260,  // taller scenic frame so waves & sky fully fit
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
  offsetX: -28,
  offsetY: 12,
};

// ===== Lighthouse =====
export const LIGHTHOUSE = {
  imgSrc: "/logos/innovuegrey.png",
  height: 156,
  offsetLeft: 10,
  offsetBottom: 12,

  beamOn: true,
  beamSweepSeconds: 6,
  beamWidthDeg: 26,
  beamColor: "rgba(255,255,180,0.65)",
  beamBlurPx: 1.2,
};

// ===== Rock base =====
export const ROCK = {
  width: 130,
  height: 35,
  offsetLeft: 0,
  offsetBottom: 0,
};

// ===== GCDC logo =====
export const BADGE = {
  imgSrc: "/logos/gcdclogo.png",
  width: 100,
  height: 100,
  opacity: 0.98,
  centerOffsetY: -8,
  centerOffsetX: 0,
};

// ===== Frame (slightly larger side/top borders) =====
export const FRAME = {
  strokeColor: "#E6EBF3",
  strokeWidth: 1,
  outerRadius: 16,
  innerRadius: 12,

  mat1: {
    min: 6,  // outer mat thickness
    max: 8,
    vw: "1.6vw",
    color: "#E6E9F0",  // blends with page background
  },

  mat2: {
    min: 4,  // inner mat thickness
    max: 6,
    vw: "1.2vw",
    color: "#FFFFFF",  // crisp white edge
  },

  shadow: "0 10px 22px rgba(0,0,0,0.08)",
  sceneInsetShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
};

// ===== Birds =====
export const BIRDS = {
  activity: 0.45,
};

// ===== Beam flash =====
export const BEAM_FLASH = {
  enable: true,
  durationMs: 1600,
  delayMs: 50,
  beamColor: "rgba(255, 247, 180, 0.70)",
  beamWidthDeg: 34,
  glowColor: "rgba(255, 247, 180, 0.95)",
  glowSpreadPx: 24,
  sweepSpanDeg: 52,
};

// ===== INNOVUE text fill =====
export const INNOVUE_FILL = {
  enable: true,
  left: 86,
  top: 72,
  width: 170,
  height: 54,
  radius: 10,
  color: "rgba(255, 247, 180, 0.45)",
  blurPx: 1.2,
  opacity: 0.0,
  peakOpacity: 0.85,
};

// ===== Weather =====
export const WEATHER = {
  enable: true,
  mode: "manual" as "auto" | "manual",
  zip: "20006",
  condition: "cloudy" as "clear" | "cloudy" | "rain" | "thunder" | "fog",
  intensity: 0.7,
};