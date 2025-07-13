//SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/**
 * @title BaseStorage
 * @notice Base storage contract for the Maven token, defining shared state variables and constants.
 * @dev Intended to be inherited by MavenController. Provides upgradeable storage layout for roles, supply, allowlist, blocklist, and storage gap.
 */
abstract contract BaseStorage {
    // =========================
    //      ✅ State Variables
    // =========================

    /// @notice The owner of the contract.
    address public owner;

    /// @notice Role identifier for contract administrators (deployment, upgrades).
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Role identifier for operators (mint, burn, blocklist management).
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    /// @notice Maximum supply of the Maven token (100 million MUSD, 6 decimals).
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 6;

    /// @notice Mapping of allowlisted chains for cross-chain operations.
    /// @dev The key is the chain selector (uint64), the value is the token contract address on that chain.
    mapping(uint64 => address) public allowlistedChains;

    /// @notice Mapping to track blocklisted accounts.
    /// @dev True if the account is blocklisted, false otherwise. Blocklisted accounts are restricted from transfers, minting, and burning.
    mapping(address => bool) internal blockedAccounts;

    /// @dev Storage gap for upgradeability (see OpenZeppelin docs).
    uint256[24] __gap_BaseStorage;
}
