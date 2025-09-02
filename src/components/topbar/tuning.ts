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
    size: 36,
    raysCount: 12,
    spinSeconds: 8,
    rayLengthScale: 0.8,
    // NOTE: TopBarShell anchors the sun to the RIGHT & TOP.
    // offsetX: negative = move LEFT; positive = move RIGHT
    // offsetY: positive = move DOWN
    offsetX: -28,
    offsetY: 12,
  };
  
  // ===== Lighthouse (left) =====
  export const LIGHTHOUSE = {
    imgSrc: "/logos/innovuegrey.png", // file in /public/logos
    height: 76,        // px
    offsetLeft: 14,    // px from left edge of the scene
    offsetBottom: 10,  // px from bottom edge of the scene
  
    // rotating beam
    beamOn: true,
    beamSweepSeconds: 6,        // lower = faster
    beamWidthDeg: 26,           // angular width
    beamColor: "rgba(255,255,180,0.65)",
    beamBlurPx: 1.2,
  };
  
  // ===== Center badge (GCDC) =====
  export const BADGE = {
    imgSrc: "/logos/gcdclogo.png", // file in /public/logos
    size: 72,          // circle diameter (px)
    offsetTop: 10,     // px from top edge (horizontally centered)
    showRing: true,
    ringColor: "#cfd9ea",
    ringWidth: 2,
    background: "radial-gradient(#ffffff 0%, #eef5ff 70%)",
    textFallback: "GCDC",
  };
  
  // ===== Frame (double-mat gallery style) =====
  export const FRAME = {
    strokeColor: "#E6EBF3",
    strokeWidth: 1,      // outer hairline
    outerRadius: 16,     // outermost corner radius
    innerRadius: 12,     // inner scene corner radius
  
    // Outer mat
    mat1: {
      min: 8,            // px
      max: 16,           // px
      vw: "3vw",         // responsive term for clamp()
      color: "#FFFFFF",
    },
  
    // Inner mat
    mat2: {
      min: 6,
      max: 12,
      vw: "2.2vw",
      color: "#FAFBFD",
    },
  
    // Shadows
    shadow: "0 10px 22px rgba(0,0,0,0.08)",
    sceneInsetShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
  };