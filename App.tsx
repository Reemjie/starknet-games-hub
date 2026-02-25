import { GAMES, TOURNEYS } from "./data";
import { Nav } from "./components/Nav";
import { Ticker } from "./components/Ticker";
import { Carousel } from "./components/Carousel";
import { Footer } from "./components/Footer";

export function App() {
  return (
    <>
      <Nav activePage="home" />

      <div id="hero-banner">
        <img src="https://res.cloudinary.com/dtqbnob94/image/upload/v1770988983/ChatGPT_Image_13_fe%CC%81vr._2026_14_08_03_ljmmnl.png" alt="StarkGames Banner" />
        <div className="grad" />
      </div>

      <Ticker />
      <Carousel />

      <div className="wrap">
        <div className="stats" style={{ marginTop: 8 }}>
          <div className="sc"><div className="sn grad-text">28M+</div><div className="sl">Total TXs</div></div>
          <div className="sc"><div className="sn" style={{ color: "#22c55e" }}>8</div><div className="sl">Live Games</div></div>
          <div className="sc"><div className="sn" style={{ color: "#F4C542" }}>{TOURNEYS.length}</div><div className="sl">Tournaments Live</div></div>
          <div className="sc"><div className="sn" style={{ color: "#5C5ADB" }}>4k+</div><div className="sl">Active Players</div></div>
        </div>

        <div style={{ marginBottom: 56 }}>
          <div className="sh">
            <div>
              <span className="sec-badge">⭐ Featured</span>
              <span className="stitle">Top Games</span>
            </div>
            <a href="#games" className="va">View all →</a>
          </div>
          <div className="gg">
            {GAMES.map((g) => (
              <a key={g.name} href={g.url} target="_blank" rel="noreferrer" className="gc">
                <img src={g.img} alt={g.name} />
                <div className="gc-info">
                  <div className="gc-name">{g.name}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {g.tags.slice(0, 2).map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 56 }}>
          <div className="sh">
            <div>
              <span className="sec-badge" style={{ borderColor: "rgba(34,197,94,0.4)", background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                <span className="ldot" /> Live Now
              </span>
              <span className="stitle">Active Tournaments</span>
            </div>
            <a href="#tournaments" className="va">All tournaments →</a>
          </div>
          <div className="tg">
            {TOURNEYS.map((t) => (
              <a key={t.name} href={t.url} target="_blank" rel="noreferrer" className="tm">
                <img src={t.img} style={{ width: 42, height: 42, borderRadius: 10, objectFit: "cover", border: `1px solid ${t.color}40`, flexShrink: 0 }} alt="" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{t.game} · {t.players}/{t.max} players</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: t.color, fontWeight: 700 }}>{t.prize}</div>
                  <span className="live-pill" style={{ marginTop: 5, display: "inline-flex" }}><span className="ldot" />LIVE</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="qa">
          <a href="#profile" className="qc" style={{ background: "linear-gradient(135deg,rgba(92,90,219,0.08),rgba(0,0,0,0))", border: "1px solid rgba(92,90,219,0.22)" }}>
            <div style={{ fontSize: 28 }}>◈</div>
            <h3>Player Profile</h3>
            <p>Cross-game stats from your wallet.</p>
          </a>
          <a href="#games" className="qc" style={{ background: "linear-gradient(135deg,rgba(236,121,107,0.08),rgba(0,0,0,0))", border: "1px solid rgba(236,121,107,0.22)" }}>
            <div style={{ fontSize: 28 }}>📊</div>
            <h3>Compare Games</h3>
            <p>Side-by-side stats for all games.</p>
          </a>
          <a href="#learn" className="qc" style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(0,0,0,0))", border: "1px solid rgba(34,197,94,0.22)" }}>
            <div style={{ fontSize: 28 }}>⚡</div>
            <h3>New to Web3?</h3>
            <p>Wallet, STRK, first game — 3 steps.</p>
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
}
