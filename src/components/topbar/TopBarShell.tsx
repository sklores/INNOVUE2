// src/components/topbar/TopBarShell.tsx
import "../../styles/topbar.css";
import { TOPBAR_HEIGHT, LOGO_SIZE } from "../../tuning";

export default function TopBarShell() {
  return (
    <header className="topbar" style={{ height: TOPBAR_HEIGHT }}>
      {/* Left: Logo */}
      <div className="topbar-logo">
        <img src="/logo/innovuegrey.png" alt="Innovue Logo" style={{ height: LOGO_SIZE }} />
      </div>

      {/* Center: Scenic Sky label (we’ll replace with layers later) */}
      <div className="topbar-sky">
        <span style={{ fontWeight: 600, color: "#444" }}>Scenic Overlook</span>
      </div>

      {/* Right: Sun/Moon (placeholder for now) */}
      <div className="topbar-corner" aria-label="Sun/Moon">☀️</div>
    </header>
  );
}