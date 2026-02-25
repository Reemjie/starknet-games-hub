import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { cartridgeConnector } from "../cartridge";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [username, setUsername] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!address) { setUsername(null); return; }
    cartridgeConnector.username?.().then((u: string | null) => setUsername(u ?? null)).catch(() => {});
  }, [address]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const copyAddr = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!isConnected) {
    return (
      <button
        className="w-connect-btn"
        onClick={() => connect({ connector: cartridgeConnector as never })}
      >
        <span>🕹</span>
        <span>Connect Wallet</span>
      </button>
    );
  }

  const label = username || shortAddr(address!);

  return (
    <div className="w-wrapper" ref={ref}>
      <button className="w-connect-btn w-connect-btn--on" onClick={() => setOpen((v) => !v)}>
        <span className="w-avatar">🎮</span>
        <span>{label}</span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
          style={{ opacity: 0.5, transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div className="w-dropdown">
          <div className="w-dropdown__addr">{shortAddr(address!)}</div>
          <button className="w-dropdown__item" onClick={copyAddr}>
            {copied ? "✓ Copied!" : "📋 Copy address"}
          </button>
          <a
            className="w-dropdown__item"
            href="https://cartridge.gg/profile"
            target="_blank"
            rel="noreferrer"
          >
            🌐 Cartridge Profile ↗
          </a>
          <hr className="w-dropdown__sep" />
          <button
            className="w-dropdown__item w-dropdown__item--red"
            onClick={() => { disconnect(); setOpen(false); }}
          >
            ⏻ Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
