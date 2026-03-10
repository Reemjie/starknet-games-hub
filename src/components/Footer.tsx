export function Footer() {
  return (
    <footer>
      <div className="fw">
        <div className="fg">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <img src="https://cdn3d.iconscout.com/3d/premium/thumb/starknet-cryptocurrency-3d-icon-png-download-9555134.png" style={{ width: 20, height: 20, objectFit: "contain" }} alt="" />
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#EC796B,#5C5ADB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>StarkGames Hub</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, lineHeight: 1.7, maxWidth: 260, marginBottom: 12 }}>The reference hub for Starknet on-chain gaming. Built with ❤️ for the community.</p>
            <a href="https://x.com/Reemjie76" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.4)", fontSize: 18, textDecoration: "none" }}>𝕏</a>
          </div>
          <div>
            <div className="fct">Navigate</div>
            {["Home","Games","Tournaments","Profile","Get Started"].map((l) => <a key={l} href="#" className="fl">{l}</a>)}
          </div>
          <div>
            <div className="fct">Games</div>
            {[["Loot Survivor","https://lootsurvivor.io"],["BlobArena","https://blobarena.xyz"],["Jokers of Neon","https://jokersofneon.com"],["Summit","https://www.summit.game"]].map(([n,u]) => <a key={n} href={u} target="_blank" rel="noreferrer" className="fl">{n}</a>)}
          </div>
          <div>
            <div className="fct">Resources</div>
            {[["Starknet.io","https://starknet.io"],["Cartridge","https://cartridge.gg"],["Voyager","https://starkscan.co"]].map(([n,u]) => <a key={n} href={u} target="_blank" rel="noreferrer" className="fl">{n}</a>)}
          </div>
        </div>
        <div className="fb">
          <p>© 2026 StarkGames Hub — Built by <a href="https://x.com/Reemjie_" target="_blank" rel="noreferrer" style={{ color: "rgba(236,121,107,0.7)", textDecoration: "none" }}>Reemjie</a></p>
          <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10 }}>Estimated data · Not financial advice · DYOR</p>
        </div>
      </div>
    </footer>
  );
}
