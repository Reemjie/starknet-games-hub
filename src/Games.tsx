import { useState } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

const GD = [
  {id:'lootsurvivor',name:'Loot Survivor',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s',url:'https://lootsurvivor.io',genre:'Roguelike',tags:['pve','arcade'],onchain:'Full',token:'$LORDS',gas:'~0.01€',diff:3,f2p:false,txsl:'12M+',color:'#F4C542',trend:'+12%',desc:'Roguelike arcade with permadeath. Fight monsters, collect legendary loot.'},
  {id:'blobarena',name:'BlobArena',img:'https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0',url:'https://blobarena.xyz',genre:'Arcade PvP',tags:['pvp','arcade'],onchain:'Full',token:'N/A',gas:'~0.005€',diff:2,f2p:true,txsl:'8.2M',color:'#EC796B',trend:'+28%',desc:'Fast-paced PvP arena. Master unique abilities and dominate.'},
  {id:'jokersofneon',name:'Jokers of Neon',img:'https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg',url:'https://jokersofneon.com',genre:'Card Game',tags:['card','pvp'],onchain:'Partial',token:'N/A',gas:'~0.02€',diff:3,f2p:false,txsl:'3.1M',color:'#a78bfa',trend:'+ATH',desc:'Cyberpunk poker with NFT cards. High-stakes tournaments.'},
  {id:'realms',name:'Realms Blitz',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThd7w4cX4MSjUtwcp5-Tqa--giLP0Qf5ABBw&s',url:'https://eternum.realms.world',genre:'Strategy MMO',tags:['strategy','pvp'],onchain:'Full',token:'$LORDS',gas:'~0.03€',diff:5,f2p:false,txsl:'2.8M',color:'#34d399',trend:'+8%',desc:'Fully on-chain strategy MMO. Build your kingdom.'},
  {id:'ponziland',name:'PonziLand',img:'https://play.ponzi.land/logo.png',url:'https://play.ponzi.land',genre:'Strategy',tags:['strategy'],onchain:'Full',token:'$STRK',gas:'~0.01€',diff:4,f2p:false,txsl:'1.5M',color:'#f97316',trend:'+Ref',desc:'Economic strategy: buy land, optimize taxes and liquidity.'},
  {id:'summit',name:'Summit',img:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium',url:'https://www.summit.game',genre:'Battle MMO',tags:['pvp','strategy'],onchain:'Full',token:'$SURVIVOR',gas:'Very low',diff:2,f2p:true,txsl:'900k',color:'#60a5fa',trend:'🔥 New',desc:'King-of-the-hill MMO. Your Beasts battle for the summit.'},
  {id:'darkshuffle',name:'Dark Shuffle',img:'https://pbs.twimg.com/card_img/2021183745525432320/6ZKNucYn?format=png&name=large',url:'https://darkshuffle.io',genre:'Deck-building',tags:['card','pve'],onchain:'Full',token:'N/A',gas:'~0.01€',diff:3,f2p:false,txsl:'700k',color:'#c084fc',trend:'+5%',desc:'Deck-building roguelike. Explore procedural maps.'},
  {id:'zkube',name:'zKube',img:'https://pbs.twimg.com/profile_images/1844012375462068224/S0SgtVy7_400x400.png',url:'https://app.zkube.xyz',genre:'Puzzle',tags:['pve','arcade'],onchain:'Full',token:'N/A',gas:'~0.005€',diff:1,f2p:true,txsl:'400k',color:'#22d3ee',trend:'Stable',desc:'On-chain Tetris-like puzzle game.'},
];

const GUIDES = [
  {game:'Realms Blitz',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThd7w4cX4MSjUtwcp5-Tqa--giLP0Qf5ABBw&s',links:[{emoji:'📖',label:'Beginner Guide',url:'https://medium.com/@AlexiaChukwuma/eternum-or-blitz-choosing-your-battle-in-starknets-flagship-rts-c017ef48cb98'},{emoji:'💬',label:'Starter Guide by Lordcumberlord',url:'https://x.com/lordcumberlord/status/2011095751196360980'}]},
  {game:'BlobArena',img:'https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0',links:[{emoji:'📖',label:'Getting Started',url:'https://www.starknet.io/blog/starknet-starter-pack/'},{emoji:'📖',label:'Tutorial by Heyshadowfax',url:'https://x.com/Starknet/status/1965430258850820293'},{emoji:'📖',label:'How to Play by OxKenzman',url:'https://x.com/kenzman18/status/1966070066320998828'}]},
  {game:'Jokers of Neon',img:'https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg',links:[{emoji:'📖',label:'Official Docs',url:'https://docs.jokersofneon.com/'},{emoji:'📖',label:'First Steps Tutorial',url:'https://www.youtube.com/watch?v=yCac6cfDm3k'},{emoji:'📖',label:'The Straights Strategy',url:'https://x.com/charrweb3/status/2020943203839483975'}]},
  {game:'Loot Survivor',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s',links:[{emoji:'📖',label:'Complete Guide',url:'https://www.gam3s.gg/news/how-to-play-loot-survivor-on-starknet/'},{emoji:'📖',label:'Go beyond level 10',url:'https://x.com/lordcumberlord/status/1969288053484118076'},{emoji:'📖',label:'Full guide by Odin',url:'https://x.com/odin_free/status/2002681429847617776'}]},
  {game:'Summit',img:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium',links:[{emoji:'📖',label:'Summit guide by Okhai',url:'https://x.com/sudo_okhai/article/2013210791114125799'},{emoji:'📖',label:'Heyshadowfax guide',url:'https://x.com/Starknet/status/2024174211187519853'}]},
  {game:'PonziLand',img:'https://play.ponzi.land/logo.png',links:[{emoji:'📖',label:'Documentation',url:'https://github.com/RuneLabsxyz/PonziLand'},{emoji:'📖',label:'Official Interactive Tutorial',url:'https://play.ponzi.land/tutorial'}]},
];

const MARKETPLACES = [
  {name:'Element Market',desc:'Starknet NFT marketplace',url:'https://element.market/starknet'},
  {name:'Realms Market',desc:'Realms Eternum NFTs',url:'https://empire.realms.world/trade',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThd7w4cX4MSjUtwcp5-Tqa--giLP0Qf5ABBw&s'},
  {name:'Survivor Exchange',desc:'Loot Survivor assets',url:'https://dev.survivor.exchange/',img:'https://pbs.twimg.com/profile_images/1827234376465121280/yAe5k3MN_400x400.png'},
  {name:'BeastDex',desc:'by spag',url:'https://beastdex.app/marketplace',img:'https://res.cloudinary.com/dtqbnob94/image/upload/v1771609532/Capture_d_e%CC%81cran_2026-02-20_a%CC%80_18.45.07_eicwfv.png'},
  {name:'Jokers Market',desc:'Cards marketplace',url:'https://play.cartridge.gg/game/jokers-of-neon/marketplace',img:'https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg'},
];

const GAMERS = [
  {name:'Odin',handle:'odin_free'},{name:'Shadowfax',handle:'heyshadowfax'},
  {name:'Cumberlord',handle:'lordcumberlord'},{name:'Calc',handle:'Calcutat'},
  {name:'Legacy gg',handle:'Lgc_GG'},{name:'Tsubasa',handle:'tsubasaP2E'},
  {name:'Djizus',handle:'djizus_'},{name:'Cudan',handle:'Cudan_Svat'},
];

const DIFFLABELS = ['','Beginner','Easy','Medium','Advanced','Expert'];
const toNum = (s: string) => { const n = parseFloat(s.replace('M+','e6').replace('M','e6').replace('k','e3')); return isNaN(n) ? 0 : n; };

export function GamesPage() {
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('lb');
  const filtered = GD.filter(g => filter === 'all' || g.tags.includes(filter));
  const sorted = [...filtered].sort((a,b) => toNum(b.txsl) - toNum(a.txsl));

  return (
    <>
      <Nav />
      <div className="wrap" style={{paddingTop:80}}>
        <div style={{marginBottom:44}}>
          <span className="sec-badge" style={{display:'inline-flex',marginBottom:10}}>🎮 All Games</span>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(26px,4vw,40px)',fontWeight:900,color:'white',margin:'0 0 6px'}}>Starknet <span className="grad-text">Game Library</span></h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:15,margin:0}}>Compare, explore guides, find your next on-chain adventure.</p>
        </div>

        <div className="gg" style={{marginBottom:56}}>
          {GD.map(g => (
            <a key={g.id} href={g.url} target="_blank" rel="noreferrer" className="gc">
              <img src={g.img} alt={g.name} />
              <div className="gc-info">
                <div className="gc-name">{g.name}</div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:6}}>
                  {g.tags.slice(0,2).map(t => <span key={t} className="tag">{t}</span>)}
                  {g.f2p && <span className="tag" style={{color:'#22c55e',background:'rgba(34,197,94,0.1)'}}>F2P</span>}
                </div>
                <p style={{color:'rgba(255,255,255,0.3)',fontSize:10,margin:0,lineHeight:1.5,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{g.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <section style={{marginBottom:72}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <span className="sec-badge" style={{display:'inline-flex',marginBottom:10}}>📊 Compare</span>
            <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(22px,3.5vw,34px)',fontWeight:900,color:'white',margin:0}}>Games <span className="grad-text">Comparator</span></h2>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
            {['all','pvp','pve','strategy','card'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{padding:'5px 14px',borderRadius:8,fontSize:11,fontWeight:600,border:'1px solid',fontFamily:"'Orbitron',sans-serif",cursor:'pointer',background:filter===f?'rgba(236,121,107,0.15)':'transparent',borderColor:filter===f?'#EC796B':'rgba(255,255,255,0.08)',color:filter===f?'white':'rgba(255,255,255,0.4)'}}>
                {f === 'all' ? 'All' : f.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{display:'flex',borderBottom:'1px solid #1F1F28',marginBottom:18}}>
            {[['lb','🏆 Leaderboard'],['table','📊 Table'],['cards','🃏 Fact Sheets']].map(([id,label]) => (
              <button key={id} onClick={() => setTab(id)} style={{padding:'9px 18px',fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,border:'none',background:'transparent',color:tab===id?'white':'rgba(255,255,255,0.4)',cursor:'pointer',borderBottom:tab===id?'2px solid #EC796B':'2px solid transparent',whiteSpace:'nowrap'}}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'lb' && (
            <div style={{background:'#13131A',border:'1px solid #1F1F28',borderRadius:16,overflow:'hidden'}}>
              {sorted.map((g,i) => (
                <div key={g.id} style={{display:'grid',gridTemplateColumns:'44px 1fr 100px 80px',alignItems:'center',gap:8,padding:'10px 16px',borderBottom:i<sorted.length-1?'1px solid rgba(31,31,40,0.5)':'none',minHeight:56}}>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",color:'rgba(255,255,255,0.25)',fontSize:12}}>{i+1}</span>
                  <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                    <img src={g.img} style={{width:34,height:34,borderRadius:7,objectFit:'cover',flexShrink:0,border:`1px solid ${g.color}33`}} alt="" />
                    <div style={{minWidth:0}}>
                      <a href={g.url} target="_blank" rel="noreferrer" style={{fontWeight:700,fontSize:13,color:'white',textDecoration:'none',display:'block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{g.name}</a>
                      <span style={{display:'inline-block',padding:'1px 6px',borderRadius:999,background:`${g.color}18`,color:g.color,border:`1px solid ${g.color}30`,fontSize:9,marginTop:2}}>{g.genre}</span>
                      {g.f2p && <span style={{display:'inline-block',padding:'1px 6px',borderRadius:999,background:'rgba(34,197,94,0.1)',color:'#22c55e',border:'1px solid rgba(34,197,94,0.25)',fontSize:9,marginLeft:4}}>F2P</span>}
                    </div>
                  </div>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:'white'}}>{g.txsl}</div>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,fontWeight:700,color:'#22c55e'}}>{g.trend}</span>
                </div>
              ))}
              <p style={{color:'rgba(255,255,255,0.15)',fontSize:11,textAlign:'center',margin:'10px 0',fontFamily:"'Share Tech Mono',monospace"}}>* Estimated — Sources: growthepie.xyz, starkarcade</p>
            </div>
          )}

          {tab === 'table' && (
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',fontSize:13,minWidth:760,borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{color:'rgba(255,255,255,0.28)',fontSize:10,textTransform:'uppercase',letterSpacing:1,borderBottom:'1px solid #1F1F28'}}>
                    {['Game','Type','On-chain','Token','Gas','F2P','Difficulty'].map(h => (
                      <th key={h} style={{textAlign:'left',padding:'10px 12px',fontWeight:600}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(g => {
                    const ocCol = g.onchain === 'Full' ? '#22c55e' : '#f97316';
                    return (
                      <tr key={g.id} style={{borderBottom:'1px solid rgba(31,31,40,0.5)'}}>
                        <td style={{padding:'11px 12px'}}><div style={{display:'flex',alignItems:'center',gap:8}}><img src={g.img} style={{width:30,height:30,borderRadius:6,objectFit:'cover'}} alt="" /><a href={g.url} target="_blank" rel="noreferrer" style={{color:'white',fontWeight:600,textDecoration:'none'}}>{g.name}</a></div></td>
                        <td style={{padding:'11px 12px'}}><span style={{padding:'2px 8px',borderRadius:999,background:`${g.color}18`,color:g.color,border:`1px solid ${g.color}30`,fontSize:10}}>{g.genre}</span></td>
                        <td style={{padding:'11px 12px'}}><span style={{padding:'2px 8px',borderRadius:999,background:`${ocCol}15`,color:ocCol,border:`1px solid ${ocCol}30`,fontSize:10}}>{g.onchain}</span></td>
                        <td style={{padding:'11px 12px',fontFamily:"'Share Tech Mono',monospace",color:'rgba(255,255,255,0.45)',fontSize:12}}>{g.token}</td>
                        <td style={{padding:'11px 12px',fontFamily:"'Share Tech Mono',monospace",color:'rgba(255,255,255,0.45)',fontSize:12}}>{g.gas}</td>
                        <td style={{padding:'11px 12px'}}>{g.f2p ? <span style={{padding:'2px 8px',borderRadius:999,background:'rgba(34,197,94,0.1)',color:'#22c55e',border:'1px solid rgba(34,197,94,0.25)',fontSize:10}}>✓ Yes</span> : <span style={{color:'rgba(255,255,255,0.18)',fontSize:12}}>No</span>}</td>
                        <td style={{padding:'11px 12px',color:'rgba(255,255,255,0.45)',fontSize:12}}>{DIFFLABELS[g.diff]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'cards' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:14}}>
              {filtered.map(g => (
                <div key={g.id} style={{background:'#13131A',borderRadius:16,overflow:'hidden',border:`1px solid ${g.color}22`}}>
                  <div style={{height:110,overflow:'hidden',position:'relative'}}>
                    <img src={g.img} style={{width:'100%',height:'100%',objectFit:'cover',filter:'saturate(0.5)'}} alt="" />
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 20%,rgba(19,19,26,0.95))'}}>
                      <div style={{position:'absolute',bottom:10,left:12,right:12,display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
                        <div>
                          <h4 style={{fontWeight:700,fontSize:13,color:'white',margin:'0 0 3px'}}>{g.name}</h4>
                          <span style={{padding:'1px 6px',borderRadius:999,background:`${g.color}20`,color:g.color,border:`1px solid ${g.color}30`,fontSize:9}}>{g.genre}</span>
                        </div>
                        <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:g.color,fontWeight:700}}>{g.txsl} tx</span>
                      </div>
                    </div>
                  </div>
                  <div style={{padding:'12px 14px'}}>
                    <p style={{color:'rgba(255,255,255,0.4)',fontSize:11,lineHeight:1.6,margin:'0 0 10px'}}>{g.desc}</p>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,paddingTop:8,borderTop:'1px solid #1F1F28',textAlign:'center'}}>
                      <div><div style={{fontSize:9,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>Diff</div><div style={{fontSize:11}}>{Array.from({length:5},(_,d) => <span key={d} style={{color:d<g.diff?g.color:'rgba(255,255,255,0.1)'}}>★</span>)}</div></div>
                      <div><div style={{fontSize:9,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>Gas</div><div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:'rgba(255,255,255,0.55)'}}>{g.gas}</div></div>
                      <div><div style={{fontSize:9,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>F2P</div><div style={{fontSize:11,color:g.f2p?'#22c55e':'rgba(255,255,255,0.2)'}}>{g.f2p?'✓':'No'}</div></div>
                    </div>
                    <a href={g.url} target="_blank" rel="noreferrer" style={{display:'block',textAlign:'center',padding:'7px',borderRadius:7,fontSize:11,fontWeight:700,textDecoration:'none',background:`${g.color}18`,border:`1px solid ${g.color}35`,color:g.color,marginTop:10}}>Play →</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3 colonnes : Guides | Marketplaces | Gamers */}
        <section style={{marginBottom:72}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <span className="sec-badge" style={{display:'inline-flex',marginBottom:10}}>📚 Resources</span>
            <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(22px,3.5vw,34px)',fontWeight:900,color:'white',margin:0}}>Guides, Marketplaces & <span className="grad-text">Community</span></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>

            {/* Colonne 1 — Guides */}
            <div>
              <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>📖 Guides</h3>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {GUIDES.map(g => (
                  <div key={g.game} style={{background:'#13131A',border:'1px solid #1F1F28',borderRadius:12,padding:'12px 14px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                      <img src={g.img} style={{width:32,height:32,borderRadius:7,objectFit:'cover',flexShrink:0}} alt="" />
                      <span style={{fontWeight:700,fontSize:13,color:'white'}}>{g.game}</span>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:4}}>
                      {g.links.map(l => (
                        <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{color:'rgba(255,255,255,0.45)',fontSize:12,textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.color='#EC796B')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.45)')}>
                          {l.emoji} <span style={{textDecoration:'underline'}}>{l.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne 2 — Marketplaces */}
            <div>
              <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>🛒 Marketplaces</h3>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {MARKETPLACES.map(m => (
                  <a key={m.name} href={m.url} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:'#13131A',border:'1px solid #1F1F28',borderRadius:12,textDecoration:'none'}}>
                    <div style={{width:34,height:34,borderRadius:7,background:'#0A0A0F',border:'1px solid #1F1F28',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                      {(m as any).img ? <img src={(m as any).img} style={{width:'100%',height:'100%',objectFit:'cover'}} alt="" /> : <span style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)'}}>{m.name.charAt(0)}</span>}
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.8)'}}>{m.name}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{m.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Colonne 3 — Gamers to Follow */}
            <div>
              <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.3)',letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>👥 Gamers to Follow</h3>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {GAMERS.map(u => (
                  <a key={u.handle} href={`https://x.com/${u.handle}`} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#13131A',border:'1px solid #1F1F28',borderRadius:12,textDecoration:'none'}}>
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
