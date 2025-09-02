// src/components/topbar/TopBarShell.tsx
import "../../styles/topbar.css";
import {
  TOPBAR_HEIGHT,
  LOGO_SIZE,
  MARGIN,
  SKY_DAY,
  SKY_NIGHT,
} from "./tuning";
import SunMoon from "./SunMoon";

function isDay(now = new Date()) {
  const h = now.getHours();
  return h >= 6 && h < 18;
}

export default function TopBarShell() {
  const day = isDay();
  const bg = day ? SKY_DAY : SKY_NIGHT;

  return (
    <header
      className="topbar"
      style={{ height: TOPBAR_HEIGHT, padding: MARGIN, background: bg }}
      aria-label="Scenic top bar"
    >
      {/* Left: lighthouse/logo */}
      <div className="topbar-logo">
        <img
          src="/logos/innovuegrey.png"
          alt="Innovue Logo"
          style={{ height: LOGO_SIZE, width: "auto", objectFit: "contain" }}
        />
      </div>

      {/* Center stage (future layers/weather) */}
      <div className="topbar-sky" />

      {/* Right: Sun/Moon component */}
      <div className="topbar-corner">
        <SunMoon />
      </div>
    </header>
  );
}