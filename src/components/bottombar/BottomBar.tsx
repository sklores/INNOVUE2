// src/components/bottombar/BottomBar.tsx
// Mobile-only Bottom Bar (tile-style)
// - Accepts optional props (lastSync, ok, onRefresh)
// - If not provided, shows current time and OK by default
// - Uses same white shell look as KPI tiles to stay consistent

export type BottomBarProps = {
    lastSync?: Date | null;
    ok?: boolean;                // connection/health
    onRefresh?: () => void;      // optional callback; falls back to hard reload
  };
  
  export default function BottomBar({ lastSync, ok = true, onRefresh }: BottomBarProps) {
    const now = new Date();
    const synced = lastSync ?? now;
  
    const shell: React.CSSProperties = {
      background: "#fff",
      color: "#2A2C34",
      border: "1px solid #E1E2E6",
      borderRadius: 16,
      padding: 12,
      boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
      // keep it away from screen edges on phones
      margin: "12px 12px calc(12px + env(safe-area-inset-bottom, 0px))",
    };
  
    const row: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    };
  
    const left: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" };
    const meta: React.CSSProperties = { fontSize: 13, fontWeight: 700, opacity: 0.9 };
    const sub: React.CSSProperties = { fontSize: 12, opacity: 0.8, fontWeight: 600 };
  
    const healthDot: React.CSSProperties = {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: ok ? "#20c997" : "#dc3545",
      boxShadow: ok ? "0 0 6px rgba(32,201,151,0.6)" : "0 0 6px rgba(220,53,69,0.6)",
    };
  
    const btn: React.CSSProperties = {
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid #E1E2E6",
      background: "#F6F7FA",
      fontWeight: 800,
      fontSize: 13,
    };
  
    const timeStr = fmtTime(now);
    const syncStr = fmtTime(synced);
  
    const handleRefresh = () => {
      if (onRefresh) onRefresh();
      else window.location.reload();
    };
  
    return (
      <footer style={shell}>
        <div style={row}>
          <div style={left}>
            <div style={meta}>{timeStr}</div>
            <div style={sub}>•</div>
            <div style={sub}>Last Sync: {syncStr}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={healthDot} />
              <div style={sub}>{ok ? "OK" : "Error"}</div>
            </div>
          </div>
  
          <button type="button" style={btn} onClick={handleRefresh} aria-label="Refresh">
            Refresh
          </button>
        </div>
      </footer>
    );
  }
  
  /* ---------- utils ---------- */
  
  function fmtTime(d: Date) {
    // “5:17 PM” style
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }