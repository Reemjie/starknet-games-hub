import ControllerConnector from "@cartridge/connector";
import { mainnet, sepolia } from "@starknet-react/chains";
import { StarknetConfig, jsonRpcProvider, voyager } from "@starknet-react/core";
import type { ReactNode } from "react";

// ⚠️  Instancié UNE SEULE FOIS en dehors de tout composant
export const cartridgeConnector = new ControllerConnector({
  // Ajoute tes session policies ici quand tu auras des contrats de jeu :
  // policies: {
  //   contracts: {
  //     "0xTON_CONTRAT": {
  //       name: "Mon Jeu",
  //       methods: [{ name: "Move", entrypoint: "move" }],
  //     },
  //   },
  // },
  chains: [
    { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
    { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
  ],
});

function rpc(chain: typeof mainnet | typeof sepolia) {
  if (chain.id === mainnet.id)
    return { nodeUrl: "https://api.cartridge.gg/x/starknet/mainnet" };
  return { nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia" };
}

export function StarknetProvider({ children }: { children: ReactNode }) {
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={jsonRpcProvider({ rpc })}
      connectors={[cartridgeConnector as never]}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
