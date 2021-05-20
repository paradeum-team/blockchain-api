export interface ChainJsonRpc {
  methods: {
    chain: string[];
    accounts: string[];
    request: string[];
    sign: string[];
  };
}
