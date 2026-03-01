import { useState, useEffect } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { ConnectButton } from "./components/ConnectButton";
import { cartridgeConnector } from "./cartridge";

const RPC = "https://api.cartridge.gg/x/starknet/mainnet";

const GAMES: Record<string, { name: string; img: string; color: string; url: string; contracts: string[] }> = {
  lootsurvivor: {
    name: "Loot Survivor", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s",
    color: "#F4C542", url: "https://lootsurvivor.io",
    contracts: ["0x018108b32cea514a78ef1b0e4a702e9f9a6ba8bfe7b8a7d4b4d2e4c01c8e8b",
                "0x0305e8e6c32c61d09fdb4b2e0e358b6ce15e8c9c65eb48d6fb5083d63cad7a26"]
  },
  blobarena: {
    name: "BlobArena", img: "https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0",
    color: "#EC796B", url: "https://blobarena.xyz",
    contracts: ["0x02e8676b8e534580fef4e93e5d9a8c35e5ae8583f5b39baed6e5cf52cc9c50f"]
  },
  jokers: {
    name: "Jokers of Neon", img: "https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg",
    color: "#a78bfa", url: "https://jokersofneon.com",
    contracts: ["0x06a05844a03bb9e744479e3298f54705a35966ab04140d3d8dd797c1f6dc49d0"]
  },
  realms: {
    name: "Realms Blitz", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThd7w4cX4MSjUtwcp5-Tqa--giLP0Qf5ABBw&s",
    color: "#34d399", url: "https://eternum.realms.world",
    contracts: ["0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f"]
  },
  ponziland: {
    name: "PonziLand", img: "https://play.ponzi.land/logo.png",
    color: "#f97316", url: "https://play.ponzi.land",
    contracts: ["0x00a5de7e40f8fdb56e0f11d36e43049a3220dce24bef1b90eef7c9508bd8aeaa"]
  },
  summit: {
    name: "Summit", img: "https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium",
    color: "#60a5fa", url: "https://www.summit.game",
    contracts: ["0x0372b11f0a7da89f1f84e68dc9b3a30e03fbe0ab87a8e0e4dc5b6c5c9e8e2a1"]
  },
  darkshuffle: {
    name: "Dark Shuffle", img: "https://pbs.twimg.com/card_img/2021183745525432320/6ZKNucYn?format=png&name=large",
    color: "#c084fc", url: "https://darkshuffle.io",
    contracts: ["0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2"]
  },
};

const RANK_TIERS = [
  { min:0,    label:"EXPLORER",  color:"#94a3b8", icon:"🔍", next:50 },
  { min:50,   label:"PLAYER",    color:"#22c55e", icon:"🎮", next:250 },
  { min:250,  label:"GAMER",     color:"#3b82f6", icon:"⚡", next:750 },
  { min:750,  label:"VETERAN",   color:"#a78bfa", icon:"🏆", next:2000 },
  { min:2000, label:"LEGEND",    color:"#F4C542", icon:"👑", next:5000 },
  { min:5000, label:"IMMORTAL",  color:"#EC796B", icon:"🔥", next:5000 },
];

function getRank(n: number) {
  let t = RANK_TIERS[0];
  for (const r of RANK_TIERS) { if (n >= r.min) t = r; }
  const progress = t.next > t.min ? Math.min(100, Math.round(((n - t.min) / (t.next - t.min)) * 100)) : 100;
  return { ...t, progress };
}

function shortAddr(a: string) { return a.slice(0,8)+'...'+a.slice(-4); }

async function rpcCall(method: string, params: unknown[]) {
  const r = await fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.result;
}

interface GameStat { name: string; img: string; color: string; url: string; eventCount: number; }

