// src/features/marquee/Marquee.tsx
import React, { useMemo, useState } from "react";

type SourceKey = "social" | "reviews" | "bank" | "news";

const SOURCES: { key: SourceKey; label: string }[] = [
  { key: "social",  label: "Social"  },
  { key: "reviews", label: "Reviews" },
  { key: "bank",    label: "Bank"    },
  { key: "news",    label: "News"    },
];

// Mock feed items (replace with live data later)
const MOCK_FEED: Record<SourceKey, string[]> = {
  social: [
    "IG: Happy Grilled Cheese Day! 🧀🔥",
    "X: New menu drop this week — tell us your favorite!",
    "TikTok: Melt cam — that sizzle 🔥",
  ],
  reviews: [
    "Google ★★★★☆ — “Best grilled cheese in DC.”",
    "Yelp ★★★★★ — “Crispy edges, gooey center.”",
  ],
  bank: [
    "Stripe: Settled $1,240",
    "Bank: Payout scheduled Fri",
  ],
  news: [
    "Local: Food Truck Fest — we’ll be there!",
    "Industry: Artisan cheese makers up 3%",
  ],
};

const METRICS = [
  { label: "Mentions", val: 27, color: "#60a5fa" },
  { label: "New Reviews", val: 5, color: "#60a5fa" },
  { label: "Links Clicked", val: 92, color: "#22c55e" }, // replaced Bank Today
];

const Marquee: React.FC = () => {
  const [active, setActive] = useState<SourceKey>("social");
  const feed = MOCK_FEED[active] ?? [];

  // Flatten feed into a single long ticker string
  const ticker = useMemo(() => (feed.length ? feed.join("  •  ") : ""), [feed]);

  const [paused, setPaused] = useState(false);
  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);

  // Styles
  const styles = {
    // Outer widget: white bg + 1px border to match tiles; feels like a standalone module
    card: {
      border: "1px solid #E1E2E6",
      borderRadius: 16,
      background: "#FFFFFF",
      boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
      padding: 14,
      marginTop: 12,
      position: "relative" as const,
      overflow: "hidden" as const,
      pointerEvents: "auto" as const,
    },

    // Title row
    titleRow: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    leftTitle: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap" as const,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: "#22c55e",
      boxShadow: "0 0 0 2px rgba(0,0,0,0.04)",
    },
    titleText: { fontWeight: 800 as const, color: "#0f172a", letterSpacing: 0.3 },
    tabs: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap" as const,
    },
    tab: (activeTab: boolean) => ({
      height: 30,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 12px",
      borderRadius: 999,
      border: "1px solid #E1E2E6",
      background: activeTab ? "#FFFFFF" : "#F7F9FC",
      color: activeTab ? "#0f172a" : "#334155",
      fontWeight: 700,
      cursor: "pointer",
    }),

    // Right side: small brand mark
    rightBrand: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    },
    brandWrap: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: "#FFFFFF",
      border: "1px solid #E1E2E6",
      display: "grid",
      placeItems: "center",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    brandImg: { width: 18, height: 18, objectFit: "contain" as const },

    // Ticker container with inner band color equal to bottom bar grey
    band: {
      border: "1px solid #E1E2E6",
      borderRadius: 12,
      background: "#dde2ea", // same as bottom bar
      padding: 10,
      position: "relative" as const,
      overflow: "hidden" as const,
    },
    tickerWrap: {
      position: "relative" as const,
      overflow: "hidden" as const,
    },
    tickerPill: {
      display: "inline-block",
      whiteSpace: "nowrap" as const,
      minWidth: "100%",
      border: "1px solid #E1E2E6",
      borderRadius: 10,
      background: "rgba(120,200,255,0.55)", // front-wave color
      color: "#0b2540",
      fontWeight: 700,
      letterSpacing: 0.2,
      padding: "8px 12px",
      animation: `marquee 18s linear infinite`,
      animationPlayState: paused ? "paused" : ("running" as const),
    },
    fadeLeft: {
      position: "absolute" as const,
      top: 0, bottom: 0, left: 0, width: 24,
      pointerEvents: "none" as const,
      background: "linear-gradient(90deg, #dde2ea 50%, rgba(221,226,234,0) 100%)",
    },
    fadeRight: {
      position: "absolute" as const,
      top: 0, bottom: 0, right: 0, width: 24,
      pointerEvents: "none" as const,
      background: "linear-gradient(270deg, #dde2ea 50%, rgba(221,226,234,0) 100%)",
    },

    // Metrics row (centered)
    metricsRow: {
      marginTop: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center" as const,
      gap: 8,
      flexWrap: "wrap" as const,
    },
    metric: (bg: string) => ({
      height: 28,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "0 12px",
      border: "1px solid #E1E2E6",
      borderRadius: 999,
      background: "#FFFFFF",
      color: "#334155",
      fontWeight: 700,
      fontSize: 12,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }),
    metricDot: (color: string) => ({
      width: 6, height: 6, borderRadius: 999,
      background: color,
      boxShadow: "0 0 0 2px rgba(0,0,0,0.04)",
    }),
  };

  return (
    <section style={styles.card}>
      {/* Header */}
      <div style={styles.titleRow as React.CSSProperties}>
        <div style={styles.leftTitle as React.CSSProperties}>
          <span style={styles.liveDot} />
          <span style={styles.titleText}>Live Feed</span>
          <div style={styles.tabs as React.CSSProperties}>
            {SOURCES.map(s => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                style={styles.tab(active === s.key) as React.CSSProperties}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brand mark */}
        <div style={styles.rightBrand as React.CSSProperties}>
          <div style={styles.brandWrap as React.CSSProperties}>
            <img src="/logos/gcdclogo.png" alt="GCDC" style={styles.brandImg as React.CSSProperties} />
          </div>
        </div>
      </div>

      {/* Ticker band */}
      <div
        style={styles.band as React.CSSProperties}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onTouchStart={onEnter}
        onTouchEnd={onLeave}
      >
        <div style={styles.tickerWrap as React.CSSProperties}>
          <span style={styles.tickerPill as React.CSSProperties}>
            {/* duplicate content to loop seamlessly */}
            {ticker} &nbsp;&nbsp; {ticker}
          </span>
          <div style={styles.fadeLeft} />
          <div style={styles.fadeRight} />
        </div>
      </div>

      {/* Metrics */}
      <div style={styles.metricsRow as React.CSSProperties}>
        {METRICS.map((m, i) => (
          <span key={i} style={styles.metric(m.color) as React.CSSProperties}>
            <span style={styles.metricDot(m.color)} />
            {m.label}: {m.val}
          </span>
        ))}
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
      `}</style>
    </section>
  );
};

export default Marquee;