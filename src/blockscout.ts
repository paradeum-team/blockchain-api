import axios, { AxiosInstance } from "axios";
import { Ethereum } from "./types";
import { multiply, isNumber, convertStringToNumber } from "./bignumber";
import { isSuccessful } from "./utilities";
import { getEthereumChain } from "./ethereum";
import { lookupMethod } from "./method-registry";
import { rpcGetAccountBalance } from "./rpc";
import { ChainID } from "caip";

const api: AxiosInstance = axios.create({
  baseURL: "https://blockscout.com/",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const fetchAndParseTokenBalance = async (
  token: Ethereum.AssetData,
  address: string,
  chainId: string,
): Promise<Ethereum.AssetData> => {
  const tokenBalanceRes = await apiGetAccountTokenBalance(address, chainId, token.contractAddress);

  const tokenBalance = isSuccessful(tokenBalanceRes) ? tokenBalanceRes.data.result : [];

  if (tokenBalance && isNumber(tokenBalance) && convertStringToNumber(tokenBalance)) {
    token.balance = tokenBalance;
  }

  return token;
};

export async function apiGetAccountBalance(address: string, chainId: string) {
  const chainData = getEthereumChain(convertStringToNumber(ChainID.parse(chainId).reference));
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "balance";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountNativeCurrency(address: string, chainId: string) {
  const chainData = getEthereumChain(convertStringToNumber(ChainID.parse(chainId).reference));

  const nativeCurrency = chainData.native_currency;

  const balanceRes = await apiGetAccountBalance(address, chainId);

  let nativeBalance = isSuccessful(balanceRes) ? balanceRes.data.result : 0;

  if (!nativeBalance) {
    nativeBalance = await rpcGetAccountBalance(address, chainId);
  }

  nativeCurrency.balance = `${nativeBalance}`;

  return nativeCurrency;
}

export async function apiGetTokenInfo(contractAddress: string, chainId: string) {
  const chainData = getEthereumChain(convertStringToNumber(ChainID.parse(chainId).reference));
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "token";
  const action = "getToken";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&contractaddress=${contractAddress}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountTokenList(address: string, chainId: string) {
  const chainData = getEthereumChain(convertStringToNumber(ChainID.parse(chainId).reference));
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "tokenlist";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountTokenBalance(
  address: string,
  chainId: string,
  contractAddress: string,
) {
  const chainData = getEthereumChain(convertStringToNumber(ChainID.parse(chainId).reference));
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "tokenbalance";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&contractaddress=${contractAddress}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountTokenAsset(
  address: string,
  chainId: string,
  contractAddress: string,
) {
  const tokenInfoRes = await apiGetTokenInfo(contractAddress, chainId);

  const tokenInfo = isSuccessful(tokenInfoRes) ? tokenInfoRes.data.result : null;

  if (tokenInfo) {
    let token: Ethereum.AssetData = {
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      decimals: tokenInfo.decimals,
      contractAddress: tokenInfo.contractAddress,
      balance: "",
    };

    token = await fetchAndParseTokenBalance(token, address, chainId);

    return token;
  } else {
    throw new Error("Could not find token information");
  }
}

export async function apiGetAccountAssets(
  address: string,
  chainId: string,
): Promise<Ethereum.AssetData[]> {
  const nativeCurrency = await apiGetAccountNativeCurrency(address, chainId);

  const tokenListRes = await apiGetAccountTokenList(address, chainId);
  const tokenList: Ethereum.AssetData[] = isSuccessful(tokenListRes)
    ? tokenListRes.data.result
    : [];

  let tokens: Ethereum.AssetData[] = await Promise.all(
    tokenList.map((token: Ethereum.AssetData) =>
      fetchAndParseTokenBalance(token, address, chainId),
    ),
  );
  tokens = tokens.filter(
    token => !!Number(token.balance) && !!token.balance && !!token.decimals && !!token.name,
  );

  const assets: Ethereum.AssetData[] = [nativeCurrency, ...tokens];

  return assets;
}

export async function apiGetAccountTxList(address: string, chainId: string) {
  const chainData = getEthereumChain(convertStringToNumber(ChainID.parse(chainId).reference));
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "txlist";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountTokenTx(address: string, chainId: string) {
  const chainData = getEthereumChain(convertStringToNumber(ChainID.parse(chainId).reference));
  const chain = chainData.chain.toLowerCase();
  const network = chainData.network.toLowerCase();
  const module = "account";
  const action = "tokentx";
  const url = `/${chain}/${network}/api?module=${module}&action=${action}&address=${address}`;
  const result = await api.get(url);
  return result;
}

export async function apiGetAccountTransactions(
  address: string,
  chainId: string,
): Promise<Ethereum.ParsedTx[]> {
  const txListRes = await apiGetAccountTxList(address, chainId);
  const txList: Ethereum.BlockScoutTx[] = isSuccessful(txListRes) ? txListRes.data.result : [];

  const transactions: Ethereum.ParsedTx[] = txList.map(
    (tx: Ethereum.BlockScoutTx): Ethereum.ParsedTx => {
      const asset: Ethereum.AssetData = {
        symbol: "ETH",
        name: "Ethereum",
        decimals: "18",
        contractAddress: "",
      };

      const parsedTx: Ethereum.ParsedTx = {
        timestamp: multiply(tx.timeStamp, 1000),
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        nonce: tx.nonce,
        gasPrice: tx.gasPrice,
        gasUsed: tx.gasUsed,
        fee: multiply(tx.gasPrice, tx.gasUsed),
        value: tx.value,
        input: tx.input,
        error: tx.isError === "1",
        asset,
        operations: [],
      };
      return parsedTx;
    },
  );

  const tokenTxnsRes = await apiGetAccountTokenTx(address, chainId);
  const tokenTxns: Ethereum.BlockScoutTokenTx[] = isSuccessful(tokenTxnsRes)
    ? tokenTxnsRes.data.result
    : [];

  await Promise.all(
    tokenTxns.map(async (tokenTx: Ethereum.BlockScoutTokenTx) => {
      const asset: Ethereum.AssetData = {
        symbol: tokenTx.tokenSymbol,
        name: tokenTx.tokenName,
        decimals: tokenTx.tokenDecimal,
        contractAddress: tokenTx.contractAddress,
      };

      const functionHash = tokenTx.input.substring(0, 10);
      const functionMethod = await lookupMethod(functionHash);

      const functionName =
        functionMethod && functionMethod.name ? functionMethod.name : functionHash;

      const operation: Ethereum.TxOperation = {
        asset,
        value: tokenTx.value,
        from: tokenTx.from,
        to: tokenTx.to,
        functionName,
      };

      let matchingTx = false;

      for (const tx of transactions) {
        if (tokenTx.hash.toLowerCase() === tx.hash.toLowerCase()) {
          tx.operations.push(operation);
          matchingTx = true;
          break;
        }
      }

      if (!matchingTx) {
        const asset: Ethereum.AssetData = {
          symbol: "ETH",
          name: "Ethereum",
          decimals: "18",
          contractAddress: "",
        };

        const parsedTx: Ethereum.ParsedTx = {
          timestamp: multiply(tokenTx.timeStamp, 100),
          hash: tokenTx.hash,
          from: tokenTx.from,
          to: tokenTx.to,
          nonce: tokenTx.nonce,
          gasPrice: tokenTx.gasPrice,
          gasUsed: tokenTx.gasUsed,
          fee: multiply(tokenTx.gasPrice, tokenTx.gasUsed),
          value: tokenTx.value,
          input: tokenTx.input,
          error: false,
          asset,
          operations: [],
        };

        transactions.push(parsedTx);
      }
    }),
  );

  transactions.sort((a, b) => parseInt(b.timestamp, 10) - parseInt(a.timestamp, 10));

  return transactions;
}
