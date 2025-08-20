//SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/**
 * @title BaseStorageV2
 * @notice Base storage contract for the NexUSD token, defining shared state variables and constants.
 * @dev Intended to be inherited by NexUSDController. Provides upgradeable storage layout for roles, supply, allowlist, blocklist, and storage gap.
 */
abstract contract BaseStorageV2 {
    // =========================
    //      ✅ State Variables
    // =========================

    /// @notice The owner of the contract.
    address public owner;

    /// @notice Role identifier for contract administrators (deployment, upgrades).
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Role identifier for operators (mint, burn, blocklist management).
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    /// @notice Role identifier for cross-chain operators (cross-chain transfers).
    bytes32 public constant BRIDGE_OPERATOR_ROLE = keccak256("BRIDGE_OPERATOR_ROLE");

    /// @notice Maximum supply of the NexUSD token (100 million NexUSD, 6 decimals).
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 6;

    /// @notice Mapping of allowlisted chains for cross-chain operations.
    /// @dev The key is the chain selector (uint64), the value is the token contract address on that chain.
    mapping(uint64 => address) public allowlistedChains;

    /// @notice Mapping to track blocklisted accounts.
    /// @dev True if the account is blocklisted, false otherwise. Blocklisted accounts are restricted from transfers, minting, and burning.
    mapping(address => bool) internal blockedAccounts;

    /// @notice Minimum amount for cross-chain transfers.
    /// @dev This is used to prevent spam and ensure meaningful transfers.
    /// @dev This value can be set by the contract owner.
    /// @dev It is initialized to 1, meaning no minimum by default.
    /// @dev This can be updated by the owner to enforce a minimum transfer amount.
    uint256 public minimumCrossChainTransferAmount;

    /// @dev Storage gap for upgradeability (see OpenZeppelin docs).
    uint256[24] __gap_BaseStorage;
}
