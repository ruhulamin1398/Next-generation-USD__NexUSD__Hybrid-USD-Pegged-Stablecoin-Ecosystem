# TestMaven Project Documentation

## Overview

This repository contains the smart contracts for the TestMaven project, a decentralized application for a fiat-backed US dollar pegged coin. It uses OpenZeppelin's upgradeable contracts for flexibility, security, and adaptability. Features include a robust role-based access control system and token management (blacklisting, minting, and burning).

## Contracts

Below is an overview of the core Solidity contracts in the `src` directory:

### `BaseStorage.sol`

Provides base storage for the TestMaven ecosystem. It defines constants such as `ADMIN_ROLE`, `OPERATOR_ROLE`, and `MAX_SUPPLY`, and an internal `blockedAccounts` mapping. Its purpose is to provide a consistent storage interface for inheriting contracts.

### `MavenController.sol`

An abstract contract inheriting from `BaseStorage` and OpenZeppelin's upgradeable `ERC20Upgradeable`, `ERC20PausableUpgradeable`, `AccessControlUpgradeable`, and `ERC20PermitUpgradeable` contracts. It manages core token logic, including blocklist management (adding/removing accounts, destroying blacklisted funds), pausing/unpausing transfers, and enforcing role-based access. It also handles error conditions for transactions involving blocklisted parties.

### `TestMaven.sol`

Main implementation of the Maven token. It inherits from `Initializable`, `UUPSUpgradeable`, and `MavenController`, providing upgradeability and core token features. Sets decimal precision to 6 and includes an upgrade authorization mechanism that restricts contract upgrades to `ADMIN_ROLE` holders. Emits `BridgeRequest` events for token transfers.

## Core Features

### 1. Role-Based Access Control

TestMaven uses OpenZeppelin's `AccessControlUpgradeable` for secure, flexible permissions:

- **Owner (Default Admin Role):** Can pause/unpause, manage roles, and configure system settings.
- **Admin Role:** Can deploy and upgrade contracts using the UUPS pattern.
- **Operator Role:** Can mint, burn, freeze/unfreeze, blocklist, and execute bridge operations.

### 2. Blocklist (Blacklist)

Operators can restrict malicious or non-compliant accounts:

- `addToBlocklist(address account)`: Block an account from transfers, minting, and bridge operations.
- `removeFromBlocklist(address account)`: Remove an account from the blocklist.
- `isBlocklisted(address account)`: Check if an account is blocklisted.
- `destroyBlackFunds(address account)`: Remove all tokens from a blocklisted account (operator only).

### 3. Pausable

The owner can pause or unpause all sensitive operations:

- `pause()`: Pauses all transfers, mint, burn, freeze, and bridge operations.
- `unpause()`: Unpauses the contract.
- All critical functions are protected by `whenNotPaused`.

### 4. Minting & Burning

- `mint(address to, uint256 amount)`: Operator can mint new tokens up to `MAX_SUPPLY`.
- `burn(address from, uint256 amount)`: Operator can burn tokens from any account.
- Both functions emit `Mint` and `Burn` events, and are disabled when paused.

### 5. Cross-Chain Bridge

- Users can request cross-chain transfers with `send`, emitting a `BridgeRequest` event.
- Operators execute cross-chain mints and burns with `bridgeMint` and `bridgeBurn`, emitting `BridgeExecuted` events.

### 6. Custodian (Freeze/Unfreeze)

- Operators can freeze or unfreeze user tokens, restricting or restoring transferability.
- `frozenBalance` and `availableBalance` report the frozen and transferable balances for any user.

### 7. Upgradeability

- TestMaven uses the UUPS proxy pattern for upgradeability.
- Only accounts with `ADMIN_ROLE` can authorize upgrades.

## Roles

The TestMaven project uses a role-based access control (RBAC) system to manage permissions securely. Roles are defined using OpenZeppelin's `AccessControlUpgradeable` library and custom definitions in `BaseStorage`.

### 1. Owner (Default Admin Role)

The Owner role holds the highest administrative privileges, focused on governance and system configuration.

- **Key Permissions:**
  - **Change Fees:** Modify transaction or service fees.
  - **Manage Operator Role:** Grant or revoke the `OPERATOR_ROLE`.
  - **Manage Admin Role:** Grant or revoke the `ADMIN_ROLE`.
  - **Pause/Unpause Functionality:** Control pausing/unpausing of the ERC20 token to halt or resume transfers.

### 2. Admin Role

The Admin role is crucial for maintaining and evolving TestMaven smart contracts, focusing on deployment and upgrades.

- **Key Permissions:**
  - **Deploy & Upgrade Contracts:** Initiate and execute upgrades to the `TestMaven` contract (and related system contracts) using the UUPS upgradeability pattern, allowing the system to evolve.

### 3. Operator Role

The Operator role manages daily token operations, including user restrictions and supply control.

- **Key Permissions:**
  - **Manage Blacklist:** Add or remove addresses from the blocklist (preventing transfers) and `destroyBlackFunds` (burn tokens) held by those accounts.
  - **Mint & Burn Tokens:** Issue new tokens up to `MAX_SUPPLY` and permanently remove tokens from circulation.

## Getting Started

To get started with TestMaven smart contracts:

### Prerequisites

Ensure [Foundry](https://getfoundry.sh/) is installed. Foundry is a fast, portable, and modular toolkit for Ethereum development. Install it with:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

### Installation

1.  **Clone Repository:** Clone the TestMaven project:

    ```bash
    git clone <url>
    cd TestMaven
    ```

2.  **Install Dependencies:** In the project directory, install dependencies:

    ```bash
    forge install
    ```

### Compiling Contracts

Compile contracts:

```bash
forge build
```

### Running Tests

Run tests to ensure contract functionalities work and verify security:

```bash
forge test
```

## Contributing

Contributions to the TestMaven project are welcome.

## License

This project is licensed under the MIT License. Refer to the `LICENSE` file for full details.

## Contact

For questions or inquiries, contact the owner.
