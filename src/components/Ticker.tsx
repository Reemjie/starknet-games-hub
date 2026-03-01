import { TICKER } from "../data";

export function Ticker() {
  const doubled = [...TICKER, ...TICKER];
  return (
    <div id="ticker">
      <div className="t-track">
        {doubled.map((t, i) => (
          <a key={i} href={t.url} target="_blank" rel="noreferrer" className="t-item">
            <svg className="t-x" viewBox="0 0 24 24"><path d="M18.9 2H22l-6.6 7.5L23 22h-6.7l-5.2-6.7L5 22H2l7.1-8.2L1 2h6.8l4.7 6.1L18.9 2z" /></svg>
            <strong style={{ color: "#EC796B" }}>{t.author}</strong>
            <span>{t.text}</span>
            <span className="t-sep">·</span>
          </a>
        ))}
      </div>
    </div>
  );
}
