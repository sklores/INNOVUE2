import React, { useMemo } from "react";
import { WEATHER } from "../../components/topbar/tuning";
// If your hook lives elsewhere, adjust this import path:
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

const formatDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return { date, time };
};

// Attempt to read temperature from the live weather hook with several common keys.
// If not present, returns null and we’ll render "—°".
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
  const live = useWeather(WEATHER.enable && WEATHER.mode === "auto" ? WEATHER.zip : null);

  const condition: WxCond = useMemo(() => {
    if (!WEATHER.enable) return "clear";
    return (WEATHER.mode === "auto" ? (live?.condition ?? "clear") : WEATHER.condition) as WxCond;
  }, [live, WEATHER.enable, WEATHER.mode]);

  const tempF = useMemo(() => (WEATHER.mode === "auto" ? getTempF(live) : null), [live]);
  const { date, time } = formatDateTime();

  const fireRefresh = () => {
    window.dispatchEvent(new Event("innovue:refresh"));
  };

  // restrained status strip (visual only; no actual wiring needed)
  const signals = [
    { label: "API",   state: "OK",   dot: "#22c55e" },
    { label: "Cache", state: "Warm", dot: "#60a5fa" },
  ];

  // ===== Styles (scoped) =====
  const styles = {
    // fixed container (anchored)
    fixedWrap: {
      position: "fixed" as const,
      left: 0,
      right: 0,
      bottom: 0,
      padding: "12px 12px calc(12px + env(safe-area-inset-bottom))",
      background: "transparent",
      zIndex: 50,
    },
    // inner card
    card: {
      border: "1px solid #E1E2E6",
      borderRadius: 12,
      background: "#FFFFFF",
      boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
      padding: 12,
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gridTemplateRows: "auto auto",
      gap: 8,
      alignItems: "center" as const,
      maxWidth: 560,
      margin: "0 auto",
    },
    row1: {
      gridColumn: "1 / 2",
      gridRow: "1 / 2",
      display: "flex",
      alignItems: "center",
      gap: 12,
      color: "#0f172a",
      fontWeight: 600,
      flexWrap: "wrap" as const,
    },
    row2: {
      gridColumn: "1 / 2",
      gridRow: "2 / 3",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      flexWrap: "wrap" as const,
    },
    refreshCol: {
      gridColumn: "2 / 3",
      gridRow: "1 / span 2",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    chip: {
      fontWeight: 600,
      fontSize: 12,
      color: "#334155",
      background: "#F7F9FC",
      border: "1px solid #E1E2E6",
      borderRadius: 10,
      padding: "6px 10px",
    },
    weather: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 700,
      color: "#0f172a",
    },
    dot: (color: string) => ({
      width: 6,
      height: 6,
      borderRadius: 999,
      background: color,
      boxShadow: `0 0 0 2px rgba(0,0,0,0.04)`,
    }),
    signalPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "#F7F9FC",
      border: "1px solid #E1E2E6",
      color: "#334155",
      borderRadius: 999,
      padding: "6px 10px",
      fontSize: 12,
      fontWeight: 600,
    },
    signalRow: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap" as const,
    },
    refreshBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 36,
      padding: "0 14px",
      border: "1px solid #E1E2E6",
      borderRadius: 8,
      background: "#eef4ff",
      color: "#17325d",
      fontWeight: 700 as const,
      cursor: "pointer",
      boxShadow: "0 6px 14px rgba(0,0,0,0.10), 0 1px 0 rgba(0,0,0,0.06)",
    },
    refreshIcon: { fontSize: 16, lineHeight: 1 },
  };

  return (
    <div style={styles.fixedWrap}>
      <div style={styles.card}>
        {/* Row 1: Date · Time · Weather (left) */}
        <div style={styles.row1}>
          <span style={styles.chip as React.CSSProperties}>{date}</span>
          <span style={styles.chip as React.CSSProperties}>{time}</span>

          <span style={styles.weather as React.CSSProperties}>
            <span aria-hidden>{weatherIcon(condition)}</span>
            <span style={{ fontWeight: 700, letterSpacing: 0.2 }}>
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
              {WEATHER.mode === "auto" ? (
                <> · {tempF != null ? `${tempF}°F` : "—°"}</>
              ) : null}
            </span>
          </span>
        </div>

        {/* Row 2: signals (left) */}
        <div style={styles.row2}>
          <div style={styles.signalRow as React.CSSProperties}>
            {signals.map((s, i) => (
              <span key={i} style={styles.signalPill as React.CSSProperties}>
                <span style={styles.dot(s.dot)} />
                {s.label}
                <span style={{ opacity: 0.8, marginLeft: 6 }}>{s.state}</span>
              </span>
            ))}
            {/* Last Sync as a compact pill */}
            <span style={styles.signalPill as React.CSSProperties}>
              <span style={styles.dot("#94a3b8")} />
              Last&nbsp;Sync
              <span style={{ opacity: 0.8, marginLeft: 6 }}>{time}</span>
            </span>
          </div>
        </div>

        {/* Right column: Refresh (spans both rows) */}
        <div style={styles.refreshCol}>
          <button style={styles.refreshBtn as React.CSSProperties} onClick={fireRefresh}>
            <span className="refresh-label">Refresh</span>
            <span style={styles.refreshIcon} aria-hidden>⟳</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;