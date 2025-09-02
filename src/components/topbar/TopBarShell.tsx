import React from "react";
import SunMoon from "./SunMoon";
import "./topbar.css";

type Props = {
  leftLogoSrc?: string;     // e.g. /logos/innovue-mark.svg (lighthouse mark)
  centerBadge?: React.ReactNode; // GCDC badge component or <img>
  mode?: "auto" | "day" | "night"; // pass through to SunMoon
};

const TopBarShell: React.FC<Props> = ({
  leftLogoSrc = "/logos/innovue-mark.svg",
  centerBadge = <div className="gcdc-badge">GCDC</div>,
  mode = "auto",
}) => {
  return (
    <div className="topbar">
      {/* Left: small lighthouse mark */}
      <div className="topbar-logo">
        {leftLogoSrc ? <img src={leftLogoSrc} alt="Innovue" /> : null}
      </div>

      {/* Center sky scene with clouds & lighthouse silhouette & center badge */}
      <div className="topbar-sky">
        <div className="sky-paint" />
        <div className="lighthouse" />
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="center-badge-wrap">{centerBadge}</div>

        {/* Right corner: ONLY one shown via SunMoon */}
        <div className="topbar-corner">
          <SunMoon size={32} mode={mode} />
        </div>
      </div>
    </div>
  );
};

export default TopBarShell;