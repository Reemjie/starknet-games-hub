import { useState } from "react";

const REPO = "Reemjie/starknet-games-hub";
const FILE_PATH = "public/data.json";
const BRANCH = "source";
const ADMIN_PASSWORD = "starkgames2026";

type Section = "games" | "ticker" | "carousel" | "tournaments" | "guides" | "marketplaces" | "gamers";

interface DataJson {
  games: any[];
  ticker: any[];
  carousel: any[];
  tournaments: any[];
  guides: any[];
  marketplaces: any[];
  gamers: any[];
}

export function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [token, setToken] = useState(() => { try { return localStorage.getItem("gh_token") || ""; } catch { return ""; } });
  const [data, setData] = useState<DataJson | null>(null);
  const [sha, setSha] = useState("");
  const [section, setSection] = useState<Section>("tournaments");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (t: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
        headers: { Authorization: `token ${t}`, Accept: "application/vnd.github.v3+json" }
      });
      const json = await res.json();
      setSha(json.sha);
      const decoded = JSON.parse(atob(json.content.replace(/\n/g, "")));
      setData(decoded);
    } catch { setMsg("❌ Erreur — vérifie ton token GitHub"); }
    setLoading(false);
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setMsg("");
    try {
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
      // Save to source branch
      const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Admin: update data.json", content, sha, branch: BRANCH })
      });
      const json = await res.json();
      if (!json.content) { setMsg("❌ " + JSON.stringify(json.message)); setSaving(false); return; }
      setSha(json.content.sha);
      setMsg("✅ Sauvegardé ! Le site se met à jour dans 2-3 min.");
    } catch { setMsg("❌ Erreur réseau"); }
    setSaving(false);
  };

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      try { localStorage.setItem("gh_token", token); } catch {}
      fetchData(token);
    } else setMsg("❌ Mot de passe incorrect");
  };

  const update = (key: Section, index: number, field: string, value: any) => {
    if (!data) return;
    const arr = [...data[key]];
    arr[index] = { ...arr[index], [field]: value };
    setData({ ...data, [key]: arr });
  };

  const remove = (key: Section, index: number) => {
    if (!data) return;
    const arr = [...data[key]];
    arr.splice(index, 1);
    setData({ ...data, [key]: arr });
  };

  const add = (key: Section) => {
    if (!data) return;
    const templates: Record<Section, any> = {
      games: { id: Date.now().toString(), name: "Nouveau jeu", url: "", img: "", genre: "Arcade", tags: [], onchain: "Full", token: "N/A", gas: "~0.01€", diff: 2, f2p: false, txsl: "0", color: "#EC796B", trend: "+0%", desc: "", active: true },
      ticker: { id: Date.now().toString(), text: "Nouveau ticker", url: "", active: true },
      carousel: { id: Date.now().toString(), title: "Nouveau slide", subtitle: "", img: "", url: "", tag: "NEW", active: true },
      tournaments: { id: Date.now().toString(), name: "Nouveau tournoi", game: "", gameImg: "", status: "upcoming", prize: "", players: 0, maxPlayers: 100, color: "#EC796B", url: "", host: "", active: true },
      guides: { game: "Nouveau jeu", img: "", links: [{ emoji: "📖", label: "Guide", url: "" }], active: true },
      marketplaces: { name: "Nouveau marketplace", desc: "", url: "", img: "", active: true },
      gamers: { name: "Nouveau gamer", handle: "", active: true },
    };
    setData({ ...data, [key]: [...data[key], templates[key]] });
  };

  const inp: React.CSSProperties = { background: "#0A0A0F", border: "1px solid #2a2a35", borderRadius: 8, color: "white", padding: "7px 10px", fontSize: 13, width: "100%", fontFamily: "'Rajdhani',sans-serif" };
  const btn = (c = "#EC796B"): React.CSSProperties => ({ padding: "7px 16px", borderRadius: 8, border: `1px solid ${c}40`, background: `${c}15`, color: c, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Rajdhani',sans-serif" });

  if (!authed) return (
    <div style={{ background: "#0A0A0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Rajdhani',sans-serif" }}>
      <div style={{ background: "#13131A", border: "1px solid #1F1F28", borderRadius: 20, padding: 40, width: 380 }}>
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, color: "white", margin: "0 0 24px", textAlign: "center" }}>⚙️ ADMIN</h2>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4 }}>MOT DE PASSE</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={inp} placeholder="••••••••" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4 }}>GITHUB TOKEN</label>
          <input type="password" value={token} onChange={e => setToken(e.target.value)} style={inp} placeholder="ghp_..." />
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>Token avec droits repo — sauvegardé localement</div>
        </div>
        <button onClick={handleLogin} style={{ ...btn(), width: "100%", padding: "10px", fontSize: 14 }}>Connexion →</button>
        {msg && <div style={{ marginTop: 12, fontSize: 12, color: "#f87171", textAlign: "center" }}>{msg}</div>}
      </div>
    </div>
  );

  const SECTIONS: { key: Section; label: string; icon: string }[] = [
    { key: "games", label: "Jeux", icon: "🎮" },
    { key: "tournaments", label: "Tournois", icon: "🏆" },
    { key: "carousel", label: "Carousel", icon: "🎠" },
    { key: "ticker", label: "Ticker", icon: "📰" },
    { key: "guides", label: "Guides", icon: "📖" },
    { key: "marketplaces", label: "Marketplaces", icon: "🛒" },
    { key: "gamers", label: "Gamers", icon: "👥" },
  ];

  return (
    <div style={{ background: "#0A0A0F", minHeight: "100vh", color: "white", fontFamily: "'Rajdhani',sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="#/" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>← Retour</a>
            <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 20, margin: 0 }}>⚙️ Admin Panel</h1>
          </div>
          <button onClick={save} disabled={saving} style={{ ...btn("#22c55e"), padding: "9px 24px", fontSize: 14 }}>
            {saving ? "Sauvegarde..." : "💾 Sauvegarder"}
          </button>
        </div>

        {msg && <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: msg.startsWith("✅") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${msg.startsWith("✅") ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, fontSize: 13 }}>{msg}</div>}

        <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)} style={{ ...btn(section === s.key ? "#EC796B" : "#5C5ADB"), background: section === s.key ? "rgba(236,121,107,0.15)" : "transparent" }}>
              {s.icon} {s.label} {data && <span style={{ opacity: 0.5 }}>({data[s.key]?.length ?? 0})</span>}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center" }}>Chargement...</p>}

        {data && !loading && (
          <div>
            
            {section === "games" && data.games.map((g, i) => (
              <div key={i} style={{ background: "#13131A", border: "1px solid #1F1F28", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {["name","url","img","genre","token","gas","txsl","trend","color"].map((f) => (
                    <div key={f}>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>{f}</label>
                      <input value={g[f]||""} onChange={e => update("games", i, f, e.target.value)} style={inp} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 10 }}>
                  <div><label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>On-chain</label><select value={g.onchain||"Full"} onChange={e => update("games", i, "onchain", e.target.value)} style={inp}><option>Full</option><option>Partial</option><option>None</option></select></div>
                  <div><label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Diff (1-5)</label><input type="number" min={1} max={5} value={g.diff||1} onChange={e => update("games", i, "diff", +e.target.value)} style={inp} /></div>
                  <div><label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>F2P</label><select value={String(g.f2p)} onChange={e => update("games", i, "f2p", e.target.value === "true")} style={inp}><option value="true">Oui</option><option value="false">Non</option></select></div>
                  <div><label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Couleur</label><input type="color" value={g.color||"#EC796B"} onChange={e => update("games", i, "color", e.target.value)} style={{ ...inp, height: 36, padding: 2 }} /></div>
                </div>
                <div style={{ marginBottom: 10 }}><label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Description</label><input value={g.desc||""} onChange={e => update("games", i, "desc", e.target.value)} style={inp} /></div>
                <div style={{ marginBottom: 10 }}><label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Tags (séparés par virgule)</label><input value={(g.tags||[]).join(",")} onChange={e => update("games", i, "tags", e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean))} style={inp} /></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}><input type="checkbox" checked={g.active} onChange={e => update("games", i, "active", e.target.checked)} /> Actif</label>
                  <button onClick={() => remove("games", i)} style={btn("#ef4444")}>🗑 Supprimer</button>
                </div>
              </div>
            ))}

            {section === "tournaments" && data.tournaments.map((t, i) => (
              <div key={i} style={{ background: "#13131A", border: "1px solid #1F1F28", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {["name","game","prize","url","host","gameImg"].map((f) => (
                    <div key={f}>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>{f}</label>
                      <input value={t[f]||""} onChange={e => update("tournaments", i, f, e.target.value)} style={inp} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Status</label>
                    <select value={t.status} onChange={e => update("tournaments", i, "status", e.target.value)} style={inp}>
                      <option value="live">Live</option><option value="upcoming">Upcoming</option><option value="ended">Ended</option>
                    </select>
                  </div>

                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                    <input type="checkbox" checked={t.active} onChange={e => update("tournaments", i, "active", e.target.checked)} /> Actif
                  </label>
                  <button onClick={() => remove("tournaments", i)} style={btn("#ef4444")}>🗑 Supprimer</button>
                </div>
              </div>
            ))}

            {section === "carousel" && data.carousel.map((c, i) => (
              <div key={i} style={{ background: "#13131A", border: "1px solid #1F1F28", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {["title","subtitle","img","url","tag"].map((f) => (
                    <div key={f}>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>{f}</label>
                      <input value={c[f]||""} onChange={e => update("carousel", i, f, e.target.value)} style={inp} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                    <input type="checkbox" checked={c.active} onChange={e => update("carousel", i, "active", e.target.checked)} /> Actif
                  </label>
                  <button onClick={() => remove("carousel", i)} style={btn("#ef4444")}>🗑 Supprimer</button>
                </div>
              </div>
            ))}

            {section === "ticker" && data.ticker.map((t, i) => (
              <div key={i} style={{ background: "#13131A", border: "1px solid #1F1F28", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Texte</label>
                    <input value={t.text||""} onChange={e => update("ticker", i, "text", e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>URL</label>
                    <input value={t.url||""} onChange={e => update("ticker", i, "url", e.target.value)} style={inp} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                    <input type="checkbox" checked={t.active} onChange={e => update("ticker", i, "active", e.target.checked)} /> Actif
                  </label>
                  <button onClick={() => remove("ticker", i)} style={btn("#ef4444")}>🗑 Supprimer</button>
                </div>
              </div>
            ))}

            {section === "guides" && data.guides.map((g, i) => (
              <div key={i} style={{ background: "#13131A", border: "1px solid #1F1F28", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Jeu</label>
                    <input value={g.game||""} onChange={e => update("guides", i, "game", e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Image URL</label>
                    <input value={g.img||""} onChange={e => update("guides", i, "img", e.target.value)} style={inp} />
                  </div>
                </div>
                {g.links?.map((l: any, li: number) => (
                  <div key={li} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Emoji</label>
                      <input value={l.emoji||""} onChange={e => { const links=[...g.links]; links[li]={...links[li],emoji:e.target.value}; update("guides",i,"links",links); }} style={inp} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Label</label>
                      <input value={l.label||""} onChange={e => { const links=[...g.links]; links[li]={...links[li],label:e.target.value}; update("guides",i,"links",links); }} style={inp} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>URL</label>
                      <input value={l.url||""} onChange={e => { const links=[...g.links]; links[li]={...links[li],url:e.target.value}; update("guides",i,"links",links); }} style={inp} />
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, flexWrap: "wrap", gap: 8 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                    <input type="checkbox" checked={g.active} onChange={e => update("guides", i, "active", e.target.checked)} /> Actif
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { const links=[...g.links, { emoji: "📖", label: "Nouveau guide", url: "" }]; update("guides", i, "links", links); }} style={btn("#22c55e")}>+ Ajouter un guide</button>
                    <button onClick={() => { const links=[...g.links]; links.pop(); update("guides", i, "links", links); }} style={{ ...btn("#f97316"), opacity: g.links.length === 0 ? 0.3 : 1 }} disabled={g.links.length === 0}>− Supprimer dernier</button>
                    <button onClick={() => remove("guides", i)} style={btn("#ef4444")}>🗑 Supprimer jeu</button>
                  </div>
                </div>
              </div>
            ))}

            {section === "marketplaces" && data.marketplaces.map((m, i) => (
              <div key={i} style={{ background: "#13131A", border: "1px solid #1F1F28", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {["name","desc","url","img"].map((f) => (
                    <div key={f}>
                      <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>{f}</label>
                      <input value={m[f]||""} onChange={e => update("marketplaces", i, f, e.target.value)} style={inp} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                    <input type="checkbox" checked={m.active} onChange={e => update("marketplaces", i, "active", e.target.checked)} /> Actif
                  </label>
                  <button onClick={() => remove("marketplaces", i)} style={btn("#ef4444")}>🗑 Supprimer</button>
                </div>
              </div>
            ))}

            {section === "gamers" && data.gamers.map((g, i) => (
              <div key={i} style={{ background: "#13131A", border: "1px solid #1F1F28", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Nom</label>
                    <input value={g.name||""} onChange={e => update("gamers", i, "name", e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 3 }}>Handle Twitter (sans @)</label>
                    <input value={g.handle||""} onChange={e => update("gamers", i, "handle", e.target.value)} style={inp} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                    <input type="checkbox" checked={g.active} onChange={e => update("gamers", i, "active", e.target.checked)} /> Actif
                  </label>
                  <button onClick={() => remove("gamers", i)} style={btn("#ef4444")}>🗑 Supprimer</button>
                </div>
              </div>
            ))}

            <button onClick={() => add(section)} style={{ ...btn("#5C5ADB"), width: "100%", padding: "12px", fontSize: 14, marginTop: 8 }}>
              + Ajouter {SECTIONS.find(s => s.key === section)?.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
