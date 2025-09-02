// src/features/marquee/Marquee.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchSheetValues } from "../data/sheets/fetch";
import { sheetMap } from "../../config/sheetMap";

type Props = { fallbackText?: string };

export default function Marquee({ fallbackText = "" }: Props) {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

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

  // Pull the five snippets (B8, B9, B15, B16, B17 inside RANGE)
  const text = useMemo(() => {
    const r = rows;
    const safe = (i: number) => String(r?.[i]?.[1] ?? "").trim();
    const parts = [
      safe(sheetMap.marquee.news),
      safe(sheetMap.marquee.reviews),
      safe(sheetMap.marquee.social),
      safe(sheetMap.marquee.banking),
      safe(sheetMap.marquee.questions),
    ].filter(Boolean);
    const s = parts.join("   •   ");
    return s || fallbackText;
  }, [rows, fallbackText]);

  return (
    <section style={{ padding: 12 }}>
      <div
        style={{
          background: "#111827",
          color: "#e5e7eb",
          padding: 10,
          borderRadius: 12,
          border: "1px solid #1f2937",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          opacity: loading ? 0.6 : 1,
        }}
        aria-label={`Live feed: ${text}`}
        title={text}
      >
        {text || " "}
      </div>
    </section>
  );
}