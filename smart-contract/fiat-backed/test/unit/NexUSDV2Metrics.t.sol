// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {HelperTest} from "../Helper.t.sol";

contract NexUSDV2MetricsTest is HelperTest {
    function setUp() public {
        deployV1();
        upgradeToV2();
    }

    function testSetTotalHoldersUpdatesMetrics() public {
        uint256 expectedHolders = 42;

        vm.prank(OWNER);
        NexUSDv2.setTotalHolders(expectedHolders);

        (uint256 currentSupply, uint256 holderCount, uint256 transferCount) = NexUSDv2.getTokenMetrics();

        assertEq(currentSupply, 0);
        assertEq(holderCount, expectedHolders);
        assertEq(transferCount, 0);
    }

    function testSetTotalNumberOfTransfersUpdatesMetrics() public {
        uint256 expectedTransfers = 1234;

        vm.prank(OWNER);
        NexUSDv2.setTotalNumberOfTransfers(expectedTransfers);

        (uint256 currentSupply, uint256 holderCount, uint256 transferCount) = NexUSDv2.getTokenMetrics();

        assertEq(currentSupply, 0);
        assertEq(holderCount, 0);
        assertEq(transferCount, expectedTransfers);
    }

    function testSetTotalHoldersRevertsWhenCallerIsNotAdmin() public {
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv2.setTotalHolders(1);
    }

    function testSetTotalNumberOfTransfersRevertsWhenCallerIsNotAdmin() public {
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv2.setTotalNumberOfTransfers(1);
    }

    function testTransferToNewHolderIncrementsHolderAndTransferCounts() public {
        uint256 amount = 1000 * 1e6;

        vm.prank(OPERATOR);
        NexUSDv2.mint(OWNER, amount);

        (uint256 initialSupply, uint256 initialHolderCount, uint256 initialTransferCount) = NexUSDv2.getTokenMetrics();

        vm.prank(OWNER);
        NexUSDv2.transfer(USER, amount / 2);

        (uint256 currentSupply, uint256 holderCount, uint256 transferCount) = NexUSDv2.getTokenMetrics();

        assertEq(currentSupply, initialSupply);
        assertEq(holderCount, initialHolderCount + 1);
        assertEq(transferCount, initialTransferCount + 1);
    }

    function testTransferEmptyingSenderKeepsHolderCountAndIncrementsTransferCount() public {
        uint256 amount = 1000 * 1e6;

        vm.prank(OPERATOR);
        NexUSDv2.mint(OWNER, amount);

        (uint256 initialSupply, uint256 initialHolderCount, uint256 initialTransferCount) = NexUSDv2.getTokenMetrics();

        vm.prank(OWNER);
        NexUSDv2.transfer(USER, amount);

        (uint256 currentSupply, uint256 holderCount, uint256 transferCount) = NexUSDv2.getTokenMetrics();

        assertEq(currentSupply, initialSupply);
        assertEq(holderCount, initialHolderCount);
        assertEq(transferCount, initialTransferCount + 1);
    }

    function testTransferToExistingHolderOnlyIncrementsTransferCount() public {
        uint256 amount = 1000 * 1e6;

        vm.prank(OPERATOR);
        NexUSDv2.mint(OWNER, amount);

        vm.prank(OPERATOR);
        NexUSDv2.mint(USER, amount);

        (uint256 initialSupply, uint256 initialHolderCount, uint256 initialTransferCount) = NexUSDv2.getTokenMetrics();

        vm.prank(OWNER);
        NexUSDv2.transfer(USER, amount / 2);

        (uint256 currentSupply, uint256 holderCount, uint256 transferCount) = NexUSDv2.getTokenMetrics();

        assertEq(currentSupply, initialSupply);
        assertEq(holderCount, initialHolderCount);
        assertEq(transferCount, initialTransferCount + 1);
    }

    function testMintToNewHolderIncrementsHolderAndTransferCounts() public {
        uint256 amount = 500 * 1e6;

        (uint256 initialSupply, uint256 initialHolderCount, uint256 initialTransferCount) = NexUSDv2.getTokenMetrics();

        vm.prank(OPERATOR);
        NexUSDv2.mint(USER, amount);

        (uint256 currentSupply, uint256 holderCount, uint256 transferCount) = NexUSDv2.getTokenMetrics();

        assertEq(currentSupply, initialSupply + amount);
        assertEq(holderCount, initialHolderCount + 1);
        assertEq(transferCount, initialTransferCount + 1);
    }

    function testBurnEmptyingSenderDecrementsHolderCountAndIncrementsTransferCount() public {
        uint256 amount = 1000 * 1e6;

        vm.prank(OPERATOR);
        NexUSDv2.mint(USER, amount);

        (uint256 initialSupply, uint256 initialHolderCount, uint256 initialTransferCount) = NexUSDv2.getTokenMetrics();

        vm.prank(OPERATOR);
        NexUSDv2.burn(USER, amount);

        (uint256 currentSupply, uint256 holderCount, uint256 transferCount) = NexUSDv2.getTokenMetrics();

        assertEq(currentSupply, initialSupply - amount);
        assertEq(holderCount, initialHolderCount - 1);
        assertEq(transferCount, initialTransferCount + 1);
    }
}
