// src/components/topbar/SunMoon.tsx
import { SUN_SIZE, SUN_COLOR, MOON_COLOR } from "./tuning";

// local-time day/night (simple for now; we’ll wire sync later)
function isDay(now = new Date()) {
  const h = now.getHours();
  return h >= 6 && h < 18;
}

export default function SunMoon() {
  const day = isDay();

  return (
    <div
      aria-label={day ? "Sun" : "Moon"}
      title={day ? "Day" : "Night"}
      style={{
        width: SUN_SIZE,
        height: SUN_SIZE,
        position: "relative",
      }}
    >
      <style>{`
        @keyframes sunPulse {
          0%   { transform: scale(1);   box-shadow: 0 0 12px rgba(255,211,110,0.75); }
          50%  { transform: scale(1.06); box-shadow: 0 0 22px rgba(255,211,110,0.85); }
          100% { transform: scale(1);   box-shadow: 0 0 12px rgba(255,211,110,0.75); }
        }
        @keyframes moonGlow {
          0%   { transform: translateY(0px);   box-shadow: 0 0 10px rgba(245,243,206,0.45); }
          50%  { transform: translateY(-1.5px); box-shadow: 0 0 16px rgba(245,243,206,0.65); }
          100% { transform: translateY(0px);   box-shadow: 0 0 10px rgba(245,243,206,0.45); }
        }
      `}</style>

      {day ? (
        <div
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${SUN_COLOR}, #ffc947 60%, #f6a83b 100%)`,
            animation: "sunPulse 4.4s ease-in-out infinite",
          }}
        />
      ) : (
        <div
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `radial-gradient(circle at 40% 40%, ${MOON_COLOR}, #bfc8de 55%, #8ea0c6 100%)`,
            animation: "moonGlow 5.6s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}