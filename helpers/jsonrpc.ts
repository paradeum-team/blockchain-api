import eip155 from "../public/jsonrpc/eip155.json";
import cosmos from "../public/jsonrpc/cosmos.json";
import polkadot from "../public/jsonrpc/polkadot.json";

import { ChainJsonRpc } from "../types";
import { parseChainId } from "./misc";

export function getChainJsonRpc(chainId: string): ChainJsonRpc {
  const [namespace] = parseChainId(chainId);
  let jsonrpc: ChainJsonRpc | undefined = undefined;
  switch (namespace) {
    case "eip155":
      jsonrpc = eip155;
      break;
    case "cosmos":
      jsonrpc = cosmos;
      break;
    case "polkadot":
      jsonrpc = polkadot;
      break;
    default:
      break;
  }
  if (typeof jsonrpc === "undefined") {
    throw new Error(`Namespace requested not supported: ${namespace}`);
  }
  return jsonrpc;
}
