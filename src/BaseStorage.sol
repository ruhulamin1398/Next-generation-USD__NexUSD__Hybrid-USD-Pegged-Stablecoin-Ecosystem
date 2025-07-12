//SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/**
 * @title BaseStorage
 * @notice The BaseStorage contract is a storage abstraction contract for the TestMavenContract.
 * @dev This contract is meant to be inherited by other contracts to provide a consistent storage interface.
 */
abstract contract BaseStorage {
    // ✅ Type declarations

    /// @dev Enum to define bridge actions for cross-chain hooks.
    enum BridgeAction {
        Mint,
        Burn
    }

    // ✅ State variables

    /// @notice Role for contract administrators, responsible for deployment and upgrades.
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Role for operators who can mint, burn, block, and unblock accounts.

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    /// @notice Maximum supply of the Maven token (100 million MUSD, 6 decimals).

    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 6; // 100M MUSD

    /**
     * @dev Mapping to track blocklisted (blacklisted) accounts.
     *      Blocklisted accounts are restricted from transfers as well as minting, burning, and others.
     *      True if the account is blocklisted, false otherwise.
     */
    mapping(address => bool) internal blockedAccounts;

    /**
     * @dev Mapping to track the frozen token amount for each user.
     *      The key is the user's address, and the value is the amount of tokens frozen.
     *      Frozen tokens cannot be transferred or used until unfrozen.
     */
    mapping(address user => uint256 amount) internal frozen;

    // Storage gap: https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#storage-gaps
    uint256[24] __gap_BaseStorage;
}
