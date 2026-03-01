import { useState } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

const STEPS = [
  {
    num:'01', color:'#5C5ADB', icon:'💳', label:'Install your wallet',
    desc:"A wallet = your identity on Starknet. Free, in 2 minutes, no personal info required.",
    wallets:[
      {name:'Argent X',sub:'Chrome/Firefox · Most popular',url:'https://www.argent.xyz/argent-x/',tag:'Recommended',tc:'#22c55e'},
      {name:'Braavos',sub:'Extension + Mobile',url:'https://braavos.app/',tag:'Mobile',tc:'#5C5ADB'},
      {name:'Cartridge Controller',sub:'Integrated · The simplest',url:'https://cartridge.gg',tag:'Gaming',tc:'#F4C542'},
    ]
  },
  {
    num:'02', color:'#EC796B', icon:'💰', label:'Get STRK',
    desc:"STRK is Starknet's token for gas fees. Ultra-low cost — often less than €0.01 per action.",
    dexs:[
      {name:'AVNU',sub:'Native Starknet DEX',url:'https://app.avnu.fi/'},
      {name:'Binance',sub:'STRK/USDT pair',url:'https://www.binance.com/fr/trade/STRK_USDT'},
    ]
  },
  {
    num:'03', color:'#22c55e', icon:'🎮', label:'Start the game!',
    desc:"Connect your wallet, sign your first transaction and dive in. Your assets are yours forever.",
    items:[
      {icon:'⛓️',title:'Each action = one transaction',desc:'Attack, craft, buy... every move is recorded on-chain.'},
      {icon:'🔒',title:'Your assets truly belong to you',desc:"No one can delete your character or items — not even the devs."},
      {icon:'🔑',title:'No email account needed',desc:'Your wallet IS your account. Same address across all Starknet games.'},
    ]
  }
];

