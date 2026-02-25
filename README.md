# StarkGames Hub — Migration React/Vite + Cartridge

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173 — tu verras ton site avec le vrai bouton Cartridge.

## 📦 Déploiement GitHub Pages

```bash
# 1. Build
npm run build

# 2. Déployer le dossier dist/ sur GitHub Pages
# Option A : GitHub Actions (recommandé)
# Option B : gh-pages package
npm install -D gh-pages
npx gh-pages -d dist
```

### GitHub Actions (automatique à chaque push)

Crée `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 📁 Structure du projet

```
src/
├── main.tsx              ← Entry point
├── App.tsx               ← Page principale
├── cartridge.tsx         ← Config Cartridge Controller
├── index.css             ← Styles
├── data/
│   └── index.ts          ← Données jeux, carousel, ticker
└── components/
    ├── ConnectButton.tsx  ← Bouton wallet Cartridge
    ├── Nav.tsx            ← Navbar
    ├── Ticker.tsx         ← Bandeau défilant
    ├── Carousel.tsx       ← Carrousel
    └── Footer.tsx         ← Footer
```

## ⚙️ Ajouter des session policies

Dans `src/cartridge.tsx`, décommente et adapte :

```ts
policies: {
  contracts: {
    "0xTON_CONTRAT": {
      name: "Mon Jeu",
      methods: [
        { name: "Move", entrypoint: "move" },
      ],
    },
  },
},
```

## 🔄 Passer en Mainnet

Dans `src/cartridge.tsx`, change `defaultChainId` :

```ts
// Importe mainnet depuis @starknet-react/chains
defaultChainId={mainnet.id}
```
