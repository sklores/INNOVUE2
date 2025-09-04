// src/features/marquee/Marquee.tsx
import React, { useMemo, useRef, useState } from "react";

/**
 * Innovue Live Feed Widget
 * - Big polished card that aggregates "real-time" items from Social, Reviews, Bank, News
 * - Palette matched: outer bg #dde2ea, outline #E1E2E6, pills reuse your UI language
 * - Live Ticker (auto-scroll, pause on hover/touch), fully clickable
 * - Centered filters, compact metric badges for quick at-a-glance
 *
 * You can later replace the mock data with real feeds.
 */

type SourceKey = "social" | "reviews" | "bank" | "news";

const SOURCES: { key: SourceKey; label: string }[] = [
  { key: "social",  label: "Social"  },
  { key: "reviews", label: "Reviews" },
  { key: "bank",    label: "Bank"    },
  { key: "news",    label: "News"    },
];

// Mock feed items (replace with real data later)
const MOCK_FEED: Record<SourceKey, string[]> = {
  social: [
    "IG: Happy Grilled Cheese Day! 🧀🔥",
    "X: New menu drop this week — tell us your favorite!",
    "TikTok: Behind-the-scenes: our perfect melt technique.",
  ],
  reviews: [
    "Google ★★★★☆ — “Best grilled cheese in DC.”",
    "Yelp ★★★★★ — “Warm staff, crispy edges, gooey center.”",
  ],
  bank: [
    "Stripe: $1,240 Settled",
    "Bank: Daily deposits processed",
  ],
  news: [
    "Local: Food Truck Fest this weekend — we’ll be there!",
    "Industry: Cheese prices stable; artisan makers up 3%",
  ],
};

// Recent “metrics” badges (placeholder)
const METRICS = [
  { label: "Mentions", val: 27 },
  { label: "New Reviews", val: 5 },
  { label: "Bank +$ Today", val: "$1.2k" },
  { label: "Links Clicked", val: 92 },
];

const Marquee: React.FC = () => {
  const [active, setActive] = useState<SourceKey>("social");
  const feed = MOCK_FEED[active];

  // Flatten the feed into a single ticker string
  const ticker = useMemo(() => (feed?.length ? feed.join("  •  ") : ""), [feed]);

  // pause on hover/touch
  const [paused, setPaused] = useState(false);
  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);

  const styles = {
    // ——— Card ———
    card: {
      border: "1px solid #E1E2E6",
      borderRadius: 16, // a bit larger than regular to feel “widgety”
      background: "#dde2ea",
      boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
      padding: 14, // more air than the old version
      marginTop: 12,
      position: "relative" as const,
      overflow: "hidden" as const,
      pointerEvents: "auto" as const, // ensure clickable
    },

    // ——— Title row ———
    titleRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 12,
    },
    titleLeft: {
      display: "flex",
      alignItems: "center",
      gap: 10,
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

    // ——— Ticker ———
    tickerWrap: {
      position: "relative" as const,
      overflow: "hidden" as const,
      border: "1px solid #E1E2E6",
      borderRadius: 12,
      background: "rgba(120,200,255,0.55)", // front-wave color
      padding: "8px 12px",
    },
    tickerTrack: (paused: boolean) => ({
      display: "inline-block",
      whiteSpace: "nowrap" as const,
      minWidth: "100%",
      animation: `marquee 18s linear infinite`,
      animationPlayState: paused ? "paused" : ("running" as const),
      pointerEvents: "auto" as const,
      color: "#0b2540",
      fontWeight: 700,
      letterSpacing: 0.2,
    }),
    fadeLeft: {
      position: "absolute" as const,
      top: 0, bottom: 0, left: 0, width: 24,
      pointerEvents: "none" as const,
      background: "linear-gradient(90deg, rgba(120,200,255,0.55) 50%, rgba(120,200,255,0) 100%)",
    },
    fadeRight: {
      position: "absolute" as const,
      top: 0, bottom: 0, right: 0, width: 24,
      pointerEvents: "none" as const,
      background: "linear-gradient(270deg, rgba(120,200,255,0.55) 50%, rgba(120,200,255,0) 100%)",
    },

    // ——— Metrics row ———
    metricsRow: {
      marginTop: 10,
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

    // ——— Filter chips (centered under ticker) ———
    chipsRow: {
      marginTop: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center" as const,
      gap: 8,
      flexWrap: "wrap" as const,
    },
    chip: {
      height: 28,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 10px",
      border: "1px solid #E1E2E6",
      borderRadius: 999,
      background: "#FFFFFF",
      color: "#334155",
      fontWeight: 600,
      fontSize: 12,
    },
  };

  return (
    <section style={styles.card}>

      {/* Title + tabs */}
      <div style={styles.titleRow as React.CSSProperties}>
        <div style={styles.titleLeft as React.CSSProperties}>
          <span style={styles.liveDot} />
          <span style={styles.titleText}>Live Feed</span>
        </div>
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

      {/* Ticker (auto-scroll; pause on hover/touch) */}
      <div
        style={styles.tickerWrap as React.CSSProperties}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onTouchStart={onEnter}
        onTouchEnd={onLeave}
      >
        <div style={styles.tickerTrack(paused) as React.CSSProperties}>
          {/* duplicate the track so it loops seamlessly */}
          <span>{ticker} </span>
          <span aria-hidden>{ticker}</span>
        </div>

        {/* edge fades */}
        <div style={styles.fadeLeft} />
        <div style={styles.fadeRight} />
      </div>

      {/* Quick metrics */}
      <div style={styles.metricsRow as React.CSSProperties}>
        {METRICS.map((m, i) => (
          <span key={i} style={styles.metric as React.CSSProperties}>
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: i === 2 ? "#22c55e" : "#60a5fa",
              boxShadow: "0 0 0 2px rgba(0,0,0,0.04)"
            }} />
            {m.label}: {m.val}
          </span>
        ))}
      </div>

      {/* Filter chips (centered) */}
      <div style={styles.chipsRow as React.CSSProperties}>
        <span style={styles.chip as React.CSSProperties}>news</span>
        <span style={styles.chip as React.CSSProperties}>reviews</span>
        <span style={styles.chip as React.CSSProperties}>social</span>
        <span style={styles.chip as React.CSSProperties}>bank</span>
        <span style={styles.chip as React.CSSProperties}>events</span>
      </div>

      {/* keyframes for the marquee */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
        /* Hide scrollbars in webkit for trackWrap */
        section::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default Marquee;