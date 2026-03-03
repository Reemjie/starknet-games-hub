import { useEffect, useState } from "react";

interface XPost {
  author?: string;
  text: string;
  url: string;
  active?: boolean;
}

export function Ticker() {
  const [items, setItems] = useState<XPost[]>([]);

  useEffect(() => {
    fetch("/starknet-games-hub/data.json")
      .then((r) => r.json())
      .then((d) => {
        const posts: XPost[] = d.ticker ?? [];
        setItems(posts.filter((t) => t.active !== false));
      })
      .catch(() => {
        setItems([{ author: "@StarkGames", text: "Bienvenue sur StarkGames Hub", url: "#" }]);
      });
  }, []);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div id="ticker">
      <div className="t-track">
        {doubled.map((t, i) => (
          <a key={i} href={t.url} target="_blank" rel="noreferrer" className="t-item">
            <svg className="t-x" viewBox="0 0 24 24">
              <path d="M18.9 2H22l-6.6 7.5L23 22h-6.7l-5.2-6.7L5 22H2l7.1-8.2L1 2h6.8l4.7 6.1L18.9 2z" />
            </svg>
            {t.author && <strong style={{ color: "#EC796B" }}>{t.author}</strong>}
            <span>{t.text}</span>
            <span className="t-sep">·</span>
          </a>
        ))}
      </div>
    </div>
  );
}
