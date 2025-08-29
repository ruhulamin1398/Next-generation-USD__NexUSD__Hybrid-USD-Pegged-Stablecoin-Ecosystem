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

/**
 * @title NexUSDController
 * @notice Controller contract for the NexUSD token, managing roles, blocklists, allowlists, and core token logic.
 * @dev Inherits from BaseStorage, ERC20, ERC20Pausable, AccessControl, and ERC20Permit (all upgradeable).
 *      Designed for upgradeability and secure role-based access control.
 */
abstract contract NexUSDController is
    BaseStorage,
    ERC20Upgradeable,
    ERC20PausableUpgradeable,
    AccessControlUpgradeable,
    ERC20PermitUpgradeable
{
    // =========================
    //      ✅ Errors
    // =========================

    /// @notice The operation failed because the sender is blocklisted.
    error BlocklistedSender(address sender);
    /// @notice The operation failed because the recipient is blocklisted.
    error BlocklistedRecipient(address recipient);
    /// @notice The operation failed because the sender address is invalid (zero address).
    error InvalidSender();
    /// @notice The operation failed because the recipient address is invalid (zero address).
    error InvalidRecipient();
    /// @notice The operation failed because the new owner address is invalid (zero address).
    error InvalidNewOwner();

    /// @notice Emitted when a user is blocklisted.
    /// @param account The address that was blocklisted.
    event UserBlocked(address indexed account);
    /// @notice Emitted when a user is removed from the blocklist.
    /// @param account The address that was unblocked.
    event UserUnBlocked(address indexed account);
 
    /// @notice Emitted when the contract owner changes.
    /// @param newOwner The new owner address.
    event OwnerChanged(address indexed newOwner);

    // =========================
    //      ✅ Modifiers
    // =========================

    /// @notice Ensures the sender is not blocklisted.
    /// @param from The address of the sender.
    modifier notBlocklistedSender(address from) {
        if (blockedAccounts[from]) revert BlocklistedSender(from);
        _;
    }
    /// @notice Ensures the recipient is not blocklisted.
    /// @param to The address of the recipient.

    modifier notBlocklistedRecipient(address to) {
        if (blockedAccounts[to]) revert BlocklistedRecipient(to);
        _;
    }

    // =========================
    //      ✅ Initializer
    // =========================
    /// @notice Initializes the NexUSDController contract with token details and role assignments.
    /// @dev Sets up ERC20 name/symbol, initializes access control, pausable, and permit modules. Grants admin and operator roles.
    /// @param name The name of the ERC20 token (e.g., "NexUSD").
    /// @param symbol The symbol of the ERC20 token (e.g., "NexUSD").
    /// @param ownerAddress The address to be granted DEFAULT_ADMIN_ROLE (owner).
    /// @param operator The address to be granted OPERATOR_ROLE (mint, burn, blocklist).
    function __NexUSDController_init(string memory name, string memory symbol, address ownerAddress, address operator)
        internal
        onlyInitializing
    {
        owner = ownerAddress;
        minimumCrossChainTransferAmount = 1; // Default to 1, can be updated by owner
        __ERC20_init(name, symbol);
        __AccessControl_init();
        __ERC20Pausable_init();
        __ERC20Permit_init(name);
        _grantRole(DEFAULT_ADMIN_ROLE, owner);
        _grantRole(OPERATOR_ROLE, operator);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // =========================
    //   ✅ External Functions
    // =========================
    /// @notice Changes the owner of the contract.
    /// @dev Only callable by DEFAULT_ADMIN_ROLE (owner).
    /// @param newOwner The address to be set as the new owner.
    function changeOwner(address newOwner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newOwner == address(0)) revert InvalidNewOwner();
        address oldOwner = owner;
        owner = newOwner;
        uint256 ownerBalance = balanceOf(oldOwner);
        if (ownerBalance > 0) {
            _burn(oldOwner, ownerBalance);
            _mint(newOwner, ownerBalance);
        }
        _revokeRole(DEFAULT_ADMIN_ROLE, oldOwner);
        _grantRole(DEFAULT_ADMIN_ROLE, newOwner);
        emit OwnerChanged(newOwner);
    }

    /// @notice Sets the minimum amount for cross-chain transfers.
    /// @dev Only callable by DEFAULT_ADMIN_ROLE (owner).
    /// @param amount The minimum amount to set for cross-chain transfers.
    function setMinimumCrossChainTransferAmount(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        minimumCrossChainTransferAmount = amount;
    }

    /// @notice Adds an account to the blocklist.
    /// @dev Only callable by OPERATOR_ROLE.
    /// @param account The address to be blocklisted.
    function addToBlocklist(address account) external onlyRole(OPERATOR_ROLE) {
        blockedAccounts[account] = true;
        emit UserBlocked(account);
    }

    /// @notice Removes an account from the blocklist.
    /// @dev Only callable by OPERATOR_ROLE.
    /// @param account The address to be removed from the blocklist.
    function removeFromBlocklist(address account) external onlyRole(OPERATOR_ROLE) {
        blockedAccounts[account] = false;
        emit UserUnBlocked(account);
    }

 

    // =========================
    //   ✅ Public Functions
    // =========================

    /// @notice Pauses all token transfers and minting/burning operations.
    /// @dev Only callable by DEFAULT_ADMIN_ROLE (owner).
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /// @notice Unpauses all token transfers and minting/burning operations.
    /// @dev Only callable by DEFAULT_ADMIN_ROLE (owner).
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // =========================
    //   ✅ Internal Functions
    // =========================

    /// @notice Updates the transfer logic to ensure sender and recipient are not blocklisted.
    /// @dev Overrides the _update function from ERC20PausableUpgradeable and ERC20Upgradeable.
    /// @param from The address of the sender.
    /// @param to The address of the recipient.
    /// @param value The amount being transferred.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable)
        notBlocklistedSender(from)
        notBlocklistedRecipient(to)
    {
        super._update(from, to, value);
    }

    // =========================
    //   ✅ View & Pure Functions
    // =========================

    /// @notice Checks if an account is currently blocklisted.
    /// @param account The address to check.
    /// @return True if the account is blocklisted, false otherwise.
    function isBlocklisted(address account) public view returns (bool) {
        return blockedAccounts[account];
    }

   
}
