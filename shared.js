// ═══════════════════════════════════════════════
// STARKGAMES HUB — shared.js v2
// ═══════════════════════════════════════════════

const CURRENT_PAGE = (function() {
  var p = window.location.pathname.split('/').pop() || 'index.html';
  if (p === '' || p === 'index.html') return 'home';
  return p.replace('.html', '');
})();

// ── Fonts ──
(function() {
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap';
  document.head.appendChild(l);
})();

// ── Shared CSS ──
var SHARED_CSS = [
  ':root{--primary:#EC796B;--accent:#5C5ADB;--gold:#F4C542;--green:#22c55e;--bg:#0A0A0F;--surface:#13131A;--border:#1F1F28;--hover:#1A1A24;}',
  '*{box-sizing:border-box;}',
  'body{font-family:Rajdhani,sans-serif;background:#0A0A0F;color:white;margin:0;padding-top:64px;}',
  '.orbitron{font-family:Orbitron,sans-serif;}',
  '.mono{font-family:Share Tech Mono,monospace;}',
  '.gradient-text{background:linear-gradient(135deg,#EC796B 0%,#5C5ADB 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}',
  // NAV
  '#sg-nav{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;background:rgba(10,10,15,0.88);backdrop-filter:blur(20px);border-bottom:1px solid rgba(31,31,40,0.8);}',
  '#sg-nav .ni{max-width:1280px;margin:0 auto;padding:0 20px;height:100%;display:flex;align-items:center;gap:8px;}',
  '#sg-nav .nlogo{display:flex;align-items:center;gap:8px;text-decoration:none;margin-right:12px;flex-shrink:0;}',
  '#sg-nav .nlogo span{font-family:Orbitron,sans-serif;font-size:14px;font-weight:700;background:linear-gradient(135deg,#EC796B,#5C5ADB);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}',
  '#sg-nav .nlinks{display:flex;align-items:center;gap:2px;flex:1;}',
  '#sg-nav .nlink{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:10px;font-family:Rajdhani,sans-serif;font-size:14px;font-weight:600;color:rgba(255,255,255,0.45);text-decoration:none;transition:all 0.2s;white-space:nowrap;position:relative;}',
  '#sg-nav .nlink:hover{color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.05);}',
  '#sg-nav .nlink.active{color:white;background:rgba(236,121,107,0.12);}',
  '#sg-nav .nlink.active::after{content:"";position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:16px;height:2px;border-radius:1px;background:#EC796B;}',
  '#sg-nav .lpill{display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:999px;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);font-size:9px;font-weight:700;color:#22c55e;font-family:Orbitron,sans-serif;letter-spacing:0.5px;}',
  '#sg-nav .ldot{width:5px;height:5px;border-radius:50%;background:#22c55e;animation:np 1.5s infinite;}',
  '@keyframes np{0%,100%{opacity:1}50%{opacity:0.3}}',
  '#sg-nav .nmob{display:none;background:transparent;border:none;cursor:pointer;padding:8px;color:rgba(255,255,255,0.6);margin-left:auto;}',
  '#sg-nav .nmenu{display:none;position:absolute;top:64px;left:0;right:0;background:rgba(10,10,15,0.98);border-bottom:1px solid #1F1F28;padding:12px 16px;flex-direction:column;gap:4px;}',
  '#sg-nav .nmenu.open{display:flex;}',
  '#sg-nav .nright{display:flex;align-items:center;gap:10px;margin-left:auto;}',
  '@media(max-width:768px){#sg-nav .nlinks{display:none;}#sg-nav .nmob{display:flex;}#sg-nav .nright{display:none;}}',
  // FOOTER
  '#sg-footer{background:#13131A;border-top:1px solid #1F1F28;padding:48px 20px 32px;}',
  '#sg-footer .fi{max-width:1280px;margin:0 auto;}',
  '#sg-footer .fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px;}',
  '@media(max-width:768px){#sg-footer .fg{grid-template-columns:1fr 1fr;gap:24px;}}',
  '@media(max-width:480px){#sg-footer .fg{grid-template-columns:1fr;}}',
  '#sg-footer .fct{font-family:Orbitron,sans-serif;font-size:10px;font-weight:700;color:rgba(255,255,255,0.25);letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;}',
  '#sg-footer .fl{display:block;color:rgba(255,255,255,0.4);font-size:14px;text-decoration:none;padding:3px 0;transition:color 0.2s;}',
  '#sg-footer .fl:hover{color:rgba(255,255,255,0.8);}',
  '#sg-footer .fb{border-top:1px solid rgba(255,255,255,0.05);padding-top:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}',
  '#sg-footer .fb p{color:rgba(255,255,255,0.2);font-size:12px;margin:0;}',
  // SHARED COMPONENTS
  '.section-badge{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:999px;border:1px solid rgba(92,90,219,0.4);background:rgba(92,90,219,0.1);color:#5C5ADB;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Orbitron,sans-serif;}',
  '.btn-primary{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;border-radius:12px;background:linear-gradient(135deg,#EC796B,#5C5ADB);color:white;font-family:Orbitron,sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;border:none;cursor:pointer;text-decoration:none;transition:all 0.3s;}',
  '.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(236,121,107,0.35);}',
  '.btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:12px;border:1px solid rgba(255,255,255,0.12);background:transparent;color:rgba(255,255,255,0.6);font-family:Rajdhani,sans-serif;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;transition:all 0.2s;}',
  '.btn-ghost:hover{border-color:rgba(255,255,255,0.3);color:white;}',
  '::-webkit-scrollbar{width:4px;}',
  '::-webkit-scrollbar-thumb{background:#1F1F28;border-radius:10px;}'
].join('');

(function() {
  var s = document.createElement('style');
  s.textContent = SHARED_CSS;
  document.head.appendChild(s);
})();

// ── NAV ITEMS ──
var NAV_ITEMS = [
  { href:'index.html',       id:'home',        icon:'⬡', label:'Home',          badge:false },
  { href:'games.html',       id:'games',       icon:'🎮', label:'Games',         badge:false },
  { href:'tournaments.html', id:'tournaments', icon:'🏆', label:'Tournaments',   badge:true  },
  { href:'profile.html',     id:'profile',     icon:'◈',  label:'Profile',       badge:false },
  { href:'learn.html',       id:'learn',       icon:'⚡', label:'Get Started',   badge:false },
];

function renderNav() {
  var nav = document.createElement('nav');
  nav.id = 'sg-nav';

  var linksHTML = NAV_ITEMS.map(function(item) {
    var active = CURRENT_PAGE === item.id ? ' active' : '';
    var badge = item.badge ? '<span class="lpill"><span class="ldot"></span>LIVE</span>' : '';
    return '<a href="' + item.href + '" class="nlink' + active + '">' +
      '<span>' + item.icon + '</span><span>' + item.label + '</span>' + badge +
    '</a>';
  }).join('');

  var mobileLinks = NAV_ITEMS.map(function(item) {
    var active = CURRENT_PAGE === item.id ? ' active' : '';
    var badge = item.badge ? '<span class="lpill"><span class="ldot"></span>LIVE</span>' : '';
    return '<a href="' + item.href + '" class="nlink' + active + '">' +
      item.icon + ' ' + item.label + badge +
    '</a>';
  }).join('');

  nav.innerHTML = '<div class="ni">' +
    '<a href="index.html" class="nlogo">' +
      '<img src="https://cdn3d.iconscout.com/3d/premium/thumb/starknet-cryptocurrency-3d-icon-png-download-9555134.png" style="width:28px;height:28px;object-fit:contain;" alt="Stark">' +
      '<span>StarkGames</span>' +
    '</a>' +
    '<div class="nlinks">' + linksHTML + '</div>' +
    '<div class="nright">' +
      '<a href="https://cartridge.gg" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:#000;color:#F4C542;border:1px solid #F4C542;border-radius:8px;font-family:Orbitron,sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-decoration:none;transition:all 0.2s;" onmouseenter="this.style.background=\'#F4C542\';this.style.color=\'#000\'" onmouseleave="this.style.background=\'#000\';this.style.color=\'#F4C542\'">' +
        '<img src="https://media.licdn.com/dms/image/v2/C560BAQG2qyhQocFjAw/company-logo_200_200/company-logo_200_200/0/1653773828948/cartridge_logo?e=2147483647&v=beta&t=xviEbUxCa0s3UeDssnnYRYlvMKx_PupB-h_z0qYRojA" style="width:14px;height:14px;object-fit:contain;" alt="">Cartridge' +
      '</a>' +
    '</div>' +
    '<button class="nmob" onclick="document.getElementById(\'sg-nmenu\').classList.toggle(\'open\')" aria-label="Menu">' +
      '<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
    '</button>' +
  '</div>' +
  '<div class="nmenu" id="sg-nmenu">' + mobileLinks + '</div>';

  document.body.insertBefore(nav, document.body.firstChild);
}

function renderFooter() {
  var navLinks = NAV_ITEMS.map(function(i) {
    return '<a href="' + i.href + '" class="fl">' + i.label + '</a>';
  }).join('');

  var footer = document.createElement('footer');
  footer.id = 'sg-footer';
  footer.innerHTML = '<div class="fi">' +
    '<div class="fg">' +
      '<div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">' +
          '<img src="https://cdn3d.iconscout.com/3d/premium/thumb/starknet-cryptocurrency-3d-icon-png-download-9555134.png" style="width:22px;height:22px;object-fit:contain;">' +
          '<span style="font-family:Orbitron,sans-serif;font-size:13px;font-weight:700;background:linear-gradient(135deg,#EC796B,#5C5ADB);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">StarkGames Hub</span>' +
        '</div>' +
        '<p style="color:rgba(255,255,255,0.3);font-size:13px;line-height:1.7;max-width:260px;margin:0 0 14px;">The reference hub for Starknet on-chain gaming. Built with ❤️ for the community.</p>' +
        '<a href="https://x.com/Reemjie_" target="_blank" style="width:34px;height:34px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);display:inline-flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);font-size:14px;text-decoration:none;transition:all 0.2s;" onmouseenter="this.style.borderColor=\'rgba(236,121,107,0.5)\';this.style.color=\'#EC796B\'" onmouseleave="this.style.borderColor=\'rgba(255,255,255,0.08)\';this.style.color=\'rgba(255,255,255,0.4)\'">𝕏</a>' +
      '</div>' +
      '<div><div class="fct">Navigate</div>' + navLinks + '</div>' +
      '<div><div class="fct">Games</div>' +
        '<a href="https://lootsurvivor.io" target="_blank" class="fl">Loot Survivor</a>' +
        '<a href="https://blobarena.xyz" target="_blank" class="fl">BlobArena</a>' +
        '<a href="https://jokersofneon.com" target="_blank" class="fl">Jokers of Neon</a>' +
        '<a href="https://eternum.realms.world" target="_blank" class="fl">Realms Blitz</a>' +
        '<a href="https://www.summit.game" target="_blank" class="fl">Summit</a>' +
        '<a href="games.html" class="fl" style="color:rgba(236,121,107,0.6);margin-top:4px;">View all →</a>' +
      '</div>' +
      '<div><div class="fct">Resources</div>' +
        '<a href="https://starknet.io" target="_blank" class="fl">Starknet.io</a>' +
        '<a href="https://cartridge.gg" target="_blank" class="fl">Cartridge</a>' +
        '<a href="https://element.market/starknet" target="_blank" class="fl">Element Market</a>' +
        '<a href="https://starkscan.co" target="_blank" class="fl">Starkscan</a>' +
        '<a href="https://growthepie.xyz" target="_blank" class="fl">Growthepie</a>' +
      '</div>' +
    '</div>' +
    '<div class="fb">' +
      '<p>© 2026 StarkGames Hub — Built by <a href="https://x.com/Reemjie_" target="_blank" style="color:rgba(236,121,107,0.7);text-decoration:none;">Reemjie</a></p>' +
      '<p style="font-family:Share Tech Mono,monospace;font-size:10px;">Estimated data · Not financial advice · DYOR</p>' +
    '</div>' +
  '</div>';

  document.body.appendChild(footer);
}