const QUICK_GAMES = [
  {name:'BlobArena',desc:'Free · Quick matches · Easy',img:'https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0',url:'https://blobarena.xyz'},
  {name:'zKube',desc:'Free · Puzzle · No wallet needed',img:'https://pbs.twimg.com/profile_images/1844012375462068224/S0SgtVy7_400x400.png',url:'https://app.zkube.xyz'},
  {name:'Summit',desc:'Free · Battle · Via Cartridge',img:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium',url:'https://www.summit.game'},
  {name:'Loot Survivor',desc:'Arcade · Legendary',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s',url:'https://lootsurvivor.io'},
];

const FAQS = [
  {emoji:'⛓️',q:'What does "on-chain" really mean?',sub:'The difference that changes everything',answer:'In a classic game, your data is on the developer\'s servers. If they shut down, your account disappears. In an on-chain game, every action is written on Starknet — public, permanent, impossible to alter.'},
  {emoji:'🔏',q:'What is a signature / transaction?',sub:'What happens when your wallet opens',answer:'When your wallet asks you to sign, it\'s like approving an action with your unique key. A transaction executes and costs a tiny fraction of STRK — often less than €0.01 on Starknet.'},
  {emoji:'🌱',q:'Can I play without spending money?',sub:'Short answer: yes',answer:'Yes! Thanks to Cartridge Controller, many games cover gas fees for you automatically. For other games, fees are so low that a tiny amount of STRK is enough to play for hours.'},
  {emoji:'🔑',q:'What is a seed phrase?',sub:'The master key to your wallet',answer:'When you create a wallet, it generates 12 or 24 random words. This is your seed phrase — write it on paper, never store it digitally, and never share it with anyone.'},
];

export function LearnPage() {
  const [openStep, setOpenStep] = useState<number|null>(null);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  return (
    <>
      <Nav />
      <div className="wrap" style={{maxWidth:1100,paddingTop:80}}>
        <div style={{textAlign:'center',marginBottom:60}}>
          <div style={{fontSize:60,marginBottom:14}}>⚡</div>
          <span className="sec-badge" style={{display:'inline-flex',marginBottom:14}}>New to Starknet?</span>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(26px,5vw,42px)',fontWeight:900,color:'white',margin:'0 0 10px'}}>Play in <span className="grad-text">3 simple steps</span></h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:15,maxWidth:440,margin:'0 auto'}}>No credit card, no account required. Just a wallet — we explain everything.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14,marginBottom:72}}>
          {STEPS.map((s,i) => (
            <div key={i} onClick={() => setOpenStep(openStep===i?null:i)} style={{background:'#13131A',border:`1px solid ${openStep===i?s.color+'40':'#1F1F28'}`,borderRadius:20,padding:24,cursor:'pointer',transition:'all 0.3s'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:s.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:700,color:'white',flexShrink:0}}>{s.num}</div>
                <div style={{flex:1,height:1,background:`linear-gradient(90deg,${s.color}40,transparent)`}}/>
              </div>
              <div style={{width:50,height:50,borderRadius:12,background:`${s.color}12`,border:`1px solid ${s.color}28`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14,fontSize:22}}>{s.icon}</div>
              <h3 style={{color:'white',fontWeight:700,fontSize:17,margin:'0 0 8px'}}>{s.label}</h3>
              <p style={{color:'rgba(255,255,255,0.42)',fontSize:13,lineHeight:1.6,margin:'0 0 14px'}}>{s.desc}</p>
              <div style={{display:'flex',alignItems:'center',gap:6,color:s.color,fontSize:12,fontWeight:600}}>
                <span>See details</span>
                <span style={{transition:'transform 0.3s',display:'inline-block',transform:openStep===i?'rotate(180deg)':'none'}}>▾</span>
              </div>
              {openStep === i && (
                <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid #1F1F28'}}>
                  {i === 0 && (
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      {s.wallets!.map(w => (
                        <a key={w.name} href={w.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',textDecoration:'none',background:'rgba(255,255,255,0.02)'}}>
                          <div style={{width:36,height:36,borderRadius:8,background:'#0A0A0F',border:'1px solid #1F1F28',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <span style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.3)'}}>{w.name.charAt(0)}</span>
                          </div>
                          <div style={{flex:1}}>
                            <div style={{color:'white',fontSize:13,fontWeight:600}}>{w.name}</div>
                            <div style={{color:'rgba(255,255,255,0.3)',fontSize:11}}>{w.sub}</div>
                          </div>
                          <span style={{padding:'2px 7px',borderRadius:999,fontSize:9,fontWeight:700,background:`${w.tc}18`,color:w.tc,border:`1px solid ${w.tc}35`,whiteSpace:'nowrap'}}>{w.tag}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {i === 1 && (
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      <div style={{padding:'10px 12px',borderRadius:8,background:'rgba(236,121,107,0.06)',border:'1px solid rgba(236,121,107,0.2)'}}>
                        <p style={{color:'#EC796B',fontSize:11,fontWeight:700,margin:'0 0 2px'}}>🎮 Gaming Option (free)</p>
                        <p style={{color:'rgba(255,255,255,0.5)',fontSize:11,margin:0}}>Most games via Cartridge cover gas for you. Play without any STRK!</p>
                      </div>
                      {s.dexs!.map(d => (
                        <a key={d.name} href={d.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',textDecoration:'none',background:'rgba(255,255,255,0.02)'}}>
                          <div style={{width:30,height:30,borderRadius:6,background:'#0A0A0F',border:'1px solid #1F1F28',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <span style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)'}}>{d.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div style={{color:'white',fontSize:12,fontWeight:600}}>{d.name}</div>
                            <div style={{color:'rgba(255,255,255,0.3)',fontSize:10}}>{d.sub}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  {i === 2 && (
                    <div style={{display:'flex',flexDirection:'column',gap:12}}>
                      {s.items!.map(item => (
                        <div key={item.title} style={{display:'flex',alignItems:'flex-start',gap:10}}>
                          <div style={{width:28,height:28,borderRadius:6,background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{item.icon}</div>
                          <div>
                            <div style={{color:'white',fontSize:13,fontWeight:600}}>{item.title}</div>
                            <div style={{color:'rgba(255,255,255,0.35)',fontSize:11,marginTop:2,lineHeight:1.5}}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{marginBottom:72,padding:26,background:'#13131A',border:'1px solid #1F1F28',borderRadius:18}}>
          <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,color:'white',margin:'0 0 5px',letterSpacing:1}}>WHERE TO START?</h3>
          <p style={{color:'rgba(255,255,255,0.35)',fontSize:13,margin:'0 0 18px'}}>Best games for new players — low barrier, free to start:</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10}}>
            {QUICK_GAMES.map(g => (
              <a key={g.name} href={g.url} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:12,padding:12,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,textDecoration:'none'}}>
                <img src={g.img} style={{width:40,height:40,borderRadius:8,objectFit:'cover',flexShrink:0}} alt="" />
                <div>
                  <div style={{color:'white',fontSize:13,fontWeight:600}}>{g.name}</div>
                  <div style={{color:'rgba(255,255,255,0.3)',fontSize:11,marginTop:1}}>{g.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div style={{marginBottom:60}}>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
            <div style={{flex:1,height:1,background:'rgba(255,255,255,0.05)'}}/>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,color:'rgba(255,255,255,0.18)',letterSpacing:2,whiteSpace:'nowrap'}}>UNDERSTANDING WEB3</span>
            <div style={{flex:1,height:1,background:'rgba(255,255,255,0.05)'}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10}}>
            {FAQS.map((f,i) => (
              <div key={i} onClick={() => setOpenFaq(openFaq===i?null:i)} style={{background:'#13131A',border:`1px solid ${openFaq===i?'rgba(92,90,219,0.35)':'#1F1F28'}`,borderRadius:14,padding:'18px 20px',cursor:'pointer',transition:'all 0.3s'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                    <span style={{fontSize:20,lineHeight:1.2,flexShrink:0}}>{f.emoji}</span>
                    <div>
                      <h4 style={{color:'white',fontSize:14,fontWeight:700,margin:'0 0 3px'}}>{f.q}</h4>
                      <p style={{color:'rgba(255,255,255,0.28)',fontSize:11,margin:0}}>{f.sub}</p>
                    </div>
                  </div>
                  <span style={{color:'rgba(255,255,255,0.22)',transition:'transform 0.3s',display:'inline-block',transform:openFaq===i?'rotate(180deg)':'none',flexShrink:0,fontSize:14}}>▾</span>
                </div>
                {openFaq === i && (
                  <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid #1F1F28'}}>
                    <p style={{color:'rgba(255,255,255,0.5)',fontSize:13,lineHeight:1.7,margin:0}}>{f.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign:'center',padding:'36px 20px',borderRadius:18,background:'linear-gradient(135deg,rgba(92,90,219,0.07),rgba(236,121,107,0.04))',border:'1px solid rgba(92,90,219,0.2)'}}>
          <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:900,color:'white',margin:'0 0 8px'}}>Ready to play?</h3>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:14,margin:'0 0 22px'}}>Start with a free game or browse the full library.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="https://blobarena.xyz" target="_blank" rel="noreferrer" className="btn-primary">🎮 Play BlobArena (Free)</a>
            <a href="#games" className="btn-ghost">Browse all games</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
