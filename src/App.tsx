import TopBarShell from "./components/topbar/TopBarShell";
import KpiTiles     from "./features/kpi/KpiTiles";
import Marquee      from "./features/marquee/Marquee";
import BottomBar    from "./components/bottombar/BottomBar";

export default function App() {
  return (
    <>
      <TopBarShell />
      <KpiTiles />
      <Marquee fallbackText="GCDC Food is great!  •  Reviews 4.4  •  Events this weekend" />
      <BottomBar />
    </>
  );
}