import { useEffect, useState, useRef } from "react";

const RPC = "https://api.cartridge.gg/x/starknet/mainnet"; // v2
const COINGECKO = "https://api.coingecko.com/api/v3/simple/price?ids=starknet&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true";

interface Stats {
  blockNumber: number | null;
  tps: number | null;
  strkPrice: number | null;
  strkChange: number | null;
  strkVolume: number | null;
  strkMcap: number | null;
  blockTime: number | null;
  txCount: number | null;
}

function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "" }: { value: number | null, decimals?: number, prefix?: string, suffix?: string }) {
  const [display, setDisplay] = useState<string>("···");
  const prevRef = useRef<number>(0);

  useEffect(() => {
    if (value === null) return;
    const start = prevRef.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const current = start + (end - start) * ease;
      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
      if (t < 1) requestAnimationFrame(animate);
      else prevRef.current = end;
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{display}</span>;
}

export function StarknetStats({ tourneysCount = 0, gamesCount = 0 }: { tourneysCount?: number, gamesCount?: number }) {
  const [stats, setStats] = useState<Stats>({
    blockNumber: null, tps: null, strkPrice: null, strkChange: null,
    strkVolume: null, strkMcap: null, blockTime: null, txCount: null
  });
  const [updated, setUpdated] = useState<string>("");
  const [pulse, setPulse] = useState(false);

  const fetchStats = async () => {
    try {
      const [r1, rp] = await Promise.all([
        fetch(RPC, { method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'starknet_blockNumber' }) }),
        fetch(COINGECKO).catch(() => null),
      ]);
      const d1 = await r1.json();
      const blockNumber = d1.result ?? null;

      let tps = null, blockTime = null, txCount = null;
      if (blockNumber) {
        const [rb1, rb2] = await Promise.all([
          fetch(RPC, { method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'starknet_getBlockWithTxHashes', params: [{ block_number: blockNumber }] }) }),
          fetch(RPC, { method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'starknet_getBlockWithTxHashes', params: [{ block_number: blockNumber - 1 }] }) }),
        ]);
        const [db1, db2] = await Promise.all([rb1.json(), rb2.json()]);
        const b1 = db1.result, b2 = db2.result;
        if (b1 && b2) {
          blockTime = b1.timestamp - b2.timestamp;
          txCount = b1.transactions?.length ?? 0;
          tps = blockTime > 0 ? txCount / blockTime : null;
        }
      }

      let strkPrice = null, strkChange = null, strkVolume = null, strkMcap = null;
      if (rp) {
        const dp = await rp.json();
        strkPrice = dp?.starknet?.usd ?? null;
        strkChange = dp?.starknet?.usd_24h_change ?? null;
        strkVolume = dp?.starknet?.usd_24h_vol ?? null;
        strkMcap = dp?.starknet?.usd_market_cap ?? null;
      }

      setStats({ blockNumber, tps, strkPrice, strkChange, strkVolume, strkMcap, blockTime, txCount });
      setUpdated(new Date().toLocaleTimeString());
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    } catch {}
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30003);
    return () => clearInterval(interval);
  }, []);

  const isUp = (stats.strkChange ?? 0) >= 0;

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>
      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @media(max-width:768px) { .stkgrid { grid-template-columns: repeat(2,1fr) !important; } }
        @keyframes glow-green { 0%, 100% { box-shadow: 0 0 8px #22c55e40; } 50% { box-shadow: 0 0 20px #22c55e80; } }
        .stat-card { transition: transform 0.2s, border-color 0.2s; }
        .stat-card:hover { transform: translateY(-2px); }
        .pulse-card { animation: glow-green 0.6s ease; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'blink 2s infinite' }} />
          <span style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.5)' }}>STARKNET MAINNET — LIVE</span>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>↻ {updated || '···'}</span>
      </div>

      {/* Main grid */}
      <div className="stkgrid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 10 }}>

        {/* STRK Price - large card */}
        <div className={`stat-card ${pulse ? 'pulse-card' : ''}`} style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(99,102,241,0.05))', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)' }} />
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(168,85,247,0.7)', marginBottom: 10 }}>◈ STRK / USD</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'white', letterSpacing: -1 }}>
            <AnimatedNumber value={stats.strkPrice} decimals={4} prefix="$" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 13, color: isUp ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
              {isUp ? '▲' : '▼'} <AnimatedNumber value={stats.strkChange ? Math.abs(stats.strkChange) : null} decimals={2} suffix="%" />
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>24h</span>
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 5 }}>VOL 24H</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{stats.strkVolume ? `$${(stats.strkVolume / 1e6).toFixed(1)}M` : '···'}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 5 }}>MCAP</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{stats.strkMcap ? `$${(stats.strkMcap / 1e6).toFixed(0)}M` : '···'}</div>
            </div>
          </div>
        </div>

        {/* Block Height */}
        <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 14, padding: '18px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent)' }} />
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(96,165,250,0.6)', marginBottom: 10 }}>⬡ BLOCK</div>
          <div style={{ fontSize: 22, color: 'white', fontWeight: 700 }}>
            {stats.blockNumber ? stats.blockNumber.toLocaleString() : '···'}
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>BLOCK TIME</div>
            <div style={{ fontSize: 13, color: 'rgba(96,165,250,0.7)', marginTop: 2 }}>
              {stats.blockTime ? `${stats.blockTime}s` : '···'}
            </div>
          </div>
        </div>

        {/* TPS */}
        <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 14, padding: '18px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(245,158,11,0.6)', marginBottom: 10 }}>⚡ TPS</div>
          <div style={{ fontSize: 22, color: 'white', fontWeight: 700 }}>
            <AnimatedNumber value={stats.tps} decimals={2} />
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>TXS / BLOCK</div>
            <div style={{ fontSize: 13, color: 'rgba(245,158,11,0.7)', marginTop: 2 }}>
              {stats.txCount ?? '···'}
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14, padding: '18px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent)' }} />
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(34,197,94,0.6)', marginBottom: 10 }}>● NETWORK</div>
          <div style={{ fontSize: 18, color: 'white', fontWeight: 700 }}>Mainnet</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'blink 2s infinite' }} />
            <span style={{ fontSize: 12, color: '#22c55e' }}>Operational</span>
          </div>
          {stats.strkMcap && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>MCAP</div>
              <div style={{ fontSize: 13, color: 'rgba(34,197,94,0.7)', marginTop: 2 }}>
                ${(stats.strkMcap / 1e6).toFixed(0)}M
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2e rangée — stats du site */}
      <div className="stkgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
        <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(168,85,247,0.6)', marginBottom: 8 }}>⛓ TOTAL TXS</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#a855f7', fontFamily: "'Share Tech Mono', monospace" }}>28M+</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>On-chain transactions</div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(34,197,94,0.6)', marginBottom: 8 }}>🎮 LIVE GAMES</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#22c55e', fontFamily: "'Share Tech Mono', monospace" }}>{gamesCount}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>Playable games</div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(244,197,66,0.15)', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(244,197,66,0.6)', marginBottom: 8 }}>🏆 TOURNAMENTS</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#F4C542', fontFamily: "'Share Tech Mono', monospace" }}>{tourneysCount}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>Active tournaments</div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(92,90,219,0.15)', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(92,90,219,0.6)', marginBottom: 8 }}>👥 ACTIVE PLAYERS</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#5C5ADB', fontFamily: "'Share Tech Mono', monospace" }}>4k+</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>Active players</div>
        </div>
      </div>
    </div>
  );
}
