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
    /// @param operator The address performing the mint operation.
    /// @param to The address receiving the minted tokens.
    /// @param amount The number of tokens minted.
    event Mint(address indexed operator, address indexed to, uint256 amount);

    /// @notice Emitted when tokens are burned.
    /// @param operator The address performing the burn operation.
    /// @param from The address whose tokens were burned.
    /// @param amount The number of tokens burned.
    event Burn(address indexed operator, address indexed from, uint256 amount);

    /// @notice Emitted when anyone requests a bridge operation.
    /// @param sender   The account locking/burning on this chain
    /// @param recipient The account intended to receive on the target chain
    /// @param amount   Number of tokens to bridge
    /// @param targetChain The name or ID of the target chain
    /// @param action   Mint or Burn intent
    event BridgeRequest(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string targetChain,
        BridgeAction action
    );

    /// @notice Emitted when the operator actually executes a bridge mint or burn.
    event BridgeExecuted(
        address indexed user,
        uint256 amount,
        string sourceChain,
        BridgeAction action
    );

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
        emit Mint(msg.sender, to, amount);
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
        emit Burn(msg.sender, from, amount);
    }

    /**
     * @notice User-facing “send” function to request a bridge operation.
     * @param recipient The intended recipient on `targetChain`
     * @param amount The number of tokens to bridge.
     * @param targetChain The name or ID of the target chain.
     */
    function send(
        address recipient,
        uint256 amount,
        string calldata targetChain
    ) external whenNotPaused {
        emit BridgeRequest(
            msg.sender,
            recipient,
            amount,
            targetChain,
            BridgeAction.Burn
        );
    }

    /**
     * @notice Operator executes mint on destination chain after off‑chain validation.
     * @dev Only callable by OPERATOR_ROLE.
     * @param to The address to receive the minted tokens.
     * @param amount The number of tokens to mint.
     * @param sourceChain The name or ID of the source chain.
     */
    function bridgeMint(
        address to,
        uint256 amount,
        string calldata sourceChain
    ) external onlyRole(OPERATOR_ROLE) {
        _mint(to, amount);
        emit BridgeExecuted(to, amount, sourceChain, BridgeAction.Mint);
    }

    /**
     * @notice Operator executes burn on destination chain after off‑chain validation.
     * @dev Only callable by OPERATOR_ROLE.
     * @param from The address whose tokens will be burned.
     * @param amount The number of tokens to burn.
     * @param sourceChain The name or ID of the source chain.
     */
    function bridgeBurn(
        address from,
        uint256 amount,
        string calldata sourceChain
    ) external onlyRole(OPERATOR_ROLE) {
        _burn(from, amount);
        emit BridgeExecuted(from, amount, sourceChain, BridgeAction.Burn);
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
