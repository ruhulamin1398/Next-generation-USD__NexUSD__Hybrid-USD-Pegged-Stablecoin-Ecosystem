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

import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {MavenController} from "./MavenController.sol";

contract TestMaven is Initializable, UUPSUpgradeable, MavenController {
    // ✅ Errors
    /// @dev Error thrown when minting would exceed the maximum supply.
    error MaxSupplyExceeded();
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance.
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.

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

    // Event emitted when the tokens are transferred to an account on another chain.
    event TokensTransferred(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        address token, // The token address that was transferred.
        uint256 tokenAmount, // The token amount that was transferred.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the message.
    );

    event TokensReceivedCrossChain(
        address indexed to, // The address receiving tokens on this chain.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        uint256 amount, // The amount of tokens received.
        bytes32 messageId // The unique ID of the cross-chain message.
    );
    // ✅ modifiers
    /// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
    /// @param _destinationChainSelector The selector of the destination chain.
    modifier onlyAllowlistedChain(uint64 _destinationChainSelector) {
        if (!allowlistedChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

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
        address operator,
        address routerAddress,
        address linkTokenAddress
    ) public initializer {
        __MavenController_init("TestMaven", "MUSD", defaultAdmin, operator);

        __BaseStorage_init(routerAddress, linkTokenAddress);
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

    /// @notice Transfer tokens to receiver on the destination chain.
    /// @notice pay in LINK.
    /// @notice the token must be in the list of supported tokens.
    /// @notice This function can only be called by the owner.
    /// @dev Assumes your contract has sufficient LINK tokens to pay for the fees.
    /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param _receiverContract The address of the recipient on the destination blockchain.
    /// @param _destinationRecipient The address of the token recipient on the destination blockchain.
    /// @param _amount token amount.
    /// @return messageId The ID of the message that was sent.
    function send(
        uint64 _destinationChainSelector,
        address _receiverContract,
        address _destinationRecipient,
        uint256 _amount
    )
        external
        onlyAllowlistedChain(_destinationChainSelector)
        returns (bytes32 messageId)
    {
        bytes memory data = abi.encode(_receiverContract, _amount);

        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        //  address(linkToken) means fees are paid in LINK
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiverContract),
            data: data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0) // Native token for fee
        });

        // Get the fee required to send the message
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

        if (fees > linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);

        // approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
        linkToken.approve(address(router), fees);

        _burn(msg.sender, _amount);
        // Send the message through the router and store the returned message ID
        messageId = router.ccipSend(_destinationChainSelector, evm2AnyMessage);

        // Emit an event with message details
        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiverContract,
            _destinationRecipient,
            _amount,
            address(linkToken),
            fees
        );

        // Return the message ID
        return messageId;
    }

    function ccipReceive(Client.Any2EVMMessage calldata message) external {
        // Decode the payload: (user address, amount)
        (address destinationUserAddress, uint256 amount) = abi.decode(
            message.data,
            (address, uint256)
        );

        // Mint tokens to the destination user
        _mint(destinationUserAddress, amount);

        emit TokensReceivedCrossChain(
            destinationUserAddress,
            message.sourceChainSelector,
            amount,
            message.messageId
        );
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
