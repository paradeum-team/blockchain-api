export interface ChainData {
  name: string;
  id: string;
  rpc: string[];
  slip44: number;
  testnet: boolean;
}

export interface NamespaceList {
  [reference: string]: ChainData;
}
