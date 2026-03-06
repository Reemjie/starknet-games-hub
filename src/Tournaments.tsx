import { useState, useEffect } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

const DATA_URL = import.meta.env.BASE_URL + "data.json";


function cdStr(endTs: number) {
  const diff = Math.max(0, endTs - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return d > 0 ? [{v:d,l:'days'},{v:h,l:'hrs'},{v:m,l:'min'}] : [{v:h,l:'hrs'},{v:m,l:'min'},{v:s,l:'sec'}];
}

function Countdown({ endTs }: { endTs: number }) {
  const [parts, setParts] = useState(cdStr(endTs));
  useEffect(() => {
    const t = setInterval(() => setParts(cdStr(endTs)), 1000);
    return () => clearInterval(t);
  }, [endTs]);
  return (
    <div style={{display:'flex',gap:6}}>
      {parts.map((p,i) => (
        <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',minWidth:40,padding:'5px 7px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:7}}>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:16,fontWeight:700,color:'white',lineHeight:1}}>{String(p.v).padStart(2,'0')}</div>
          <div style={{fontSize:8,color:'rgba(255,255,255,0.3)',letterSpacing:1,textTransform:'uppercase',marginTop:2}}>{p.l}</div>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === 'live') return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:999,background:'rgba(34,197,94,0.15)',border:'1px solid rgba(34,197,94,0.4)',color:'#22c55e',fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:700}}><span style={{width:5,height:5,borderRadius:'50%',background:'#22c55e',flexShrink:0,display:'inline-block'}}/>LIVE</span>;
  if (status === 'upcoming') return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:999,background:'rgba(244,197,66,0.15)',border:'1px solid rgba(244,197,66,0.4)',color:'#F4C542',fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:700}}>⏳ SOON</span>;
  return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:999,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.3)',fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:700}}>✓ ENDED</span>;
}

