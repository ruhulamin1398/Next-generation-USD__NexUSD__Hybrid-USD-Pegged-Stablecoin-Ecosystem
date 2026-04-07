### `GET /api/networks`

- Description: Proxy endpoint for fetching all network configurations.
- Behavior: forwards request to the backend `/configs` endpoint, attaches `BACKEND_API_TOKEN` server-side, and appends `tokenType: "fiat"` to each network entry.

```http
GET https://localhost:3001/api/networks
```

---

### `POST /api/balances`

- Description: Returns NexUSD balances for a wallet address across all configured networks.
- Request body: JSON containing `address`.
- Response: list of network balances with `balance`, `usdValue`, and network metadata.

```http
POST https://localhost:3001/api/balances
Content-Type: application/json

{
  "address": "0xYourAddressHere"
}
```

---

### `POST /api/tx/save`

- Description: Save a completed transaction to the wallet history database.
- Request body: transaction payload including `address`, `chain`, `txHash`, `type`, `amount`, `token`, `tokenType`, `from`, `to`, `status`, `timestamp`, and optional `metadata`.
- Response: success object with saved `id` and `txHash`.

```http
POST https://localhost:3001/api/tx/save
Content-Type: application/json

{
  "address": "0xYourAddressHere",
  "chain": "sepolia",
  "txHash": "0xTxHash",
  "type": "transfer",
  "amount": "100.0",
  "token": "NexUSD",
  "tokenType": "fiat",
  "from": "0xFromAddress",
  "to": "0xToAddress",
  "status": "confirmed",
  "timestamp": 1712345678,
  "metadata": {
    "networkTitle": "Sepolia",
    "explorerUrl": "https://sepolia.etherscan.io"
  }
}
```

---

### `GET /api/tx`

- Description: Fetch paginated transaction history for a wallet address.
- Query params:
  - `address` (required)
  - `page` (optional, default `1`)
  - `limit` (optional, default `20`)
  - `tokenType` (optional `fiat` or `crypto`)
  - `type` (optional `transfer` or `receive`)
- Response: paginated list of transactions.

```http
GET https://localhost:3001/api/tx?address=0xYourAddressHere&page=1&limit=20
```

---

### `POST /api/faucet`

- Description: Proxy endpoint for requesting testnet NexUSD via the backend `POST /airdrop` endpoint.
- Request body: `network` and `address`.
- Response: backend faucet response with `txHash` and `status`.

```http
POST https://localhost:3001/api/faucet
Content-Type: application/json

{
  "network": "sepolia",
  "address": "0xYourAddressHere"
}
```
