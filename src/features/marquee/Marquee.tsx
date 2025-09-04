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

// Mock feed (replace later with live data)
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

const METRICS = [
  { label: "Mentions",     val: 27, color: "#60a5fa" },
  { label: "New Reviews",  val: 5,  color: "#60a5fa" },
  { label: "Links Clicked",val: 92, color: "#22c55e" },
];

const Marquee: React.FC = () => {
  const [active, setActive] = useState<SourceKey>("social");
  const feed = MOCK_FEED[active] ?? [];
  const ticker = useMemo(() => (feed.length ? feed.join("  •  ") : ""), [feed]);

  const [paused, setPaused] = useState(false);
  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);

  // ——— Styles ———
  const styles = {
    card: {
      border: "1px solid #E1E2E6",
      borderRadius: 16,
      background: "#FFFFFF",
      boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
      padding: 12,            // a bit tighter
      marginTop: 10,
      position: "relative" as const,
      overflow: "hidden" as const,
      pointerEvents: "auto" as const,
    },

    // Header: left (title + tabs) and right (brand)
    header: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      gap: 10,
    },
    leftHeader: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap" as const,
    },
    liveDot: {
      width: 8, height: 8, borderRadius: 999, background: "#22c55e",
      boxShadow: "0 0 0 2px rgba(0,0,0,0.04)",
    },
    headerTitle: { fontWeight: 800 as const, color: "#0f172a", letterSpacing: 0.3 },
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

    // Right: brand chip (bigger, halo), positioned to feel centered between A/P and edge
    brandArea: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "flex-end",
      minWidth: 84, // gives visual breathing room relative to tabs
    },
    brandChip: {
      display: "inline-grid",
      placeItems: "center",
      width: 44, height: 44,   // bigger chip
      borderRadius: 999,
      background: "#FFFFFF",
      border: "1px solid #E1E2E6",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      position: "relative" as const,
    },
    brandImg: {
      width: 40, height: 40, objectFit: "contain" as const, borderRadius: "50%", zIndex: 1,
    },
    brandHalo: {
      position: "absolute" as const,
      inset: -6, borderRadius: 999,
      background: "radial-gradient(circle at center, rgba(255,247,180,0.55) 0%, rgba(255,247,180,0.12) 55%, rgba(255,247,180,0) 75%)",
      filter: "blur(8px)", animation: "brandPulse 6s ease-in-out infinite", zIndex: 0,
    },

    // Divider under header
    divider: {
      marginTop: 10, marginBottom: 10, height: 1, background: "#E1E2E6",
    },

    // Ticker band (inner bg matches bottom bar)
    band: {
      border: "1px solid #E1E2E6",
      borderRadius: 12,
      background: "#dde2ea",  // bottom bar grey
      padding: 8,
      position: "relative" as const,
      overflow: "hidden" as const,
    },
    tickerWrap: { position: "relative" as const, overflow: "hidden" as const },
    tickerPill: {
      display: "inline-block", whiteSpace: "nowrap" as const, minWidth: "100%",
      border: "1px solid #E1E2E6", borderRadius: 10,
      background: "rgba(120,200,255,0.55)", // front-wave color
      color: "#0b2540", fontWeight: 700, letterSpacing: 0.2,
      padding: "8px 12px",
      animation: `marquee 22s linear infinite`,
      animationPlayState: paused ? "paused" : ("running" as const),
      boxShadow: "inset 0 1px 0 rgba(255,255,255,.6)",
    },
    fadeLeft: {
      position: "absolute" as const, top: 0, bottom: 0, left: 0, width: 16,
      pointerEvents: "none" as const,
      background: "linear-gradient(90deg, #dde2ea 50%, rgba(221,226,234,0) 100%)",
    },
    fadeRight: {
      position: "absolute" as const, top: 0, bottom: 0, right: 0, width: 16,
      pointerEvents: "none" as const,
      background: "linear-gradient(270deg, #dde2ea 50%, rgba(221,226,234,0) 100%)",
    },

    // Metrics row
    metricsRow: {
      marginTop: 8, display: "flex", alignItems: "center",
      justifyContent: "center" as const, gap: 8, flexWrap: "wrap" as const,
    },
    metric: (color: string) => ({
      height: 28, display: "inline-flex", alignItems: "center",
      gap: 8, padding: "0 12px",
      border: "1px solid #E1E2E6", borderRadius: 999,
      background: "#FFFFFF", color: "#334155", fontWeight: 700, fontSize: 12,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }),
    metricDot: (color: string) => ({
      width: 5, height: 5, borderRadius: 999,
      background: color, boxShadow: "0 0 0 2px rgba(0,0,0,0.04)",
    }),
  };

  return (
    <section style={styles.card}>
      {/* Header */}
      <div style={styles.header as React.CSSProperties}>
        <div style={styles.leftHeader as React.CSSProperties}>
          <span style={styles.liveDot} />
          <span style={styles.headerTitle}>GCDC Live Feed</span>

          {/* Tabs on a single line incl. A/P */}
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

        {/* GCDC brand chip (bigger, halo, non-clickable) */}
        <div style={styles.brandArea as React.CSSProperties}>
          <div style={styles.brandChip as React.CSSProperties}>
            <div style={styles.brandHalo as React.CSSProperties} />
            <img src="/logos/gcdclogo.png" alt="GCDC" style={styles.brandImg as React.CSSProperties} />
          </div>
        </div>
      </div>

      {/* subtle divider */}
      <div style={styles.divider as React.CSSProperties} />

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
        @keyframes brandPulse {
          0%, 100% { transform: scale(0.98); opacity: 0.55; }
          50%      { transform: scale(1.04); opacity: 0.85; }
        }
        @keyframes marquee {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
      `}</style>
    </section>
  );
};

export default Marquee;