### Airdrop tokens (mint directly to address)

```http
POST http://localhost:3001/airdrop
token: {{BACKEND_API_TOKEN}}
Content-Type: application/json

{
    "network": "sepolia",
    "address": "0xB2FD18C9727a315a68c1084f17eb6a85dd544353",
    "amount": 100
}

```

```json
// Response

{
  "id": "69d082372ac087f06a7ae24e",
  "network": "sepolia",
  "address": "0xB2FD18C9727a315a68c1084f17eb6a85dd544353",
  "amount": 100,
  "txHash": "0xc939e7184ab70663008e8e41ec24032bdd73df37c263144d93ea196198452062",
  "status": "success",
  "error": null
}
```

### Config

```http
GET http://localhost:3001/configs
token: {{BACKEND_API_TOKEN}}

```

```json
// response
[
  {
    "_id": "69b153985dfcb84e11d670a4",
    "title": "BSC Testnet",
    "contractAddress": "0x71E53ea9f5a19A0aFB72d4fFCEBB5c0Da9c57152",
    "decimals": 6,
    "rpcUrl": "",
    "network": "bsc-testnet",
    "explorerUrl": "https://testnet.bscscan.com",
    "totalHolders": 2232,
    "totalSupply": 99905900,
    "totalTransferred": 2700
  },
  {
    "_id": "69b1539f5dfcb84e11d670a7",
    "title": "Avalanche Fuji",
    "contractAddress": "0x8ff02cFB12F00C023E24743744E59e8e79D22d76",
    "decimals": 6,
    "rpcUrl": "",
    "network": "avalanche-fuji",
    "explorerUrl": "https://testnet.snowscan.xyz",
    "totalHolders": 1759,
    "totalSupply": 98980344,
    "totalTransferred": 1937
  },
  {
    "_id": "69b153d05dfcb84e11d670ae",
    "title": "Polygon Amoy",
    "contractAddress": "0x6Db9d8fea1B96FE25B2382a6b26656D9Eb260502",
    "decimals": 6,
    "rpcUrl": "",
    "network": "polygon-amoy",
    "explorerUrl": "https://amoy.polygonscan.com",
    "totalHolders": 1988,
    "totalSupply": 97843430,
    "totalTransferred": 5204
  },
  {
    "_id": "69b153d35dfcb84e11d670b1",
    "title": "Sepolia",
    "contractAddress": "0x9768F4a36a9748D0a03A4Cefe70087758295747f",
    "decimals": 6,
    "rpcUrl": "",
    "network": "sepolia",
    "explorerUrl": "https://sepolia.etherscan.io",
    "totalHolders": 1860,
    "totalSupply": 24340876,
    "totalTransferred": 1969
  },
  {
    "_id": "69cadfcde88a27720ebc25ed",
    "title": "Hoodi Sepolia",
    "contractAddress": "0x58F427707474346B30163EE69c24681c18Cf87DA",
    "decimals": 6,
    "rpcUrl": "",
    "network": "hoodi-sepolia",
    "explorerUrl": "https://hoodi.etherscan.io",
    "totalHolders": 1066,
    "totalSupply": 4229946,
    "totalTransferred": 1097
  },
  {
    "_id": "69cadfcee88a27720ebc25ef",
    "title": "Chaido Sepolia",
    "contractAddress": "0x58F427707474346B30163EE69c24681c18Cf87DA",
    "decimals": 6,
    "rpcUrl": "",
    "network": "chaido-sepolia",
    "explorerUrl": "https://gnosis-chiado.blockscout.com",
    "totalHolders": 762,
    "totalSupply": 146233772,
    "totalTransferred": 766
  },
  {
    "_id": "69cadfcee88a27720ebc25f1",
    "title": "Mantle Sepolia",
    "contractAddress": "0xab0b261df6d672069288d8c8dfdd01c1626e2d07",
    "decimals": 6,
    "rpcUrl": "",
    "network": "mantle-sepolia",
    "explorerUrl": "https://sepolia.mantlescan.xyz",
    "totalHolders": 1011,
    "totalSupply": 1836920116,
    "totalTransferred": 1023
  },
  {
    "_id": "69cadfcee88a27720ebc25f3",
    "title": "Optimism Sepolia",
    "contractAddress": "0x58F427707474346B30163EE69c24681c18Cf87DA",
    "decimals": 6,
    "rpcUrl": "",
    "network": "optimism-sepolia",
    "explorerUrl": "https://sepolia-optimism.etherscan.io/",
    "totalHolders": 1334,
    "totalSupply": 128015312,
    "totalTransferred": 1362
  },
  {
    "_id": "69cadfcde88a27720ebc25eb",
    "title": "Arbitrum Sepolia",
    "contractAddress": "0x58F427707474346B30163EE69c24681c18Cf87DA",
    "decimals": 6,
    "rpcUrl": "",
    "network": "arbitrum-sepolia",
    "explorerUrl": "https://sepolia.arbiscan.io",
    "totalHolders": 1364,
    "totalSupply": 2367852,
    "totalTransferred": 1429
  },
  {
    "_id": "69cadfcde88a27720ebc25e9",
    "title": "Base Sepolia",
    "contractAddress": "0x58f427707474346b30163ee69c24681c18cf87da",
    "decimals": 6,
    "rpcUrl": "",
    "network": "base-sepolia",
    "explorerUrl": "https://sepolia.basescan.org",
    "totalHolders": 715,
    "totalSupply": 174351863,
    "totalTransferred": 728
  }
]
```

### Single Network Config

```http
GET http://localhost:3001/config?network=sepolia
token: {{BACKEND_API_TOKEN}}
```

```json
// response
{
  "_id": "69b153d35dfcb84e11d670b1",
  "title": "Sepolia",
  "contractAddress": "0x9768F4a36a9748D0a03A4Cefe70087758295747f",
  "decimals": 6,
  "rpcUrl": "",
  "network": "sepolia",
  "explorerUrl": "https://sepolia.etherscan.io",
  "totalHolders": 1860,
  "totalSupply": 24340876,
  "totalTransferred": 1969
}
```
