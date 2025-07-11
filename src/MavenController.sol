//SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {BaseStorage} from "./BaseStorage.sol";

abstract contract MavenController is
    BaseStorage,
    ERC20Upgradeable,
    AccessControlUpgradeable
{
    event AccountBlocked(address indexed account);
    event AccountUnblocked(address indexed account);

    function __MavenController_init(
        string memory name,
        string memory symbol,
        address defaultAdmin,
        address operator
    ) internal onlyInitializing {
        __ERC20_init(name, symbol);
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(OPERATOR_ROLE, operator);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
}
