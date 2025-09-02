// src/components/topbar/tuning.ts

// Fixed-size "painting" for mobile dashboard
export const TOPBAR = {
    width: 360,
    height: 130,
    radius: 12, // <-- ensure this exists since TopBarShell reads it
  };
  
  // Local time window for day/night
  export const TIME = {
    sunriseHour: 6,
    sunsetHour: 18,
  };