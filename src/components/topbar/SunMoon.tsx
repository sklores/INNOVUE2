import React, { useMemo } from "react";

/**
 * SunMoon
 * - Animated sun (rotating rays) for daytime
 * - Animated moon (gentle float) + tiny twinkles for nighttime
 * Show exactly ONE based on `mode` or local time.
 */
type Props = {
  size?: number;                 // px
  mode?: "auto" | "day" | "night";
  sunriseHour?: number;          // local 24h
  sunsetHour?: number;           // local 24h
  className?: string;
};

const SunMoon: React.FC<Props> = ({
  size = 36,
  mode = "auto",
  sunriseHour = 6,
  sunsetHour = 18,
  className = "",
}) => {
  const isDay = useMemo(() => {
    if (mode !== "auto") return mode === "day";
    const h = new Date().getHours();
    return h >= sunriseHour && h < sunsetHour;
  }, [mode, sunriseHour, sunsetHour]);

  // inline styles so this file is drop-in without extra CSS imports
  const commonWrap: React.CSSProperties = {
    width: size,
    height: size,
    position: "relative",
  };

  if (isDay) {
    return (
      <div className={`iv-sun ${className}`} style={commonWrap}>
        {/* core */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(#fff9b1 0%, #ffd66e 60%, #ffbd3c 100%)",
          boxShadow: "0 0 10px rgba(255, 200, 70, 0.7)",
        }}/>
        {/* rays */}
        <div style={{
          position: "absolute", inset: 0,
          animation: "iv-spin 8s linear infinite",
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{
              position: "absolute",
              left: "50%", top: "50%",
              width: 2, height: size * 0.55,
              transformOrigin: "center calc(-" + size * 0.1 + "px)",
              transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
              background: "linear-gradient(to bottom, rgba(255,205,90,.0) 0%, rgba(255,205,90,.95) 75%)",
              borderRadius: 1
            }}/>
          ))}
        </div>

        <style>{`
          @keyframes iv-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // night
  return (
    <div className={`iv-moon ${className}`} style={commonWrap}>
      {/* moon base */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "50%",
        background: "radial-gradient(#dfe9f6 0%, #b9c6dd 60%, #93a3c1 100%)",
        transform: "translateY(0)",
        animation: "iv-float 4s ease-in-out infinite",
      }}/>
      {/* crescent cutout */}
      <div style={{
        position: "absolute",
        right: size * 0.08, top: size * 0.08,
        width: size * 0.9, height: size * 0.9,
        borderRadius: "50%",
        background: "linear-gradient(#87a0c5, #87a0c5)",
        filter: "blur(0.2px)",
      }}/>
      {/* tiny twinkles */}
      {Array.from({ length: 4 }).map((_, i) => {
        const left = [8, 2, 22, 28][i] / 36 * size;
        const top  = [2, 18, 6, 22][i] / 36 * size;
        const delay = i * 0.6;
        return (
          <span key={i} style={{
            position: "absolute",
            left, top,
            width: 2, height: 2,
            borderRadius: "50%",
            background: "white",
            opacity: 0.8,
            animation: `iv-twinkle 2.4s ease-in-out ${delay}s infinite`,
          }}/>
        );
      })}

      <style>{`
        @keyframes iv-float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes iv-twinkle {
          0%,100% { opacity: .2; transform: scale(0.8); }
          50% { opacity: .9; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SunMoon;