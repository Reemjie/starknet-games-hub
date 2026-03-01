import { useState, useEffect } from "react";
import { CAROUSEL } from "../data";

export function Carousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % CAROUSEL.length), 5500);
    return () => clearInterval(t);
  }, []);
  const move = (dir: number) => setIdx((i) => (i + dir + CAROUSEL.length) % CAROUSEL.length);
  return (
    <div id="carousel">
      <div className="cw">
        <div className="ct" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {CAROUSEL.map((s, i) => {
            const sc = s.status === "live" ? "#22c55e" : "#F4C542";
            return (
              <div key={i} className="cs">
                <img src={s.img} alt={s.title} loading="lazy" />
                <div className="cs-ov" />
                <div className="cs-txt">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span className="sbadge" style={{ background: `${sc}22`, border: `1px solid ${sc}55`, color: sc }}>{s.status.toUpperCase()}</span>
                    <span style={{ color: "#EC796B", fontFamily: "Orbitron,sans-serif", fontSize: 11, fontWeight: 700 }}>{s.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{s.date}</span>
                  </div>
                  <h3 style={{ fontFamily: "Orbitron,sans-serif", fontSize: "clamp(16px,3vw,28px)", fontWeight: 900, color: "white", margin: "0 0 8px" }}>{s.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(12px,1.8vw,15px)", margin: "0 0 16px", maxWidth: 580 }}>{s.subtitle}</p>
                  <a href={s.url} target="_blank" rel="noreferrer" className="btn-primary">Discover →</a>
                </div>
              </div>
            );
          })}
        </div>
        <button className="cbtn" style={{ left: 14 }} onClick={() => move(-1)}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className="cbtn" style={{ right: 14 }} onClick={() => move(1)}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="cdots">
        {CAROUSEL.map((_, i) => (
          <button key={i} className={`cdot ${i === idx ? "on" : ""}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  );
}
