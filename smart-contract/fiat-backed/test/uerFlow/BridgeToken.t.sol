// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {NexUSD} from "../../src/NexUSD.sol";
import {BaseStorage} from "../../src/BaseStorage.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {ERC1967Proxy} from "lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "../Helper.t.sol";

contract BridgeTokenFlowTest is Test, HelperConfig, HelperTest {
    function setUp() public {
        deployV1();
    }

    function testBridgeTransferFlow() public {
        uint256 amount = 1000 * 1e6;
        uint256 fee = 10 * 1e6;
        uint64 targetChainSelector = amoy;
        address destinationRecipient = USER2;

        // Allow the chain for cross-chain transfer
        vm.prank(ADMIN);
        NexUSDv1.addAllowlistedChain(targetChainSelector, address(NexUSDv1));

        // Mint to USER1
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER1, amount);
        assertEq(NexUSDv1.balanceOf(USER1), amount);

        // USER1 initiates bridge send (burns tokens)
        vm.startPrank(USER1);
        vm.recordLogs();
        bytes32 messageId = NexUSDv1.send(
            targetChainSelector,
            destinationRecipient,
            amount
        );
        Vm.Log[] memory logs = vm.getRecordedLogs();
        // First event: Transfer (burn)
        assertEq(
            logs[0].topics[0],
            keccak256("Transfer(address,address,uint256)")
        );
        // Second event: BridgeRequest
        assertEq(
            logs[1].topics[0],
            keccak256("BridgeRequest(bytes32,uint64,address,address,uint256)")
        );
        vm.stopPrank();
        assertEq(NexUSDv1.balanceOf(USER1), 0);

        // OPERATOR executes bridgeMint on destination chain
        vm.prank(BRIDGE_OPERATOR);
        vm.recordLogs();
        NexUSDv1.bridgeMint(
            messageId,
            targetChainSelector,
            destinationRecipient,
            amount,
            fee
        );
        Vm.Log[] memory logs2 = vm.getRecordedLogs();
        // First event: Transfer (mint to recipient)
        assertEq(
            logs2[0].topics[0],
            keccak256("Transfer(address,address,uint256)")
        );
        // Second event: Transfer (mint to owner)
        assertEq(
            logs2[1].topics[0],
            keccak256("Transfer(address,address,uint256)")
        );
        // Third event: BridegeTokenReceived
        assertEq(
            logs2[2].topics[0],
            keccak256("BridegeTokenReceived(bytes32,address,uint64,uint256)")
        );
        assertEq(NexUSDv1.balanceOf(destinationRecipient), amount - fee);
        assertEq(NexUSDv1.balanceOf(OWNER), fee);
    }
}
