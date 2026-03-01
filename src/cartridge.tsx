import { ControllerConnector } from "@cartridge/connector";
import { mainnet, sepolia } from "@starknet-react/chains";
import { StarknetConfig, jsonRpcProvider, voyager } from "@starknet-react/core";
import type { Chain } from "@starknet-react/chains";
import type { ReactNode } from "react";

export const cartridgeConnector = new ControllerConnector({
  chains: [
    { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
    { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
  ],
});

function rpc(chain: Chain) {
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
