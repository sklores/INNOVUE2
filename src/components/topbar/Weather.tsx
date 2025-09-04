// src/components/topbar/Weather.tsx
import React, { useMemo } from "react";

export type Condition = "clear" | "cloudy" | "rain" | "thunder" | "fog";

type Props = {
  condition?: Condition;
  intensity?: number;    // 0..1 (density / strength)
  reducedMotion?: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * PuffyCloud
 * - Clean soft cloud: slight blur + radial gradient (no merging/goo filter)
 */
const PuffyCloud: React.FC<{
  xPctStart: number;     // starting left position in %
  yPx: number;           // top position in px
  scale: number;         // 0.9..1.5
  hue: number;           // 0=day (blue-white), 1=night (cool-grey)
  driftSec: number;      // duration to cross the screen
  delay: number;         // animation delay (s)
}> = ({ xPctStart, yPx, scale, hue, driftSec, delay }) => {
  const w = 160 * scale;
  const h = 70 * scale;

  const topCol   = `rgba(${Math.round(255 - 30*hue)}, ${Math.round(255 - 35*hue)}, ${Math.round(255 - 55*hue)}, 0.96)`;
  const midCol   = `rgba(${Math.round(245 - 45*hue)}, ${Math.round(250 - 50*hue)}, ${Math.round(255 - 60*hue)}, 0.96)`;

  const id = useMemo(() => `cfill_${Math.random().toString(36).slice(2)}`, []);

  return (
    <div
      style={{
        position: "absolute",
        top: yPx,
        left: `${xPctStart}%`,
        width: w,
        height: h,
        transform: "translateX(-50%)",
        animation: `cloud-x ${driftSec}s linear ${delay}s infinite`,
        filter: "blur(0.3px) drop-shadow(0 2px 1px rgba(0,0,0,0.06))",
        pointerEvents: "none",
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id={id} cx="40%" cy="30%" r="80%">
            <stop offset="0%"  stopColor={topCol} />
            <stop offset="60%" stopColor={midCol} />
            <stop offset="100%" stopColor={midCol} />
          </radialGradient>
        </defs>

        {/* three ellipses fused visually (no filter → no cross-cloud merging) */}
        <g fill={`url(#${id})`}>
          <ellipse cx={w*0.35} cy={h*0.45} rx={w*0.22} ry={h*0.35}/>
          <ellipse cx={w*0.55} cy={h*0.40} rx={w*0.25} ry={h*0.38}/>
          <ellipse cx={w*0.75} cy={h*0.48} rx={w*0.20} ry={h*0.32}/>
        </g>
      </svg>

      <style>{`
        @keyframes cloud-x {
          0%   { transform: translate(-50%, 0) }
          100% { transform: translate(calc(100vw + 50%), 0) } /* traverse full viewport width */
        }
      `}</style>
    </div>
  );
};

const Weather: React.FC<Props> = ({
  condition = "clear",
  intensity = 0.6,
  reducedMotion,
}) => {
  const t = clamp01(intensity);
  if (condition === "clear") return null;

  // Replace with a real phase if you have it; neutral for now.
  const isNight = false;
  const hue = isNight ? 1 : 0;

  // Cloud count logic: always 2, and 3 only when intensity high
  const baseCount = 2;
  const allowThird = t > 0.75 ? 1 : 0; // add one more when really dense
  const total = baseCount + allowThird; // 2..3

  // placement helpers
  const pick = (min: number, max: number) => min + Math.random() * (max - min);
  const MIN_DX = 18; // stronger spacing so clouds never clump

  // Regions (in % of scene width)
  const LH_MIN = 6;   // lighthouse band (far left)
  const LH_MAX = 24;
  const MID_MIN = 22;
  const MID_MAX = 60;
  const RIGHT_CAP = 72; // keep away from extreme right (moon area)

  const clouds = useMemo(() => {
    const arr: {
      xStart: number;
      y: number;
      sc: number;
      drift: number;
      delay: number;
    }[] = [];

    // seed one cloud over the lighthouse band (guaranteed left coverage)
    const firstX = pick(LH_MIN, LH_MAX);
    arr.push({
      xStart: firstX - 50, // start off-screen left to traverse entire width
      y: 12 + Math.random() * 10,
      sc: 1.0 + Math.random() * 0.4,
      drift: (28 + Math.random() * 10) * (reducedMotion ? 1.6 : 1),
      delay: -Math.random() * 10,
    });

    // place remaining clouds with left bias and spacing guard
    while (arr.length < total) {
      let candidate = pick(MID_MIN, RIGHT_CAP);
      // enforce spacing from existing
      let tries = 0;
      while (tries < 10) {
        const tooClose = arr.some(c => Math.abs(c.xStart - candidate) < MIN_DX);
        if (!tooClose) break;
        candidate -= 4 + Math.random() * 6; // nudge left
        candidate = Math.max(LH_MIN, Math.min(candidate, RIGHT_CAP));
        tries++;
      }
      arr.push({
        xStart: candidate - 50,
        y: 12 + Math.random() * 10,
        sc: 1.0 + Math.random() * 0.4,
        drift: (28 + Math.random() * 10) * (reducedMotion ? 1.6 : 1),
        delay: -Math.random() * 10,
      });
    }

    return arr;
  }, [total, reducedMotion]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* CLOUDS for cloudy / rain / thunder */}
      {(condition === "cloudy" || condition === "rain" || condition === "thunder") && (
        <>
          {clouds.map((c, i) => (
            <PuffyCloud
              key={i}
              xPctStart={c.xStart}
              yPx={c.y}
              scale={c.sc}
              hue={hue}
              driftSec={c.drift}
              delay={c.delay}
            />
          ))}
        </>
      )}

      {/* RAIN (streaks) */}
      {(condition === "rain" || condition === "thunder") && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.9 }}>
          {Array.from({ length: 18 + Math.round(16 * t) }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const speed = (1.25 - t * 0.35) * (reducedMotion ? 1.6 : 1);
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: -10,
                  width: 1.5,
                  height: 12 + t * 8,
                  background: "rgba(155,185,215,0.95)",
                  transform: "rotate(10deg)",
                  animation: `wx-rain ${speed}s linear ${delay}s infinite`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* THUNDER FLASH */}
      {condition === "thunder" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 28% 18%, rgba(255,255,210,0.55), transparent 40%)",
            mixBlendMode: "screen",
            opacity: 0,
            animation: "wx-flash 4.6s ease-in-out infinite",
          }}
        />
      )}

      {/* FOG */}
      {condition === "fog" && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 10,
              height: 36 + t * 10,
              background:
                "linear-gradient(180deg, rgba(230,238,245,0.85), rgba(230,238,245,0.3))",
              filter: "blur(1px)",
              animation: `wx-fog ${18 * (reducedMotion ? 1.4 : 1)}s ease-in-out infinite`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 26,
              height: 24 + t * 8,
              background:
                "linear-gradient(180deg, rgba(230,238,245,0.65), rgba(230,238,245,0.2))",
              filter: "blur(1px)",
              animation: `wx-fog ${22 * (reducedMotion ? 1.4 : 1)}s ease-in-out -4s infinite`,
            }}
          />
        </>
      )}

      <style>{`
        @keyframes wx-rain  {
          0% { transform: translateY(-10px) rotate(10deg); opacity: .95 }
          100% { transform: translateY(120px) rotate(10deg); opacity: .2 }
        }
        @keyframes wx-flash { 0%,88%,100% { opacity: 0 } 90% { opacity: .85 } 92% { opacity: 0 } 94% { opacity: .65 } 96% { opacity: 0 } }
        @keyframes wx-fog   { 0%,100% { transform: translateX(0) } 50% { transform: translateX(16px) } }
      `}</style>
    </div>
  );
};

export default Weather;