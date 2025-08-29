// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";
import {NexUSD} from "../../src/NexUSD.sol";
import {BaseStorage} from "../../src/BaseStorage.sol";
import {DeployNexUSD} from "../../script/DeployNexUSD.s.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "../Helper.t.sol";

contract AccessControlTest is HelperConfig, HelperTest {
    function setUp() public {
        deployV1();
    }

    function testDefaultRolesAreSet() public view {
        // OWNER should have DEFAULT_ADMIN_ROLE
        assertTrue(NexUSDv1.hasRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), OWNER));
        // ADMIN should have ADMIN_ROLE
        assertTrue(NexUSDv1.hasRole(NexUSDv1.ADMIN_ROLE(), ADMIN));
        // OPERATOR should have OPERATOR_ROLE
        assertTrue(NexUSDv1.hasRole(NexUSDv1.OPERATOR_ROLE(), OPERATOR));
    }

    function testAddAndRevokeAdminRole() public {
        address newAdmin = address(0xBEEF);
        // OWNER grants ADMIN_ROLE
        vm.startPrank(OWNER);
        NexUSDv1.grantRole(NexUSDv1.ADMIN_ROLE(), newAdmin);
        vm.stopPrank();
        assertTrue(NexUSDv1.hasRole(NexUSDv1.ADMIN_ROLE(), newAdmin));
        // OWNER revokes ADMIN_ROLE
        vm.startPrank(OWNER);
        NexUSDv1.revokeRole(NexUSDv1.ADMIN_ROLE(), newAdmin);
        vm.stopPrank();
        assertFalse(NexUSDv1.hasRole(NexUSDv1.ADMIN_ROLE(), newAdmin));
    }

    function testAddAndRevokeOperatorRole() public {
        address newOperator = address(0xCAFE);
        // OWNER grants OPERATOR_ROLE
        vm.startPrank(OWNER);
        NexUSDv1.grantRole(NexUSDv1.OPERATOR_ROLE(), newOperator);
        vm.stopPrank();
        assertTrue(NexUSDv1.hasRole(NexUSDv1.OPERATOR_ROLE(), newOperator));
        // OWNER revokes OPERATOR_ROLE
        vm.startPrank(OWNER);
        NexUSDv1.revokeRole(NexUSDv1.OPERATOR_ROLE(), newOperator);
        vm.stopPrank();
        assertFalse(NexUSDv1.hasRole(NexUSDv1.OPERATOR_ROLE(), newOperator));
    }

    function testChangeDefaultAdminRole() public {
        address newOwner = address(0x1234);
        // OWNER grants DEFAULT_ADMIN_ROLE to newOwner
        vm.startPrank(OWNER);
        NexUSDv1.grantRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), newOwner);
        vm.stopPrank();
        assertTrue(NexUSDv1.hasRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), newOwner));
        // OWNER revokes own admin role
        vm.startPrank(OWNER);
        NexUSDv1.revokeRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), OWNER);
        vm.stopPrank();
        assertFalse(NexUSDv1.hasRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), OWNER));
        assertTrue(NexUSDv1.hasRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), newOwner));
    }

    function testChangeOwnerFunctionality() public {
        address newOwner = address(0x5678);
        // OWNER calls changeOwner
        vm.startPrank(OWNER);
        NexUSDv1.changeOwner(newOwner);
        vm.stopPrank();
        // New owner should have DEFAULT_ADMIN_ROLE
        assertTrue(NexUSDv1.hasRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), newOwner));
        assertFalse(NexUSDv1.hasRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), OWNER));
        // Storage owner variable should be updated
        assertEq(NexUSDv1.owner(), newOwner);
    }

 
}
