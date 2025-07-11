// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {MavenController} from "./MavenController.sol";

contract TestMaven is Initializable, UUPSUpgradeable, MavenController {
    event BridgeRequest(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 targetChainId,
        string action
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address defaultAdmin,
        address operator
    ) public initializer {
        __UUPSUpgradeable_init();
        __MavenController_init("TestMaven", "MUSD", defaultAdmin, operator);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(ADMIN_ROLE) {}
}
