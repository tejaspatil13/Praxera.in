import { ImageResponse } from "next/og";

export const alt = "Praxera Technologies — Less manual work. Smarter systems. Better business.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0a1428 0%, #101e3a 60%, #0b3b43 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#050b18" />
            <path d="M10 24V8h7.5a5.5 5.5 0 0 1 0 11H14" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 19l5.5 5" fill="none" stroke="#2dd4bf" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 8 }}>PRAXERA</div>
            <div style={{ fontSize: 14, letterSpacing: 9, color: "#8d9bb0", marginTop: 4 }}>TECHNOLOGIES</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>Less manual work.</div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>Smarter systems.</div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, color: "#2dd4bf" }}>Better business.</div>
        </div>
        <div style={{ fontSize: 24, color: "#b9c3d2" }}>AI · Automation · Integrations · Custom software</div>
      </div>
    ),
    size,
  );
}
