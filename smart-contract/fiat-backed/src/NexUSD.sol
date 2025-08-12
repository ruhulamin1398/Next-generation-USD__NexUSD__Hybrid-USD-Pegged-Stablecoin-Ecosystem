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

import {NexUSDController} from "./NexUSDController.sol";

/**
 * @title NexUSD
 * @dev This contract is an implementation of the NexUSDController for the NexUSD token.
 * @notice It extends NexUSDController and implements the UUPS upgradeable pattern.
 * @dev It includes functions for minting, burning, sending tokens across chains, and handling cross-chain transfers.
 */
contract NexUSD is Initializable, UUPSUpgradeable, NexUSDController {
    // =========================
    //      ✅ Errors
    // =========================

    /// @dev Error thrown when minting would exceed the maximum supply.
    error MaxSupplyExceeded();
    error NotEnoughBalance(uint256 amount); // Used to make sure contract has enough balance.
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.

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

    /// @notice Emitted when a cross-chain token transfer is requested.
    /// @param messageId The unique ID of the message.
    /// @param destinationChainSelector The chain selector of the destination chain.
    /// @param receiverContract The address of the receiver contract on the destination chain.
    /// @param destinationRecipient The recipient address on the destination chain.
    /// @param tokenAmount The token amount to be transferred.
    event BridgeRequest(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiverContract,
        address destinationRecipient,
        uint256 tokenAmount
    );

    /// @notice Emitted when tokens are received from another chain.
    /// @param messageId The unique ID of the cross-chain message.
    /// @param to The address receiving tokens on this chain.
    /// @param sourceChainSelector The chain selector of the source chain.
    /// @param amount The amount of tokens received.
    event BridegeTokenReceived(
        bytes32 indexed messageId,
        address indexed to,
        uint64 indexed sourceChainSelector,
        uint256 amount
    );
    // =========================
    //      ✅ Modifiers
    // =========================

    /// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
    /// @param _destinationChainSelector The selector of the destination chain.
    modifier onlyAllowlistedChain(uint64 _destinationChainSelector) {
        if (allowlistedChains[_destinationChainSelector] == address(0)) {
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        }
        _;
    }
    /// @dev Modifier that checks if the amount is above the minimum cross-chain transfer amount.
    /// @param amount The amount to check.
    modifier onlyMinimumCrossChainAmount(uint256 amount) {
        if (amount < minimumCrossChainTransferAmount) {
            revert NotEnoughBalance(amount);
        }
        _;
    }

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
    function initialize(
        address ownerAddress,
        address operator
    ) public initializer {
        __NexUSDController_init("NexUSD", "NUSD", ownerAddress, operator);
        __UUPSUpgradeable_init();
    }

    // =========================
    //   ✅ External Functions
    // =========================

    /**
     * @notice Mints new NUSD tokens to a specified address.
     * @dev Only callable by OPERATOR_ROLE. Enforces the MAX_SUPPLY limit.
     * @param to The address to receive the minted tokens.
     * @param amount The number of tokens to mint (6 decimals).
     */
    function mint(address to, uint256 amount) external onlyRole(OPERATOR_ROLE) {
        if (to == address(0)) revert InvalidRecipient();
        if (totalSupply() + amount > MAX_SUPPLY) {
            revert MaxSupplyExceeded();
        }
        _mint(to, amount);
        emit Mint(msg.sender, to, amount);
    }

    /**
     * @notice Burns NUSD tokens from a specified address.
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
     * @notice Sends NUSD tokens to a recipient on another chain.
     * @dev Only callable by allowlisted chains. Burns tokens from the sender's balance.
     * @param destinationChainSelector The selector of the destination chain.
     * @param destinationRecipient The recipient address on the destination chain.
     * @param amount The number of tokens to send (6 decimals).
     * @return messageId The unique ID of the cross-chain message.
     */
    function send(
        uint64 destinationChainSelector,
        address destinationRecipient,
        uint256 amount
    )
        external
        onlyAllowlistedChain(destinationChainSelector)
        whenNotPaused
        notBlocklistedSender(msg.sender)
        onlyMinimumCrossChainAmount(amount)
        returns (bytes32 messageId)
    {
        if (destinationRecipient == address(0)) revert InvalidRecipient();
        address receiverContract = allowlistedChains[destinationChainSelector];

        uint256 balance = balanceOf(msg.sender);
        if (balance < amount) {
            revert NotEnoughBalance(amount);
        }

        _burn(msg.sender, amount);
        // Emit an event with message details
        messageId = _generateMessageId(
            destinationChainSelector,
            receiverContract,
            destinationRecipient,
            amount
        );
        emit BridgeRequest(
            messageId,
            destinationChainSelector,
            receiverContract,
            destinationRecipient,
            amount
        );

        // Return the message ID
        return messageId;
    }

    /**
     * @notice Handles the reception of tokens from another chain.
     * @dev Only callable by BRIDGE_OPERATOR_ROLE. Mints tokens to the recipient on this chain.
     * @param messageId The unique ID of the cross-chain message.
     * @param sourceChainSelector The selector of the source chain.
     * @param recipient The address receiving the tokens on this chain.
     * @param amount The number of tokens requested(6 decimals).
     * @param fee ,the number of token will send to owner account
     */
    function bridgeMint(
        bytes32 messageId,
        uint64 sourceChainSelector,
        address recipient,
        uint256 amount,
        uint256 fee
    )
        external
        whenNotPaused
        notBlocklistedRecipient(recipient)
        onlyRole(BRIDGE_OPERATOR_ROLE)
    {
        if (totalSupply() + amount > MAX_SUPPLY) {
            revert MaxSupplyExceeded();
        }

        if (recipient == address(0)) revert InvalidRecipient();
        // Mint tokens to the destination user
        _mint(recipient, amount - fee);
        _mint(owner, fee);

        emit BridegeTokenReceived(
            messageId,
            recipient,
            sourceChainSelector,
            amount
        );
    }

    // =========================
    //   ✅ Internal Functions
    // =========================

    /**
     * @notice Authorizes contract upgrades via UUPS proxy pattern.
     * @dev Only callable by ADMIN_ROLE.
     * @param newImplementation The address of the new contract implementation.
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(ADMIN_ROLE) {}

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
        return
            keccak256(
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
     * @notice Returns the number of decimals used for NUSD (fixed at 6).
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
        return "1.0";
    }
}
