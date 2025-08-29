//SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/**
 * @title BaseStorage
 * @notice Base storage contract for the NexUSD token, defining shared state variables and constants.
 * @dev Intended to be inherited by NexUSDController. Provides upgradeable storage layout for roles, supply,  blocklist, and storage gap.
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

    /// @notice Maximum supply of the NexUSD token (100 million NexUSD, 6 decimals).
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 6;

 

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
