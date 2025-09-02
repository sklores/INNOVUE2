// src/components/topbar/SelectorsBar.tsx
import React, { useState } from "react";

/**
 * Overlapping control bar:
 * - Sits just below the scenic frame, overlapping by ~24px
 * - Refresh button fires a global "innovue:refresh" event
 * - Day active; Week/Month present (disabled for now)
 */
const SelectorsBar: React.FC = () => {
  const [range, setRange] = useState<"day" | "week" | "month">("day");

  const fireRefresh = () => {
    // Fire a global event TopBarShell listens to (to trigger the lighthouse flash)
    window.dispatchEvent(new Event("innovue:refresh"));
  };

  const btn = (key: "day" | "week" | "month", label: string, disabled?: boolean) => {
    const active = range === key;
    return (
      <button
        onClick={() => !disabled && setRange(key)}
        disabled={!!disabled}
        className={
          "sel-tab" +
          (active ? " sel-tab--active" : "") +
          (disabled ? " sel-tab--disabled" : "")
        }
        aria-pressed={active}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="selectors-wrap">
      <div className="selectors-bar">
        <button className="sel-refresh" onClick={fireRefresh} title="Refresh">
          <span className="sel-refresh-icon" aria-hidden>⟳</span>
          <span className="sel-refresh-label">Refresh</span>
        </button>

        <div className="sel-spacer" />

        <div className="sel-tabs">
          {btn("day", "Day")}
          {btn("week", "Week", true)}
          {btn("month", "Month", true)}
        </div>
      </div>
    </div>
  );
};

export default SelectorsBar;