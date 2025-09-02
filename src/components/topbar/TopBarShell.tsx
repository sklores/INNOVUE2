import React from "react";
import "../App.css"; // make sure global styles apply
import { TOPBAR_HEIGHT, LOGO_SIZE, SUN_SIZE, MARGIN } from "../tuning";

export default function TopBarShell() {
  return (
    <div
      style={{
        height: TOPBAR_HEIGHT,
        background: "linear-gradient(to top, #87ceeb, #f0f8ff)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: MARGIN,
        borderBottom: "1px solid #ccc",
      }}
    >
      {/* Lighthouse/Logo */}
      <img
        src="/logo/innovuegrey.png"
        alt="Innovue Lighthouse"
        style={{
          height: LOGO_SIZE,
          width: "auto",
          objectFit: "contain",
        }}
      />

      {/* Sun/Moon placeholder */}
      <div
        style={{
          height: SUN_SIZE,
          width: SUN_SIZE,
          borderRadius: "50%",
          background: "#FFD700", // yellow for sun, swap later
        }}
      ></div>
    </div>
  );
}