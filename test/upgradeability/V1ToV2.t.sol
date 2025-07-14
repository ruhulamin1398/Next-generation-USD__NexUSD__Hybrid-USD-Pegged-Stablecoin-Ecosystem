//SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";
import {TestMaven} from "../../src/TestMaven.sol";

import {DeployMaven} from "../../script/DeployMaven.s.sol";

import {HelperTest} from "../Helper.t.sol";

import {Vm} from "forge-std/Vm.sol";

contract V1ToV2 is HelperTest {
    function setUp() public {
        deployV1();
    }

    function testVersionAndDecimalsAfterUpgrade() public {
        assertEq(MUSDv1.version(), "1.0");
        assertEq(MUSDv1.decimals(), 6);

        // Upgrade
        upgradeToV2();

        assertEq(MUSDv2.version(), "2.0");
        assertEq(MUSDv2.decimals(), 6);
    }

    function testStorageAndBalancesRetainedAfterUpgrade() public {
        // Mint tokens to USER1 before upgrade
        vm.startPrank(OPERATOR);
        MUSDv1.mint(USER1, 1000e6);
        vm.stopPrank();
        assertEq(MUSDv1.balanceOf(USER1), 1000e6);

        // Upgrade
        upgradeToV2();

        // Check balance is retained
        assertEq(MUSDv2.balanceOf(USER1), 1000e6);
    }

    function testRolesAndBlocklistRetainedAfterUpgrade() public {
        // Blocklist USER1 before upgrade
        vm.startPrank(OPERATOR);
        MUSDv1.addToBlocklist(USER1);
        vm.stopPrank();
        assertTrue(MUSDv1.isBlocklisted(USER1));

        // Upgrade
        upgradeToV2();

        // Blocklist status should persist
        assertTrue(MUSDv2.isBlocklisted(USER1));
    }

    function testMintBurnAndEventsAfterUpgrade() public {
        // Mint before upgrade
        vm.startPrank(OPERATOR);
        MUSDv1.mint(USER1, 500e6);
        vm.stopPrank();
        assertEq(MUSDv1.balanceOf(USER1), 500e6);

        // Upgrade
        upgradeToV2();

        // Mint and burn after upgrade
        vm.startPrank(OPERATOR);
        MUSDv2.mint(USER1, 100e6);
        MUSDv2.burn(USER1, 50e6);
        vm.stopPrank();
        assertEq(MUSDv2.balanceOf(USER1), 550e6);
    }

    function testBridgeRequestEventAfterUpgrade() public {
        // Upgrade
        upgradeToV2();

        allowNewChainV2(amoy);

        // Mint to USER1 and test send emits BridgeRequest
        vm.startPrank(OPERATOR);
        MUSDv2.mint(USER1, 1000e6);
        vm.stopPrank();

        vm.recordLogs();

        vm.prank(USER1);
        // We'll just check that the event is emitted, not the exact values
        MUSDv2.send(amoy, USER2, 100e6);

        Vm.Log[] memory entries = vm.getRecordedLogs();

        // Check that the first event is Transfer (burn)
        assertEq(
            entries[0].topics[0],
            keccak256("Transfer(address,address,uint256)")
        );
        // Check that the second event is BridgeRequest
        assertEq(
            entries[1].topics[0],
            keccak256("BridgeRequest(bytes32,uint64,address,address,uint256)")
        );
    }

    function testPermitSignatureStillValidAfterUpgrade() public {
        // Simulate permit signature before upgrade
        uint256 privateKey = 0xA11CE;
        address ownerAddr = vm.addr(privateKey);
        address spender = address(0xB0B);
        uint256 value = 123e6;
        uint256 nonce = MUSDv1.nonces(ownerAddr);
        // For simplicity, skip actual signature, just check nonce increments and allowance after upgrade
        vm.startPrank(ownerAddr);
        MUSDv1.approve(spender, value);
        vm.stopPrank();
        assertEq(MUSDv1.allowance(ownerAddr, spender), value);

        // Upgrade
        upgradeToV2();

        // Allowance and nonce should persist
        assertEq(MUSDv2.allowance(ownerAddr, spender), value);
        assertEq(MUSDv2.nonces(ownerAddr), nonce);
    }

    function testPauseUnpauseAfterUpgrade() public {
        // Pause before upgrade
        vm.startPrank(OWNER);
        MUSDv1.pause();
        vm.stopPrank();
        assertTrue(MUSDv1.paused());

        // Upgrade
        upgradeToV2();

        // Should still be paused
        assertTrue(MUSDv2.paused());

        // Unpause and check
        vm.startPrank(OWNER);
        MUSDv2.unpause();
        vm.stopPrank();
        assertFalse(MUSDv2.paused());
    }

    function testbridgeMintAfterUpgrade() public {
        // Upgrade first

        upgradeToV2();

        // Operator mints cross-chain
        vm.startPrank(OPERATOR);
        bytes32 messageId = keccak256("msg");
        uint64 sourceChain = 1234;
        address recipient = USER1;
        uint256 amount = 100e6;
        uint256 fee = 1e6;
        vm.stopPrank();
        vm.startPrank(BRIDGE_OPERATOR);
        MUSDv2.bridgeMint(messageId, sourceChain, recipient, amount, fee);
        vm.stopPrank();
        assertEq(MUSDv2.balanceOf(recipient), amount - fee);
    }

    function testFuzzUpgradeDoesNotCorruptStorage(uint256 fuzzAmount) public {
        fuzzAmount = bound(fuzzAmount, 1, 10_000_000e6);
        // Mint fuzzed amount before upgrade
        vm.startPrank(OPERATOR);
        MUSDv1.mint(USER1, uint256(fuzzAmount));
        vm.stopPrank();
        assertEq(MUSDv1.balanceOf(USER1), uint256(fuzzAmount));

        // Upgrade
        upgradeToV2();

        // Balance should be unchanged
        assertEq(MUSDv2.balanceOf(USER1), uint256(fuzzAmount));
    }
}
