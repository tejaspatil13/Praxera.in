import { ImageResponse } from "next/og";

export const alt = "Tejas Patil, video editor and AI-powered creative producer at Praxera Technologies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000000", color: "#f6f0e6", padding: 64 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#b5a99c", letterSpacing: 3 }}>
        <span>PRAXERA TECHNOLOGIES</span>
        <span style={{ color: "#ff2a3c" }}>● 00:00:00:00</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
        <span>We don’t just edit videos.</span>
        <span style={{ color: "#ff2a3c" }}>We create experiences.</span>
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#b5a99c" }}>Tejas Patil · Video Editor & AI-Powered Creative Producer</div>
    </div>,
    size,
  );
}
