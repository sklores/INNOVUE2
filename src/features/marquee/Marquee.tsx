// src/features/marquee/Marquee.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchSheetValues } from "../data/sheets/fetch";
import { sheetMap } from "../../config/sheetMap";

type Filters = {
  news: boolean;
  reviews: boolean;
  social: boolean;
  bank: boolean;
  questions: boolean;
};

export default function Marquee() {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    news: true,
    reviews: true,
    social: true,
    bank: true,
    questions: true,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetchSheetValues();
        setRows(r);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const parts = useMemo(() => {
    const safe = (i: number) => String(rows?.[i]?.[1] ?? "").trim();
    return {
      news: safe(sheetMap.marquee.news),
      reviews: safe(sheetMap.marquee.reviews),
      social: safe(sheetMap.marquee.social),
      bank: safe(sheetMap.marquee.banking),
      questions: safe(sheetMap.marquee.questions),
    };
  }, [rows]);

  const text = useMemo(() => {
    const ordered: Array<keyof Filters> = ["news", "reviews", "social", "bank", "questions"];
    const on = ordered.filter((k) => filters[k]).map((k) => parts[k]).filter(Boolean);
    return on.join("  —  ");
  }, [parts, filters]);

  const toggle = (k: keyof Filters) => setFilters((s) => ({ ...s, [k]: !s[k] }));

  // styles that mirror your KPI cards (shell + inner banner)
  const shell: React.CSSProperties = {
    background: "#fff",
    color: "#2A2C34",
    border: "1px solid #E1E2E6",
    borderRadius: 16,
    padding: 14,
    boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
    marginTop: 12,
  };
  const labelStyle: React.CSSProperties = { fontWeight: 800, fontSize: 16, marginBottom: 10 };

  return (
    <section style={{ padding: 12 }}>
      {/* tile shell */}
      <div style={shell}>
        <div style={labelStyle}>Live Feed</div>

        {/* scrolling banner */}
        <Ticker text={text || (loading ? "Loading…" : " ")} />

        {/* filter chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          <Chip active={filters.news} onClick={() => toggle("news")}  >news</Chip>
          <Chip active={filters.reviews} onClick={() => toggle("reviews")}>reviews</Chip>
          <Chip active={filters.social} onClick={() => toggle("social")}>social</Chip>
          <Chip active={filters.bank} onClick={() => toggle("bank")}>bank</Chip>
          <Chip active={filters.questions} onClick={() => toggle("questions")}>events</Chip>
        </div>
      </div>
    </section>
  );
}

/* ----------- sub-components ----------- */

function Ticker({ text }: { text: string }) {
  // purple gradient banner styled like a KPI inner bar, but full-width scrolling
  const bar: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(180deg, #b99cf7, #8d79e6)",
    color: "#0b2540",
    minHeight: 44,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    padding: "0 12px",
  };

  const track: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    whiteSpace: "nowrap",
    // we’ll animate translateX on the inner span
  };

  const span: React.CSSProperties = {
    display: "inline-block",
    paddingRight: 40, // gap before repeat
    animation: "innovue-marquee 18s linear infinite",
  };

  return (
    <div style={bar}>
      {/* keyframes (scoped) */}
      <style>{`
        @keyframes innovue-marquee {
          0%   { transform: translateX(0%) }
          100% { transform: translateX(-100%) }
        }
      `}</style>
      <div style={track} aria-label={`Marquee: ${text}`} title={text}>
        <span style={span}>{text || " "}</span>
        {/* duplicate for seamless loop */}
        <span style={span}>{text || " "}</span>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        fontWeight: 800,
        fontSize: 14,
        color: active ? "#0b2540" : "#787D85",
        background: active ? "#E1E2F9" : "transparent",
        border: active ? "1px solid #C9CDF0" : "1px solid #E1E2E6",
        userSelect: "none",
      }}
    >
      {children}
    </button>
  );
}