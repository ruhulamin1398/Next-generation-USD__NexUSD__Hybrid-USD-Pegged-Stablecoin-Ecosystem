// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {TestMaven} from "../../src/TestMaven.sol";
import {BaseStorage} from "../../src/BaseStorage.sol";
import {MavenController} from "../../src/MavenController.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {ERC1967Proxy} from "lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract MavenUserFlowsTest is Test {
    TestMaven public MUSDProxy;
    MavenController public controller; // To interact with controller functions

    address public deployer;
    address public user1;
    address public user2;

    function setUp() public virtual {
        deployer = makeAddr("deployer");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        vm.startPrank(deployer);

        // Deploy the TestMaven implementation contract
        TestMaven implementation = new TestMaven();

        // Prepare the initialization call data
        bytes memory initializeData = abi.encodeWithSelector(
            implementation.initialize.selector,
            deployer, // defaultAdmin
            deployer // operator
        );

        // Deploy the ERC1967Proxy pointing to the implementation and initializing it
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            initializeData
        );

        // Cast the proxy address to TestMaven and MavenController for interaction
        MUSDProxy = TestMaven(address(proxy));
        controller = MavenController(address(proxy));
        vm.stopPrank();

        // console.log("Maven Address:", address(MUSDProxy));
        // console.log("Controller Address:", address(controller));
        // console.log("Deployer:", deployer);
        // console.log("User1:", user1);
        // console.log("User2:", user2);
        // console.log("OPERATOR_ROLE:", controller.OPERATOR_ROLE());
        // console.log("Deployer has OPERATOR_ROLE:", controller.hasRole(controller.OPERATOR_ROLE(), deployer));
    }

    // function testUserBridgeMintFlow() public {
    //     uint256 amount = 500 * 1e6;
    //     string memory targetChain = "Polygon";
    //     string memory sourceChain = "Ethereum";

    //     // 1. User initiates a bridge request to transfer tokens to another chain
    //     vm.prank(user1);
    //     emit TestMaven.BridgeRequest(
    //         user1,
    //         user2,
    //         amount,
    //         targetChain,
    //         BaseStorage.BridgeAction.Burn
    //     );
    //     MUSDProxy.send(user2, amount, targetChain);

    //     // 2. Operator executes the bridge mint on the destination chain
    //     vm.prank(deployer);
    //     emit TestMaven.BridgeExecuted(
    //         user2,
    //         amount,
    //         sourceChain,
    //         BaseStorage.BridgeAction.Mint
    //     );
    //     MUSDProxy.bridgeMint(user2, amount, sourceChain);
    //     assertEq(MUSDProxy.balanceOf(user2), amount);
    // }

    // function testUserBridgeBurnFlow() public {
    //     uint256 amount = 500 * 1e6;
    //     string memory targetChain = "Polygon";
    //     string memory sourceChain = "Ethereum";

    //     // 1. Operator mints tokens to USER on the source chain
    //     vm.prank(deployer);
    //     MUSDProxy.mint(user1, amount);
    //     assertEq(MUSDProxy.balanceOf(user1), amount);

    //     // 2. User initiates a bridge request to transfer tokens to another chain
    //     vm.prank(user1);
    //     emit TestMaven.BridgeRequest(
    //         user1,
    //         user2,
    //         amount,
    //         targetChain,
    //         BaseStorage.BridgeAction.Burn
    //     );
    //     MUSDProxy.send(user2, amount, targetChain);

    //     // 3. Operator executes the bridge burn on the source chain
    //     vm.prank(deployer);
    //     emit TestMaven.BridgeExecuted(
    //         user1,
    //         amount,
    //         sourceChain,
    //         BaseStorage.BridgeAction.Burn
    //     );
    //     MUSDProxy.bridgeBurn(user1, amount, sourceChain);
    //     assertEq(MUSDProxy.balanceOf(user1), 0);
    // }

    // function testBlocklistedBridgeOperation() public {
    //     uint256 amount = 500 * 1e6;
    //     string memory targetChain = "Polygon";

    //     // 1. Operator mints tokens to USER
    //     vm.prank(deployer);
    //     MUSDProxy.mint(user1, amount);

    //     // 2. USER initiates a bridge request
    //     vm.prank(user1);
    //     MUSDProxy.send(user2, amount, targetChain);

    //     // 3. Operator blocklists USER
    //     vm.prank(deployer);
    //     MUSDProxy.addToBlocklist(user1);

    //     // 4. Operator attempts to burn USER's tokens for the bridge (should fail)
    //     vm.prank(deployer);
    //     vm.expectRevert(
    //         abi.encodeWithSelector(
    //             MavenController.BlocklistedSender.selector,
    //             user1
    //         )
    //     );
    //     MUSDProxy.bridgeBurn(user1, amount, "Ethereum");

    //     // 5. Operator unblocklists USER
    //     vm.prank(deployer);
    //     MUSDProxy.removeFromBlocklist(user1);

    //     // 6. Operator successfully burns USER's tokens for the bridge
    //     vm.prank(deployer);
    //     MUSDProxy.bridgeBurn(user1, amount, "Ethereum");
    //     assertEq(MUSDProxy.balanceOf(user1), 0);
    // }

    function testContractPauseAndResume() public {
        uint256 amount = 1000 * 1e6;

        // 1. Operator mints tokens to USER
        vm.prank(deployer);
        MUSDProxy.mint(user1, amount);

        // 2. Owner pauses the contract
        vm.prank(deployer);
        MUSDProxy.pause();
        assertEq(MUSDProxy.paused(), true);

        // 3. All actions should be blocked
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector)
        );
        MUSDProxy.transfer(user2, amount);

        vm.prank(deployer);
        vm.expectRevert(
            abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector)
        );
        MUSDProxy.mint(user1, amount);

        vm.prank(deployer);
        vm.expectRevert(
            abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector)
        );
        MUSDProxy.burn(user1, amount);

        vm.prank(user1);
        // vm.expectRevert(
        //     abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector)
        // );
        // MUSDProxy.send(user2, amount, "Polygon");

        // // 4. Owner unpauses the contract
        // vm.prank(deployer);
        // MUSDProxy.unpause();
        // assertEq(MUSDProxy.paused(), false);

        // // 5. USER can now transfer tokens
        // vm.prank(user1);
        // MUSDProxy.transfer(user2, amount);
        // assertEq(MUSDProxy.balanceOf(user2), amount);
    }

    function testApproveAndTransferFrom() public {
        uint256 mintAmount = 1000 * 1e6;
        uint256 approvedAmount = 500 * 1e6;
        uint256 transferAmount = 300 * 1e6;

        // 1. Operator mints tokens to user1
        vm.startPrank(deployer);
        MUSDProxy.mint(user1, mintAmount);
        vm.stopPrank();
        assertEq(MUSDProxy.balanceOf(user1), mintAmount);

        // 2. user1 approves deployer to spend tokens
        vm.startPrank(user1);
        MUSDProxy.approve(deployer, approvedAmount);
        vm.stopPrank();
        assertEq(MUSDProxy.allowance(user1, deployer), approvedAmount);

        // 3. deployer transfers tokens from user1 to user2
        vm.startPrank(deployer);
        MUSDProxy.transferFrom(user1, user2, transferAmount);
        vm.stopPrank();
        assertEq(MUSDProxy.balanceOf(user1), mintAmount - transferAmount);
        assertEq(MUSDProxy.balanceOf(user2), transferAmount);
        assertEq(
            MUSDProxy.allowance(user1, deployer),
            approvedAmount - transferAmount
        );
    }

    function testTransferZeroAmount() public {
        uint256 mintAmount = 1000 * 1e6;

        // 1. Operator mints tokens to user1
        vm.startPrank(deployer);
        MUSDProxy.mint(user1, mintAmount);
        vm.stopPrank();
        assertEq(MUSDProxy.balanceOf(user1), mintAmount);

        // 2. user1 transfers zero tokens to user2 (should succeed and have no effect)
        vm.startPrank(user1);
        MUSDProxy.transfer(user2, 0);
        vm.stopPrank();

        assertEq(MUSDProxy.balanceOf(user1), mintAmount);
        assertEq(MUSDProxy.balanceOf(user2), 0);
    }
}
