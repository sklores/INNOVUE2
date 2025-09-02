// src/App.tsx
import TopBarShell from "./components/topbar/TopBarShell";
import SelectorsBar from "./components/topbar/SelectorsBar";
import KpiTiles     from "./features/kpi/KpiTiles";
import Marquee      from "./features/marquee/Marquee";
import BottomBar    from "./components/bottombar/BottomBar";

export default function App() {
  return (
    <>
      <TopBarShell />
      <SelectorsBar />
      <KpiTiles />
      <Marquee />
      <BottomBar />
    </>
  );
}