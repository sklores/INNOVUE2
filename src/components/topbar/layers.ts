// src/components/topbar/layers.ts
// Layer stack (back → front) with simple flags
export type LayerId =
  | "SkyLayer"
  | "SunMoon"
  | "Lighthouse"
  | "LightBeam"
  | "Waves"
  | "Weather";

export const layers: { id: LayerId; visible: boolean }[] = [
  { id: "SkyLayer",   visible: true },
  { id: "SunMoon",    visible: true },
  { id: "Lighthouse", visible: true },
  { id: "LightBeam",  visible: true },
  { id: "Waves",      visible: true },
  { id: "Weather",    visible: true },
];