export function TournamentsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [TOURNEYS, setTourneys] = useState<any[]>([]);
  useEffect(() => {
    const load = () => fetch(DATA_URL + "?t=" + Date.now())
      .then(r => r.json())
      .then(d => setTourneys(d.tournaments || []))
      .catch(() => {});
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, []);
  const featured = TOURNEYS.find((t: any) => t.featured && t.status === 'live');
  const list = TOURNEYS.filter((t: any) => !t.featured && (statusFilter === 'all' || t.status === statusFilter));


  const ended = TOURNEYS.filter((t: any) => t.status === 'ended' && t.winner);

  return (
    <>
      <Nav />
      <div className="wrap" style={{paddingTop:32}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <span className="sec-badge" style={{display:'inline-flex',marginBottom:12}}>🔴 Tournaments</span>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(26px,5vw,42px)',fontWeight:900,color:'white',margin:'0 0 8px'}}>Tournament <span className="grad-text">Hub</span></h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:15,margin:'0 auto',maxWidth:460}}>Every Starknet competition in one place — live countdowns, prize pools, instant access.</p>
        </div>



        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24}}>
          {[['all','All'],['live','🔴 Live'],['upcoming','⏳ Upcoming'],['ended','✓ Ended']].map(([f,l]) => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{padding:'6px 16px',borderRadius:8,fontSize:11,fontWeight:600,border:'1px solid',fontFamily:"'Orbitron',sans-serif",cursor:'pointer',background:statusFilter===f?'rgba(236,121,107,0.15)':'transparent',borderColor:statusFilter===f?'#EC796B':'rgba(255,255,255,0.08)',color:statusFilter===f?'white':'rgba(255,255,255,0.4)'}}>
              {l}
            </button>
          ))}
        </div>

        {featured && (
          <div style={{background:'#13131A',border:'1px solid #1F1F28',borderRadius:18,overflow:'hidden',marginBottom:20,position:'relative'}}>
            <div style={{position:'absolute',top:0,right:0,bottom:0,width:'38%',overflow:'hidden',borderRadius:'0 18px 18px 0'}}>
              <img src={featured.gameImg} style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.15,filter:'saturate(0.3)'}} alt="" />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#13131A,transparent 60%)'}}/>
            </div>
            <div style={{padding:'26px 30px',position:'relative',zIndex:2}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                <span style={{background:`linear-gradient(135deg,${featured.color},#f97316)`,padding:'2px 10px',borderRadius:5,fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:700,color:'#000',letterSpacing:1}}>✦ FEATURED</span>
                <StatusPill status={featured.status} />
              </div>
              <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(18px,3vw,28px)',fontWeight:900,color:'white',margin:'0 0 6px',maxWidth:'58%'}}>{featured.name}</h2>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,maxWidth:'50%',margin:'0 0 18px',lineHeight:1.6}}>{featured.desc}</p>
              <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:20,marginBottom:20}}>
                <div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,0.28)',letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>Prize Pool</div>
                  <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:7,background:'rgba(244,197,66,0.1)',border:'1px solid rgba(244,197,66,0.3)',color:'#F4C542',fontFamily:"'Share Tech Mono',monospace",fontSize:12,fontWeight:700}}>🏆 {featured.prize}</span>
                </div>
                <div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,0.28)',letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>Players</div>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:14,color:'white'}}>{featured.players} / {featured.maxPlayers}</div>
                  <div style={{height:4,borderRadius:2,background:'rgba(255,255,255,0.06)',overflow:'hidden',width:130,marginTop:4}}>
                    <div style={{height:4,borderRadius:2,background:featured.color,width:`${Math.round(featured.players/featured.maxPlayers*100)}%`}}/>
                  </div>
                </div>
                {featured.endTimestamp && (
                  <div>
                    <div style={{fontSize:9,color:'rgba(255,255,255,0.28)',letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>Ends In</div>
                    <Countdown endTs={featured.endTimestamp} />
                  </div>
                )}
              </div>
              <a href={featured.url} target="_blank" rel="noreferrer" className="btn-primary">Join Tournament →</a>
            </div>
          </div>
        )}

        <div className="tg">
          {list.map(t => {
            const pct = t.maxPlayers > 0 ? Math.round(t.players/t.maxPlayers*100) : 0;
            return (
              <a key={t.id} href={t.url} target="_blank" rel="noreferrer" style={{background:'#13131A',borderRadius:14,border:'1px solid #1F1F28',padding:18,transition:'all 0.3s',cursor:'pointer',textDecoration:'none',display:'block'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <img src={t.gameImg} style={{width:36,height:36,borderRadius:8,objectFit:'cover',border:`1px solid ${t.color}40`,flexShrink:0}} alt="" />
                    <div>
                      <div style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>{t.game}</div>
                      <div style={{fontWeight:700,fontSize:14,color:'white'}}>{t.name}</div>
                    </div>
                  </div>
                  <StatusPill status={t.status} />
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:7,background:'rgba(244,197,66,0.1)',border:'1px solid rgba(244,197,66,0.3)',color:'#F4C542',fontFamily:"'Share Tech Mono',monospace",fontSize:11,fontWeight:700}}>{t.prize}</span>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:'rgba(255,255,255,0.35)'}}>{t.players}/{t.maxPlayers}</span>
                </div>
                <div style={{height:4,borderRadius:2,background:'rgba(255,255,255,0.06)',overflow:'hidden',margin:'8px 0'}}>
                  <div style={{height:4,borderRadius:2,background:t.color,opacity:0.7,width:`${pct}%`}}/>
                </div>
                {t.status !== 'ended' && t.endTimestamp && <Countdown endTs={t.endTimestamp} />}
                {(t as any).winner && <div style={{marginTop:8,fontSize:11,color:'rgba(255,255,255,0.28)'}}>🏆 Winner: <span style={{fontFamily:"'Share Tech Mono',monospace",color:'#F4C542'}}>{(t as any).winner}</span></div>}
                {t.status !== 'ended' && <div style={{marginTop:12,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.05)',textAlign:'right'}}><span style={{fontSize:12,fontWeight:700,color:t.color}}>Enter →</span></div>}
              </a>
            );
          })}
        </div>

        <div style={{marginTop:36,padding:'22px 26px',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14,border:'1px dashed rgba(92,90,219,0.3)',background:'rgba(92,90,219,0.04)'}}>
          <div>
            <h4 style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:700,color:'white',margin:'0 0 4px'}}>Organizing a tournament?</h4>
            <p style={{color:'rgba(255,255,255,0.35)',fontSize:13,margin:0}}>Submit it and reach the full Starknet gaming community.</p>
          </div>
          <a href="https://x.com/Reemjie_" target="_blank" rel="noreferrer" className="btn-primary" style={{background:'rgba(92,90,219,0.15)',border:'1px solid rgba(92,90,219,0.4)',boxShadow:'none'}}>DM @Reemjie_</a>
        </div>

        {ended.length > 0 && (
          <div style={{marginTop:56}}>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
              <div style={{flex:1,height:1,background:'rgba(255,255,255,0.05)'}}/>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,color:'rgba(255,255,255,0.2)',letterSpacing:2,whiteSpace:'nowrap'}}>RECENT WINNERS</span>
              <div style={{flex:1,height:1,background:'rgba(255,255,255,0.05)'}}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:10}}>
              {ended.map(t => (
                <div key={t.id} style={{background:'#13131A',border:'1px solid #1F1F28',borderRadius:12,padding:'13px 15px',display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:`${t.color}18`,border:`1px solid ${t.color}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🏆</div>
                  <div style={{minWidth:0,flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:'white',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.name}</div>
                    <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:t.color,margin:'2px 0'}}>{(t as any).winnerPrize || t.prize}</div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,0.2)'}}>{(t as any).winner} · {t.game}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
