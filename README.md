# blockchain-api

A simple Blockchain API proxy for CAIP-compatible dapps

## API

```sh
# get chain data for provided chainId
https://blockchain-api.vercel.app/api/chain/[chainId]

# get chain list for provided namespace
https://blockchain-api.vercel.app/api/namespace/[namespace]

# get only testnets for provided namespace
https://blockchain-api.vercel.app/api/namespace/[namespace]?testnet=true

# get only chains with public rpc for provided namespace
https://blockchain-api.vercel.app/api/namespace/[namespace]?rpc=true
```
