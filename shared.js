// ═══════════════════════════════════════════════════════════════
// STARKGAMES HUB — shared.js
// Header, Footer, shared data & utilities for all pages
// ═══════════════════════════════════════════════════════════════

// ── Current page detection ──
const CURRENT_PAGE = (() => {
  const p = window.location.pathname.split('/').pop() || 'index.html';
  if (p === '' || p === 'index.html') return 'home';
  return p.replace('.html', '');
})();

// ── Inject Google Fonts + Tailwind config ──
(function injectHead() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
})();

// ── Shared CSS injected once ──
const SHARED_CSS = `
  :root {
    --primary: #EC796B;
    --accent: #5C5ADB;
    --gold: #F4C542;
    --green: #22c55e;
    --bg: #0A0A0F;
    --surface: #13131A;
    --border: #1F1F28;
    --hover: #1A1A24;
  }
  * { box-sizing: border-box; }
  body { font-family: 'Rajdhani', sans-serif; background: var(--bg); color: white; margin: 0; padding-top: 64px; }
  .orbitron { font-family: 'Orbitron', sans-serif; }
  .mono     { font-family: 'Share Tech Mono', monospace; }
  .gradient-text { background: linear-gradient(135deg, #EC796B 0%, #5C5ADB 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

  /* ── NAV ── */
  #sg-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(10,10,15,0.85); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(31,31,40,0.8);
    height: 64px;
    transition: background 0.3s;
  }
  #sg-nav .nav-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 20px;
    height: 100%; display: flex; align-items: center; gap: 8px;
  }
  #sg-nav .nav-logo {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none; margin-right: 12px; flex-shrink: 0;
  }
  #sg-nav .nav-logo span {
    font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: 700;
    background: linear-gradient(135deg,#EC796B,#5C5ADB); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  #sg-nav .nav-links { display: flex; align-items: center; gap: 2px; flex: 1; }
  #sg-nav .nav-link {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 10px;
    font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 600;
    color: rgba(255,255,255,0.45); text-decoration: none;
    transition: all 0.2s; white-space: nowrap;
    position: relative;
  }
  #sg-nav .nav-link:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.05); }
  #sg-nav .nav-link.active { color: white; background: rgba(236,121,107,0.12); }
  #sg-nav .nav-link.active::after {
    content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
    width: 16px; height: 2px; border-radius: 1px; background: var(--primary);
  }
  #sg-nav .live-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 7px; border-radius: 999px;
    background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3);
    font-size: 9px; font-weight: 700; color: #22c55e;
    font-family: 'Orbitron', sans-serif; letter-spacing: 0.5px;
  }
  #sg-nav .live-pill .dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; animation: navPulse 1.5s infinite; }
  @keyframes navPulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  /* Mobile menu */
  #sg-nav .nav-mobile-btn {
    display: none; background: transparent; border: none; cursor: pointer;
    padding: 8px; color: rgba(255,255,255,0.6); margin-left: auto;
  }
  #sg-nav .nav-mobile-menu {
    display: none; position: absolute; top: 64px; left: 0; right: 0;
    background: rgba(10,10,15,0.98); border-bottom: 1px solid var(--border);
    padding: 12px 16px; flex-direction: column; gap: 4px;
  }
  #sg-nav .nav-mobile-menu.open { display: flex; }
  #sg-nav .nav-mobile-menu .nav-link { padding: 10px 14px; }
  #sg-nav .nav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }

  @media (max-width: 768px) {
    #sg-nav .nav-links { display: none; }
    #sg-nav .nav-mobile-btn { display: flex; }
    #sg-nav .nav-right { display: none; }
  }

  /* ── FOOTER ── */
  #sg-footer {
    background: var(--surface); border-top: 1px solid var(--border);
    padding: 48px 20px 32px;
  }
  #sg-footer .footer-inner { max-width: 1280px; margin: 0 auto; }
  #sg-footer .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
  @media (max-width: 768px) { #sg-footer .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; } }
  @media (max-width: 480px) { #sg-footer .footer-grid { grid-template-columns: 1fr; } }
  #sg-footer .footer-col-title { font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }
  #sg-footer .footer-link { display: block; color: rgba(255,255,255,0.4); font-size: 14px; text-decoration: none; padding: 3px 0; transition: color 0.2s; }
  #sg-footer .footer-link:hover { color: rgba(255,255,255,0.8); }
  #sg-footer .footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  #sg-footer .footer-bottom p { color: rgba(255,255,255,0.2); font-size: 12px; margin: 0; }

  /* ── COMMON COMPONENTS ── */
  .section-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 14px; border-radius: 999px;
    border: 1px solid rgba(92,90,219,0.4); background: rgba(92,90,219,0.1);
    color: #5C5ADB; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    font-family: 'Orbitron', sans-serif;
  }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 24px; border-radius: 12px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: white; font-family: 'Orbitron', sans-serif; font-size: 11px;
    font-weight: 700; letter-spacing: 1px; border: none; cursor: pointer;
    text-decoration: none; transition: all 0.3s; position: relative; overflow: hidden;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(236,121,107,0.35); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12); background: transparent;
    color: rgba(255,255,255,0.6); font-family: 'Rajdhani', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: white; }
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .card:hover { border-color: rgba(255,255,255,0.12); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #1F1F28; border-radius: 10px; }
`;

