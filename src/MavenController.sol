//SPDX-License-Identifier: MIT

// This is considered an Exogenous,  Anchored (pegged), Fait Backend low volitility coin

// Layout of Contract:
// version
// imports
// interfaces, libraries, contracts
// errors
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

pragma solidity 0.8.30;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ERC20PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {BaseStorage} from "./BaseStorage.sol";

abstract contract MavenController is
    BaseStorage,
    ERC20Upgradeable,
    ERC20PausableUpgradeable,
    AccessControlUpgradeable,
    ERC20PermitUpgradeable
{
    // ✅ Errors

    /**
     * @dev The operation failed because the user is blocked.
     */
    /**
     * @dev The operation failed because the sender is blocklisted.
     */
    error BlocklistedSender(address sender);

    /**
     * @dev The operation failed because the recipient is blocklisted.
     */
    error BlocklistedRecipient(address recipient);

    // ✅ Events
    /**
     * @dev Emitted when a user is blocked.
     * @param account The address of the account that was blocked.
     */
    event UserBlocked(address indexed account);
    /**
     * @dev Emitted when a user is unblocked.
     * @param account The address of the account that was unblocked.
     */
    event UserUnBlocked(address indexed account);
    /**
     * @dev Emitted when black funds are destroyed.
     * @param account The address of the account whose funds were destroyed.
     * @param amount The amount of funds that were destroyed.
     */
    event DestroyedBlackFunds(address indexed account, uint256 amount);

    // ✅ Initalizer
    /**
     * @notice Initializes the MavenController contract with token details and role assignments.
     * @dev Sets up ERC20 name/symbol, initializes access control, pausable, and permit modules. Grants admin and operator roles.
     * @param name The name of the ERC20 token (e.g., "TestMaven").
     * @param symbol The symbol of the ERC20 token (e.g., "MUSD").
     * @param defaultAdmin The address to be granted DEFAULT_ADMIN_ROLE (owner ).
     * @param operator The address to be granted OPERATOR_ROLE (mint, blocklist, destroy).
     */
    function __MavenController_init(
        string memory name,
        string memory symbol,
        address defaultAdmin,
        address operator
    ) internal onlyInitializing {
        __ERC20_init(name, symbol);
        __AccessControl_init();
        __ERC20Pausable_init();
        __ERC20Permit_init(name);
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(OPERATOR_ROLE, operator);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // ✅ external Functions

    /**
     * @notice Adds an account to the blocklist.
     * @dev Only callable by OPERATOR_ROLE.
     * @param account The address to be blocklisted.
     */
    function addToBlocklist(address account) external onlyRole(OPERATOR_ROLE) {
        blockedAccounts[account] = true;
        emit UserBlocked(account);
    }

    /**
     * @notice Removes an account from the blocklist.
     * @dev Only callable by OPERATOR_ROLE.
     * @param account The address to be removed from the blocklist.
     */
    function removeFromBlocklist(
        address account
    ) external onlyRole(OPERATOR_ROLE) {
        blockedAccounts[account] = false;
        emit UserUnBlocked(account);
    }

    function updateAllowlistedChains(
        uint64 chainSelector,
        bool status
    ) external onlyRole(ADMIN_ROLE) {
        allowlistedChains[chainSelector] = status;
    }

    // ✅ public Functions

    /**
     * @notice Pauses all token transfers and minting/burning operations.
     * @dev Only callable by DEFAULT_ADMIN_ROLE (owner ).
     */
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses all token transfers and minting/burning operations.
     * @dev Only callable by DEFAULT_ADMIN_ROLE (owner ).
     */
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ✅ internal Functions

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 /*amount*/
    ) internal view {
        if (from != address(0) && blockedAccounts[from]) {
            revert BlocklistedSender(from);
        }
        if (to != address(0) && blockedAccounts[to]) {
            revert BlocklistedRecipient(to);
        }
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20Upgradeable, ERC20PausableUpgradeable) {
        _beforeTokenTransfer(from, to, value);

        super._update(from, to, value);
    }

    // ✅ private Functions
    // ✅ view & pure functions
    /**
     * @notice Checks if an account is currently blocklisted.
     * @param account The address to check.
     * @return bool True if the account is blocklisted, false otherwise.
     */
    function isBlocklisted(address account) public view returns (bool) {
        return blockedAccounts[account];
    }
}
