import axios, { AxiosResponse } from "axios";
import { formatJsonRpcRequest, JsonRpcRequest } from "rpc-json-utils";
import { hexToUtf8 } from "enc-utils";

import { getChainConfig } from "./chains";
import { convertStringToNumber } from "./bignumber";

export const rpcGetAccountBalance = async (address: string, chainId: string): Promise<number> => {
  const { rpcUrl } = getChainConfig(chainId);

  if (!rpcUrl && typeof rpcUrl !== "string") {
    throw new Error("Invalid or missing rpc url");
  }

  const request = formatJsonRpcRequest("eth_getBalance", [address, "latest"]);
  const response = await axios.post(rpcUrl, request);

  const balance = convertStringToNumber(hexToUtf8(response.data.result));
  return balance;
};

export const rpcGetAccountNonce = async (address: string, chainId: string): Promise<number> => {
  const { rpcUrl } = getChainConfig(chainId);

  if (!rpcUrl && typeof rpcUrl !== "string") {
    throw new Error("Invalid or missing rpc url");
  }

  const request = formatJsonRpcRequest("eth_getTransactionCount", [address, "pending"]);
  const response = await axios.post(rpcUrl, request);

  const nonce = convertStringToNumber(hexToUtf8(response.data.result));
  return nonce;
};

export const rpcGetGasLimit = async (contractAddress: string, data: string): Promise<number> => {
  const chainId = "eip155:1";

  const { rpcUrl } = getChainConfig(chainId);
  const request = formatJsonRpcRequest("eth_estimateGas", [
    {
      to: contractAddress,
      data,
    },
  ]);
  const response = await axios.post(rpcUrl, request);
  const gasLimit = convertStringToNumber(hexToUtf8(response.data.result));
  return gasLimit;
};

export const rpcGetBlockNumber = async (chainId: string): Promise<number> => {
  const { rpcUrl } = getChainConfig(chainId);

  if (!rpcUrl && typeof rpcUrl !== "string") {
    throw new Error("Invalid or missing rpc url");
  }
  const request = formatJsonRpcRequest("eth_blockNumber", []);
  const response = await axios.post(rpcUrl, request);
  const blockNumber = convertStringToNumber(hexToUtf8(response.data.result));
  return blockNumber;
};

export const rpcPostCustomRequest = async (
  chainId: string,
  customRpc: JsonRpcRequest,
): Promise<any> => {
  const { rpcUrl } = getChainConfig(chainId);

  if (!rpcUrl && typeof rpcUrl !== "string") {
    throw new Error("Invalid or missing rpc url");
  }

  const rpcRequest = formatJsonRpcRequest(customRpc.method, customRpc.params);

  const response = await axios.post(rpcUrl, rpcRequest);

  return response.data.result;
};

export const rpcPostRequest = async (
  chainId: string,
  rpcRequest: JsonRpcRequest,
): Promise<AxiosResponse> => {
  const { rpcUrl } = getChainConfig(chainId);

  if (!rpcUrl && typeof rpcUrl !== "string") {
    throw new Error("Invalid or missing rpc url");
  }

  const response = await axios.post(rpcUrl, rpcRequest);

  return response;
};