(function injectCSS() {
  const style = document.createElement('style');
  style.textContent = SHARED_CSS;
  document.head.appendChild(style);
})();

// ── NAV CONFIG ──
const NAV_ITEMS = [
  { href: 'index.html',       id: 'home',        icon: '⬡', label: 'Home' },
  { href: 'games.html',       id: 'games',       icon: '🎮', label: 'Games' },
  { href: 'tournaments.html', id: 'tournaments', icon: '🏆', label: 'Tournaments', badge: 'live' },
  { href: 'profile.html',     id: 'profile',     icon: '◈',  label: 'Profile' },
  { href: 'learn.html',       id: 'learn',       icon: '⚡', label: 'Get Started' },
];

function renderNav() {
  const nav = document.createElement('nav');
  nav.id = 'sg-nav';
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/starknet-cryptocurrency-3d-icon-png-download-9555134.png"
             alt="Stark" style="width:28px;height:28px;object-fit:contain;">
        <span>StarkGames</span>
      </a>
      <div class="nav-links">
        ${NAV_ITEMS.map(item => `
          <a href="${item.href}" class="nav-link ${CURRENT_PAGE === item.id ? 'active' : ''}">
            <span>${item.icon}</span>
            <span>${item.label}</span>
            ${item.badge === 'live' ? `<span class="live-pill"><span class="dot"></span>LIVE</span>` : ''}
          </a>
        `).join('')}
      </div>
      <div class="nav-right">
        <a href="https://cartridge.gg" target="_blank"
           style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:#000;color:#F4C542;border:1px solid #F4C542;border-radius:8px;font-family:'Orbitron',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-decoration:none;transition:all 0.2s;"
           onmouseenter="this.style.background='#F4C542';this.style.color='#000'"
           onmouseleave="this.style.background='#000';this.style.color='#F4C542'">
          <img src="https://media.licdn.com/dms/image/v2/C560BAQG2qyhQocFjAw/company-logo_200_200/company-logo_200_200/0/1653773828948/cartridge_logo?e=2147483647&v=beta&t=xviEbUxCa0s3UeDssnnYRYlvMKx_PupB-h_z0qYRojA"
               style="width:14px;height:14px;object-fit:contain;">
          Cartridge
        </a>
      </div>
      <button class="nav-mobile-btn" onclick="toggleMobileMenu()" aria-label="Menu">
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
    <div class="nav-mobile-menu" id="mobile-menu">
      ${NAV_ITEMS.map(item => `
        <a href="${item.href}" class="nav-link ${CURRENT_PAGE === item.id ? 'active' : ''}">
          <span>${item.icon}</span> <span>${item.label}</span>
          ${item.badge === 'live' ? `<span class="live-pill"><span class="dot"></span>LIVE</span>` : ''}
        </a>
      `).join('')}
    </div>
  `;
  document.body.insertBefore(nav, document.body.firstChild);
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

function renderFooter() {
  const footer = document.createElement('footer');
  footer.id = 'sg-footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/starknet-cryptocurrency-3d-icon-png-download-9555134.png"
                 style="width:24px;height:24px;object-fit:contain;">
            <span style="font-family:'Orbitron',sans-serif;font-size:13px;font-weight:700;background:linear-gradient(135deg,#EC796B,#5C5ADB);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">StarkGames Hub</span>
          </div>
          <p style="color:rgba(255,255,255,0.3);font-size:13px;line-height:1.7;max-width:280px;margin:0 0 16px;">
            The reference hub for Starknet on-chain gaming. Built with ❤️ for the community.
          </p>
          <div style="display:flex;gap:8px;">
            <a href="https://x.com/Reemjie_" target="_blank"
               style="width:34px;height:34px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);text-decoration:none;transition:all 0.2s;font-size:14px;"
               onmouseenter="this.style.borderColor='rgba(236,121,107,0.5)';this.style.color='#EC796B'"
               onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)';this.style.color='rgba(255,255,255,0.4)'">𝕏</a>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Navigate</div>
          ${NAV_ITEMS.map(i => `<a href="${i.href}" class="footer-link">${i.label}</a>`).join('')}
        </div>
        <div>
          <div class="footer-col-title">Games</div>
          <a href="https://lootsurvivor.io" target="_blank" class="footer-link">Loot Survivor</a>
          <a href="https://blobarena.xyz" target="_blank" class="footer-link">BlobArena</a>
          <a href="https://jokersofneon.com" target="_blank" class="footer-link">Jokers of Neon</a>
          <a href="https://eternum.realms.world" target="_blank" class="footer-link">Realms Blitz</a>
          <a href="https://www.summit.game" target="_blank" class="footer-link">Summit</a>
          <a href="games.html" class="footer-link" style="color:rgba(236,121,107,0.6);margin-top:4px;">View all →</a>
        </div>
        <div>
          <div class="footer-col-title">Resources</div>
          <a href="https://starknet.io" target="_blank" class="footer-link">Starknet.io</a>
          <a href="https://cartridge.gg" target="_blank" class="footer-link">Cartridge</a>
          <a href="https://element.market/starknet" target="_blank" class="footer-link">Element Market</a>
          <a href="https://starkscan.co" target="_blank" class="footer-link">Starkscan</a>
          <a href="https://growthepie.xyz" target="_blank" class="footer-link">Growthepie</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 StarkGames Hub — Built by <a href="https://x.com/Reemjie_" target="_blank" style="color:rgba(236,121,107,0.7);text-decoration:none;">Reemjie</a></p>
        <p style="font-family:'Share Tech Mono',monospace;font-size:10px;">Estimated data · Not financial advice · DYOR</p>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

// ── DATA LOADING ──
const FALLBACK_DATA = {
  games: [
    { id:'lootsurvivor', name:'Loot Survivor', url:'https://lootsurvivor.io', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s', desc:'Roguelike arcade avec permadeath. Bats des monstres, collecte du loot légendaire.', tags:['Arcade','Roguelike','PvE'], featured:true, active:true, twitter:'https://x.com/LootSurvivor', discord:'https://discord.gg/DNWacZG9' },
    { id:'blobarena', name:'BlobArena', url:'https://blobarena.xyz', img:'https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0', desc:'Arène PvP rapide avec des blobs colorés.', tags:['Arcade','PvP','Real-Time'], featured:true, active:true, twitter:'https://x.com/Blobarena', discord:'https://discord.gg/Cxr6XWnK' },
    { id:'jokersofneon', name:'Jokers of Neon', url:'https://jokersofneon.com', img:'https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg', desc:'Poker cyberpunk avec cartes NFT.', tags:['Card Game','NFT','PvP'], featured:true, active:true, twitter:'https://x.com/jokers_of_neon', discord:'https://discord.gg/pJcw2bVk' },
    { id:'realms', name:'Realms Blitz', url:'https://eternum.realms.world', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThd7w4cX4MSjUtwcp5-Tqa--giLP0Qf5ABBw&s', desc:'MMO de stratégie entièrement on-chain.', tags:['Strategy','MMO','PvP'], featured:true, active:true, twitter:'https://x.com/realmsworld', discord:'https://discord.gg/7jdEMx2r' },
    { id:'summit', name:'Summit', url:'https://www.summit.game', img:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium', desc:'King-of-the-hill MMO. Tes Beasts NFT combattent pour dominer le sommet.', tags:['Battle','MMO'], featured:true, active:true, twitter:'https://x.com/LootSurvivor', discord:'https://discord.gg/DNWacZG9' },
    { id:'ponziland', name:'PonziLand', url:'https://play.ponzi.land', img:'https://play.ponzi.land/logo.png', desc:'Stratégie économique : achète des terres, optimise taxes et liquidité.', tags:['Strategy','Management'], featured:false, active:true, twitter:'https://x.com/ponzidotland', discord:'https://discord.gg/9gf4Fb9D' },
    { id:'darkshuffle', name:'Dark Shuffle', url:'https://darkshuffle.io', img:'https://pbs.twimg.com/card_img/2021183745525432320/6ZKNucYn?format=png&name=large', desc:'Roguelike de deck-building.', tags:['Deck-building','Roguelike'], featured:false, active:true, twitter:'https://x.com/darkshuffle_gg', discord:'https://discord.gg/7jdEMx2r' },
    { id:'zkube', name:'zKube', url:'https://app.zkube.xyz', img:'https://pbs.twimg.com/profile_images/1844012375462068224/S0SgtVy7_400x400.png', desc:'Puzzle Tetris-like on-chain.', tags:['Strategy','Casual'], featured:false, active:true, twitter:'https://x.com/zKube_game', discord:'https://discord.gg/7jdEMx2r' },
  ],
  carousel: [
    { id:'c1', title:'Summit is live!', subtitle:'The largest fully onchain battle ever recorded has just begun', label:'Summit', date:'19 February', img:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium', url:'https://www.summit.game/', status:'live', active:true },
    { id:'c2', title:'Be a private tester', subtitle:'Fill the form for a chance to enter the testing phase', label:'BlobArena', date:'16 February', img:'https://res.cloudinary.com/dtqbnob94/image/upload/v1771259640/Capture_d_e%CC%81cran_2026-02-16_a%CC%80_17.33.29_ces8sh.png', url:'https://blobarena.xyz/private-test', status:'live', active:true },
    { id:'c3', title:'Budokan Tournaments', subtitle:'Join a tournament and try to win the prize pool', label:'Loot Survivor', date:'9 February', img:'https://res.cloudinary.com/dtqbnob94/image/upload/v1771020559/Capture_d_e%CC%81cran_2026-02-13_a%CC%80_23.09.00_gry4ot.png', url:'https://budokan.gg/', status:'live', active:true },
    { id:'c4', title:'Cudokan Tournament', subtitle:'Face the best survivors in Cudokan tournaments on Telegram', label:'Loot Survivor', date:'12 February', img:'https://res.cloudinary.com/dtqbnob94/image/upload/v1771020441/Capture_d_e%CC%81cran_2026-02-13_a%CC%80_23.06.51_qqxyje.png', url:'https://web.telegram.org/a/#-1003325299219', status:'live', active:true },
    { id:'c5', title:'Referrals are live', subtitle:'Share your link and earn 20% of your friends activity in $STRK', label:'PonziLand', date:'13 February', img:'https://pbs.twimg.com/media/HAex_XnWUAAWsly?format=png&name=small', url:'https://play.ponzi.land/game', status:'live', active:true },
    { id:'c6', title:'Season 1 Tournament is live', subtitle:'Use your entries to try to win great prize packs', label:'Jokers of Neon', date:'13 February', img:'https://res.cloudinary.com/dtqbnob94/image/upload/v1771020855/Capture_d_e%CC%81cran_2026-02-13_a%CC%80_23.14.01_sxznyk.png', url:'https://x.com/jokers_of_neon/status/2022381534523830645', status:'live', active:true },
  ],
  banner: [
    { id:'b1', author:'@growthepie', text:'Discover Starknet app metrics', url:'https://x.com/growthepie_eth/status/2021590096495943683', active:true },
    { id:'b2', author:'@Blobarena', text:'Private Testing sign-up for the new version of Blob Arena is now available', url:'https://x.com/Blobarena/status/2023430165624230352', active:true },
    { id:'b3', author:'@LootSurvivor', text:'LootSurvivor in the top ethereum ranked app', url:'https://x.com/Calcutat/status/2023337819125449030', active:true },
    { id:'b4', author:'@Jokers of neon', text:'New user interactions ATH for jokers of neon', url:'https://x.com/jokers_of_neon/status/2021250290662637715', active:true },
    { id:'b5', author:'@Starkarcade', text:'Stats Loot Survivor : 12M+ tx, $159k fees, 1.3k+ active users', url:'https://x.com/starkarcade/status/2018971927164199070', active:true },
    { id:'b6', author:'@PonzidotLand', text:'Referrals are LIVE !', url:'https://x.com/ponzidotland/status/2019796166716613071', active:true },
  ],
  guides: [
    { id:'g1', game:'Realms Eternum (Blitz)', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThd7w4cX4MSjUtwcp5-Tqa--giLP0Qf5ABBw&s', links:[{emoji:'📖',label:'Beginner Guide',url:'https://medium.com/@AlexiaChukwuma/eternum-or-blitz-choosing-your-battle-in-starknets-flagship-rts-c017ef48cb98'},{emoji:'💬',label:'Starter Guide by Lordcumberlord',url:'https://x.com/lordcumberlord/status/2011095751196360980'}], active:true },
    { id:'g2', game:'BlobArena', img:'https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0', links:[{emoji:'📖',label:'Getting Started',url:'https://www.starknet.io/blog/starknet-starter-pack/'},{emoji:'📖',label:'Tutorial by Heyshadowfax',url:'https://x.com/Starknet/status/1965430258850820293'}], active:true },
    { id:'g3', game:'Jokers of Neon', img:'https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg', links:[{emoji:'📖',label:'Official Docs',url:'https://docs.jokersofneon.com/'},{emoji:'📖',label:'First steps Tutorial',url:'https://www.youtube.com/watch?v=yCac6cfDm3k'}], active:true },
    { id:'g4', game:'Loot Survivor', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s', links:[{emoji:'📖',label:'Complete Guide',url:'https://www.gam3s.gg/news/how-to-play-loot-survivor-on-starknet/'},{emoji:'📖',label:'Go beyond level 10',url:'https://x.com/lordcumberlord/status/1969288053484118076'}], active:true },
    { id:'g5', game:'Summit', img:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium', links:[{emoji:'📖',label:'Summit Survivor guide',url:'https://x.com/sudo_okhai/article/2013210791114125799'},{emoji:'📖',label:'Heyshadowfax guide',url:'https://x.com/Starknet/status/2024174211187519853'}], active:true },
    { id:'g6', game:'PonziLand', img:'https://play.ponzi.land/logo.png', links:[{emoji:'📖',label:'Documentation',url:'https://github.com/RuneLabsxyz/PonziLand'},{emoji:'📖',label:'Official Tutorial',url:'https://play.ponzi.land/tutorial'}], active:true },
  ]
};

async function loadSiteData() {
  try {
    const res = await fetch('data.json?t=' + Date.now());
    if (!res.ok) throw new Error('no data.json');
    return await res.json();
  } catch {
    return FALLBACK_DATA;
  }
}

// Auto-init nav + footer on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
});
