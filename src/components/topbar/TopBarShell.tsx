// Mobile-only "painting in a frame": fixed canvas size, centered
const CANVAS = { width: 390, height: 180 }; // per our plan

export default function TopBarShell() {
  return (
    <header
      className="section"
      style={{
        width: CANVAS.width,
        height: CANVAS.height,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {/* Layers will go here later (Sky, SunMoon, Lighthouse, Waves, Weather, ClientLogo) */}
      TopBar Frame
    </header>
  );
}