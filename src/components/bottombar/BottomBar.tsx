import React, { useMemo } from "react";
import { WEATHER } from "../../components/topbar/tuning";
// Adjust this import path if your hook lives elsewhere:
import { useWeather } from "../../components/topbar/useWeather";

type WxCond = "clear" | "cloudy" | "rain" | "thunder" | "fog";

const weatherIcon = (c: WxCond) => {
  switch (c) {
    case "clear":   return "☀︎";
    case "cloudy":  return "☁︎";
    case "rain":    return "🌧";
    case "thunder": return "⛈";
    case "fog":     return "🌫";
    default:        return "☁︎";
  }
};

const formatDate = () => {
  const now = new Date();
  return now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
};

// Try to read Fahrenheit from several common keys.
// If only Celsius exists, convert to F. If neither, return null.
const getTempF = (live: any): number | null => {
  const c =
    live?.tempC ?? live?.temperatureC ?? live?.temp_c ?? live?.temperature_c ??
    null;
  const f =
    live?.tempF ?? live?.temperatureF ?? live?.temp_f ?? live?.temperature_f ??
    null;

  if (typeof f === "number" && isFinite(f)) return Math.round(f);
  if (typeof c === "number" && isFinite(c)) return Math.round((c * 9) / 5 + 32);
  return null;
};

const BottomBar: React.FC = () => {
  // Live weather if auto mode; otherwise manual condition text
  const live = useWeather(WEATHER.enable && WEATHER.mode === "auto" ? WEATHER.zip : null);

  const condition: WxCond = useMemo(() => {
    if (!WEATHER.enable) return "clear";
    return (WEATHER.mode === "auto" ? (live?.condition ?? "clear") : WEATHER.condition) as WxCond;
  }, [live, WEATHER.enable, WEATHER.mode]);

  const tempF = useMemo(() => (WEATHER.mode === "auto" ? getTempF(live) : null), [live]);
  const date = formatDate();

  const fireRefresh = () => {
    window.dispatchEvent(new Event("innovue:refresh"));
  };

  // ===== Styles (scoped) =====
  const styles = {
    barWrap: {
      position: "fixed" as const,
      left: 0,
      right: 0,
      bottom: 0,
      // slightly darker than your page grey
      background: "#dde2ea",
      // minimal height; no outer padding so it goes full-width edge-to-edge
      padding: "8px 0 calc(8px + env(safe-area-inset-bottom))",
      boxShadow: "0 -4px 12px rgba(0,0,0,0.06)",
      zIndex: 60,
    },
    row: {
      // full-width inline container for pills; no side gutters
      display: "flex",
      alignItems: "center",
      gap: 8,
      // keep pills centered; if you prefer left-aligned, change to "flex-start"
      justifyContent: "center",
      // prevent the row from growing too tall
      minHeight: 40,
    },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 32,
      padding: "0 12px",
      border: "1px solid #E1E2E6",
      borderRadius: 999,
      background: "#FFFFFF",
      color: "#0f172a",
      fontWeight: 700 as const,
      fontSize: 12,
      letterSpacing: 0.2,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      whiteSpace: "nowrap" as const,
    },
    refreshBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 32,
      padding: "0 14px",
      border: "1px solid #E1E2E6",
      borderRadius: 999,
      background: "#eef4ff",
      color: "#17325d",
      fontWeight: 800 as const,
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
    },
    icon: { fontSize: 14, lineHeight: 1 },
    dot: (color: string) => ({
      width: 6,
      height: 6,
      borderRadius: 999,
      background: color,
      boxShadow: `0 0 0 2px rgba(0,0,0,0.04)`,
    }),
  };

  return (
    <div style={styles.barWrap}>
      <div style={styles.row}>
        {/* 1) Date */}
        <span style={styles.pill as React.CSSProperties}>{date}</span>

        {/* 2) Weather + Temp in one pill */}
        <span style={styles.pill as React.CSSProperties}>
          <span style={styles.icon} aria-hidden>{weatherIcon(condition)}</span>
          <span>
            {condition.charAt(0).toUpperCase() + condition.slice(1)}
            {" · "}
            {WEATHER.mode === "auto" ? (tempF != null ? `${tempF}°F` : "—°") : "—°"}
          </span>
        </span>

        {/* 3) API OK */}
        <span style={styles.pill as React.CSSProperties}>
          <span style={styles.dot("#22c55e")} />
          API&nbsp;OK
        </span>

        {/* 4) Refresh — on the same single line, far right look preserved by centering pills uniformly */}
        <button style={styles.refreshBtn as React.CSSProperties} onClick={fireRefresh}>
          <span>Refresh</span>
          <span style={styles.icon} aria-hidden>⟳</span>
        </button>
      </div>
    </div>
  );
};

export default BottomBar;