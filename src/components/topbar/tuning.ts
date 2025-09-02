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
  
  // SUN tuning
  // NOTE: offsetX is inverted because the sun is anchored to the RIGHT.
  // - To move LEFT: use a NEGATIVE offsetX (e.g., -28)
  // - To move RIGHT: use a POSITIVE offsetX
  // - To move DOWN: use a POSITIVE offsetY
  export const SUN = {
    size: 42,
    raysCount: 12,
    spinSeconds: 8,
    rayLengthScale: 0.80,
    offsetX: -28,  // ⬅️ move left (more negative = farther left)
    offsetY: 12,   // ⬅️ move down
  };