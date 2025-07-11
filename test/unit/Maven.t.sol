// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";
import {TestMaven} from "../../src/TestMaven.sol";
import {DeployMaven} from "../../script/DeployMaven.s.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "./Helper.t.sol";

contract MavenTest is HelperConfig, HelperTest {
    TestMaven MUSDProxy;
    address USER = address(0x1234);
    address USER2 = address(0x5678);

    function setUp() public {
        DeployMaven deployer = new DeployMaven();
        address proxy = deployer.run();
        MUSDProxy = TestMaven(proxy);
    }

    function testDeployment() public view {
        assertEq(MUSDProxy.decimals(), 6);
        assertEq(MUSDProxy.name(), "TestMaven");
        assertEq(MUSDProxy.symbol(), "MUSD");
    }

    function testMintByOperator() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        assertEq(MUSDProxy.balanceOf(USER), amount);
    }

    function testMintByNonOperatorReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(USER);
        vm.expectRevert();
        MUSDProxy.mint(USER, amount);
    }

    function testMintRevertsWhenExceedingMaxSupply() public {
        vm.startPrank(OPERATOR);
        MUSDProxy.mint(USER, MUSDProxy.MAX_SUPPLY());
        assertEq(MUSDProxy.totalSupply(), MUSDProxy.MAX_SUPPLY());

        vm.expectRevert();
        MUSDProxy.mint(USER, 1);
        vm.stopPrank();
    }

    function testBlocklistPreventsMint() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        MUSDProxy.addToBlocklist(USER);
        vm.expectRevert();
        MUSDProxy.mint(USER, amount);
        vm.stopPrank();
    }

    function testBlocklistAllowsBurn() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        MUSDProxy.mint(USER, amount);

        MUSDProxy.addToBlocklist(USER);
        vm.expectRevert();
        MUSDProxy.burn(USER, amount);

        vm.stopPrank();
    }

    function testBurnByOperator() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        MUSDProxy.burn(USER, amount);
        vm.stopPrank();
        assertEq(MUSDProxy.balanceOf(USER), 0);
    }

    function testBurnByNonOperatorReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        vm.expectRevert();
        vm.prank(USER);
        MUSDProxy.burn(USER, amount);
    }

    function testAddToBlocklist() public {
        vm.startPrank(OPERATOR);
        MUSDProxy.addToBlocklist(USER);
        assertEq(MUSDProxy.isBlocklisted(USER), true);
        vm.stopPrank();
    }

    function testRemoveFromBlocklist() public {
        vm.startPrank(OPERATOR);
        MUSDProxy.addToBlocklist(USER);
        MUSDProxy.removeFromBlocklist(USER);
        assertEq(MUSDProxy.isBlocklisted(USER), false);
        vm.stopPrank();
    }

    function testBlocklistPreventsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        MUSDProxy.addToBlocklist(USER);
        vm.stopPrank();
        vm.prank(USER);
        vm.expectRevert();
        MUSDProxy.transfer(USER, amount);
    }

    function testUnblocklistAllowsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        MUSDProxy.addToBlocklist(USER);
        MUSDProxy.removeFromBlocklist(USER);
        vm.stopPrank();
        vm.prank(USER);
        MUSDProxy.transfer(USER2, amount);
        assertEq(MUSDProxy.balanceOf(USER2), amount);
    }

    function testPausePreventsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        vm.prank(OWNER);
        MUSDProxy.pause();
        vm.prank(USER);
        vm.expectRevert();
        MUSDProxy.transfer(USER, amount);
    }

    function testUnpauseAllowsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        vm.startPrank(OWNER);
        MUSDProxy.pause();
        MUSDProxy.unpause();
        vm.stopPrank();
        vm.prank(USER);
        MUSDProxy.transfer(USER, amount);
        assertEq(MUSDProxy.balanceOf(USER), amount);
    }

    function testFreezeByOperator() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        vm.prank(OPERATOR);
        MUSDProxy.freeze(USER, 500 * 1e6);
        assertEq(MUSDProxy.frozenBalance(USER), 500 * 1e6);
    }

    function testFreezePreventsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        vm.prank(OPERATOR);
        MUSDProxy.freeze(USER, 800 * 1e6);
        vm.prank(USER);
        vm.expectRevert();
        MUSDProxy.transfer(USER2, 900 * 1e6); // More than unfrozen
    }

    function testFreezeAllowsPartialTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        vm.prank(OPERATOR);
        MUSDProxy.freeze(USER, 800 * 1e6);
        vm.prank(USER);
        MUSDProxy.transfer(USER2, 200 * 1e6); // Only unfrozen part
        assertEq(MUSDProxy.balanceOf(USER2), 200 * 1e6);
        assertEq(MUSDProxy.balanceOf(USER), 800 * 1e6);
    }

    function testFreezeRevertsIfInsufficientUnfrozen() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        vm.prank(OPERATOR);
        vm.expectRevert();
        MUSDProxy.freeze(USER, 1200 * 1e6); // More than available
    }

    function testAvailableBalanceReflectsFrozen() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        MUSDProxy.mint(USER, amount);
        // No frozen tokens yet
        assertEq(MUSDProxy.availableBalance(USER), amount);
        // Freeze some tokens

        MUSDProxy.freeze(USER, 600 * 1e6);
        assertEq(MUSDProxy.availableBalance(USER), 400 * 1e6);
        // Freeze all tokens

        vm.expectRevert();
        MUSDProxy.freeze(USER, amount);

        MUSDProxy.freeze(USER, 400 * 1e6);
        assertEq(MUSDProxy.availableBalance(USER), 0);
        vm.stopPrank();
    }

    function testPartialAndFullUnfreeze() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        MUSDProxy.mint(USER, amount);

        MUSDProxy.freeze(USER, 800 * 1e6);
        assertEq(MUSDProxy.frozenBalance(USER), 800 * 1e6);

        // Unfreeze 300

        MUSDProxy.unfreeze(USER, 300 * 1e6);
        assertEq(MUSDProxy.frozenBalance(USER), 500 * 1e6);

        // Unfreeze remaining 500

        MUSDProxy.unfreeze(USER, 500 * 1e6);
        assertEq(MUSDProxy.frozenBalance(USER), 0);

        // Try to unfreeze more than frozen, expect revert

        vm.expectRevert();
        MUSDProxy.unfreeze(USER, 1);

        vm.stopPrank();
    }
}
