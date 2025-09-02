// src/App.tsx
import TopBarShell from "./components/topbar/TopBarShell";
import KpiTiles     from "./features/kpi/KpiTiles";
import Marquee      from "./features/marquee/Marquee";
import BottomBar    from "./components/bottombar/BottomBar";

export default function App() {
  // TEMP: sample marquee text so it’s not empty
  const marqueeText =
    "GCDC Food is great!  •  Reviews trending 4.4  •  Bank healthy  •  Events this weekend";

  return (
    <>
      <TopBarShell />
      <KpiTiles />

      {/* Live Feed + Marquee */}
      <section style={{ padding: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Live Feed</div>
        <Marquee text={marqueeText} />
      </section>

      <BottomBar />
    </>
  );
}