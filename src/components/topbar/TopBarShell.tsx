import React from "react";
import "../../styles/topbar.css";
import { TOPBAR_HEIGHT, LOGO_SIZE } from "../../tuning";

export default function TopBarShell() {
  return (
    <header className="topbar" style={{ height: TOPBAR_HEIGHT }}>
      {/* Left: Logo */}
      <div className="topbar-logo">
        <img
          src="/logo/innovuegrey.png"
          alt="Innovue Logo"
          style={{ height: LOGO_SIZE }}
        />
      </div>

      {/* Center: Scenic Sky placeholder */}
      <div className="topbar-sky">
        {/* Later we’ll add animated clouds, waves, etc. */}
        <span style={{ fontWeight: 600, color: "#444" }}>Scenic Overlook</span>
      </div>

      {/* Right: Sun/Moon placeholder */}
      <div className="topbar-corner">
        {/* Later replaced by dynamic sun/moon */}
        <span role="img" aria-label="sun">
          ☀️
        </span>
      </div>
    </header>
  );
}