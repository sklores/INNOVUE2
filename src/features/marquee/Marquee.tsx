// src/features/marquee/Marquee.tsx
import React from "react";

/**
 * Palette-aligned marquee.
 * - Outer card matches bottom bar grey (#dde2ea) with 1px outline
 * - Message pill matches the front wave color (rgba(120,200,255,0.55))
 * - Edge fades hint horizontal scroll
 * - Minimal, restrained "Live" dot at the start
 */
const Marquee: React.FC = () => {
  // Replace this with your feed string; you can wire it later
  const message =
    "Happy Grilled Cheese Day! — New menu drop this week — Follow us on Instagram @GCDC — Delivery now live — Order direct and save — Meetup Tonight 7pm — ";

  const styles = {
    card: {
      border: "1px solid #E1E2E6",
      borderRadius: 12,
      background: "#dde2ea",
      boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
      padding: 10,
      overflow: "hidden" as const,
      position: "relative" as const,
    },
    trackWrap: {
      position: "relative" as const,
      overflowX: "auto" as const,
      overflowY: "hidden" as const,
      scrollbarWidth: "none" as const, // Firefox
      msOverflowStyle: "none" as const, // IE/Edge
    },
    // Hide scrollbars in webkit
    noScroll: {
      WebkitOverflowScrolling: "touch" as const,
    },
    track: {
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      whiteSpace: "nowrap" as const,
      padding: "0 8px",
    },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      height: 32,
      padding: "0 12px",
      border: "1px solid #E1E2E6",
      borderRadius: 10,
      background: "rgba(120,200,255,0.55)", // same as front wave color
      color: "#0f172a",
      fontWeight: 700,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: "#22c55e",
      boxShadow: "0 0 0 2px rgba(0,0,0,0.04)",
    },
    msg: { letterSpacing: 0.2 },
    // Left/right fade masks to hint scroll
    fadeLeft: {
      position: "absolute" as const,
      top: 0,
      bottom: 0,
      left: 0,
      width: 24,
      pointerEvents: "none" as const,
      background: "linear-gradient(90deg, #dde2ea 50%, rgba(221,226,234,0) 100%)",
    },
    fadeRight: {
      position: "absolute" as const,
      top: 0,
      bottom: 0,
      right: 0,
      width: 24,
      pointerEvents: "none" as const,
      background: "linear-gradient(270deg, #dde2ea 50%, rgba(221,226,234,0) 100%)",
    },
    // Filter tags row (kept minimal)
    chipsRow: {
      marginTop: 8,
      display: "flex",
      flexWrap: "wrap" as const,
      gap: 8,
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
      <div style={{ ...styles.trackWrap, ...styles.noScroll } as React.CSSProperties}>
        <div style={styles.track}>
          <span style={styles.pill as React.CSSProperties}>
            <span style={styles.liveDot} />
            <span style={styles.msg}>Live Feed</span>
          </span>
          {/* message content in a long pill */}
          <span style={styles.pill as React.CSSProperties}>
            <span style={styles.msg}>{message.repeat(2)}</span>
          </span>
        </div>

        {/* edge fades */}
        <div style={styles.fadeLeft} />
        <div style={styles.fadeRight} />
      </div>

      {/* (optional) small chips; keep minimal to avoid clutter */}
      <div style={styles.chipsRow as React.CSSProperties}>
        <span style={styles.chip as React.CSSProperties}>news</span>
        <span style={styles.chip as React.CSSProperties}>reviews</span>
        <span style={styles.chip as React.CSSProperties}>social</span>
        <span style={styles.chip as React.CSSProperties}>bank</span>
        <span style={styles.chip as React.CSSProperties}>events</span>
      </div>
    </section>
  );
};

export default Marquee;