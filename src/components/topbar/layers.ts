// Visual stacking order (back -> front)
export const Z = {
    SKY: 1,
    SUNMOON: 2,
    CLOUDS: 3,
    BIRDS: 4,
    WAVES: 5,
    LIGHTHOUSE: 6,
    UI_TOP: 10,
  };
  
  // Simple helpers
  export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
  export const to0_100 = (n: number) => Math.max(0, Math.min(100, n));