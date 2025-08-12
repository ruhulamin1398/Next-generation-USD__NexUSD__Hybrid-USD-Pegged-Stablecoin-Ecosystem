// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {TestMaven} from "../../src/TestMaven.sol";
import {BaseStorage} from "../../src/BaseStorage.sol";
import {MavenController} from "../../src/MavenController.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {ERC1967Proxy} from "lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "../Helper.t.sol";

contract TokenMintAndTransferTest is Test, HelperConfig, HelperTest {
    function setUp() public {
        deployV1();
    }

    function testMintByOperator() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, amount);
        assertEq(MUSDv1.balanceOf(USER1), amount);
    }

    function testMintByNonOperatorReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(USER1);
        vm.expectRevert();
        MUSDv1.mint(USER1, amount);
    }

    function testMintToZeroAddressReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        vm.expectRevert();
        MUSDv1.mint(address(0), amount);
    }

    function testMintExceedingMaxSupplyReverts() public {
        uint256 amount = MUSDv1.MAX_SUPPLY();
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, amount);
        assertEq(MUSDv1.totalSupply(), amount);
        vm.prank(OPERATOR);
        vm.expectRevert();
        MUSDv1.mint(USER1, 1);
    }

    function testTransferByUser() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, amount);
        vm.prank(USER1);
        MUSDv1.transfer(USER2, amount);
        assertEq(MUSDv1.balanceOf(USER1), 0);
        assertEq(MUSDv1.balanceOf(USER2), amount);
    }

    function testTransferZeroAmount() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, amount);
        vm.prank(USER1);
        MUSDv1.transfer(USER2, 0);
        assertEq(MUSDv1.balanceOf(USER1), amount);
        assertEq(MUSDv1.balanceOf(USER2), 0);
    }

    function testTransferByNonHolderReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(USER2);
        vm.expectRevert();
        MUSDv1.transfer(USER1, amount);
    }

    function testTransferToZeroAddressReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, amount);
        vm.prank(USER1);
        vm.expectRevert();
        MUSDv1.transfer(address(0), amount);
    }

    function testTransferWhenPausedReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, amount);
        vm.prank(OWNER);
        MUSDv1.pause();
        vm.prank(USER1);
        vm.expectRevert();
        MUSDv1.transfer(USER2, amount);
    }

    function testMintToBlocklistedReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.addToBlocklist(USER1);
        vm.prank(OPERATOR);
        vm.expectRevert();
        MUSDv1.mint(USER1, amount);
    }

    function testTransferFromBlocklistedReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, amount);
        vm.prank(OPERATOR);
        MUSDv1.addToBlocklist(USER1);
        vm.prank(USER1);
        vm.expectRevert();
        MUSDv1.transfer(USER2, amount);
    }

    function testTransferToBlocklistedReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, amount);
        vm.prank(OPERATOR);
        MUSDv1.addToBlocklist(USER2);
        vm.prank(USER1);
        vm.expectRevert();
        MUSDv1.transfer(USER2, amount);
    }

    function testMintToUnblocklistedThenTransfer() public {
        uint256 amount = 1000 * 1e6;
        // Mint to USER1
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, amount);
        assertEq(MUSDv1.balanceOf(USER1), amount);
        // Transfer to USER2
        vm.prank(USER1);
        MUSDv1.transfer(USER2, amount);
        assertEq(MUSDv1.balanceOf(USER1), 0);
        assertEq(MUSDv1.balanceOf(USER2), amount);
    }

    function testFullMintToTransferFlow() public {
        uint256 mintAmount = 2000 * 1e6;
        uint256 transferAmount = 1500 * 1e6;
        // Mint to USER1
        vm.prank(OPERATOR);
        MUSDv1.mint(USER1, mintAmount);
        assertEq(MUSDv1.balanceOf(USER1), mintAmount);
        // USER1 transfers to USER2
        vm.prank(USER1);
        MUSDv1.transfer(USER2, transferAmount);
        assertEq(MUSDv1.balanceOf(USER1), mintAmount - transferAmount);
        assertEq(MUSDv1.balanceOf(USER2), transferAmount);
        // USER2 transfers back to USER1
        vm.prank(USER2);
        MUSDv1.transfer(USER1, transferAmount);
        assertEq(MUSDv1.balanceOf(USER1), mintAmount);
        assertEq(MUSDv1.balanceOf(USER2), 0);
    }
}
