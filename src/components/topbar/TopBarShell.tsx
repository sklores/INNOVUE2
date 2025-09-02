// src/components/topbar/TopBarShell.tsx
import "../../styles/topbar.css";
import {
  TOPBAR_HEIGHT,
  LOGO_SIZE,
  SUN_SIZE,
  MARGIN,
  SKY_DAY,
  SKY_NIGHT,
  SUN_COLOR,
  MOON_COLOR,
} from "./tuning";

function isDay(now = new Date()) {
  const h = now.getHours();
  return h >= 6 && h < 18;
}

export default function TopBarShell() {
  const day = isDay();
  const bg = day ? SKY_DAY : SKY_NIGHT;
  const orbColor = day ? SUN_COLOR : MOON_COLOR;
  const orbEmoji = day ? "☀️" : "🌙";

  return (
    <header
      className="topbar"
      style={{
        height: TOPBAR_HEIGHT,
        padding: MARGIN,
        background: bg,
      }}
      aria-label="Scenic top bar"
    >
      {/* Left: your lighthouse/logo (corrected path: /logos/… NOT /logo/…) */}
      <div className="topbar-logo">
        <img
          src="/logos/innovuegrey.png"
          alt="Innovue Logo"
          style={{ height: LOGO_SIZE, width: "auto", objectFit: "contain" }}
        />
      </div>

      {/* Center: sky stage (we’ll add layers later) */}
      <div className="topbar-sky" />

      {/* Right: time-aware sun/moon */}
      <div
        className="topbar-corner"
        aria-label={day ? "Sun" : "Moon"}
        title={day ? "Day" : "Night"}
        style={{
          width: SUN_SIZE,
          height: SUN_SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          background: orbColor,
          boxShadow: day
            ? "0 0 12px rgba(255,211,110,0.75)"
            : "0 0 8px rgba(245,243,206,0.65)",
          color: "#0b2540",
          fontSize: Math.round(SUN_SIZE * 0.7),
        }}
      >
        {orbEmoji}
      </div>
    </header>
  );
}