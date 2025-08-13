# NexUSD Fiat backed contract – Next-generation USD (NexUSD)- USD paged stable coin

## Deployed at

```
 Amoy-Polygon : 0x6Db9d8fea1B96FE25B2382a6b26656D9Eb260502
```

## What is NexUSD?

NexUSD is a USD-pegged ERC-20 stablecoin with:

- Upgradeability (UUPS proxy)
- Admin-only mint/burn
- Max supply cap (100 million tokens)
- Cross-chain bridge support
- Blocklist (blacklist) and pausable features
- EIP-2612 permit() support
- Gas optimizations

## Key Features

### 1. Upgradeable (UUPS Proxy)

- The contract can be upgraded by an admin using the UUPS proxy pattern.
- Only `ADMIN_ROLE` can upgrade the contract.

### 2. Role-Based Access Control

- **Owner (Default Admin):** Can pause/unpause, manage roles, and cross chain collect fees.
- **Admin:** Can upgrade the contract, manage cross-chain list, and perform other development-related tasks.
- **Operator:** Can mint, burn, manage the blocklist, and perform user service-related tasks.
- **Bridge Operator:** Can perform bridge transfer-related tasks, including calling `bridgeMint` on the destination chain.

### 3. Minting & Burning

- Only operators can mint or burn tokens.
- Minting is capped at 100,000,000 tokens (6 decimals).
- Both actions are disabled when paused.

### 4. Blocklist (Blacklist)

- Operators can block or unblock accounts.
- Blocked accounts cannot transfer, mint, or burn tokens.

### 5. Pausable

- The owner can pause or unpause all sensitive operations.
- When paused, transfers, mint, burn, and bridge are disabled.

### 6. Cross-Chain Bridge

- Users can request cross-chain transfers with `send`, which emits a `BridgeRequest` event. Each transfer creates a unique `messageId` to track the process across chains.
- Users can only send cross-chain transfer requests to destination chains that are explicitly allowed and set by an `ADMIN_ROLE`.
- There is a minimum cross-chain transfer amount (`minimumCrossChainTransferAmount`) enforced for all bridge requests to prevent spam and dust transfers. This value is configurable by an admin.
- After a user sends a request, a bridge operator on the destination chain will mint the corresponding tokens to the recipient using `bridgeMint`.
- When minting tokens for a cross-chain transfer using `bridgeMint`, a portion of the tokens is minted as a fee to the owner account, and the remaining tokens are minted to the recipient.
- Only accounts with the `BRIDGE_OPERATOR_ROLE` can call `bridgeMint` on the destination chain.
- All bridge actions are protected by blocklist and pause checks.

### 7. EIP-2612 Permit (Bonus)

- The contract supports `permit()` for gasless approvals.

### 8. Gas Optimizations

- Uses efficient storage and access patterns.

## How to Use

### 1. Install Dependencies

```bash
forge install

npm install
```

### 2. Compile Contracts

```bash
forge build
```

### 3. Run Tests

```bash
make test-all
```

## Contract Overview

- `BaseStorage.sol`: Storage layout and constants.
- `NexUSDController.sol`: Core logic, roles, blocklist, pause, and bridge.
- `NexUSD.sol`: Main token contract, upgradeable, emits bridge events.
- `NexUSDV2.sol`: Upgraded version with same features and upgrade safety.

## Upgrade Notes

- Upgrades are only allowed by `ADMIN_ROLE`.
- When upgrading, always call all required parent initializers in the new contract.
- Use the `@custom:oz-upgrades-from` annotation for upgrade validation.

## Security & Audit

- All sensitive functions are protected by roles and pause checks.
- Blocklist prevents malicious accounts from using the token.
- Max supply is strictly enforced.
- Cross-chain bridge emits events with unique `messageId` for off-chain monitoring.

## License

MIT
