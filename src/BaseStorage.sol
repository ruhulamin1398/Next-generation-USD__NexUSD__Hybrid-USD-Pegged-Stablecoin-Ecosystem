//SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/**
 * @title BaseStorage
 * @notice The BaseStorage contract is a storage abstraction contract for the TestMavenContract.
 * @dev This contract is meant to be inherited by other contracts to provide a consistent storage interface.
 */

abstract contract BaseStorage {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 6; // 100M MUSD
    mapping(address => bool) internal blockedAccounts;

    // Storage gap: https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#storage-gaps
    uint256[24] __gap_BaseStorage;
}
