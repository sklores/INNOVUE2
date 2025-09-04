// src/App.tsx
import TopBarShell from "./components/topbar/TopBarShell";
import SelectorsBar from "./components/topbar/SelectorsBar";
import KpiTiles     from "./features/kpi/KpiTiles";
import Marquee      from "./features/marquee/Marquee";
import BottomSafeArea from "./components/bottombar/BottomSafeArea"; // ⬅️ new spacer
import BottomBar    from "./components/bottombar/BottomBar";

export default function App() {
  return (
    <>
      <TopBarShell />
      <SelectorsBar />
      <KpiTiles />
      <Marquee />

      {/* Spacer keeps content clear of the sticky bottom bar */}
      <BottomSafeArea />

      <BottomBar />
    </>
  );
}