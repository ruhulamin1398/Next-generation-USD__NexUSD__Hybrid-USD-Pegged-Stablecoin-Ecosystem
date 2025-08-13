// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";
import {NexUSD} from "../../src/NexUSD.sol";
import {BaseStorage} from "../../src/BaseStorage.sol";
import {DeployNexUSD} from "../../script/DeployNexUSD.s.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "../Helper.t.sol";

contract NexUSDControllerTest is HelperConfig, HelperTest {
    function setUp() public {
         deployV1();
    }

    function testAddToBlocklist() public {
        vm.startPrank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        assertEq(NexUSDv1.isBlocklisted(USER), true);
        vm.stopPrank();
    }

    function testRemoveFromBlocklist() public {
        vm.startPrank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        NexUSDv1.removeFromBlocklist(USER);
        assertEq(NexUSDv1.isBlocklisted(USER), false);
        vm.stopPrank();
    }

    function testBlocklistPreventsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        NexUSDv1.addToBlocklist(USER);
        vm.stopPrank();
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.transfer(USER, amount);
    }

    function testUnblocklistAllowsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        NexUSDv1.addToBlocklist(USER);
        NexUSDv1.removeFromBlocklist(USER);
        vm.stopPrank();
        vm.prank(USER);
        NexUSDv1.transfer(USER2, amount);
        assertEq(NexUSDv1.balanceOf(USER2), amount);
    }

    function testPauseAndUnpause() public {
        vm.prank(OWNER);
        NexUSDv1.pause();
        assertTrue(NexUSDv1.paused());
        vm.prank(OWNER);
        NexUSDv1.unpause();
        assertFalse(NexUSDv1.paused());
    }

    function testPauseRevertsIfNotOwner() public {
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.pause();
    }

    function testChangeOwner() public {
        address newOwner = USER2;
        vm.prank(OWNER);
        NexUSDv1.changeOwner(newOwner);
        // Should have new owner role
        assertTrue(NexUSDv1.hasRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), newOwner));
        assertFalse(NexUSDv1.hasRole(NexUSDv1.DEFAULT_ADMIN_ROLE(), OWNER));
    }

    function testChangeOwnerRevertsIfZero() public {
        vm.prank(OWNER);
        vm.expectRevert();
        NexUSDv1.changeOwner(address(0));
    }

    function testAddAndRemoveAllowlistedChain() public {
        uint64 chainId = 0x1234;
        address tokenAddr = address(0xBEEF);
        vm.prank(ADMIN);
        NexUSDv1.addAllowlistedChain(chainId, tokenAddr);
        assertEq(NexUSDv1.getAllowlistedChain(chainId), tokenAddr);
        vm.prank(ADMIN);
        NexUSDv1.removeAllowlistedChain(chainId);
        assertEq(NexUSDv1.getAllowlistedChain(chainId), address(0));
    }

    function testAddAllowlistedChainRevertsIfNotAdmin() public {
        uint64 chainId = 0x1234;
        address tokenAddr = address(0xBEEF);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.addAllowlistedChain(chainId, tokenAddr);
    }

    function testRemoveAllowlistedChainRevertsIfNotAdmin() public {
        uint64 chainId = 0x1234;
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.removeAllowlistedChain(chainId);
    }

    function testAddToBlocklistRevertsIfNotOperator() public {
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.addToBlocklist(USER2);
    }

    function testRemoveFromBlocklistRevertsIfNotOperator() public {
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.removeFromBlocklist(USER2);
    }

    function testBlocklistPreventsSending() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.transfer(USER2, amount);
    }

    function testBlocklistPreventsReceiving() public {
        uint256 amount = 5000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER2);
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.startPrank(USER);
        vm.expectRevert();
        NexUSDv1.transfer(USER2, amount);
        vm.stopPrank();
    }

    function testBlocklistedSenderReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.transfer(USER2, amount);
    }

    function testChangeOwnerTransfersBalance() public {
        uint256 amount = 1000 * 1e6;
        address newOwner = USER2;
        vm.prank(OPERATOR);
        NexUSDv1.mint(OWNER, amount);
        vm.prank(OWNER);
        NexUSDv1.changeOwner(newOwner);
        assertEq(NexUSDv1.balanceOf(newOwner), amount);
        assertEq(NexUSDv1.balanceOf(OWNER), 0);
    }

    function testChangeOwnerNoBalance() public {
        address newOwner = USER2;
        vm.prank(OWNER);
        NexUSDv1.changeOwner(newOwner);
        assertEq(NexUSDv1.balanceOf(newOwner), 0);
    }

    function testAddToBlocklistAlreadyBlocklisted() public {
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER2);
        // Should not revert or emit again, but should remain blocklisted
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER2);
        assertTrue(NexUSDv1.isBlocklisted(USER2));
    }

    function testRemoveFromBlocklistAlreadyUnblocked() public {
        // Should not revert or emit again, but should remain unblocked
        vm.prank(OPERATOR);
        NexUSDv1.removeFromBlocklist(USER2);
        assertFalse(NexUSDv1.isBlocklisted(USER2));
    }

    function testAddAllowlistedChainOverwrite() public {
        uint64 chainId = 0x1234;
        address tokenAddr1 = address(0xBEEF);
        address tokenAddr2 = address(0xCAFE);
        vm.prank(ADMIN);
        NexUSDv1.addAllowlistedChain(chainId, tokenAddr1);
        assertEq(NexUSDv1.getAllowlistedChain(chainId), tokenAddr1);
        vm.prank(ADMIN);
        NexUSDv1.addAllowlistedChain(chainId, tokenAddr2);
        assertEq(NexUSDv1.getAllowlistedChain(chainId), tokenAddr2);
    }

    function testRemoveAllowlistedChainAlreadyRemoved() public {
        uint64 chainId = 0x1234;
        vm.prank(ADMIN);
        NexUSDv1.removeAllowlistedChain(chainId);
        // Should remain address(0)
        assertEq(NexUSDv1.getAllowlistedChain(chainId), address(0));
    }
}
