import { ChainID } from "caip";

import * as blockchain from "./blockchain";
import { ChainConfig, SupportedChains } from "./types";

export function sanitizeChainId(chainId: string): string {
  return new ChainID(chainId).toString();
}

export function getChainProperty<T>(chainId: string, property: string): T {
  const { namespace, reference } = ChainID.parse(chainId);
  const config = blockchain[property][namespace][reference];

  if (!config) {
    throw new Error(`Invalid or unsupported chainId: ${chainId}`);
  }
  return config;
}

export function getChainConfig(chainId: string): ChainConfig {
  return getChainProperty<ChainConfig>(chainId, "config");
}

export function getSupportedChains(): SupportedChains {
  const chains: SupportedChains = {};
  Object.keys(blockchain.config).forEach((namespace: string) => {
    Object.keys(blockchain.config[namespace]).forEach((reference: string) => {
      const chainId = ChainID.format({ namespace, reference });
      chains[chainId] = getChainConfig(chainId);
    });
  });
  return chains;
}
