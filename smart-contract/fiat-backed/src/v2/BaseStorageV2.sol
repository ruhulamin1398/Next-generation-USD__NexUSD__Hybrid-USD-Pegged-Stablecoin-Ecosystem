//SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/**
 * @title BaseStorageV2
 * @notice Base storage contract for the NexUSD token, defining shared state variables and constants.
 * @dev Intended to be inherited by NexUSDController. Provides upgradeable storage layout for roles, supply,  blocklist, and storage gap.
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

    /// @notice Maximum supply of the NexUSD token ( 1 Billion NexUSD, 6 decimals).
    uint256 public constant MAX_SUPPLY = 1000_000_000 * 10 ** 6;

    /// @notice Mapping to track blocklisted accounts.
    /// @dev True if the account is blocklisted, false otherwise. Blocklisted accounts are restricted from transfers, minting, and burning.
    mapping(address => bool) internal blockedAccounts;

    uint256 public minimumCrossChainTransferAmount;

    /// @notice Total number of token holders.
    /// @dev This will setup automatically  when minting and burning tokens.
    uint256 internal totalHolders;

    /// @notice  Total number of token transfers that have occurred.
    /// @dev This is a cumulative count of all transfer transactions, including minting and burning operations.
    uint256 internal totalNumberOfTransfers;

    /// @dev Storage gap for upgradeability (see OpenZeppelin docs).
    uint256[22] __gap_BaseStorage;
}
