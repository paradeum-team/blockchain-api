import axios, { AxiosInstance } from "axios";
import { Ethereum } from "./types";
import { convertStringToNumber, divide, multiply, formatFixedDecimals } from "./bignumber";

const api: AxiosInstance = axios.create({
  baseURL: "https://ethgasstation.info/",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const apiGetGasPrices = async (): Promise<Ethereum.GasPrices> => {
  const { data } = await api.get(`/json/ethgasAPI.json`);
  const result: Ethereum.GasPrices = {
    timestamp: Date.now(),
    slow: {
      time: convertStringToNumber(multiply(data.safeLowWait, 60)),
      price: convertStringToNumber(divide(data.safeLow, 10)),
    },
    average: {
      time: convertStringToNumber(multiply(data.avgWait, 60)),
      price: convertStringToNumber(divide(data.average, 10)),
    },
    fast: {
      time: convertStringToNumber(multiply(data.fastestWait, 60)),
      price: convertStringToNumber(divide(data.fastest, 10)),
    },
  };
  return result;
};

export const apiGetGasGuzzlers = async (): Promise<Ethereum.GasGuzzler[]> => {
  const { data } = await api.get(`/json/gasguzz.json`);
  const result = data.map((guzzlerRaw: Ethereum.GasGuzzlerRaw) => ({
    address: guzzlerRaw.to_address,
    pct: convertStringToNumber(formatFixedDecimals(`${guzzlerRaw.pcttot}`, 2)),
    gasused: convertStringToNumber(guzzlerRaw.gasused),
    id: guzzlerRaw.ID,
  }));
  return result;
};
