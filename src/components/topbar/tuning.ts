// Central knobs for the scenic Top Bar.
// Tweak here, not inside components.

export const TOPBAR = {
    width: 360,         // fixed painting width (px)
    height: 130,        // fixed painting height (px)
    paddingX: 12,
    cornerRadius: 12,
  };
  
  // Time-of-day
  export const TIME = {
    sunriseHour: 6,
    sunsetHour: 18,
  };
  
  // Sky
  export const SKY = {
    nightStarsCount: 25,
  };
  
  // Clouds
  export const CLOUDS = {
    density: 2,              // 0..5 (how many cloud groups)
    baseSpeedSec: 26,        // drift duration
    varianceSec: 8,
    opacity: 0.9,
  };
  
  // Birds (linked to Labor KPI)
  export const BIRDS = {
    minFlocks: 0,
    maxFlocks: 3,
    baseSpeedSec: 10,
    varianceSec: 4,
  };
  
  // Waves (linked to Sales KPI)
  export const WAVES = {
    baseHeight: 6,          // px amplitude at 0 score
    maxExtraHeight: 12,     // added amplitude at 100 score
    speedSec: 5,
  };
  
  // Lighthouse
  export const LIGHTHOUSE = {
    imgSrc: "/logo/innovuegrey.png",
    leftOffset: 14,       // px from left
    bottomOffset: 6,      // px from bottom
    height: 72,           // px
    beamSweepSec: 5,      // rotation duration
    beamWidthDeg: 22,
    beamColor: "rgba(255, 255, 180, 0.65)",
  };