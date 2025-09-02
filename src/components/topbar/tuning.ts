// src/components/topbar/tuning.ts

// Fixed-size "painting" for mobile dashboard
export const TOPBAR = {
    width: 360,
    height: 220,  // adjust to taste
    radius: 12,
  };
  
  // Local time window for day/night
  export const TIME = {
    sunriseHour: 6,
    sunsetHour: 18,
  };
  
  // 🔧 Sun tuning knobs (defaults)
  export const SUN = {
    size: 46,           // px diameter of the sun core
    raysCount: 10,      // how many rays around the sun
    spinSeconds: 8,     // how long for a full rotation (lower = faster)
    rayLengthScale: 0.80, // 0..1 proportion of size used for ray length
    offsetX: 0,         // px: + moves RIGHT (applied in TopBarShell)
    offsetY: 2,         // px: + moves DOWN  (applied in TopBarShell)
  };