export function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { provider } = useProvider();
  const [username, setUsername] = useState<string|null>(null);
  const [nonce, setNonce] = useState<number>(0);
  const [gameStats, setGameStats] = useState<GameStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('games');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!address || !provider) return;
    setLoading(true);
    setGameStats([]);

    // 1. Nonce
    provider.getNonceForAddress(address)
      .then((n: string) => setNonce(parseInt(n, 16)))
      .catch(() => setNonce(0));

    // 2. Cartridge username
    (cartridgeConnector as any).username?.()
      .then((u: string|undefined) => setUsername(u ?? null))
      .catch(() => {});

    // 3. Detect games via starknet_getEvents
    const FROM_BLOCK = 0;
    const promises = Object.entries(GAMES).map(async ([, game]) => {
      try {
        let total = 0;
        for (const contract of game.contracts) {
          const result = await rpcCall('starknet_getEvents', [{
            from_block: { block_number: FROM_BLOCK },
            to_block: 'latest',
            address: contract,
            keys: [[]], // all events
            chunk_size: 100,
          }]);
          // Filter events where from_address matches wallet
          const addr = address.toLowerCase();
          const matching = (result?.events || []).filter((e: { from_address?: string; data?: string[] }) =>
            e.from_address?.toLowerCase() === addr ||
            (e.data || []).some((d: string) => d.toLowerCase() === addr)
          );
          total += matching.length;
        }
        if (total > 0) return { ...game, eventCount: total };
        return null;
      } catch { return null; }
    });

    Promise.all(promises).then(results => {
      const found = results.filter(Boolean) as GameStat[];
      setGameStats(found.sort((a, b) => b.eventCount - a.eventCount));
      setLoading(false);
    });
  }, [address, provider]);

  const rank = getRank(nonce);
  const displayName = username || (address ? shortAddr(address) : '');

  const ACHIEVEMENTS = [
    { e:'🔑', l:'First Tx',     d:'First on-chain action',  u: nonce >= 1 },
    { e:'🎮', l:'Gamer',        d:'50+ transactions',       u: nonce >= 50 },
    { e:'⚡', l:'Power User',   d:'250+ transactions',      u: nonce >= 250 },
    { e:'🏆', l:'Veteran',      d:'750+ transactions',      u: nonce >= 750 },
    { e:'👑', l:'Legend',       d:'2000+ transactions',     u: nonce >= 2000 },
    { e:'🔥', l:'Immortal',     d:'5000+ transactions',     u: nonce >= 5000 },
    { e:'🎯', l:'Multi-gamer',  d:'Played 3+ games',        u: gameStats.length >= 3 },
    { e:'🌟', l:'Early Adopter',d:'Wallet > 1 year old',    u: false },
  ];

  const shareUrl = `https://reemjie.github.io/starknet-games-hub/#profile/${displayName}`;

  return (
    <>
      <Nav />
      <div className="wrap" style={{ maxWidth:900, paddingTop:80 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <span className="sec-badge" style={{ display:'inline-flex', marginBottom:12 }}>◈ Player Profile</span>
          <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(24px,5vw,38px)', fontWeight:900, color:'white', margin:'0 0 8px' }}>
            Your <span className="grad-text">On-Chain</span> Identity
          </h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, margin:'0 auto', maxWidth:420 }}>
            Connect your Cartridge wallet to see your stats.
          </p>
        </div>

        {!isConnected && (
          <div style={{ textAlign:'center', padding:'60px 20px', background:'#13131A', borderRadius:20, border:'1px solid #1F1F28' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>◈</div>
            <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, color:'white', margin:'0 0 8px' }}>Connect your wallet</h3>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, marginBottom:24 }}>Your on-chain activity, rank and achievements — all in one place.</p>
            <ConnectButton />
          </div>
        )}

        {isConnected && address && (
          <div>
            {/* Profile Card */}
            <div style={{ background:'#13131A', border:'1px solid #1F1F28', borderRadius:20, marginBottom:16 }}>
              {/* Banner */}
              <div style={{ height:100, background:'linear-gradient(135deg,#0C0C4F,#1a0a2e 40%,#0f1a0f)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(92,90,219,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(92,90,219,0.1) 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
                <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 60% 80% at 30% 50%,${rank.color}28,transparent 60%)` }} />
              </div>

              <div style={{ padding:'0 24px 24px' }}>
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:-20, marginBottom:16, flexWrap:'wrap', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:14 }}>
                    <div style={{ width:76, height:76, borderRadius:'50%', padding:3, background:`linear-gradient(135deg,${rank.color},#5C5ADB)`, flexShrink:0 }}>
                      <div style={{ width:'100%', height:'100%', borderRadius:'50%', background:'#13131A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>
                        {rank.icon}
                      </div>
                    </div>
                    <div style={{ marginBottom:4 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:17, fontWeight:900, color:'white', margin:0 }}>{displayName}</h2>
                        <span style={{ padding:'2px 8px', borderRadius:5, fontFamily:"'Orbitron',sans-serif", fontSize:9, fontWeight:700, background:`${rank.color}20`, color:rank.color, border:`1px solid ${rank.color}50` }}>{rank.label}</span>
                      </div>
                      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:3 }}>{shortAddr(address)}</div>
                    </div>
                  </div>
                  <a href={`https://starkscan.co/contract/${address}`} target="_blank" rel="noreferrer" style={{ padding:'7px 13px', borderRadius:10, border:'1px solid rgba(92,90,219,0.35)', background:'rgba(92,90,219,0.08)', color:'#5C5ADB', fontSize:12, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, textDecoration:'none' }}>
                    Starkscan ↗
                  </a>
                </div>

                {/* Rank bar */}
                <div style={{ marginBottom:18, padding:'12px 14px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                    <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:'rgba(255,255,255,0.35)' }}>{rank.icon} {rank.label}</span>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.22)' }}>
                      {nonce.toLocaleString()} txs {rank.progress < 100 ? `· ${(rank.next - nonce).toLocaleString()} to next rank` : '· MAX RANK'}
                    </span>
                  </div>
                  <div style={{ height:6, borderRadius:3, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                    <div style={{ height:6, borderRadius:3, background:`linear-gradient(90deg,${rank.color},#5C5ADB)`, width:`${rank.progress}%`, transition:'width 1s ease' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                    {RANK_TIERS.slice(0,5).map(t => (
                      <span key={t.label} style={{ fontSize:8, color: nonce >= t.min ? t.color : 'rgba(255,255,255,0.1)', fontFamily:"'Orbitron',sans-serif" }}>{t.icon}</span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 }}>
                  {[
                    { n: nonce.toLocaleString(), l:'Total Txs', c: rank.color },
                    { n: loading ? '...' : gameStats.length || '—', l:'Games Detected', c:'#22c55e' },
                    { n: ACHIEVEMENTS.filter(a=>a.u).length+'/'+ACHIEVEMENTS.length, l:'Achievements', c:'#F4C542' },
                    { n: username || '—', l:'Cartridge ID', c: username ? '#EC796B' : 'rgba(255,255,255,0.2)' },
                  ].map(s => (
                    <div key={s.l} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:13, textAlign:'center' }}>
                      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize: typeof s.n === 'string' && s.n.length > 8 ? 11 : 18, fontWeight:900, color:s.c, wordBreak:'break-all' }}>{s.n}</div>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:'1.5px', textTransform:'uppercase', marginTop:4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:18 }}>
                  {[['games','🎮 Games'],['achv','🏆 Achievements'],['info','◈ Info']].map(([id,label]) => (
                    <button key={id} onClick={()=>setTab(id)} style={{ padding:'8px 18px', fontSize:13, fontWeight:600, borderBottom: tab===id?'2px solid #EC796B':'2px solid transparent', cursor:'pointer', color: tab===id?'white':'rgba(255,255,255,0.4)', background:'transparent', borderTop:'none', borderLeft:'none', borderRight:'none', fontFamily:"'Rajdhani',sans-serif" }}>
                      {label}
                    </button>
                  ))}
                </div>

                {tab === 'games' && (
                  <div>
                    {loading && (
                      <div style={{ textAlign:'center', padding:'24px 0' }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid rgba(236,121,107,0.2)', borderTopColor:'#EC796B', animation:'spin 0.8s linear infinite', margin:'0 auto 10px' }} />
                        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
                        <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11, fontFamily:"'Orbitron',sans-serif", letterSpacing:1 }}>SCANNING ON-CHAIN ACTIVITY...</p>
                      </div>
                    )}
                    {!loading && gameStats.length === 0 && (
                      <div style={{ textAlign:'center', padding:'24px 0' }}>
                        <p style={{ color:'rgba(255,255,255,0.2)', fontSize:13, fontFamily:"'Orbitron',sans-serif", letterSpacing:1 }}>NO GAME ACTIVITY DETECTED</p>
                        <p style={{ color:'rgba(255,255,255,0.15)', fontSize:12, marginTop:8 }}>Play a Starknet game to see your stats here</p>
                      </div>
                    )}
                    {!loading && gameStats.map((g, i) => (
                      <a key={g.name} href={g.url} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:9, textDecoration:'none', borderBottom: i < gameStats.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <span style={{ fontSize:10, color:'rgba(255,255,255,0.18)', fontFamily:"'Share Tech Mono',monospace", width:14 }}>{i+1}</span>
                        <img src={g.img} style={{ width:36, height:36, borderRadius:9, objectFit:'cover', border:`1px solid ${g.color}40`, flexShrink:0 }} alt="" />
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:14, color:'white' }}>{g.name}</div>
                          <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', marginTop:2 }}>On-chain activity detected</div>
                        </div>
                        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13, color:g.color, fontWeight:700 }}>{g.eventCount} events</div>
                      </a>
                    ))}
                  </div>
                )}

                {tab === 'achv' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
                    {ACHIEVEMENTS.map((a,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, border:'1px solid', background: a.u?'rgba(255,255,255,0.03)':'transparent', borderColor: a.u?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)', opacity: a.u?1:0.35 }}>
                        <div style={{ fontSize:22, flexShrink:0 }}>{a.e}</div>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color: a.u?'white':'rgba(255,255,255,0.4)' }}>{a.l}</div>
                          <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:1 }}>{a.d}</div>
                        </div>
                        {a.u && <span style={{ marginLeft:'auto', color:'#22c55e', fontSize:14 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'info' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {[
                      { l:'Wallet Address', v: address, mono:true },
                      { l:'Cartridge Username', v: username || 'Not detected', mono:false },
                      { l:'Total Transactions', v: nonce.toLocaleString(), mono:true },
                      { l:'Current Rank', v: `${rank.icon} ${rank.label}`, mono:false },
                      { l:'Games Detected', v: loading ? 'Scanning...' : `${gameStats.length} game${gameStats.length !== 1 ? 's' : ''}`, mono:false },
                      { l:'Network', v: 'Starknet Mainnet', mono:false },
                    ].map(row => (
                      <div key={row.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)', flexShrink:0 }}>{row.l}</span>
                        <span style={{ fontSize:12, color:'white', fontFamily: row.mono?"'Share Tech Mono',monospace":undefined, wordBreak:'break-all', textAlign:'right', maxWidth:'65%' }}>{row.v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Share */}
            <div style={{ padding:'14px 18px', borderRadius:12, background:'rgba(92,90,219,0.05)', border:'1px solid rgba(92,90,219,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)' }}>Share your profile</div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:2 }}>{shareUrl}</div>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                style={{ padding:'7px 14px', borderRadius:8, border:'1px solid rgba(92,90,219,0.35)', background: copied?'rgba(34,197,94,0.1)':'rgba(92,90,219,0.1)', color: copied?'#22c55e':'#5C5ADB', fontSize:12, cursor:'pointer', fontFamily:"'Rajdhani',sans-serif", fontWeight:600, transition:'all 0.2s' }}>
                {copied ? '✓ Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
