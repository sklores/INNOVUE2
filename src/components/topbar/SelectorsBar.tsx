// src/components/topbar/SelectorsBar.tsx
import React, { useState } from "react";

/**
 * Centered Day / Week / Month + Refresh
 * Overlaps the scenic frame by ~24px (styled in CSS).
 */
const SelectorsBar: React.FC = () => {
  const [range, setRange] = useState<"day" | "week" | "month">("day");

  const fireRefresh = () => {
    window.dispatchEvent(new Event("innovue:refresh"));
  };

  const Tab = ({
    value,
    label,
    disabled,
  }: {
    value: "day" | "week" | "month";
    label: string;
    disabled?: boolean;
  }) => {
    const active = range === value;
    return (
      <button
        className={
          "sel-tab" +
          (active ? " sel-tab--active" : "") +
          (disabled ? " sel-tab--disabled" : "")
        }
        aria-pressed={active}
        disabled={!!disabled}
        onClick={() => !disabled && setRange(value)}
        type="button"
      >
        {label}
      </button>
    );
  };

  return (
    <div className="selectors-wrap">
      <div className="selectors-bar selectors-bar--centered">
        <div className="sel-group">
          <Tab value="day" label="Day" />
          <Tab value="week" label="Week" disabled />
          <Tab value="month" label="Month" disabled />

          <span className="sel-divider" aria-hidden>·</span>

          <button className="sel-refresh" onClick={fireRefresh} type="button">
            <span className="sel-refresh-label">Refresh</span>
            <span className="sel-refresh-icon" aria-hidden>⟳</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectorsBar;