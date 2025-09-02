// add these imports at the top with your others
import KpiTiles, { type KpiRow } from "../../features/kpi/KpiTiles";
import Marquee from "../../features/marquee/Marquee";

// ...keep all your helpers and state/fetch code...

// label mapping stays the same...

// --- replace the return(...) body with this minimal composition ---
return (
  <main className="main" style={{ padding: 12 }}>
    <TopBarShell />

    <KpiTiles
      loading={loading}
      err={err}
      sales={sales as KpiRow | undefined}
      cogs={cogs as KpiRow | undefined}
      labor={labor as KpiRow | undefined}
      prime={prime as KpiRow | undefined}
      bank={bank as KpiRow | undefined}
      online={online as KpiRow | undefined}
      review={review as KpiRow | undefined}
      netProfit={netProfit as KpiRow | undefined}
    />

    <section style={{ marginTop:12 }}>
      <div style={{ fontWeight:800, fontSize:16, marginBottom:8 }}>Live Feed</div>
      <Marquee text={marqueeText} />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:10 }}>
        <button onClick={() => toggle("news")}   style={chip(pick.news)}>news</button>
        <button onClick={() => toggle("reviews")}style={chip(pick.reviews)}>reviews</button>
        <button onClick={() => toggle("social")} style={chip(pick.social)}>social</button>
        <button onClick={() => toggle("bank")}   style={chip(pick.bank)}>bank</button>
        <button onClick={() => toggle("events")} style={chip(pick.events)}>events</button>
      </div>
    </section>

    <section style={{ marginTop:12 }}>
      <BottomBar />
    </section>
  </main>
);