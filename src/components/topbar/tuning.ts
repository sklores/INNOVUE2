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
// TopBarShell anchors the sun to TOP-RIGHT.
// offsetX: negative = LEFT, positive = RIGHT
// offsetY: positive = DOWN
export const SUN = {
  size: 46,
  raysCount: 12,
  spinSeconds: 8,
  rayLengthScale: 0.8,
  offsetX: -28,
  offsetY: 12,
};

// ===== Lighthouse (left) =====
export const LIGHTHOUSE = {
  imgSrc: "/logos/innovuegrey.png",
  height: 156,      // px
  offsetLeft: 10,   // px from left of scene
  offsetBottom: 12, // px from bottom of scene

  beamOn: true,
  beamSweepSeconds: 6,
  beamWidthDeg: 26,
  beamColor: "rgba(255,255,180,0.65)",
  beamBlurPx: 1.2,
};

// ===== Rock base under lighthouse =====
export const ROCK = {
  width: 130,       // px
  height: 35,       // px
  offsetLeft: 0,    // px from LEFT edge of scene
  offsetBottom: 0,  // px from BOTTOM edge of scene
};

// ===== GCDC logo (centered by ClientLogo.tsx) =====
export const BADGE = {
  imgSrc: "/logos/gcdclogo.png",
  width: 100,
  height: 100,
  opacity: 0.98,

  // Fine-tune offsets while staying centered (px):
  // negative Y = raise; positive Y = lower
  // negative X = left;  positive X = right
  centerOffsetY: -8,
  centerOffsetX: 0,
};

// ===== Frame (double-mat gallery style) =====
// Option A: SLIM mats so the scenic canvas fills ~90% visually
export const FRAME = {
  strokeColor: "#E6EBF3",
  strokeWidth: 1,
  outerRadius: 16,
  innerRadius: 12,

  // Outer mat — near page bg so it visually melts away
  mat1: {
    min: 4,               // slimmer than 8–16
    max: 8,
    vw: "1.4vw",
    color: "#E6E9F0",
  },

  // Inner mat — keep white and slim for a crisp edge
  mat2: {
    min: 3,               // slimmer than 6–12
    max: 6,
    vw: "1vw",
    color: "#FAFBFD",
  },

  shadow: "0 10px 22px rgba(0,0,0,0.08)",
  sceneInsetShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
};

// ===== Birds (flying flocks) =====
export const BIRDS = {
  activity: 0.45,   // raise/lower number of flocks & speed (0..1)
};

// ===== Beam flash on refresh =====
export const BEAM_FLASH = {
  enable: true,
  durationMs: 1600, // total time for sweep + glow
  delayMs: 50,      // small delay after mount
  beamColor: "rgba(255, 247, 180, 0.70)",
  beamWidthDeg: 34, // slightly wider than normal sweep
  glowColor: "rgba(255, 247, 180, 0.95)",
  glowSpreadPx: 24, // logo glow thickness
  sweepSpanDeg: 52, // span of rotation around the target angle
};

// ===== INNOVUE text fill area (scene coordinates) =====
export const INNOVUE_FILL = {
  enable: true,
  left: 86,
  top: 72,
  width: 170,
  height: 54,
  radius: 10,
  color: "rgba(255, 247, 180, 0.45)",
  blurPx: 1.2,
  opacity: 0.0,      // start opacity (do not change)
  peakOpacity: 0.85, // brightest at mid sweep
};

// ===== Weather defaults =====
// For clouds right now, keep mode: "manual" + condition: "cloudy".
// To switch back to LIVE later, change mode to "auto" (ZIP is set to 20006).
export const WEATHER = {
  enable: true,
  mode: "manual" as "auto" | "manual",
  zip: "20006",
  condition: "cloudy" as "clear" | "cloudy" | "rain" | "thunder" | "fog",
  intensity: 0.7,
};