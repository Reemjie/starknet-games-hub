import { useState, useEffect, useRef, useCallback } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { ConnectButton } from "./components/ConnectButton";
import { cartridgeConnector } from "./cartridge";



const GAMES: Record<string, { name: string; img: string; color: string; url: string; contracts: string[] }> = {
  lootsurvivor: { name: "Loot Survivor", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s", color: "#F4C542", url: "https://lootsurvivor.io", contracts: ["0x0305e8e6c32c61d09fdb4b2e0e358b6ce15e8c9c65eb48d6fb5083d63cad7a26"] },
  blobarena:    { name: "BlobArena",    img: "https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0", color: "#EC796B", url: "https://blobarena.xyz", contracts: ["0x02e8676b8e534580fef4e93e5d9a8c35e5ae8583f5b39baed6e5cf52cc9c50f"] },
  jokers:       { name: "Jokers of Neon", img: "https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg", color: "#a78bfa", url: "https://jokersofneon.com", contracts: ["0x06a05844a03bb9e744479e3298f54705a35966ab04140d3d8dd797c1f6dc49d0"] },
  realms:       { name: "Realms Blitz",  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThd7w4cX4MSjUtwcp5-Tqa--giLP0Qf5ABBw&s", color: "#34d399", url: "https://eternum.realms.world", contracts: ["0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f"] },
  ponziland:    { name: "PonziLand",    img: "https://play.ponzi.land/logo.png", color: "#f97316", url: "https://play.ponzi.land", contracts: ["0x00a5de7e40f8fdb56e0f11d36e43049a3220dce24bef1b90eef7c9508bd8aeaa"] },
  summit:       { name: "Summit",       img: "https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium", color: "#60a5fa", url: "https://www.summit.game", contracts: ["0x0372b11f0a7da89f1f84e68dc9b3a30e03fbe0ab87a8e0e4dc5b6c5c9e8e2a1"] },
  darkshuffle:  { name: "Dark Shuffle", img: "/starknet-games-hub/games/darkshuffle.png", color: "#c084fc", url: "https://darkshuffle.io", contracts: ["0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2"] },
};

const RANK_TIERS = [
  { min: 0,    label: "EXPLORER",  color: "#94a3b8", icon: "🔍", next: 50 },
  { min: 50,   label: "PLAYER",    color: "#22c55e", icon: "🎮", next: 250 },
  { min: 250,  label: "GAMER",     color: "#3b82f6", icon: "⚡", next: 750 },
  { min: 750,  label: "VETERAN",   color: "#a78bfa", icon: "🏆", next: 2000 },
  { min: 2000, label: "LEGEND",    color: "#F4C542", icon: "👑", next: 5000 },
  { min: 5000, label: "IMMORTAL",  color: "#EC796B", icon: "🔥", next: 99999 },
];

function getRank(n: number) {
  let t = RANK_TIERS[0];
  for (const r of RANK_TIERS) { if (n >= r.min) t = r; }
  const progress = t.next > t.min ? Math.min(100, Math.round(((n - t.min) / (t.next - t.min)) * 100)) : 100;
  return { ...t, progress };
}

function shortAddr(a: string) { return a.slice(0, 8) + '...' + a.slice(-4); }

interface GameStat { name: string; img: string; color: string; url: string; eventCount: number; }
interface Trophy { id: string; title: string; description: string; points: number; icon: string; game?: { name: string }; }

function computeOnchainTrophies(nonce: number): Trophy[] {
  const t: Trophy[] = [];
  if (nonce >= 1)    t.push({ id: 'tx1',    icon: '🔑', title: 'First Step',      description: 'First on-chain transaction',    points: 10,  game: { name: 'Starknet' } });
  if (nonce >= 50)   t.push({ id: 'tx50',   icon: '🎮', title: 'Getting Started', description: '50 transactions on Starknet',   points: 25,  game: { name: 'Starknet' } });
  if (nonce >= 250)  t.push({ id: 'tx250',  icon: '⚡', title: 'Power User',      description: '250 transactions on Starknet',  points: 50,  game: { name: 'Starknet' } });
  if (nonce >= 750)  t.push({ id: 'tx750',  icon: '🏆', title: 'Veteran',         description: '750 transactions on Starknet',  points: 100, game: { name: 'Starknet' } });
  if (nonce >= 2000) t.push({ id: 'tx2000', icon: '👑', title: 'Legend',          description: '2000 transactions on Starknet', points: 250, game: { name: 'Starknet' } });
  if (nonce >= 5000) t.push({ id: 'tx5000', icon: '🔥', title: 'Immortal',        description: '5000 transactions on Starknet', points: 500, game: { name: 'Starknet' } });
  return t;
}

function getAllGames(): GameStat[] {
  return Object.values(GAMES).map(g => ({ name: g.name, img: g.img, color: g.color, url: g.url, eventCount: 0 }));
}

async function loadImg(src: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function drawPlayerCard(canvas: HTMLCanvasElement, opts: {
  username: string; address: string; rank: ReturnType<typeof getRank>;
  nonce: number; gameStats: GameStat[]; trophies: Trophy[];
}) {
  const W = 1200, H = 630;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Load images in parallel - pick best game image for background
  const avatarSrc = opts.username ? `https://unavatar.io/twitter/${opts.username}` : null;
  const bgGameSrc = opts.gameStats[0]?.img || Object.values(GAMES)[0].img;
  const [avatarImg, bgImg] = await Promise.all([
    avatarSrc ? loadImg(avatarSrc) : Promise.resolve(null),
    loadImg(bgGameSrc),
  ]);
  

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#060610'); bg.addColorStop(0.5, '#0d0d18'); bg.addColorStop(1, '#060610');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Background: right half = game image, left = dark
  if (bgImg) {
    ctx.save();
    // Draw game image on right 60%
    const scale = Math.max((W * 0.65) / bgImg.width, H / bgImg.height);
    const sw = bgImg.width * scale, sh = bgImg.height * scale;
    const sx = W * 0.35 + (W * 0.65 - sw) / 2;
    const sy = (H - sh) / 2;
    ctx.globalAlpha = 0.55;
    ctx.drawImage(bgImg, sx, sy, sw, sh);
    ctx.restore();
  }

  // Left dark panel
  const leftPanel = ctx.createLinearGradient(0, 0, W * 0.65, 0);
  leftPanel.addColorStop(0, 'rgba(6,6,16,1)');
  leftPanel.addColorStop(0.7, 'rgba(6,6,16,0.97)');
  leftPanel.addColorStop(1, 'rgba(6,6,16,0.3)');
  ctx.fillStyle = leftPanel; ctx.fillRect(0, 0, W, H);

  // Right fade overlay
  const rightFade = ctx.createLinearGradient(W * 0.35, 0, W, 0);
  rightFade.addColorStop(0, 'rgba(6,6,16,0.3)');
  rightFade.addColorStop(0.5, 'rgba(6,6,16,0.15)');
  rightFade.addColorStop(1, 'rgba(6,6,16,0.7)');
  ctx.fillStyle = rightFade; ctx.fillRect(W * 0.35, 0, W * 0.65, H);

  // Rank color glow bottom-left
  const rankGlow = ctx.createRadialGradient(0, H, 0, 0, H, 500);
  rankGlow.addColorStop(0, opts.rank.color + '35');
  rankGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = rankGlow; ctx.fillRect(0, 0, W, H);

  // Top gradient
  const topFade = ctx.createLinearGradient(0, 0, 0, 120);
  topFade.addColorStop(0, 'rgba(6,6,16,0.9)');
  topFade.addColorStop(1, 'transparent');
  ctx.fillStyle = topFade; ctx.fillRect(0, 0, W, 120);

  // Bottom gradient
  const botFade = ctx.createLinearGradient(0, H - 80, 0, H);
  botFade.addColorStop(0, 'transparent');
  botFade.addColorStop(1, 'rgba(6,6,16,0.95)');
  ctx.fillStyle = botFade; ctx.fillRect(0, H - 80, W, 80);

  // Grid
  ctx.strokeStyle = 'rgba(92,90,219,0.07)'; ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // Rank glow
  const glow = ctx.createRadialGradient(180, 200, 0, 180, 200, 320);
  glow.addColorStop(0, opts.rank.color + '40'); glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  // Top accent bar
  const bar = ctx.createLinearGradient(0,0,W,0);
  bar.addColorStop(0,'transparent'); bar.addColorStop(0.2, opts.rank.color);
  bar.addColorStop(0.8,'#5C5ADB'); bar.addColorStop(1,'transparent');
  ctx.strokeStyle = bar; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0,3); ctx.lineTo(W,3); ctx.stroke();

  // Border
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
  ctx.strokeRect(1,1,W-2,H-2);

  // Avatar circle
  ctx.save();
  ctx.beginPath(); ctx.arc(160, 185, 82, 0, Math.PI*2);
  const grad = ctx.createLinearGradient(78,103,242,267);
  grad.addColorStop(0, opts.rank.color); grad.addColorStop(1, '#5C5ADB');
  ctx.strokeStyle = grad; ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath(); ctx.arc(160, 185, 79, 0, Math.PI*2); ctx.clip();
  if (avatarImg) {
    ctx.drawImage(avatarImg, 81, 106, 158, 158);
  } else {
    ctx.fillStyle = '#0f0f1e'; ctx.fill();
    ctx.font = '60px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white'; ctx.fillText(opts.rank.icon, 160, 185);
  }
  ctx.restore();

  // Rank icon overlay on avatar
  if (avatarImg) {
    ctx.save();
    ctx.beginPath(); ctx.arc(222, 247, 22, 0, Math.PI*2);
    ctx.fillStyle = '#0d0d18'; ctx.fill();
    ctx.strokeStyle = opts.rank.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '18px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(opts.rank.icon, 222, 247);
    ctx.restore();
  }

  // Username
  ctx.font = 'bold 44px Arial'; ctx.fillStyle = 'white';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(opts.username, 280, 172);

  // Rank badge
  const rankLabel = opts.rank.label;
  ctx.font = 'bold 13px Arial';
  const rw = ctx.measureText(rankLabel).width + 28;
  ctx.fillStyle = opts.rank.color + '28'; ctx.strokeStyle = opts.rank.color + '80'; ctx.lineWidth = 1;
  ctx.beginPath(); (ctx as any).roundRect(280, 184, rw, 26, 5); ctx.fill(); ctx.stroke();
  ctx.font = 'bold 12px Arial'; ctx.fillStyle = opts.rank.color; ctx.textAlign = 'center';
  ctx.fillText(rankLabel, 280 + rw/2, 201);

  // Address
  ctx.font = '12px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.textAlign = 'left'; ctx.fillText(shortAddr(opts.address), 280, 232);

  // Progress bar
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath(); (ctx as any).roundRect(280, 248, 480, 8, 4); ctx.fill();
  const pg = ctx.createLinearGradient(280,0,760,0);
  pg.addColorStop(0, opts.rank.color); pg.addColorStop(1, '#5C5ADB');
  ctx.fillStyle = pg;
  ctx.beginPath(); (ctx as any).roundRect(280, 248, 480 * opts.rank.progress/100, 8, 4); ctx.fill();
  ctx.font = '11px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.textAlign = 'left';
  ctx.fillText(`${opts.nonce.toLocaleString()} txs · ${opts.rank.progress < 100 ? (opts.rank.next - opts.nonce).toLocaleString() + ' to next rank' : 'MAX RANK 🔥'}`, 280, 274);

  // Stats boxes
  const totalPts = opts.trophies.reduce((s,t) => s+t.points, 0) || computeOnchainTrophies(opts.nonce).reduce((s,t) => s+t.points, 0);
  const stats = [
    { l: 'TOTAL TXS', v: opts.nonce.toLocaleString(), c: opts.rank.color },
    { l: 'GAMES', v: String(opts.gameStats.length || 7), c: '#22c55e' },
    { l: 'TROPHIES', v: String(opts.trophies.length || computeOnchainTrophies(opts.nonce).length), c: '#F4C542' },
    { l: 'TROPHY PTS', v: totalPts + 'pts', c: '#F4C542' },
  ];
  stats.forEach((s, i) => {
    const x = 60 + i * 175, y = 330;
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.strokeStyle = s.c + '30'; ctx.lineWidth = 1;
    ctx.beginPath(); (ctx as any).roundRect(x, y, 160, 78, 12); ctx.fill(); ctx.stroke();
    ctx.font = 'bold 28px Arial'; ctx.fillStyle = s.c; ctx.textAlign = 'center';
    ctx.fillText(s.v, x+80, y+46);
    ctx.font = '10px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillText(s.l, x+80, y+64);
  });

  // Trophies row
  ctx.font = '10px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.textAlign = 'left'; ctx.fillText('TROPHIES & ACHIEVEMENTS', 60, 438);
  const cardTrophies = opts.trophies.length > 0 ? opts.trophies : computeOnchainTrophies(opts.nonce);
  if (cardTrophies.length === 0) {
    ctx.font = '12px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.textAlign = 'center';
    ctx.fillText('Play games on Starknet to earn trophies', W/2, 510);
  } else {
    const cols = Math.min(opts.trophies.length, 6);
    const boxW = Math.floor((W - 120) / cols);
    cardTrophies.slice(0, 6).forEach((t, i) => {
      const x = 60 + i * boxW, y = 450;
      ctx.fillStyle = 'rgba(244,197,66,0.06)';
      ctx.strokeStyle = 'rgba(244,197,66,0.25)'; ctx.lineWidth = 1;
      ctx.beginPath(); (ctx as any).roundRect(x, y, boxW - 10, 120, 10); ctx.fill(); ctx.stroke();
      ctx.font = '36px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white'; ctx.fillText(t.icon || '🏅', x + (boxW-10)/2, y + 42);
      ctx.font = 'bold 13px Arial'; ctx.fillStyle = 'white'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(t.title, x + (boxW-10)/2, y + 82);
      ctx.font = 'bold 12px monospace'; ctx.fillStyle = '#F4C542';
      ctx.fillText('+' + t.points + 'pts', x + (boxW-10)/2, y + 100);
      if (t.game?.name) {
        ctx.font = '10px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillText(t.game.name, x + (boxW-10)/2, y + 116);
      }
    });
  }

  // Watermark
  ctx.font = '11px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.textAlign = 'right';
  ctx.fillText('starkgames-hub · reemjie.github.io/starknet-games-hub', W-20, H-14);
}

function TeaserProfile() {
  const demoStats = [
    { n: '391', l: 'Total Txs', c: '#3b82f6' },
    { n: '7', l: 'Games', c: '#22c55e' },
    { n: '4', l: 'Trophies', c: '#F4C542' },
    { n: '5/8', l: 'Achievements', c: '#a78bfa' },
  ];
  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes holo { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer { 0%{opacity:0.4} 50%{opacity:1} 100%{opacity:0.4} }
      `}</style>
      <div style={{ filter: 'blur(3px)', opacity: 0.45, pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ background: '#13131A', border: '1px solid #1F1F28', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ height: 100, background: 'linear-gradient(135deg,#0C0C4F,#1a0a2e 40%,#0f1a0f)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(92,90,219,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(92,90,219,0.1) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: -20, marginBottom: 20 }}>
              <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#5C5ADB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>⚡</div>
              <div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 17, fontWeight: 900, color: 'white' }}>reemjie</div>
                <div style={{ padding: '2px 8px', borderRadius: 5, display:'inline-block', fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700, background: '#3b82f620', color: '#3b82f6', border: '1px solid #3b82f650', marginTop: 4 }}>GAMER</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
              {demoStats.map(s => (
                <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, fontWeight: 900, color: s.c }}>{s.n}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ animation: 'float 3s ease-in-out infinite', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>◈</div>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(16px,4vw,22px)', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>
            Your <span style={{ background: 'linear-gradient(90deg,#EC796B,#a78bfa,#3b82f6)', backgroundSize:'200%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'holo 3s ease infinite' }}>On-Chain Identity</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 340, margin: '0 auto 20px' }}>
            Connect your Cartridge wallet to reveal your gamer card, rank, trophies and stats.
          </p>
          <ConnectButton />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {['🏆 Trophies', '⚡ Live Stats', '🎮 Games Played', '🃏 Shareable Card', '🏅 Achievements'].map((f, i) => (
            <span key={f} style={{ padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 11, animationDelay: `${i*0.3}s` }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { provider } = useProvider();
  const [username, setUsername] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);
  const [gameStats, setGameStats] = useState<GameStat[]>([]);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [tab, setTab] = useState('games');
  const [copied, setCopied] = useState(false);
  const [cardGenerated, setCardGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!address || !provider) return;
    setLoading(true); setGameStats([]); setTrophies([]); setCardGenerated(false);
    provider.getNonceForAddress(address)
      .then((n: string) => {
        const nc = parseInt(n, 16);
        setNonce(nc);
        setTrophies(computeOnchainTrophies(nc));
      }).catch(() => setNonce(0));
    (cartridgeConnector as any).username?.()
      .then((u: string | undefined) => setUsername(u ?? null))
      .catch(() => {});
    setGameStats(getAllGames());
    setLoading(false); setLoadingStep('');
  }, [address, provider]);

  const rank = getRank(nonce);
  const displayName = username || (address ? shortAddr(address) : '');
  const shareUrl = `https://reemjie.github.io/starknet-games-hub/#profile`;
  const activeTrophyPts = trophies.reduce((s, t) => s + t.points, 0);
  const gamesPlayed = gameStats.filter(g => g.eventCount > 0).length;

  const ACHIEVEMENTS = [
    { e: '🔑', l: 'First Tx',      d: 'First on-chain action',   u: nonce >= 1 },
    { e: '🎮', l: 'Gamer',         d: '50+ transactions',         u: nonce >= 50 },
    { e: '⚡', l: 'Power User',    d: '250+ transactions',        u: nonce >= 250 },
    { e: '🏆', l: 'Veteran',       d: '750+ transactions',        u: nonce >= 750 },
    { e: '👑', l: 'Legend',        d: '2000+ transactions',       u: nonce >= 2000 },
    { e: '🔥', l: 'Immortal',      d: '5000+ transactions',       u: nonce >= 5000 },
    { e: '🎯', l: 'Multi-gamer',   d: '3+ games on Starknet',     u: Object.keys(GAMES).length >= 3 },
    { e: '🌟', l: 'Trophy Hunter', d: '5+ trophies earned',       u: trophies.length >= 5 },
  ];

  const generateCard = useCallback(async () => {
    if (!canvasRef.current || !address) return;
    await drawPlayerCard(canvasRef.current, { username: displayName, address, rank, nonce, gameStats, trophies });
    setCardGenerated(true);
  }, [displayName, address, rank, nonce, gameStats, trophies]);

  const downloadCard = useCallback(() => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.download = `starkgames-${displayName}.png`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
  }, [displayName]);

  const shareOnX = useCallback(() => {
    const topGame = gameStats[0]?.name || 'Starknet';
    const text = `🎮 My Starknet Gaming Profile\n\n${rank.icon} ${rank.label} · ${nonce.toLocaleString()} txs on-chain\n🏆 ${trophies.length} trophies · ${gamesPlayed} games played\n🥇 Most played: ${topGame}\n\nCreate yours 👇\n${shareUrl}\n\n#Starknet #OnchainGaming #StarkGames`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }, [rank, nonce, trophies, gamesPlayed, gameStats, shareUrl]);

  return (
    <>
      <Nav />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes card-shine { 0%{transform:translateX(-100%) rotate(25deg)} 100%{transform:translateX(300%) rotate(25deg)} }
      `}</style>
      <div className="wrap" style={{ maxWidth: 900, paddingTop: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="sec-badge" style={{ display: 'inline-flex', marginBottom: 12 }}>◈ Player Profile</span>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(22px,5vw,36px)', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>
            Your <span className="grad-text">On-Chain</span> Identity
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 auto', maxWidth: 400 }}>
            Rank, trophies, games played — your complete Starknet gamer profile.
          </p>
        </div>

        {!isConnected && <TeaserProfile />}

        {isConnected && address && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#0f0f1e,#13131A)', border: `1px solid ${rank.color}30`, borderRadius: 20, marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position:'absolute', top:0, left:'-100%', width:'60%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent)', animation:'card-shine 5s ease infinite', pointerEvents:'none' }} />
              <div style={{ height: 110, background: `linear-gradient(135deg,#0C0C4F,${rank.color}30 50%,#0f1a0f)`, position: 'relative', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(92,90,219,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(92,90,219,0.08) 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
                <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 60% 80% at 20% 50%,${rank.color}35,transparent 60%)` }} />
                <div style={{ position:'absolute', top:14, right:16, fontFamily:"'Orbitron',sans-serif", fontSize:10, color:'rgba(255,255,255,0.25)', letterSpacing:2 }}>STARKNET GAMER CARD</div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:-24, marginBottom:16, flexWrap:'wrap', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:14 }}>
                    <div style={{ width:76, height:76, borderRadius:'50%', padding:3, background:`linear-gradient(135deg,${rank.color},#5C5ADB)`, flexShrink:0 }}>
                      <div style={{ width:'100%', height:'100%', borderRadius:'50%', background:'#0f0f1e', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>{rank.icon}</div>
                    </div>
                    <div style={{ marginBottom:4 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, fontWeight:900, color:'white', margin:0 }}>{displayName}</h2>
                        <span style={{ padding:'2px 9px', borderRadius:5, fontFamily:"'Orbitron',sans-serif", fontSize:9, fontWeight:700, background:`${rank.color}20`, color:rank.color, border:`1px solid ${rank.color}50` }}>{rank.label}</span>
                        {activeTrophyPts > 0 && <span style={{ padding:'2px 9px', borderRadius:5, fontFamily:"'Orbitron',sans-serif", fontSize:9, fontWeight:700, background:'rgba(244,197,66,0.1)', color:'#F4C542', border:'1px solid rgba(244,197,66,0.3)' }}>⭐ {activeTrophyPts}pts</span>}
                      </div>
                      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:3 }}>{shortAddr(address)}</div>
                    </div>
                  </div>
                  <a href={`https://voyager.online/contract/${address}`} target="_blank" rel="noreferrer" style={{ padding:'7px 13px', borderRadius:10, border:'1px solid rgba(92,90,219,0.35)', background:'rgba(92,90,219,0.08)', color:'#5C5ADB', fontSize:12, fontWeight:600, textDecoration:'none' }}>Voyager ↗</a>
                </div>
                <div style={{ marginBottom:16, padding:'12px 14px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:4 }}>
                    <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:'rgba(255,255,255,0.35)' }}>{rank.icon} {rank.label}</span>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.22)' }}>{nonce.toLocaleString()} txs {rank.progress < 100 ? `· ${(rank.next - nonce).toLocaleString()} to next rank` : '· MAX RANK 🔥'}</span>
                  </div>
                  <div style={{ height:7, borderRadius:4, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                    <div style={{ height:7, borderRadius:4, background:`linear-gradient(90deg,${rank.color},#5C5ADB)`, width:`${rank.progress}%`, transition:'width 1.2s ease' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                    {RANK_TIERS.map(t => (
                      <div key={t.label} style={{ textAlign:'center' }}>
                        <span style={{ fontSize:12, opacity: nonce >= t.min ? 1 : 0.15 }}>{t.icon}</span>
                        <div style={{ fontSize:7, color: nonce >= t.min ? t.color : 'rgba(255,255,255,0.1)', fontFamily:"'Orbitron',sans-serif", marginTop:2 }}>{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="stkgrid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:16 }}>
                  {[
                    { n: nonce.toLocaleString(), l: 'Total Txs', c: rank.color },
                    { n: loading ? '…' : String(gamesPlayed || Object.keys(GAMES).length), l: 'Games', c: '#22c55e' },
                    { n: loading ? '…' : String(trophies.length || '—'), l: 'Trophies', c: '#F4C542' },
                    { n: ACHIEVEMENTS.filter(a=>a.u).length+'/'+ACHIEVEMENTS.length, l: 'Achievements', c: '#a78bfa' },
                  ].map(s => (
                    <div key={s.l} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${s.c}20`, borderRadius:12, padding:'10px 6px', textAlign:'center' }}>
                      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize: s.n.length > 4 ? 13 : 18, fontWeight:900, color:s.c, lineHeight:1.1 }}>{s.n}</div>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:'1.5px', textTransform:'uppercase', marginTop:4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {loading && (
                  <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'rgba(92,90,219,0.05)', borderRadius:10, marginBottom:16, border:'1px solid rgba(92,90,219,0.15)' }}>
                    <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(92,90,219,0.2)', borderTopColor:'#5C5ADB', animation:'spin 0.8s linear infinite', flexShrink:0 }} />
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:"'Orbitron',sans-serif" }}>{loadingStep}</span>
                  </div>
                )}
                <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:16, overflowX:'auto' }}>
                  {[['games','🎮 Games'],['trophies','🏅 Trophies'],['achv','🏆 Achievements'],['info','◈ Info']].map(([id,label]) => (
                    <button key={id} onClick={()=>setTab(id)} style={{ padding:'8px 14px', fontSize:12, fontWeight:600, borderBottom:tab===id?'2px solid #EC796B':'2px solid transparent', cursor:'pointer', color:tab===id?'white':'rgba(255,255,255,0.4)', background:'transparent', border:'none', fontFamily:"'Rajdhani',sans-serif", whiteSpace:'nowrap' }}>
                      {label}
                    </button>
                  ))}
                </div>
                {tab === 'games' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
                    {gameStats.map(g => (
                      <a key={g.name} href={g.url} target="_blank" rel="noreferrer" style={{ textDecoration:'none', borderRadius:14, border:`1px solid ${g.color}${g.eventCount>0?'40':'18'}`, background:`linear-gradient(135deg,${g.color}${g.eventCount>0?'10':'05'},transparent)`, overflow:'hidden', display:'flex', flexDirection:'column', opacity:g.eventCount===0?0.5:1 }}>
                        <div style={{ position:'relative', height:80, overflow:'hidden', background:'#0A0A0F' }}>
                          <img src={g.img} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.8 }} alt="" />
                          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 30%,#0A0A0F)' }} />
                          {g.eventCount > 0 && <div style={{ position:'absolute', top:6, right:6, padding:'2px 7px', borderRadius:999, background:g.color+'30', border:`1px solid ${g.color}50`, fontSize:9, color:g.color, fontFamily:"'Share Tech Mono',monospace", fontWeight:700 }}>{g.eventCount} txs</div>}
                        </div>
                        <div style={{ padding:'8px 10px' }}>
                          <div style={{ fontWeight:700, fontSize:12, color:'white', marginBottom:4 }}>{g.name}</div>
                          {g.eventCount > 0 ? (
                            <div style={{ height:3, borderRadius:2, background:'rgba(255,255,255,0.06)' }}>
                              <div style={{ height:3, borderRadius:2, background:g.color, width:`${Math.min(100,(g.eventCount/Math.max(...gameStats.map(x=>x.eventCount),1))*100)}%`, transition:'width 1s ease' }} />
                            </div>
                          ) : (
                            <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)' }}>Not played yet</div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
                {tab === 'trophies' && (
                  <div>
                    {loading && <div style={{ textAlign:'center', padding:'24px 0' }}><div style={{ width:28,height:28,borderRadius:'50%',border:'2px solid rgba(244,197,66,0.2)',borderTopColor:'#F4C542',animation:'spin 0.8s linear infinite',margin:'0 auto' }} /></div>}
                    {!loading && trophies.length === 0 && (
                      <div style={{ textAlign:'center', padding:'32px 0' }}>
                        <div style={{ fontSize:44, marginBottom:10 }}>🏅</div>
                        <p style={{ color:'rgba(255,255,255,0.2)', fontSize:13, fontFamily:"'Orbitron',sans-serif" }}>NO TROPHIES YET</p>
                        <p style={{ color:'rgba(255,255,255,0.15)', fontSize:12, marginTop:8 }}>Make more transactions to earn on-chain trophies</p>
                      </div>
                    )}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10 }}>
                      {trophies.map((t,i) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, border:'1px solid rgba(244,197,66,0.2)', background:'linear-gradient(135deg,rgba(244,197,66,0.05),transparent)' }}>
                          <div style={{ fontSize:28, flexShrink:0 }}>{t.icon||'🏅'}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:700, color:'white' }}>{t.title}</div>
                            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{t.description}</div>
                            <div style={{ fontSize:9, color:'#F4C542', marginTop:4, fontFamily:"'Share Tech Mono',monospace" }}>{t.game?.name} · +{t.points}pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {trophies.length > 0 && (
                      <div style={{ marginTop:14, padding:'10px 14px', borderRadius:10, background:'rgba(244,197,66,0.05)', border:'1px solid rgba(244,197,66,0.15)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Total trophy points</span>
                        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, fontWeight:700, color:'#F4C542' }}>{activeTrophyPts} pts</span>
                      </div>
                    )}
                  </div>
                )}
                {tab === 'achv' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
                    {ACHIEVEMENTS.map((a,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, border:'1px solid', background:a.u?'rgba(255,255,255,0.03)':'transparent', borderColor:a.u?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)', opacity:a.u?1:0.35 }}>
                        <div style={{ fontSize:24, flexShrink:0 }}>{a.e}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:a.u?'white':'rgba(255,255,255,0.4)' }}>{a.l}</div>
                          <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:1 }}>{a.d}</div>
                        </div>
                        {a.u && <span style={{ color:'#22c55e', fontSize:16 }}>✓</span>}
                      </div>
                    ))}
                    <div style={{ gridColumn:'1/-1', marginTop:6, padding:'10px 14px', borderRadius:10, background:'rgba(167,139,250,0.05)', border:'1px solid rgba(167,139,250,0.15)', display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Completed</span>
                      <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:13, fontWeight:700, color:'#a78bfa' }}>{ACHIEVEMENTS.filter(a=>a.u).length}/{ACHIEVEMENTS.length}</span>
                    </div>
                  </div>
                )}
                {tab === 'info' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {[
                      { l:'Wallet Address', v:address, mono:true },
                      { l:'Cartridge Username', v:username||'Not detected', mono:false },
                      { l:'Total Transactions', v:nonce.toLocaleString(), mono:true },
                      { l:'Current Rank', v:`${rank.icon} ${rank.label}`, mono:false },
                      { l:'Trophy Points', v:`${activeTrophyPts} pts`, mono:true },
                      { l:'Games Played', v:`${gamesPlayed} / ${Object.keys(GAMES).length}`, mono:false },
                      { l:'Network', v:'Starknet Mainnet', mono:false },
                    ].map(row => (
                      <div key={row.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)', flexShrink:0 }}>{row.l}</span>
                        <span style={{ fontSize:12, color:'white', fontFamily:row.mono?"'Share Tech Mono',monospace":undefined, wordBreak:'break-all', textAlign:'right', maxWidth:'60%' }}>{row.v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ background:'linear-gradient(135deg,#0f0f1e,#13131A)', border:'1px solid rgba(92,90,219,0.2)', borderRadius:16, padding:20, marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
                <div>
                  <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:13, color:'white', margin:'0 0 4px' }}>🃏 Gamer Card</h3>
                  <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, margin:0 }}>Generate your NFT-style card and share it on X</p>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button onClick={generateCard} disabled={loading} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid rgba(92,90,219,0.4)', background:'rgba(92,90,219,0.1)', color:'#5C5ADB', fontSize:12, cursor:loading?'not-allowed':'pointer', fontWeight:700, opacity:loading?0.5:1 }}>
                    {cardGenerated ? '🔄 Regenerate' : '⚡ Generate Card'}
                  </button>
                  {cardGenerated && <>
                    <button onClick={downloadCard} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid rgba(34,197,94,0.4)', background:'rgba(34,197,94,0.08)', color:'#22c55e', fontSize:12, cursor:'pointer', fontWeight:700 }}>⬇ Download</button>
                    <button onClick={shareOnX} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(0,0,0,0.3)', color:'white', fontSize:12, cursor:'pointer', fontWeight:700 }}>𝕏 Share</button>
                  </>}
                </div>
              </div>
              <canvas ref={canvasRef} style={{ width:'100%', borderRadius:12, border:'1px solid rgba(255,255,255,0.06)', display:cardGenerated?'block':'none' }} />
              {!cardGenerated && (
                <div style={{ height:100, display:'flex', alignItems:'center', justifyContent:'center', border:'1px dashed rgba(255,255,255,0.06)', borderRadius:12, background:'rgba(0,0,0,0.2)' }}>
                  <p style={{ color:'rgba(255,255,255,0.12)', fontSize:11, fontFamily:"'Orbitron',sans-serif", textAlign:'center' }}>⚡ GENERATE YOUR CARD TO PREVIEW IT</p>
                </div>
              )}
            </div>
            <div style={{ padding:'14px 18px', borderRadius:12, background:'rgba(92,90,219,0.05)', border:'1px solid rgba(92,90,219,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)' }}>Share your profile</div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:2 }}>{shareUrl}</div>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${copied?'rgba(34,197,94,0.35)':'rgba(92,90,219,0.35)'}`, background:copied?'rgba(34,197,94,0.1)':'rgba(92,90,219,0.1)', color:copied?'#22c55e':'#5C5ADB', fontSize:12, cursor:'pointer', fontWeight:600, transition:'all 0.2s' }}>
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
