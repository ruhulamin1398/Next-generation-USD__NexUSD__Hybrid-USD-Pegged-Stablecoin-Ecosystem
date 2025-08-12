# Audit of NexUSD Smart Contracts

## Audit Scope

The following contracts were included in the scope of this audit:

- `BaseStorage.sol`
- `MavenController.sol`
- `NexUSD.sol`

## Summary

The NexUSD system implements an upgradeable ERC20 token (NUSD) with advanced access control, pausable functionality, blocklist mechanisms, and a cross-chain bridge pattern. The architecture separates storage, core logic, and upgradeable implementation for maintainability and upgrade safety. The contracts leverage OpenZeppelin's upgradeable libraries and follow best practices for modularity and security.

## Key Findings

### Strengths

- **Upgradeability:** Uses the UUPS proxy pattern for seamless contract upgrades without migration.
- **Access Control:** Employs OpenZeppelin's `AccessControlUpgradeable` for robust, granular role management.
- **Pausable:** Integrates `ERC20PausableUpgradeable` to allow emergency halts of all token operations.
- **Blocklist:** Implements mechanisms to restrict malicious actors and control cross-chain operations.
- **Comprehensive Testing:** The project includes a professional, high-coverage test suite using Foundry, with edge case , flow and upgradeability tests.

### Potential Issues and Recommendations

| Severity         | Issue                                             | Recommendation                                                                                                 |
|------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| Informational    | Centralized Bridge Mechanism                      | Consider a decentralized or automated bridge (e.g., relayers, light clients, or third-party bridge providers). |
| Low              | Centralization of Power                           | Use a multi-signature wallet or DAO for `DEFAULT_ADMIN_ROLE` to reduce single point of failure.                |
| Low              | Bridge Max Supply Race Condition                  | Implement atomicity or compensation logic to prevent loss of funds if destination mint fails after source burn. |


## Detailed Findings

### 1. Centralized Bridge Mechanism

**Severity:** Informational

**Description:** The current bridge mechanism is not a true cross-chain bridge. It relies on a trusted operator to manually mint and burn tokens on the destination chain after an off-chain validation process. This has several drawbacks:

- **Single Point of Failure:** If the operator is compromised or becomes unavailable, the entire bridge functionality will be halted.
- **Trust:** Users must trust the operator to act honestly and correctly.
- **Scalability:** The manual nature of the process makes it difficult to scale to a large number of transactions.

**Recommendation:** Consider a bridge mechanism that balances decentralization with regulatory compliance. Options include using a network of regulated relayers, integrating with compliant third-party bridge providers, or implementing a permissioned bridge with transparent governance and auditability. Ensure that any solution meets KYC/AML requirements and maintains robust controls over minting and burning to align with fiat reserve attestations.

### 2. Centralization of Power

**Severity:** Low

**Description:** The `DEFAULT_ADMIN_ROLE` has significant power over the contract, including the ability to:

- Pause and unpause the contract.
- Change the owner of the contract.
- Upgrade the contract.

This centralization of power creates a single point of failure. If the account with the `DEFAULT_ADMIN_ROLE` is compromised, the entire system could be at risk.

**Recommendation:** Consider implementing a multi-signature wallet or a DAO to manage the `DEFAULT_ADMIN_ROLE`. This would distribute the power and reduce the risk of a single point of failure.

### 3. Bridge Max Supply Race Condition

**Severity:** Low

**Description:** In the current bridge transfer flow, tokens are burned on the source chain before minting on the destination chain. If the destination chain's `MAX_SUPPLY` is reached (or would be exceeded by the mint), the mint will fail and revert, but the burn on the source chain will have already occurred. This results in a net loss of tokens for the user and a supply imbalance between chains.

- **Impact:** Users may lose funds if the destination chain cannot mint due to max supply constraints, while the source chain has already burned their tokens.
- **Root Cause:** Lack of atomicity between burn (source) and mint (destination) operations across chains.

**Recommendation:**
- Implement a compensation or refund mechanism if the destination mint fails (e.g., allow the operator to re-mint on the source chain in such cases).
- Consider using a two-phase commit or escrow pattern to ensure atomicity, or leverage cross-chain messaging protocols that support rollback on failure.


## Additional Recommendations

- **Testing & Coverage:** Continue to maintain high test coverage, especially for edge cases and upgrade scenarios. Consider adding fuzzing and invariant tests for bridge and role logic.
- **Upgradeability Risks:** Document and test all storage layout changes. Use OpenZeppelin's upgrade safety tools before each upgrade.
- **References:**
  - [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/contracts/4.x/upgradeable)
  - [EIP-2535: Diamonds](https://eips.ethereum.org/EIPS/eip-2535)
  - [EIP-2612: Permit](https://eips.ethereum.org/EIPS/eip-2612)

 


