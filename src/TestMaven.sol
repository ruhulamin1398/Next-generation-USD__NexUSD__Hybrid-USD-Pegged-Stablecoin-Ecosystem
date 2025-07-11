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
    event BridgeRequest(
        address indexed sender, address indexed recipient, uint256 amount, uint256 targetChainId, string action
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address defaultAdmin, address operator) public initializer {
        __MavenController_init("TestMaven", "MUSD", defaultAdmin, operator);
        __UUPSUpgradeable_init();
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    // Only OPERATOR_ROLE can mint new tokens
    function mint(address to, uint256 amount) external onlyRole(OPERATOR_ROLE) {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyRole(OPERATOR_ROLE) {
        _burn(from, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        MavenController._beforeTokenTransfer(from, to, amount);
        super._beforeTokenTransfer(from, to, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
