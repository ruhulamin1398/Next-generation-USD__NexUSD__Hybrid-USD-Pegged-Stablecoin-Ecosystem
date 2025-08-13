// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "../Helper.t.sol";

contract NexUSDTest is HelperConfig, HelperTest {
    function setUp() public {
        deployV1();
    }

    function testDeployment() public view {
        assertEq(NexUSDv1.decimals(), 6);
        assertEq(NexUSDv1.name(), "NexUSD");
        assertEq(NexUSDv1.symbol(), "NexUSD");
    }

    function testMintByOperator() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        assertEq(NexUSDv1.balanceOf(USER), amount);
    }

    function testMintByNonOperatorReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.mint(USER, amount);
    }

    function testMintRevertsWhenExceedingMaxSupply() public {
        vm.startPrank(OPERATOR);
        NexUSDv1.mint(USER, NexUSDv1.MAX_SUPPLY());
        assertEq(NexUSDv1.totalSupply(), NexUSDv1.MAX_SUPPLY());

        vm.expectRevert();
        NexUSDv1.mint(USER, 1);
        vm.stopPrank();
    }

    function testBlocklistPreventsMint() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        vm.expectRevert();
        NexUSDv1.mint(USER, amount);
        vm.stopPrank();
    }

    function testBlocklistAllowsBurn() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        NexUSDv1.mint(USER, amount);

        NexUSDv1.addToBlocklist(USER);
        vm.expectRevert();
        NexUSDv1.burn(USER, amount);

        vm.stopPrank();
    }

    function testBurnByOperator() public {
        uint256 amount = 1000 * 1e6;
        vm.startPrank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        NexUSDv1.burn(USER, amount);
        vm.stopPrank();
        assertEq(NexUSDv1.balanceOf(USER), 0);
    }

    function testBurnByNonOperatorReverts() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.expectRevert();
        vm.prank(USER);
        NexUSDv1.burn(USER, amount);
    }

    function testPausePreventsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(OWNER);
        NexUSDv1.pause();
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.transfer(USER, amount);
    }

    function testUnpauseAllowsTransfer() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.startPrank(OWNER);
        NexUSDv1.pause();
        NexUSDv1.unpause();
        vm.stopPrank();
        vm.prank(USER);
        NexUSDv1.transfer(USER, amount);
        assertEq(NexUSDv1.balanceOf(USER), amount);
    }

    function testMintRevertsIfToZeroAddress() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        vm.expectRevert();
        NexUSDv1.mint(address(0), amount);
    }

    function testMintRevertsIfExceedsMaxSupply() public {
        uint256 maxSupply = NexUSDv1.MAX_SUPPLY();
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, maxSupply);
        vm.prank(OPERATOR);
        vm.expectRevert();
        NexUSDv1.mint(USER, 1);
    }

    function testBurnRevertsIfNotOperator() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.burn(USER, amount);
    }

    function testSendRevertsIfRecipientZero() public {
        uint256 amount = 1000 * 1e6;
        allowNewChainV1(amoy);
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.send(amoy, address(0), amount);
    }

    function testSendRevertsIfChainNotAllowlisted() public {
        uint256 amount = 1000 * 1e6;
        uint64 notAllowlisted = 0x9999;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.send(notAllowlisted, USER2, amount);
    }

    function testSendRevertsIfNotEnoughBalance() public {
        uint256 amount = 1000 * 1e6;
        allowNewChainV1(amoy);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.send(amoy, USER2, amount);
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

    function testSendEmitsBridgeRequest() public {
        uint256 amount = 1000 * 1e6;

        allowNewChainV1(amoy);

        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);

        vm.recordLogs();

        vm.prank(USER);
        NexUSDv1.send(amoy, USER2, amount);

        // Retrieve recorded logs
        Vm.Log[] memory logs = vm.getRecordedLogs();

        // Assert the first log is a Transfer (burn)
        assertEq(
            logs[0].topics[0],
            keccak256("Transfer(address,address,uint256)")
        );
        // Assert the second log is BridgeRequest
        assertEq(
            logs[1].topics[0],
            keccak256("BridgeRequest(bytes32,uint64,address,address,uint256)")
        );
    }

    function testbridgeMintEmitsBridegeTokenReceived() public {
        uint256 amount = 1000 * 1e6;
        uint256 fee = 100 * 1e6;
        uint64 sourceChainSelector = 0x1234;
        bytes32 messageId = keccak256("id");
        address recipient = USER;
        address owner = OWNER;
        vm.prank(BRIDGE_OPERATOR);
        vm.recordLogs();
        NexUSDv1.bridgeMint(
            messageId,
            sourceChainSelector,
            recipient,
            amount,
            fee
        );
        Vm.Log[] memory logs = vm.getRecordedLogs();
        // Assert the first log is Transfer (mint to recipient)
        assertEq(
            logs[0].topics[0],
            keccak256("Transfer(address,address,uint256)")
        );
        // Assert the second log is Transfer (mint to owner)
        assertEq(
            logs[1].topics[0],
            keccak256("Transfer(address,address,uint256)")
        );
        // Assert the third log is BridegeTokenReceived
        assertEq(
            logs[2].topics[0],
            keccak256("BridegeTokenReceived(bytes32,address,uint64,uint256)")
        );
        assertEq(NexUSDv1.balanceOf(recipient), amount - fee);
        assertEq(NexUSDv1.balanceOf(owner), fee);
    }

    function testSendRevertsWhenPaused() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(OWNER);
        NexUSDv1.pause();
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.send(amoy, USER2, amount);
    }

    function testbridgeMintRevertsWhenPaused() public {
        uint256 amount = 1000 * 1e6;
        uint256 fee = 100 * 1e6;
        uint64 sourceChainSelector = amoy;
        bytes32 messageId = keccak256("id");
        address recipient = USER;
        vm.prank(OWNER);
        NexUSDv1.pause();
        vm.prank(BRIDGE_OPERATOR);
        vm.expectRevert();
        NexUSDv1.bridgeMint(
            messageId,
            sourceChainSelector,
            recipient,
            amount,
            fee
        );
    }

    function testbridgeMintRevertsIfSenderIsBlocklisted() public {
        uint256 amount = 1000 * 1e6;

        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(USER);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.send(amoy, USER2, amount);
    }

    function testbridgeMintRevertsIfRecipientIsBlocklisted() public {
        uint256 amount = 1000 * 1e6;
        uint256 fee = 100 * 1e6;
        uint64 scSelector = amoy;
        bytes32 messageId = keccak256("blocklist");
        address recipient = USER;
        vm.prank(OPERATOR);
        NexUSDv1.addToBlocklist(recipient);
        vm.prank(BRIDGE_OPERATOR);
        vm.expectRevert();
        NexUSDv1.bridgeMint(messageId, scSelector, recipient, amount, fee);
    }

    function testbridgeMintRevertsIfRecipientIsZero() public {
        uint256 amount = 1000 * 1e6;
        uint256 fee = 100 * 1e6;
        uint64 scSelector = amoy;
        bytes32 messageId = keccak256("zero");
        address recipient = address(0);
        vm.prank(BRIDGE_OPERATOR);
        vm.expectRevert();
        NexUSDv1.bridgeMint(messageId, scSelector, recipient, amount, fee);
    }

    function testbridgeMintRevertsIfMaxSupplyExceeded() public {
        uint256 maxSupply = NexUSDv1.MAX_SUPPLY();
        uint256 fee = 100 * 1e6;
        uint64 scSelector = amoy;
        bytes32 messageId = keccak256("max-supply");
        address recipient = USER;
        // Mint up to max supply
        vm.prank(OPERATOR);
        NexUSDv1.mint(recipient, maxSupply);
        // Try to bridge mint any positive amount
        uint256 amount = 1 * 1e6;
        vm.prank(BRIDGE_OPERATOR);
        vm.expectRevert();
        NexUSDv1.bridgeMint(messageId, scSelector, recipient, amount, fee);
    }

    function testbridgeMintRevertsIfNotOperator() public {
        uint256 amount = 1000 * 1e6;
        uint256 fee = 100 * 1e6;
        uint64 scSelector = amoy;
        bytes32 messageId = keccak256("not-operator");
        address recipient = USER;
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.bridgeMint(messageId, scSelector, recipient, amount, fee);
    }

    function testOnlyMinimumCrossChainAmount_AllowsMinimum() public {
        uint256 amount = NexUSDv1.minimumCrossChainTransferAmount();
        allowNewChainV1(amoy);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.send(amoy, USER2, amount);
    }
}
