// SPDX-License-Identifier: MIT

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
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {NexUSDControllerV2} from "./NexUSDControllerV2.sol";

/**
 * @custom:oz-upgrades-from NexUSD
 * @title NexUSDV2
 * @dev This contract is an implementation of the NexUSDController for the NexUSD token.
 * @notice It extends NexUSDController and implements the UUPS upgradeable pattern.
 * @dev It includes functions for minting, burning, sending tokens across chains, and handling cross-chain transfers.
 */
contract NexUSDV2 is Initializable, UUPSUpgradeable, NexUSDControllerV2 {
    // =========================
    //      ✅ Errors
    // =========================

    // =========================
    //      ✅ Events
    // =========================

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

    // =========================
    //      ✅ Modifiers
    // =========================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // =========================
    //      ✅ Initializer
    // =========================

    /**
     * @notice Initializes the NexUSD contract with admin and operator roles.
     * @dev Sets up the token name and symbol, assigns roles, and enables UUPS upgradeability.
     * @param ownerAddress The address to be granted the DEFAULT_ADMIN_ROLE (owner ).
     * @param operator The address to be granted the OPERATOR_ROLE (mint, blocklist, destroy).
     */
    function initialize(address ownerAddress, address operator) public initializer {
        __NexUSDController_init("NexUSD", "NexUSD", ownerAddress, operator);
        __UUPSUpgradeable_init();
    }

    // =========================
    //   ✅ External Functions
    // =========================

    /**
     * @notice Mints new NexUSD tokens to a specified address.
     * @dev Only callable by OPERATOR_ROLE. Enforces the MAX_SUPPLY limit.
     * @param to The address to receive the minted tokens.
     * @param amount The number of tokens to mint (6 decimals).
     */
    function mint(address to, uint256 amount) external onlyRole(OPERATOR_ROLE) {
        if (to == address(0)) revert InvalidRecipient();

        _mint(to, amount);
        emit Mint(msg.sender, to, amount);
    }

    /**
     * @notice Burns NexUSD tokens from a specified address.
     * @dev Only callable by OPERATOR_ROLE. Used for supply reduction.
     * @param from The address whose tokens will be burned.
     * @param amount The number of tokens to burn (6 decimals).
     */
    function burn(address from, uint256 amount) external onlyRole(OPERATOR_ROLE) {
        _burn(from, amount);
        emit Burn(msg.sender, from, amount);
    }

    // =========================
    //   ✅ Internal Functions
    // =========================

    /**
     * @notice Authorizes contract upgrades via UUPS proxy pattern.
     * @dev Only callable by ADMIN_ROLE.
     * @param newImplementation The address of the new contract implementation.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    // =========================
    //   ✅ Private Functions
    // =========================

    /**
     * @dev Generates a unique message ID for cross-chain transfers.
     * @param destinationChainSelector The selector of the destination chain.
     * @param receiverContract The address of the receiver contract on the destination chain.
     * @param destinationRecipient The recipient address on the destination chain.
     * @param amount The amount of tokens to transfer.
     * @return messageId The unique message ID.
     */
    function _generateMessageId(
        uint64 destinationChainSelector,
        address receiverContract,
        address destinationRecipient,
        uint256 amount
    ) private view returns (bytes32 messageId) {
        // You can use block.timestamp or a nonce for uniqueness
        return keccak256(
            abi.encodePacked(
                destinationChainSelector,
                receiverContract,
                destinationRecipient,
                amount,
                block.timestamp,
                blockhash(block.number - 1),
                address(this),
                msg.sender
            )
        );
    }

    // =========================
    //   ✅ View & Pure Functions
    // =========================

    /**
     * @notice Returns the number of decimals used for NexUSD (fixed at 6).
     * @return uint8 The number of decimals (6).
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Returns the version of the contract.
     * @return string The version string.
     */
    function version() public pure returns (string memory) {
        return "2.0";
    }
}
