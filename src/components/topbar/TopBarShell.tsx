// src/components/topbar/TopBarShell.tsx
import "../../styles/topbar.css";                 // styles live at src/styles/topbar.css
import { TOPBAR_HEIGHT, LOGO_SIZE, SUN_SIZE, MARGIN, SKY_DAY } from "./tuning"; // tuning is in the same folder

export default function TopBarShell() {
  return (
    <header
      className="topbar"
      style={{
        height: TOPBAR_HEIGHT,
        padding: MARGIN,
        // we can drive background from tuning (override the CSS gradient if desired)
        background: SKY_DAY,
      }}
      aria-label="Scenic top bar"
    >
      {/* Left: Logo (your lighthouse) */}
      <div className="topbar-logo">
        <img
          src="/logo/innovuegrey.png"
          alt="Innovue Logo"
          style={{ height: LOGO_SIZE, width: "auto", objectFit: "contain" }}
        />
      </div>

      {/* Center: sky area (we'll add layers/animations later) */}
      <div className="topbar-sky">
        {/* keep empty or a small label while we wire sync later */}
      </div>

      {/* Right: Sun/Moon placeholder (will be time/weather-driven) */}
      <div className="topbar-corner" style={{ width: SUN_SIZE, height: SUN_SIZE }}>
        <span role="img" aria-label="sun" style={{ fontSize: SUN_SIZE * 0.9 }}>
          ☀️
        </span>
      </div>
    </header>
  );
}