// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";
import {TestMaven} from "../../src/TestMaven.sol";
import {BaseStorage} from "../../src/BaseStorage.sol";
import {DeployMaven} from "../../script/DeployMaven.s.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "../Helper.t.sol";

contract MavenControllerTest is HelperConfig, HelperTest {
    function setUp() public {
         deployV1();
    }

    function testAddToBlocklist() public {
        vm.startPrank(OPERATOR);
        MUSDv1.addToBlocklist(USER);
        assertEq(MUSDv1.isBlocklisted(USER), true);
        vm.stopPrank();
    }

    function testRemoveFromBlocklist() public {
        vm.startPrank(OPERATOR);
        MUSDv1.addToBlocklist(USER);
        MUSDv1.removeFromBlocklist(USER);
        assertEq(MUSDv1.isBlocklisted(USER), false);
        vm.stopPrank();
    }

    function testBlocklistPreventsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        MUSDv1.mint(USER, amount);
        MUSDv1.addToBlocklist(USER);
        vm.stopPrank();
        vm.prank(USER);
        vm.expectRevert();
        MUSDv1.transfer(USER, amount);
    }

    function testUnblocklistAllowsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        MUSDv1.mint(USER, amount);
        MUSDv1.addToBlocklist(USER);
        MUSDv1.removeFromBlocklist(USER);
        vm.stopPrank();
        vm.prank(USER);
        MUSDv1.transfer(USER2, amount);
        assertEq(MUSDv1.balanceOf(USER2), amount);
    }

    function testPauseAndUnpause() public {
        vm.prank(OWNER);
        MUSDv1.pause();
        assertTrue(MUSDv1.paused());
        vm.prank(OWNER);
        MUSDv1.unpause();
        assertFalse(MUSDv1.paused());
    }

    function testPauseRevertsIfNotOwner() public {
        vm.prank(USER);
        vm.expectRevert();
        MUSDv1.pause();
    }

    function testChangeOwner() public {
        address newOwner = USER2;
        vm.prank(OWNER);
        MUSDv1.changeOwner(newOwner);
        // Should have new owner role
        assertTrue(MUSDv1.hasRole(MUSDv1.DEFAULT_ADMIN_ROLE(), newOwner));
        assertFalse(MUSDv1.hasRole(MUSDv1.DEFAULT_ADMIN_ROLE(), OWNER));
    }

    function testChangeOwnerRevertsIfZero() public {
        vm.prank(OWNER);
        vm.expectRevert();
        MUSDv1.changeOwner(address(0));
    }

    function testAddAndRemoveAllowlistedChain() public {
        uint64 chainId = 0x1234;
        address tokenAddr = address(0xBEEF);
        vm.prank(ADMIN);
        MUSDv1.addAllowlistedChain(chainId, tokenAddr);
        assertEq(MUSDv1.getAllowlistedChain(chainId), tokenAddr);
        vm.prank(ADMIN);
        MUSDv1.removeAllowlistedChain(chainId);
        assertEq(MUSDv1.getAllowlistedChain(chainId), address(0));
    }

    function testAddAllowlistedChainRevertsIfNotAdmin() public {
        uint64 chainId = 0x1234;
        address tokenAddr = address(0xBEEF);
        vm.prank(USER);
        vm.expectRevert();
        MUSDv1.addAllowlistedChain(chainId, tokenAddr);
    }

    function testRemoveAllowlistedChainRevertsIfNotAdmin() public {
        uint64 chainId = 0x1234;
        vm.prank(USER);
        vm.expectRevert();
        MUSDv1.removeAllowlistedChain(chainId);
    }

    function testAddToBlocklistRevertsIfNotOperator() public {
        vm.prank(USER);
        vm.expectRevert();
        MUSDv1.addToBlocklist(USER2);
    }

    function testRemoveFromBlocklistRevertsIfNotOperator() public {
        vm.prank(USER);
        vm.expectRevert();
        MUSDv1.removeFromBlocklist(USER2);
    }

    function testBlocklistPreventsSending() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.mint(USER, amount);
        vm.prank(OPERATOR);
        MUSDv1.addToBlocklist(USER);
        vm.prank(USER);
        vm.expectRevert();
        MUSDv1.transfer(USER2, amount);
    }

    function testBlocklistPreventsReceiving() public {
        uint256 amount = 5000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.addToBlocklist(USER2);
        vm.prank(OPERATOR);
        MUSDv1.mint(USER, amount);
        vm.startPrank(USER);
        vm.expectRevert();
        MUSDv1.transfer(USER2, amount);
        vm.stopPrank();
    }

    function testBlocklistedSenderReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.mint(USER, amount);
        vm.prank(OPERATOR);
        MUSDv1.addToBlocklist(USER);
        vm.prank(USER);
        vm.expectRevert();
        MUSDv1.transfer(USER2, amount);
    }

    function testChangeOwnerTransfersBalance() public {
        uint256 amount = 1000 * 1e6;
        address newOwner = USER2;
        vm.prank(OPERATOR);
        MUSDv1.mint(OWNER, amount);
        vm.prank(OWNER);
        MUSDv1.changeOwner(newOwner);
        assertEq(MUSDv1.balanceOf(newOwner), amount);
        assertEq(MUSDv1.balanceOf(OWNER), 0);
    }

    function testChangeOwnerNoBalance() public {
        address newOwner = USER2;
        vm.prank(OWNER);
        MUSDv1.changeOwner(newOwner);
        assertEq(MUSDv1.balanceOf(newOwner), 0);
    }

    function testAddToBlocklistAlreadyBlocklisted() public {
        vm.prank(OPERATOR);
        MUSDv1.addToBlocklist(USER2);
        // Should not revert or emit again, but should remain blocklisted
        vm.prank(OPERATOR);
        MUSDv1.addToBlocklist(USER2);
        assertTrue(MUSDv1.isBlocklisted(USER2));
    }

    function testRemoveFromBlocklistAlreadyUnblocked() public {
        // Should not revert or emit again, but should remain unblocked
        vm.prank(OPERATOR);
        MUSDv1.removeFromBlocklist(USER2);
        assertFalse(MUSDv1.isBlocklisted(USER2));
    }

    function testAddAllowlistedChainOverwrite() public {
        uint64 chainId = 0x1234;
        address tokenAddr1 = address(0xBEEF);
        address tokenAddr2 = address(0xCAFE);
        vm.prank(ADMIN);
        MUSDv1.addAllowlistedChain(chainId, tokenAddr1);
        assertEq(MUSDv1.getAllowlistedChain(chainId), tokenAddr1);
        vm.prank(ADMIN);
        MUSDv1.addAllowlistedChain(chainId, tokenAddr2);
        assertEq(MUSDv1.getAllowlistedChain(chainId), tokenAddr2);
    }

    function testRemoveAllowlistedChainAlreadyRemoved() public {
        uint64 chainId = 0x1234;
        vm.prank(ADMIN);
        MUSDv1.removeAllowlistedChain(chainId);
        // Should remain address(0)
        assertEq(MUSDv1.getAllowlistedChain(chainId), address(0));
    }
}
