// src/components/topbar/SkyLayer.tsx
import React, { useMemo } from "react";
import { TIME } from "./tuning";

/**
 * SkyLayer with 4 phases by local time:
 * - Day
 * - Sunset (golden hour, before sunset)
 * - Dusk  (blue hour, after sunset)
 * - Night (stars)
 *
 * You can optionally add TIME.twilightBufferHours in tuning.ts to tweak window size.
 */
type Phase = "day" | "sunset" | "dusk" | "night";

const getPhase = (): Phase => {
  const nowH = new Date().getHours();
  const sunrise = TIME?.sunriseHour ?? 6;
  const sunset = TIME?.sunsetHour ?? 18;
  const buf = (TIME as any)?.twilightBufferHours ?? 1.2; // hours around sunset

  // windows (local):
  //   day:     between sunrise+buf and sunset-buf
  //   sunset:  [sunset-buf, sunset)
  //   dusk:    [sunset, sunset+buf]
  //   night:   otherwise
  if (nowH >= sunrise + buf && nowH < sunset - buf) return "day";
  if (nowH >= sunset - buf && nowH < sunset) return "sunset";
  if (nowH >= sunset && nowH < sunset + buf) return "dusk";
  return "night";
};

const SkyLayer: React.FC = () => {
  const phase = useMemo(getPhase, []);

  const background = useMemo(() => {
    switch (phase) {
      case "day":
        // soft blue midday
        return "linear-gradient(180deg, #aee0ff 0%, #cfeaff 55%, #eaf5ff 100%)";
      case "sunset":
        // warm golden hour
        return "linear-gradient(180deg, #FFD9A3 0%, #FFB86B 45%, #FF9A5C 70%, #F7816B 100%)";
      case "dusk":
        // cool violet-blue after sunset
        return "linear-gradient(180deg, #4A6FB9 0%, #385aa4 45%, #2D4C90 70%, #223B75 100%)";
      case "night":
      default:
        // deep navy night
        return "linear-gradient(180deg, #0D274D 0%, #1B3C66 60%, #264B7A 100%)";
    }
  }, [phase]);

  const vignette = useMemo(() => {
    // subtle vignette to add depth; warmer for sunset, cooler for dusk/night
    switch (phase) {
      case "sunset":
        return "radial-gradient(80% 70% at 50% 10%, rgba(255,220,160,0.25) 0%, rgba(255,180,120,0.12) 35%, rgba(0,0,0,0) 70%)";
      case "dusk":
        return "radial-gradient(80% 70% at 50% 10%, rgba(140,170,220,0.18) 0%, rgba(80,100,160,0.10) 35%, rgba(0,0,0,0) 70%)";
      case "night":
        return "radial-gradient(80% 70% at 50% 10%, rgba(140,170,220,0.10) 0%, rgba(0,0,0,0) 60%)";
      default:
        return "radial-gradient(80% 70% at 50% 10%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)";
    }
  }, [phase]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background,
        transition: "background 600ms ease",
      }}
    >
      {/* soft vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: vignette,
          pointerEvents: "none",
        }}
      />

      {/* night stars */}
      {phase === "night" && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 26 }).map((_, i) => {
            const left = Math.random() * 100;
            const top = 6 + Math.random() * 46;
            const size = Math.random() * 2 + 1;
            const delay = Math.random() * 2;
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.9)",
                  opacity: 0.8,
                  animation: `iv-twinkle 2.2s ease-in-out ${delay}s infinite`,
                }}
              />
            );
          })}
          <style>{`
            @keyframes iv-twinkle {
              0%,100% { opacity:.25; transform: scale(.85); }
              50%     { opacity:.95; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default SkyLayer;