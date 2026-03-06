import { useState } from "react";
import { ConnectButton } from "./ConnectButton";

export function Nav() {
  const hash = window.location.hash.replace("#", "");
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav id="nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" className="nl">
          <img src="https://cdn3d.iconscout.com/3d/premium/thumb/starknet-cryptocurrency-3d-icon-png-download-9555134.png" style={{ width: 28, height: 28, objectFit: "contain" }} alt="" />
          <span>StarkGames</span>
        </a>
        <div className="na-hide" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <a href="#" className={`na ${hash === "" ? "active" : ""}`}>⬡ Home</a>
          <a href="#games" className={`na ${hash === "games" ? "active" : ""}`}>🎮 Games</a>
          <a href="#tournaments" className={`na ${hash === "tournaments" ? "active" : ""}`}>🏆 Tournaments <span className="lpill"><span className="ldot" />LIVE</span></a>
          <a href="#profile" className={`na ${hash === "profile" ? "active" : ""}`}>◈ Profile</a>
          <a href="#learn" className={`na ${hash === "learn" ? "active" : ""}`}>⚡ Get Started</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="burger" onClick={() => setOpen(!open)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "white", padding: "6px 10px", cursor: "pointer", fontSize: 18, lineHeight: 1, display: "none" }}>
            {open ? "✕" : "☰"}
          </button>
          <ConnectButton />
        </div>
      </nav>
      {open && (
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, background: "#0D0D14", borderBottom: "1px solid rgba(255,255,255,0.08)", zIndex: 999, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          {[["#", "⬡ Home"], ["#games", "🎮 Games"], ["#tournaments", "🏆 Tournaments"], ["#profile", "◈ Profile"], ["#learn", "⚡ Get Started"]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{ padding: "12px 16px", color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 14, borderRadius: 10, background: "rgba(255,255,255,0.03)", fontFamily: "'Orbitron', sans-serif", fontWeight: 600, letterSpacing: 1 }}>
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
