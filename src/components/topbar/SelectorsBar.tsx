// src/components/topbar/SelectorsBar.tsx
import React, { useState } from "react";

/**
 * Centered Day/Week/Month + Refresh group
 * Overlaps the scenic frame by ~24px (see CSS).
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
        onClick={() => !disabled && setRange(value)}
        disabled={!!disabled}
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
          <button className="sel-refresh" onClick={fireRefresh}>
            <span className="sel-refresh-label">Refresh</span>
            <span className="sel-refresh-icon" aria-hidden>⟳</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectorsBar;