import { ConnectButton } from "./ConnectButton";

export function Nav() {
  const hash = window.location.hash.replace("#", "");
  return (
    <nav id="nav">
      <a href="#" className="nl">
        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/starknet-cryptocurrency-3d-icon-png-download-9555134.png" style={{ width: 28, height: 28, objectFit: "contain" }} alt="" />
        <span>StarkGames</span>
      </a>
      <a href="#" className={`na ${hash === '' ? 'active' : ''}`}>⬡ Home</a>
      <a href="#games" className={`na na-hide ${hash === 'games' ? 'active' : ''}`}>🎮 Games</a>
      <a href="#tournaments" className={`na na-hide ${hash === 'tournaments' ? 'active' : ''}`}>🏆 Tournaments <span className="lpill"><span className="ldot" />LIVE</span></a>
      <a href="#profile" className={`na na-hide ${hash === 'profile' ? 'active' : ''}`}>◈ Profile</a>
      <a href="#learn" className={`na na-hide ${hash === 'learn' ? 'active' : ''}`}>⚡ Get Started</a>
      <div className="nav-right"><ConnectButton /></div>
    </nav>
  );
}
