// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "../Helper.t.sol";

contract EdgeCasesTest is HelperConfig, HelperTest {
    function setUp() public {
        deployV1();
    }

    function testMintZeroAmount() public {
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, 0);
        assertEq(NexUSDv1.balanceOf(USER), 0);
    }

    function testTransferZeroAmountToSelf() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(USER);
        NexUSDv1.transfer(USER, 0);
        assertEq(NexUSDv1.balanceOf(USER), amount);
    }

    function testDoubleBlocklistNoRevert() public {
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        assertTrue(NexUSDv1.isBlocklisted(USER));
    }

    function testDoubleUnblocklistNoRevert() public {
        vm.prank(OPERATOR);
        NexUSDv1.removeFromBlocklist(USER);
        vm.prank(OPERATOR);
        NexUSDv1.removeFromBlocklist(USER);
        assertFalse(NexUSDv1.isBlocklisted(USER));
    }

    function testPauseTwiceNoRevert() public {
        vm.prank(OWNER);
        NexUSDv1.pause();
        vm.expectRevert();
        vm.prank(OWNER);
        NexUSDv1.pause();
        assertTrue(NexUSDv1.paused());
    }

    function testUnpauseTwiceNoRevert() public {
        vm.prank(OWNER);
        NexUSDv1.pause();
        vm.prank(OWNER);
        NexUSDv1.unpause();
        vm.expectRevert();
        vm.prank(OWNER);
        NexUSDv1.unpause();
        assertFalse(NexUSDv1.paused());
    }

    function testMintMaxSupplyTwiceReverts() public {
        uint256 maxSupply = NexUSDv1.MAX_SUPPLY();
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, maxSupply);
        assertEq(NexUSDv1.totalSupply(), maxSupply);
        vm.prank(OPERATOR);
        vm.expectRevert();
        NexUSDv1.mint(USER, 1);
    }

    function testTransferToZeroAddressReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.transfer(address(0), amount);
    }

    function testMintToBlocklistedThenUnblocklistAndMint() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        vm.prank(OPERATOR);
        vm.expectRevert();
        NexUSDv1.mint(USER, amount);
        vm.prank(OPERATOR);
        NexUSDv1.removeFromBlocklist(USER);
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        assertEq(NexUSDv1.balanceOf(USER), amount);
    }

    function testBlocklistedSenderCannotTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.transfer(USER2, amount);
    }

    function testPausePreventsMint() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OWNER);
        NexUSDv1.pause();
        vm.prank(OPERATOR);
        vm.expectRevert();
        NexUSDv1.mint(USER, amount);
    }

    function testAddAllowlistedChainTwice() public {
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

    function testRemoveAllowlistedChainTwice() public {
        uint64 chainId = 0x1234;
        vm.prank(ADMIN);
        NexUSDv1.removeAllowlistedChain(chainId);
        vm.prank(ADMIN);
        NexUSDv1.removeAllowlistedChain(chainId);
        assertEq(NexUSDv1.getAllowlistedChain(chainId), address(0));
    }

    function testChangeOwnerToZeroAddressReverts() public {
        vm.prank(OWNER);
        vm.expectRevert();
        NexUSDv1.changeOwner(address(0));
    }
}
