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
  
  // SUN tuning (unchanged unless you want to tweak)
  export const SUN = {
    size: 36,
    raysCount: 12,
    spinSeconds: 8,
    rayLengthScale: 0.8,
    offsetX: -28,
    offsetY: 12,
  };
  
  // 🔧 FRAME (double-mat “gallery” style)
  // Thickness uses CSS clamp(min, vw, max) so it scales with phone width.
  export const FRAME = {
    strokeColor: "#E6EBF3",
    strokeWidth: 1,             // outer hairline
    outerRadius: 16,            // outermost corner radius
    innerRadius: 12,            // radius for the scene inside the mats
  
    // First (outer) mat
    mat1: {
      min: 8,                   // px
      max: 16,                  // px
      vw: "3vw",                // responsive middle term
      color: "#FFFFFF",
      insetHighlight: "rgba(255,255,255,0.7)", // subtle top highlight
    },
  
    // Second (inner) mat
    mat2: {
      min: 6,
      max: 12,
      vw: "2.2vw",
      color: "#FAFBFD",
    },
  
    // Soft outer shadow for the whole frame
    shadow: "0 10px 22px rgba(0,0,0,0.08)",
    // Optional very light inner bevel on the scene edge
    sceneInsetShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
  };