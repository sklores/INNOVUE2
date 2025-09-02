// src/tuning.ts
// Centralized values for UI tweaking — easy to change without touching components

// TopBar settings
export const TOPBAR_HEIGHT = 100; // px
export const LOGO_SIZE = 48;      // px
export const SUN_SIZE = 32;       // px
export const MARGIN = "8px 16px"; // CSS shorthand (top/bottom left/right)

// Animation speeds (ms or px/sec)
export const SUN_ANIMATION_SPEED = 2000; // ms for transition
export const CLOUD_SPEED = 40;           // px/sec if clouds added

// Colors
export const SKY_DAY = "linear-gradient(to top, #87ceeb, #f0f8ff)"; // blue daytime
export const SKY_NIGHT = "linear-gradient(to top, #0b2540, #2a2c34)"; // dark night
export const SUN_COLOR = "#FFD700";   // gold
export const MOON_COLOR = "#F5F3CE";  // pale yellow

// Optional toggles
export const DEBUG_OUTLINES = false;  // draw borders for layout debugging