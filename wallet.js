/**
 * wallet.js — Intégration Cartridge Controller
 * À placer à la racine de ton projet, à côté de index.html
 *
 * Usage dans chaque page HTML :
 *   <script type="module" src="./wallet.js"></script>
 *   <div id="wallet-btn-container"></div>
 */

import { RpcProvider, constants } from "https://esm.sh/starknet@6.11.0";

// ─────────────────────────────────────────────
// CONFIG — Modifie ici selon tes besoins
// ─────────────────────────────────────────────
const CONFIG = {
  // Change "SN_SEPOLIA" en "SN_MAIN" pour le mainnet
  chainId: constants.StarknetChainId.SN_SEPOLIA,
  rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",

  // ID du conteneur où le bouton sera injecté (doit exister dans le HTML)
  buttonContainerId: "wallet-btn-container",
};

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let walletState = {
  isConnected: false,
  address: null,
  username: null,
  account: null,
};

// ─────────────────────────────────────────────
// CARTRIDGE CONTROLLER — Chargé via window.starknet
// ─────────────────────────────────────────────

/**
 * Détecte et retourne le connecteur Cartridge injecté dans la page.
 * Cartridge injecte automatiquement window.starknet quand l'extension
 * ou le popup est présent.
 */
async function getCartridgeConnector() {
  // Attendre que Cartridge injecte son objet (jusqu'à 3s)
  for (let i = 0; i < 30; i++) {
    if (window.starknet?.id === "argentX" || window.starknet?.id === "cartridge" || window.starknet) {
      return window.starknet;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return null;
}

// ─────────────────────────────────────────────
// CONNECT / DISCONNECT
// ─────────────────────────────────────────────

export async function connectWallet() {
  try {
    // Priorité 1 : Cartridge Controller (via popup web)
    // On utilise l'API starknet-get-api standard
    let connector = await getCartridgeConnector();

    if (!connector) {
      // Fallback : ouvrir Cartridge via popup URL
      openCartridgePopup();
      return;
    }

    // Demander la connexion
    const result = await connector.enable({ starknetVersion: "v5" });

    if (!result || result.length === 0) {
      throw new Error("Connexion refusée");
    }

    const address = result[0];

    // Récupérer le nom d'utilisateur Cartridge si disponible
    let username = null;
    try {
      username = await connector.request({ type: "wallet_getPermissions" });
    } catch (_) {}

    walletState = {
      isConnected: true,
      address,
      username: connector.account?.username || null,
      account: connector.account,
    };

    // Sauvegarder en session pour persistance entre pages
    sessionStorage.setItem("wallet_address", address);
    if (walletState.username) {
      sessionStorage.setItem("wallet_username", walletState.username);
    }

    renderButton();
    dispatchWalletEvent("wallet:connected", walletState);

  } catch (err) {
    console.error("Erreur de connexion wallet :", err);
    dispatchWalletEvent("wallet:error", { error: err.message });
  }
}

export function disconnectWallet() {
  walletState = {
    isConnected: false,
    address: null,
    username: null,
    account: null,
  };

  sessionStorage.removeItem("wallet_address");
  sessionStorage.removeItem("wallet_username");

  renderButton();
  dispatchWalletEvent("wallet:disconnected", {});
}

/**
 * Ouvre le Controller Cartridge dans un popup Web si pas d'extension installée.
 * Cartridge propose une interface web à l'adresse cartridge.gg
 */
function openCartridgePopup() {
  const popup = window.open(
    "https://x.cartridge.gg",
    "CartridgeController",
    "width=480,height=640,left=100,top=100"
  );

  if (!popup) {
    alert(
      "Popup bloqué ! Autorise les popups pour ce site,\nou installe le Cartridge Controller depuis cartridge.gg"
    );
  }
}

// ─────────────────────────────────────────────
// RESTORE SESSION
// ─────────────────────────────────────────────

function restoreSession() {
  const savedAddress = sessionStorage.getItem("wallet_address");
  const savedUsername = sessionStorage.getItem("wallet_username");

  if (savedAddress) {
    walletState = {
      isConnected: true,
      address: savedAddress,
      username: savedUsername,
      account: null, // Le compte complet sera rechargé lors de la prochaine action
    };
  }
}

// ─────────────────────────────────────────────
// RENDER — Bouton injecté dans #wallet-btn-container
// ─────────────────────────────────────────────

function renderButton() {
  const container = document.getElementById(CONFIG.buttonContainerId);
  if (!container) return;

  container.innerHTML = walletState.isConnected
    ? renderConnectedButton()
    : renderDisconnectedButton();

  // Attacher les event listeners
  const btn = container.querySelector(".cartridge-btn");
  if (!btn) return;

  if (walletState.isConnected) {
    // Clic sur le bouton connecté → toggle dropdown
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = container.querySelector(".cartridge-dropdown");
      dropdown?.classList.toggle("open");
    });

    // Clic sur "Déconnecter"
    container.querySelector(".cartridge-disconnect")?.addEventListener("click", () => {
      disconnectWallet();
    });

    // Clic sur "Copier l'adresse"
    container.querySelector(".cartridge-copy")?.addEventListener("click", () => {
      navigator.clipboard.writeText(walletState.address);
      const el = container.querySelector(".cartridge-copy");
      el.textContent = "✓ Copié !";
      setTimeout(() => (el.textContent = "Copier l'adresse"), 1500);
    });

    // Fermer le dropdown si clic ailleurs
    document.addEventListener("click", () => {
      container.querySelector(".cartridge-dropdown")?.classList.remove("open");
    }, { once: true });

  } else {
    btn.addEventListener("click", connectWallet);
  }
}

function shortAddr(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function renderDisconnectedButton() {
  return `
    <button class="cartridge-btn cartridge-btn--disconnected">
      <svg class="cartridge-btn__icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
      </svg>
      Connecter Cartridge
    </button>`;
}

function renderConnectedButton() {
  const display = walletState.username || shortAddr(walletState.address);
  return `
    <div class="cartridge-connected-wrapper">
      <button class="cartridge-btn cartridge-btn--connected">
        <span class="cartridge-btn__avatar">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </span>
        <span>${display}</span>
        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" style="opacity:0.6">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>
      <div class="cartridge-dropdown">
        <div class="cartridge-dropdown__address">${shortAddr(walletState.address)}</div>
        <button class="cartridge-dropdown__item cartridge-copy">Copier l'adresse</button>
        <a class="cartridge-dropdown__item" href="https://cartridge.gg/profile" target="_blank">
          Mon profil Cartridge ↗
        </a>
        <hr class="cartridge-dropdown__divider">
        <button class="cartridge-dropdown__item cartridge-disconnect cartridge-disconnect--danger">
          Déconnecter
        </button>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────
// EVENTS — Permet à tes autres scripts d'écouter le wallet
// ─────────────────────────────────────────────

function dispatchWalletEvent(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

// API publique pour tes autres scripts :
// document.addEventListener("wallet:connected", (e) => {
//   console.log("Adresse :", e.detail.address);
// });

export function getWalletState() {
  return { ...walletState };
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
  restoreSession();
  renderButton();
}

// Lancer à la fin du chargement du DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
