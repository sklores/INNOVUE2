// src/features/marquee/Marquee.tsx
import React, { useMemo, useState } from "react";

type SourceKey = "social" | "reviews" | "bank" | "news" | "ap";

const SOURCES: { key: SourceKey; label: string }[] = [
  { key: "social",  label: "Social"  },
  { key: "reviews", label: "Reviews" },
  { key: "bank",    label: "Bank"    },
  { key: "news",    label: "News"    },
  { key: "ap",      label: "A/P"     },
];

// Mock feed (replace with live data later)
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
  ap: [
    "A/P: Vendor payment #00482 queued",
    "A/P: Invoice #2029 due in 3 days",
  ],
};

// Small metrics row (optional)
const METRICS = [
  { label: "Mentions",      val: 27, dot: "#60a5fa" },
  { label: "New Reviews",   val: 5,  dot: "#60a5fa" },
  { label: "Links Clicked", val: 92, dot: "#22c55e" },
];

const Marquee: React.FC = () => {
  const [active, setActive] = useState<SourceKey>("social");
  const feed = MOCK_FEED[active] ?? [];
  const ticker = useMemo(() => (feed.length ? feed.join("  •  ") : ""), [feed]);

  // --- Styles (match KPI tiles; add consistent side padding) ---
  const styles = {
    card: {
      border: "1px solid #E1E2E6",
      borderRadius: 16,
      background: "#FFFFFF",
      boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
      padding: 14,            // same as KPI tiles
      marginTop: 12,
      position: "relative" as const,
      pointerEvents: "auto" as const,
    },

    // Top row: tabs + GCDC logo, all centered with breathing room
    centerRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center", // centered group
      gap: 10,
      flexWrap: "wrap" as const,
      paddingInline: 12,        // same side padding feel as KPI tiles
      marginBottom: 10,
    },

    // Tabs in one line; if too small, they can scroll horizontally
    tabs: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      whiteSpace: "nowrap" as const,
      overflowX: "auto" as const,
      scrollbarWidth: "none" as const,
      msOverflowStyle: "none" as const,
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

    // GCDC logo at top-right of the centered row (bigger chip), no animation
    brandChip: {
      width: 44,
      height: 44,
      borderRadius: 999,
      background: "#FFFFFF",
      border: "1px solid #E1E2E6",
      display: "grid",
      placeItems: "center",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    brandImg: { width: 40, height: 40, objectFit: "contain" as const, borderRadius: "50%" },

    // Ticker (static; manual scroll if long)
    tickerWrap: {
      border: "1px solid #E1E2E6",
      borderRadius: 12,
      background: "#FFFFFF",
      padding: 8,
      overflow: "hidden" as const,
    },
    tickerPill: {
      display: "inline-block",
      whiteSpace: "nowrap" as const,
      minWidth: "100%",
      border: "1px solid #E1E2E6",
      borderRadius: 10,
      background: "rgba(120,200,255,0.55)",  // front-wave color
      color: "#0b2540",
      fontWeight: 700,
      letterSpacing: 0.2,
      padding: "8px 12px",
    },

    // Metrics row (centered)
    metricsRow: {
      marginTop: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center" as const,
      gap: 8,
      flexWrap: "wrap" as const,
    },
    metric: {
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
    },
    metricDot: (color: string) => ({
      width: 5, height: 5, borderRadius: 999, background: color,
      boxShadow: "0 0 0 2px rgba(0,0,0,0.04)",
    }),
  };

  return (
    <section style={styles.card}>
      {/* Centered top row: tabs + GCDC logo */}
      <div style={styles.centerRow as React.CSSProperties}>
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

        <div style={styles.brandChip as React.CSSProperties}>
          <img src="/logos/gcdclogo.png" alt="GCDC" style={styles.brandImg as React.CSSProperties} />
        </div>
      </div>

      {/* Ticker (static text; horizontally scrollable if long) */}
      <div style={styles.tickerWrap as React.CSSProperties}>
        <div style={styles.tickerPill as React.CSSProperties}>{ticker}</div>
      </div>

      {/* Metrics */}
      <div style={styles.metricsRow as React.CSSProperties}>
        {METRICS.map((m, i) => (
          <span key={i} style={styles.metric as React.CSSProperties}>
            <span style={styles.metricDot(m.dot)} />
            {m.label}: {m.val}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Marquee;