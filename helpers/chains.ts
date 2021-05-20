import eip155 from "../public/chains/eip155.json";
import cosmos from "../public/chains/cosmos.json";
import polkadot from "../public/chains/polkadot.json";

import { ChainData, NamespaceList, FilterOptions } from "../types";
import { filterChain } from "./filter";
import { parseChainId } from "./misc";

export function getNamespaceList(
  chainId: string,
  opts?: FilterOptions
): NamespaceList {
  const [namespace] = parseChainId(chainId);
  let list: NamespaceList | undefined = undefined;
  switch (namespace) {
    case "eip155":
      list = eip155;
      break;
    case "cosmos":
      list = cosmos;
      break;
    case "polkadot":
      list = polkadot;
      break;
    default:
      break;
  }
  if (typeof list === "undefined") {
    throw new Error(`Namespace requested not supported: ${namespace}`);
  }
  if (typeof opts !== "undefined") {
    let cache = list;
    list = {};
    Object.keys(cache).forEach((key) => {
      const chain = cache[key];
      if (filterChain(chain, opts)) {
        list[key] = chain;
      }
    });
  }
  return list;
}

export function getChainData(chainId: string): ChainData {
  const [_, reference] = parseChainId(chainId);
  const list = getNamespaceList(chainId);
  const chain = list[reference];
  if (typeof chain === "undefined") {
    throw new Error(`Chain requested not supported: ${chainId}`);
  }
  return chain;
}
