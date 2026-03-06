import React, { useState, useEffect } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";


const BASE = "/starknet-games-hub";

function GameCard({ g }: { g: any }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a href={g.url} target="_blank" rel="noreferrer" className="gc" style={{position:'relative'}}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{position:'relative',overflow:'hidden'}}>
        <img src={g.img} alt={g.name} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',opacity:hovered?1:0,transition:'opacity 0.3s'}} />
        <div style={{position:'absolute',bottom:hovered?16:8,left:'50%',transform:'translateX(-50%)',opacity:hovered?1:0,transition:'all 0.3s',whiteSpace:'nowrap'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 18px',borderRadius:999,background:'linear-gradient(135deg,#EC796B,#a855f7)',color:'white',fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,letterSpacing:1,boxShadow:'0 4px 20px rgba(236,121,107,0.5)'}}>▶ PLAY NOW</span>
        </div>
      </div>
      <div className="gc-info">
        <div className="gc-name">{g.name}</div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:6}}>
          {(g.tags??[]).slice(0,2).map((t: string) => <span key={t} className="tag">{t}</span>)}
          {g.f2p && <span className="tag" style={{color:'#22c55e',background:'rgba(34,197,94,0.1)'}}>F2P</span>}
        </div>
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:10,margin:0,lineHeight:1.5,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{g.desc}</p>
      </div>
    </a>
  );
}

export function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [marketplaces, setMarketplaces] = useState<any[]>([]);
  const [gamers, setGamers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${BASE}/data.json`)
      .then(r => r.json())
      .then(d => {
        setGames((d.games ?? []).filter((g: any) => g.active !== false));
        setGuides((d.guides ?? []).filter((g: any) => g.active !== false));
        setMarketplaces((d.marketplaces ?? []).filter((m: any) => m.active !== false));
        setGamers((d.gamers ?? []).filter((u: any) => u.active !== false));
      })
      .catch(() => {});
  }, []);


  return (
    <>
      <Nav />
      <div className="wrap" style={{paddingTop:32}}>
        <div style={{marginBottom:44}}>
          <span className="sec-badge" style={{display:'inline-flex',marginBottom:10}}>🎮 All Games</span>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(26px,4vw,40px)',fontWeight:900,color:'white',margin:'0 0 6px'}}>Starknet <span className="grad-text">Game Library</span></h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:15,margin:0}}>Compare, explore guides, find your next on-chain adventure.</p>
        </div>

        <div className="gg" style={{marginBottom:56}}>
          {games.map(g => <GameCard key={g.id} g={g} />)}
        </div>

        {/* Guides | Marketplaces | Gamers */}
        <section style={{marginBottom:72}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <span className="sec-badge" style={{display:'inline-flex',marginBottom:10}}>📚 Resources</span>
            <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(22px,3.5vw,34px)',fontWeight:900,color:'white',margin:0}}>Guides, Marketplaces & <span className="grad-text">Community</span></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}} className="resources-grid">

            <div>
              <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>📖 Guides</h3>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {guides.map(g => (
                  <div key={g.id} style={{background:'#13131A',border:'1px solid #1F1F28',borderRadius:12,padding:'12px 14px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                      <img src={g.img} style={{width:32,height:32,borderRadius:7,objectFit:'cover',flexShrink:0}} alt="" />
                      <span style={{fontWeight:700,fontSize:13,color:'white'}}>{g.game}</span>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:4}}>
                      {(g.links??[]).map((l: any) => (
                        <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{color:'rgba(255,255,255,0.45)',fontSize:12,textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.color='#EC796B')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.45)')}>
                          {l.emoji} <span style={{textDecoration:'underline'}}>{l.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>🛒 Marketplaces</h3>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {marketplaces.map(m => (
                  <a key={m.id} href={m.url} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#13131A',border:'1px solid #1F1F28',borderRadius:12,textDecoration:'none'}}>
                    <div style={{width:34,height:34,borderRadius:7,background:'#0A0A0F',border:'1px solid #1F1F28',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                      {m.img ? <img src={m.img} style={{width:'100%',height:'100%',objectFit:'cover'}} alt="" /> : <span style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)'}}>{m.name.charAt(0)}</span>}
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.8)'}}>{m.name}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{m.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>👥 Gamers to Follow</h3>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {gamers.map(u => (
                  <a key={u.id} href={`https://x.com/${u.handle}`} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#13131A',border:'1px solid #1F1F28',borderRadius:12,textDecoration:'none'}}>
                    <img src={`https://unavatar.io/x/${u.handle}`} style={{width:34,height:34,borderRadius:'50%',border:'1px solid #1F1F28',flexShrink:0}} alt={u.name} onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} />
                    <div>
                      <div style={{fontWeight:600,fontSize:13,color:'white'}}>{u.name}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>@{u.handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
