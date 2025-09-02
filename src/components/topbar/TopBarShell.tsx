import React from "react";
import SunMoon from "./SunMoon";
import "../../styles/topbar.css";

type Props = {
  leftLogoSrc?: string;           // e.g. /logos/innovue-mark.svg
  centerBadge?: React.ReactNode;  // e.g. <img src="/logos/gcdc-badge.svg" />
  mode?: "auto" | "day" | "night";
};

const TopBarShell: React.FC<Props> = ({
  leftLogoSrc = "/logos/innovue-mark.svg",
  centerBadge = <div className="gcdc-badge">GCDC</div>,
  mode = "auto",
}) => {
  return (
    <div className="topbar">
      {/* Left: lighthouse/brand mark */}
      <div className="topbar-logo">
        {leftLogoSrc ? <img src={leftLogoSrc} alt="Innovue" /> : null}
      </div>

      {/* Middle: sky strip with lighthouse + clouds + center badge */}
      <div className="topbar-sky">
        <div className="sky-paint" />
        <div className="lighthouse" />
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="center-badge-wrap">{centerBadge}</div>

        {/* Right corner: sun or moon (only one shows) */}
        <div className="topbar-corner">
          <SunMoon size={32} mode={mode} />
        </div>
      </div>
    </div>
  );
};

export default TopBarShell;