// ── DATA ──
var FALLBACK_DATA = {
  heroBanner: {
    img: 'https://res.cloudinary.com/dtqbnob94/image/upload/v1770988983/ChatGPT_Image_13_fe%CC%81vr._2026_14_08_03_ljmmnl.png',
    label: 'STARKNET GAMING HUB',
    title: 'The best of Starknet gaming, in one place.',
    subtitle: 'Tournaments, guides, stats — everything you need to play on-chain.',
    url: 'games.html'
  },
  games: [
    { id:'lootsurvivor', name:'Loot Survivor', url:'https://lootsurvivor.io', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s', desc:'Roguelike arcade with permadeath. Fight monsters, collect legendary loot.', tags:['Arcade','Roguelike','PvE'], featured:true, active:true, twitter:'https://x.com/LootSurvivor', discord:'https://discord.gg/DNWacZG9' },
    { id:'blobarena', name:'BlobArena', url:'https://blobarena.xyz', img:'https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0', desc:'Fast-paced PvP arena with colorful blobs.', tags:['Arcade','PvP','Real-Time'], featured:true, active:true, twitter:'https://x.com/Blobarena', discord:'https://discord.gg/Cxr6XWnK' },
    { id:'jokersofneon', name:'Jokers of Neon', url:'https://jokersofneon.com', img:'https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg', desc:'Cyberpunk poker with NFT cards. High-stakes tournaments.', tags:['Card Game','NFT','PvP'], featured:true, active:true, twitter:'https://x.com/jokers_of_neon', discord:'https://discord.gg/pJcw2bVk' },
    { id:'realms', name:'Realms Blitz', url:'https://eternum.realms.world', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThd7w4cX4MSjUtwcp5-Tqa--giLP0Qf5ABBw&s', desc:'Fully on-chain strategy MMO. Build your kingdom.', tags:['Strategy','MMO','PvP'], featured:true, active:true, twitter:'https://x.com/realmsworld', discord:'https://discord.gg/7jdEMx2r' },
    { id:'summit', name:'Summit', url:'https://www.summit.game', img:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium', desc:'King-of-the-hill MMO. Your Beasts NFTs battle to dominate.', tags:['Battle','MMO'], featured:true, active:true, twitter:'https://x.com/LootSurvivor', discord:'https://discord.gg/DNWacZG9' },
    { id:'ponziland', name:'PonziLand', url:'https://play.ponzi.land', img:'https://play.ponzi.land/logo.png', desc:'Economic strategy: buy land, optimize taxes and liquidity.', tags:['Strategy','Management'], featured:false, active:true, twitter:'https://x.com/ponzidotland', discord:'https://discord.gg/9gf4Fb9D' },
    { id:'darkshuffle', name:'Dark Shuffle', url:'https://darkshuffle.io', img:'https://pbs.twimg.com/card_img/2021183745525432320/6ZKNucYn?format=png&name=large', desc:'Deck-building roguelike. Explore procedural maps.', tags:['Deck-building','Roguelike'], featured:false, active:true, twitter:'https://x.com/darkshuffle_gg', discord:'https://discord.gg/7jdEMx2r' },
    { id:'zkube', name:'zKube', url:'https://app.zkube.xyz', img:'https://pbs.twimg.com/profile_images/1844012375462068224/S0SgtVy7_400x400.png', desc:'On-chain Tetris-like puzzle game.', tags:['Puzzle','Casual'], featured:false, active:true, twitter:'https://x.com/zKube_game', discord:'https://discord.gg/7jdEMx2r' }
  ],
  carousel: [
    { id:'c1', title:'Summit is live!', subtitle:'The largest fully onchain battle ever recorded has just begun', label:'Summit', date:'19 Feb', img:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium', url:'https://www.summit.game/', status:'live', active:true },
    { id:'c2', title:'Be a private tester', subtitle:'Fill the form for a chance to enter the testing phase', label:'BlobArena', date:'16 Feb', img:'https://res.cloudinary.com/dtqbnob94/image/upload/v1771259640/Capture_d_e%CC%81cran_2026-02-16_a%CC%80_17.33.29_ces8sh.png', url:'https://blobarena.xyz/private-test', status:'live', active:true },
    { id:'c3', title:'Budokan Tournaments', subtitle:'Join a tournament and try to win the prize pool', label:'Loot Survivor', date:'9 Feb', img:'https://res.cloudinary.com/dtqbnob94/image/upload/v1771020559/Capture_d_e%CC%81cran_2026-02-13_a%CC%80_23.09.00_gry4ot.png', url:'https://budokan.gg/', status:'live', active:true },
    { id:'c4', title:'Cudokan Tournament', subtitle:'Face the best survivors in Cudokan tournaments on Telegram', label:'Loot Survivor', date:'12 Feb', img:'https://res.cloudinary.com/dtqbnob94/image/upload/v1771020441/Capture_d_e%CC%81cran_2026-02-13_a%CC%80_23.06.51_qqxyje.png', url:'https://web.telegram.org/a/#-1003325299219', status:'live', active:true },
    { id:'c5', title:'Referrals are live', subtitle:'Share your link and earn 20% of your friends activity in $STRK', label:'PonziLand', date:'13 Feb', img:'https://pbs.twimg.com/media/HAex_XnWUAAWsly?format=png&name=small', url:'https://play.ponzi.land/game', status:'live', active:true },
    { id:'c6', title:'Season 1 Tournament is live', subtitle:'Use your entries to try to win great prize packs', label:'Jokers of Neon', date:'13 Feb', img:'https://res.cloudinary.com/dtqbnob94/image/upload/v1771020855/Capture_d_e%CC%81cran_2026-02-13_a%CC%80_23.14.01_sxznyk.png', url:'https://x.com/jokers_of_neon/status/2022381534523830645', status:'live', active:true }
  ],
  banner: [
    { id:'b1', author:'@growthepie', text:'Discover Starknet app metrics', url:'https://x.com/growthepie_eth/status/2021590096495943683', active:true },
    { id:'b2', author:'@Blobarena', text:'Private Testing sign-up for the new version of Blob Arena is now available', url:'https://x.com/Blobarena/status/2023430165624230352', active:true },
    { id:'b3', author:'@LootSurvivor', text:'LootSurvivor in the top ethereum ranked app', url:'https://x.com/Calcutat/status/2023337819125449030', active:true },
    { id:'b4', author:'@Jokers of Neon', text:'New user interactions ATH for Jokers of Neon', url:'https://x.com/jokers_of_neon/status/2021250290662637715', active:true },
    { id:'b5', author:'@Starkarcade', text:'Stats Loot Survivor: 12M+ tx, $159k fees, 1.3k+ active users', url:'https://x.com/starkarcade/status/2018971927164199070', active:true },
    { id:'b6', author:'@PonzidotLand', text:'Referrals are LIVE!', url:'https://x.com/ponzidotland/status/2019796166716613071', active:true }
  ],
  guides: [
    { id:'g1', game:'Realms Eternum (Blitz)', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThd7w4cX4MSjUtwcp5-Tqa--giLP0Qf5ABBw&s', links:[{emoji:'📖',label:'Beginner Guide',url:'https://medium.com/@AlexiaChukwuma/eternum-or-blitz-choosing-your-battle-in-starknets-flagship-rts-c017ef48cb98'},{emoji:'💬',label:'Starter Guide by Lordcumberlord',url:'https://x.com/lordcumberlord/status/2011095751196360980'}], active:true },
    { id:'g2', game:'BlobArena', img:'https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0', links:[{emoji:'📖',label:'Getting Started',url:'https://www.starknet.io/blog/starknet-starter-pack/'},{emoji:'📖',label:'Tutorial by Heyshadowfax',url:'https://x.com/Starknet/status/1965430258850820293'},{emoji:'📖',label:'How to Play by OxKenzman',url:'https://x.com/kenzman18/status/1966070066320998828'}], active:true },
    { id:'g3', game:'Jokers of Neon', img:'https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg', links:[{emoji:'📖',label:'Official Docs',url:'https://docs.jokersofneon.com/'},{emoji:'📖',label:'First steps Tutorial',url:'https://www.youtube.com/watch?v=yCac6cfDm3k'},{emoji:'📖',label:'The Straights Strategy',url:'https://x.com/charrweb3/status/2020943203839483975'}], active:true },
    { id:'g4', game:'Loot Survivor', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s', links:[{emoji:'📖',label:'Complete Guide',url:'https://www.gam3s.gg/news/how-to-play-loot-survivor-on-starknet/'},{emoji:'📖',label:'Go beyond level 10',url:'https://x.com/lordcumberlord/status/1969288053484118076'},{emoji:'📖',label:'Full guide by Odin',url:'https://x.com/odin_free/status/2002681429847617776'}], active:true },
    { id:'g5', game:'Summit', img:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium', links:[{emoji:'📖',label:'Summit guide by Okhai',url:'https://x.com/sudo_okhai/article/2013210791114125799'},{emoji:'📖',label:'Heyshadowfax guide',url:'https://x.com/Starknet/status/2024174211187519853'}], active:true },
    { id:'g6', game:'PonziLand', img:'https://play.ponzi.land/logo.png', links:[{emoji:'📖',label:'Documentation',url:'https://github.com/RuneLabsxyz/PonziLand'},{emoji:'📖',label:'Official Interactive Tutorial',url:'https://play.ponzi.land/tutorial'}], active:true }
  ],
  tournaments: [
    { id:'t1', name:'Budokan Grand S2', game:'Loot Survivor', gameImg:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s', status:'live', prize:'$4,200 LORDS', players:247, maxPlayers:500, color:'#F4C542', url:'https://budokan.gg', host:'@BudokanGG', featured:true, tags:['Ranked','NFT Prize'], desc:'The most competitive Loot Survivor tournament yet.', endTimestamp: Date.now() + 1000*60*60*38, active:true },
    { id:'t2', name:'Blob Brawl #12', game:'BlobArena', gameImg:'https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0', status:'live', prize:'$800 STRK', players:64, maxPlayers:64, color:'#EC796B', url:'https://blobarena.xyz', host:'@Blobarena', featured:false, tags:['PvP','Free Entry'], desc:'64-player elimination bracket. Best blob wins.', endTimestamp: Date.now() + 1000*60*60*4, active:true },
    { id:'t3', name:'Neon Season 1', game:'Jokers of Neon', gameImg:'https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg', status:'live', prize:'$2,100 NFTs', players:189, maxPlayers:256, color:'#a78bfa', url:'https://jokersofneon.com', host:'@jokers_of_neon', featured:false, tags:['Seasonal','Card Prize'], desc:'Seasonal ranked with exclusive NFT card prizes.', endTimestamp: Date.now() + 1000*60*60*72, active:true },
    { id:'t4', name:'Cudokan Weekly', game:'Loot Survivor', gameImg:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s', status:'upcoming', prize:'$500 LORDS', players:12, maxPlayers:100, color:'#22d3ee', url:'https://web.telegram.org/a/#-1003325299219', host:'@Cudokan', featured:false, tags:['Telegram','Weekly'], desc:'Weekly community tournament on Telegram.', endTimestamp: Date.now() + 1000*60*60*48, active:true },
    { id:'t5', name:'Summit Open #1', game:'Summit', gameImg:'https://pbs.twimg.com/media/HBIRQPsakAEvNuO?format=png&name=medium', status:'upcoming', prize:'TBD $SURVIVOR', players:0, maxPlayers:200, color:'#60a5fa', url:'https://www.summit.game', host:'@SummitGame', featured:false, tags:['New','Open'], desc:'First official Summit tournament.', endTimestamp: Date.now() + 1000*60*60*96, active:true },
    { id:'t6', name:'Blob Brawl #11', game:'BlobArena', gameImg:'https://miro.medium.com/v2/resize:fit:1360/format:webp/0*K76-0V6jjzU2fjS0', status:'ended', prize:'$800 STRK', players:64, maxPlayers:64, color:'#EC796B', url:'https://blobarena.xyz', host:'@Blobarena', featured:false, tags:['Ended'], desc:'', winner:'0x09a1...b7c', winnerPrize:'$800 STRK', endTimestamp: Date.now() - 1000*60*60*24, active:true },
    { id:'t7', name:'Budokan Season 1', game:'Loot Survivor', gameImg:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TBm3f1UjODzwiPT6plEJDVhdRfmJKGwiNQ&s', status:'ended', prize:'$3,000 LORDS', players:300, maxPlayers:300, color:'#F4C542', url:'https://budokan.gg', host:'@BudokanGG', featured:false, tags:['Ended'], desc:'', winner:'0x04d3...9f2', winnerPrize:'1,200 LORDS', endTimestamp: Date.now() - 1000*60*60*168, active:true },
    { id:'t8', name:'Neon Pre-season', game:'Jokers of Neon', gameImg:'https://pbs.twimg.com/profile_images/1912136965727657984/OE1pA304_400x400.jpg', status:'ended', prize:'$500 LORDS', players:120, maxPlayers:128, color:'#a78bfa', url:'https://jokersofneon.com', host:'@jokers_of_neon', featured:false, tags:['Ended'], desc:'', winner:'0x07b2...c4d', winnerPrize:'500 LORDS', endTimestamp: Date.now() - 1000*60*60*336, active:true }
  ]
};

async function loadSiteData() {
  try {
    var res = await fetch('data.json?t=' + Date.now());
    if (!res.ok) throw new Error('no data.json');
    var data = await res.json();
    // Merge tournaments from fallback if not in data.json yet
    if (!data.tournaments) data.tournaments = FALLBACK_DATA.tournaments;
    return data;
  } catch(e) {
    return FALLBACK_DATA;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  renderNav();
  renderFooter();
});
