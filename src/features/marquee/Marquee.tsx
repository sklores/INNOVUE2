// src/features/marquee/Marquee.tsx
type Props = { text?: string };

export default function Marquee({ text = "" }: Props) {
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
        }}
        aria-label={`Live feed: ${text}`}
        title={text}
      >
        {text || " "}
      </div>
    </section>
  );
}