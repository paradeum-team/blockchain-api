import { NextApiRequest } from "next";

import { ChainData, FilterOptions } from "../types";
import { getBoolean } from "./misc";

export function getFilterOptions(
  req: NextApiRequest
): FilterOptions | undefined {
  const { testnet, rpc } = req.query;
  if (typeof testnet === "undefined" && typeof rpc === "undefined") {
    return undefined;
  }
  return {
    testnet:
      typeof testnet !== "undefined"
        ? getBoolean(req.query.testnet)
        : undefined,
    rpc: typeof rpc !== "undefined" ? getBoolean(req.query.rpc) : undefined,
  };
}

export function filterChain(chain: ChainData, opts: FilterOptions): boolean {
  if (typeof opts.testnet !== "undefined" && opts.testnet !== chain.testnet) {
    return false;
  }
  if (typeof opts.rpc !== "undefined" && !chain.rpc.length) {
    return false;
  }
  return true;
}
