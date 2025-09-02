// src/features/kpi/KpiTiles.tsx
type Tile = {
    label: string;
    value: string;
    gradient: [string, string]; // [from, to]
  };
  
  const TILES: Tile[] = [
    { label: "Sales",        value: "$2,500", gradient: ["#76d0c3", "#4bb1a0"] },
    { label: "COGS",         value: "27%",    gradient: ["#f2cf98", "#e5a963"] },
    { label: "Labor",        value: "$407",   gradient: ["#8fd0c3", "#5cad9f"] },
    { label: "Prime",        value: "$1,082", gradient: ["#f2a1a9", "#d86b74"] },
    { label: "Bank",         value: "$9,403", gradient: ["#7bc2b8", "#2e6f77"] },
    { label: "Review Score", value: "4.4",    gradient: ["#9fe2c0", "#4fb68f"] },
  ];
  
  export default function KpiTiles() {
    return (
      <section style={{ padding: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {TILES.map((t) => (
            <KpiCard key={t.label} {...t} />
          ))}
        </div>
      </section>
    );
  }
  
  function KpiCard({ label, value, gradient }: Tile) {
    const [from, to] = gradient;
    return (
      <div
        style={{
          background: `linear-gradient(180deg, ${from}, ${to})`,
          color: "#fff",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 72,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              marginBottom: 6,
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: 0.3,
              opacity: 0.95,
            }}
          >
            {label}
          </div>
          <div
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 26,
              lineHeight: 1,
            }}
          >
            {value}
          </div>
        </div>
      </div>
    );
  }