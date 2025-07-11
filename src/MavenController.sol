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
import {ERC20PausableUpgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
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
    error BlocklistedSender(address sender);
    error BlocklistedRecipient(address recipient);
    error NotBlocklisted(address account);

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
    function __MavenController_init(string memory name, string memory symbol, address defaultAdmin, address operator)
        internal
        onlyInitializing
    {
        __ERC20_init(name, symbol);
        __AccessControl_init();
        __ERC20Pausable_init();

        __ERC20Permit_init(name);

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(OPERATOR_ROLE, operator);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // ✅ external Functions

    function addToBlocklist(address account) external onlyRole(OPERATOR_ROLE) {
        blockedAccounts[account] = true;
        emit UserBlocked(account);
    }

    function removeFromBlocklist(address account) external onlyRole(OPERATOR_ROLE) {
        blockedAccounts[account] = false;
        emit UserUnBlocked(account);
    }

    function destroyBlackFunds(address blacklistedAccount) external onlyRole(OPERATOR_ROLE) {
        if (!blockedAccounts[blacklistedAccount]) {
            revert NotBlocklisted(blacklistedAccount);
        }

        uint256 dirtyFunds = balanceOf(blacklistedAccount);
        _burn(blacklistedAccount, dirtyFunds);

        emit DestroyedBlackFunds(blacklistedAccount, dirtyFunds);
    }

    // ✅ public Functions

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ✅ internal Functions

    function _beforeTokenTransfer(address from, address to, uint256 /* amount */ ) internal virtual {
        if (from != address(0) && blockedAccounts[from]) {
            revert BlocklistedSender(from);
        }
        if (to != address(0) && blockedAccounts[to]) {
            revert BlocklistedRecipient(to);
        }
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable)
    {
        super._update(from, to, value);
    }

    // ✅ private Functions
    // ✅ view & pure functions
    function isBlocklisted(address account) public view returns (bool) {
        return blockedAccounts[account];
    }
}
