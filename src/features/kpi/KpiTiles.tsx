// src/features/kpi/KpiTiles.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchSheetValues } from "../data/sheets/fetch";
import { sheetMap } from "../../config/sheetMap";

const toNum = (v: unknown) => {
  const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const fmtUSD = (n: number | null) =>
  n == null ? "—" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtPct = (n: number | null) => (n == null ? "—" : `${Math.round(n)}%`);
const fmtInt = (n: number | null) => (n == null ? "—" : n.toLocaleString("en-US"));

type Unit = "$" | "%" | "";
export type KpiRow = { label: string; value: number | null; greenAt: number | null; redAt: number | null; unit: Unit };

const PASTEL = { red: "#F6C1C1", amber: "#F8D5AA", green: "#C6E2D6" };
const scoreToPastel = (s: number) => (s >= 70 ? PASTEL.green : s >= 40 ? PASTEL.amber : PASTEL.red);

function computeScore(opts: {
  value: number | null; unit: Unit; higherIsBetter: boolean; greenAt?: number | null; redAt?: number | null;
}) {
  const { value, unit, higherIsBetter, greenAt, redAt } = opts;
  if (value == null) return 0;
  const G = toNum(greenAt ?? null), R = toNum(redAt ?? null);
  if (G != null && R != null && G !== R) {
    let t = higherIsBetter ? (value - R) / (G - R) : (R - value) / (R - G);
    return clamp(Math.round(t * 100));
  }
  if (unit === "%") return clamp(Math.round(higherIsBetter ? value : 100 - value));
  return value > 0 ? 75 : 25;
}

export default function KpiTiles() {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setErr(null);
        const r = await fetchSheetValues();
        setRows(r);
      } catch (e: any) {
        setErr(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpis = useMemo(() => {
    const out: KpiRow[] = [];
    for (const idx of sheetMap.kpiRows) {
      const r = rows[idx] || [];
      const label = String(r[0] ?? "").trim();
      if (!label) continue;
      const unitToken = String(r[5] ?? "").trim().toLowerCase();
      const unit: Unit = unitToken === "$" || unitToken === "usd" || unitToken === "dollar" ? "$" : unitToken === "%" ? "%" : "";
      out.push({ label, value: toNum(r[1]), greenAt: toNum(r[2]), redAt: toNum(r[3]), unit });
    }
    return out;
  }, [rows]);

  const byLabel = useMemo(() => {
    const map = new Map<string, KpiRow>();
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
    for (const k of kpis) map.set(norm(k.label), k);
    const get = (...names: string[]) => { for (const n of names) { const hit = map.get(norm(n)); if (hit) return hit; } return undefined; };
    return { get };
  }, [kpis]);

  const sales     = byLabel.get("sales");
  const cogs      = byLabel.get("cogs","cost of goods","cost of goods sold");
  const labor     = byLabel.get("labor","labour");
  const prime     = byLabel.get("prime","prime cost");
  const bank      = byLabel.get("bank","bank balance");
  const online    = byLabel.get("online views","views","online");
  const review    = byLabel.get("review score","reviews","rating");
  const netProfit = byLabel.get("net profit","profit");

  return (
    <section style={{ padding: 12 }}>
      <Card title="Sales" row={sales} higherIsBetter loading={loading} err={err} />
      <Row2>
        <Card title="COGS"  row={cogs}  higherIsBetter={false} loading={loading} err={err} />
        <Card title="Labor" row={labor} higherIsBetter={false} loading={loading} err={err} />
      </Row2>
      <Row2>
        <Card title="Prime" row={prime} higherIsBetter={false} loading={loading} err={err} />
        <Card title="Bank"  row={bank}  higherIsBetter        loading={loading} err={err} />
      </Row2>
      <Row2>
        <Card title="Online Views" row={online} higherIsBetter loading={loading} err={err} />
        <Card title="Review Score" row={review} higherIsBetter loading={loading} err={err} />
      </Row2>
      <Card title="Net Profit" row={netProfit} higherIsBetter loading={loading} err={err} />
    </section>
  );
}

function Row2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:12 }}>
      {children}
    </div>
  );
}

function Card({
  title, row, higherIsBetter, loading, err
}: { title:string; row?:KpiRow; higherIsBetter:boolean; loading:boolean; err:string|null }) {
  const value = row?.value ?? null;
  const unit  = row?.unit  ?? "";
  const bg    = scoreToPastel(
    computeScore({ value, unit: unit as Unit, higherIsBetter, greenAt: row?.greenAt ?? null, redAt: row?.redAt ?? null })
  );
  const shown = unit === "$" ? fmtUSD(value) : unit === "%" ? fmtPct(value) : fmtInt(value);

  const shell: React.CSSProperties = {
    background:"#fff", color:"#2A2C34", border:"1px solid #E1E2E6",
    borderRadius:16, padding:14, boxShadow:"0 2px 10px rgba(0,0,0,0.18)", marginTop:12
  };
  const bar: React.CSSProperties = {
    height:64, display:"flex", alignItems:"center", justifyContent:"center",
    borderRadius:12, background:bg, color:"#0b2540", fontWeight:900, fontSize:24, letterSpacing:0.3
  };
  const titleStyle: React.CSSProperties = { fontWeight:800, fontSize:16, marginBottom:8 };

  return (
    <section style={shell}>
      <div style={titleStyle}>{title}</div>
      <div style={bar}>{loading ? "Syncing…" : err ? "Error" : shown}</div>
    </section>
  );
}