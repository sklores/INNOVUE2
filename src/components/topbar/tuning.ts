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
  
  // SUN knobs (already in use)
  export const SUN = {
    size: 36,
    raysCount: 12,
    spinSeconds: 8,
    rayLengthScale: 0.8,
    offsetX: -28,
    offsetY: 12,
  };
  
  // ===== NEW: Lighthouse (left) =====
  export const LIGHTHOUSE = {
    imgSrc: "/logos/innovuegrey.png", // existing file in /public/logos
    height: 76,        // px height of the tower image
    offsetLeft: 14,    // px from LEFT edge of scene
    offsetBottom: 10,  // px from BOTTOM edge of scene
  
    // rotating beam
    beamOn: true,
    beamSweepSeconds: 6,        // lower = faster sweep
    beamWidthDeg: 26,           // angular width of the bright wedge
    beamColor: "rgba(255,255,180,0.65)",
    beamBlurPx: 1.2,
  };
  
  // ===== NEW: Center badge (GCDC) =====
  export const BADGE = {
    imgSrc: "/logos/gcdclogo.png", // existing file in /public/logos
    size: 72,          // circle diameter (px)
    offsetTop: 10,     // px from TOP edge of scene (centered horizontally)
    // ring / background styling
    showRing: true,
    ringColor: "#cfd9ea",
    ringWidth: 2,
    background: "radial-gradient(#ffffff 0%, #eef5ff 70%)",
    textFallback: "GCDC", // used only if img is missing
  };