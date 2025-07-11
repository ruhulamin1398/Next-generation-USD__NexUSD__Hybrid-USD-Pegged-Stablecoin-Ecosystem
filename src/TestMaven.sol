// SPDX-License-Identifier: MIT

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

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {MavenController} from "./MavenController.sol";

contract TestMaven is Initializable, UUPSUpgradeable, MavenController {
    // ✅ Errors
    /// @dev Error thrown when minting would exceed the maximum supply.
    error MaxSupplyExceeded();

    // ✅ Events

    /// @notice Emitted when new tokens are minted.
    /// @param to The address receiving the minted tokens.
    /// @param amount The number of tokens minted.
    event Mint(address indexed to, uint256 amount);

    /// @notice Emitted when tokens are burned.
    /// @param from The address whose tokens were burned.
    /// @param amount The number of tokens burned.
    event Burn(address indexed from, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ✅ Initalizer

    /**
     * @notice Initializes the TestMaven contract with admin and operator roles.
     * @dev Sets up the token name and symbol, assigns roles, and enables UUPS upgradeability.
     * @param defaultAdmin The address to be granted the DEFAULT_ADMIN_ROLE (owner ).
     * @param operator The address to be granted the OPERATOR_ROLE (mint, blocklist, destroy).
     */
    function initialize(
        address defaultAdmin,
        address operator
    ) public initializer {
        __MavenController_init("TestMaven", "MUSD", defaultAdmin, operator);
        __UUPSUpgradeable_init();
    }

    // ✅ external Functions

    /**
     * @notice Mints new MUSD tokens to a specified address.
     * @dev Only callable by OPERATOR_ROLE. Enforces the MAX_SUPPLY limit.
     * @param to The address to receive the minted tokens.
     * @param amount The number of tokens to mint (6 decimals).
     */
    function mint(address to, uint256 amount) external onlyRole(OPERATOR_ROLE) {
        if (totalSupply() + amount > MAX_SUPPLY) {
            revert MaxSupplyExceeded();
        }
        _mint(to, amount);
        emit Mint(to, amount);
    }

    /**
     * @notice Burns MUSD tokens from a specified address.
     * @dev Only callable by OPERATOR_ROLE. Used for supply reduction.
     * @param from The address whose tokens will be burned.
     * @param amount The number of tokens to burn (6 decimals).
     */
    function burn(
        address from,
        uint256 amount
    ) external onlyRole(OPERATOR_ROLE) {
        _burn(from, amount);
        emit Burn(from, amount);
    }

    // ✅ internal Functions

    /**
     * @notice Authorizes contract upgrades via UUPS proxy pattern.
     * @dev Only callable by ADMIN_ROLE.
     * @param newImplementation The address of the new contract implementation.
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(ADMIN_ROLE) {}

    // ✅ view & pure functions

    /**
     * @notice Returns the number of decimals used for MUSD (fixed at 6).
     * @return uint8 The number of decimals (6).
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
