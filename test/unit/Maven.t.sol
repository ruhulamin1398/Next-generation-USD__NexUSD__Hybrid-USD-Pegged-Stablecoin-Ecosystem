// // SPDX-License-Identifier: MIT

// pragma solidity ^0.8.30;

// import {console, console2} from "forge-std/Script.sol";
// import {TestMaven} from "../../src/TestMaven.sol";
// import {BaseStorage} from "../../src/BaseStorage.sol";
// import {DeployMaven} from "../../script/DeployMaven.s.sol";

// import {HelperConfig} from "../../script/HelperConfig.s.sol";

// import {Vm} from "forge-std/Vm.sol";
// import {HelperTest} from "./Helper.t.sol";

// contract MavenTest is HelperConfig, HelperTest {
//     TestMaven MUSDProxy;
//     address USER = address(0x1234);

//     function setUp() public {
//         DeployMaven deployer = new DeployMaven();
//         address proxy = deployer.run();
//         MUSDProxy = TestMaven(proxy);
//     }

//     function testDeployment() public view {
//         assertEq(MUSDProxy.decimals(), 6);
//         assertEq(MUSDProxy.name(), "TestMaven");
//         assertEq(MUSDProxy.symbol(), "MUSD");
//     }

//     function testMintByOperator() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         assertEq(MUSDProxy.balanceOf(USER), amount);
//     }

//     function testMintByNonOperatorReverts() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(USER);
//         vm.expectRevert();
//         MUSDProxy.mint(USER, amount);
//     }

//     function testMintRevertsWhenExceedingMaxSupply() public {
//         vm.startPrank(OPERATOR);
//         MUSDProxy.mint(USER, MUSDProxy.MAX_SUPPLY());
//         assertEq(MUSDProxy.totalSupply(), MUSDProxy.MAX_SUPPLY());

//         vm.expectRevert();
//         MUSDProxy.mint(USER, 1);
//         vm.stopPrank();
//     }

//     function testBlocklistPreventsMint() public {
//         uint256 amount = 1000 * 1e6;
//         vm.startPrank(OPERATOR);
//         MUSDProxy.addToBlocklist(USER);
//         vm.expectRevert();
//         MUSDProxy.mint(USER, amount);
//         vm.stopPrank();
//     }

//     function testBlocklistAllowsBurn() public {
//         uint256 amount = 1000 * 1e6;
//         vm.startPrank(OPERATOR);
//         MUSDProxy.mint(USER, amount);

//         MUSDProxy.addToBlocklist(USER);
//         vm.expectRevert();
//         MUSDProxy.burn(USER, amount);

//         vm.stopPrank();
//     }

//     function testBurnByOperator() public {
//         uint256 amount = 1000 * 1e6;
//         vm.startPrank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         MUSDProxy.burn(USER, amount);
//         vm.stopPrank();
//         assertEq(MUSDProxy.balanceOf(USER), 0);
//     }

//     function testBurnByNonOperatorReverts() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         vm.expectRevert();
//         vm.prank(USER);
//         MUSDProxy.burn(USER, amount);
//     }

//     function testAddToBlocklist() public {
//         vm.startPrank(OPERATOR);
//         MUSDProxy.addToBlocklist(USER);
//         assertEq(MUSDProxy.isBlocklisted(USER), true);
//         vm.stopPrank();
//     }

//     function testRemoveFromBlocklist() public {
//         vm.startPrank(OPERATOR);
//         MUSDProxy.addToBlocklist(USER);
//         MUSDProxy.removeFromBlocklist(USER);
//         assertEq(MUSDProxy.isBlocklisted(USER), false);
//         vm.stopPrank();
//     }

//     function testBlocklistPreventsTransfer() public {
//         uint256 amount = 1000 * 1e6;
//         vm.startPrank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         MUSDProxy.addToBlocklist(USER);
//         vm.stopPrank();
//         vm.prank(USER);
//         vm.expectRevert();
//         MUSDProxy.transfer(USER, amount);
//     }

//     function testUnblocklistAllowsTransfer() public {
//         uint256 amount = 1000 * 1e6;
//         vm.startPrank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         MUSDProxy.addToBlocklist(USER);
//         MUSDProxy.removeFromBlocklist(USER);
//         vm.stopPrank();
//         vm.prank(USER);
//         MUSDProxy.transfer(USER2, amount);
//         assertEq(MUSDProxy.balanceOf(USER2), amount);
//     }

//     function testPausePreventsTransfer() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         vm.prank(OWNER);
//         MUSDProxy.pause();
//         vm.prank(USER);
//         vm.expectRevert();
//         MUSDProxy.transfer(USER, amount);
//     }

//     function testUnpauseAllowsTransfer() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         vm.startPrank(OWNER);
//         MUSDProxy.pause();
//         MUSDProxy.unpause();
//         vm.stopPrank();
//         vm.prank(USER);
//         MUSDProxy.transfer(USER, amount);
//         assertEq(MUSDProxy.balanceOf(USER), amount);
//     }

//     // function testSendEmitsBridgeRequest() public {
//     //     uint256 amount = 1000 * 1e6;
//     //     string memory targetChain = "Polygon";

//     //     vm.prank(OPERATOR);
//     //     MUSDProxy.mint(USER, amount);
//     //     vm.prank(USER);

//     //     emit TestMaven.BridgeRequest(
//     //         USER,
//     //         USER2,
//     //         amount,
//     //         targetChain,
//     //         BaseStorage.BridgeAction.Burn
//     //     );
//     //     MUSDProxy.send(USER2, amount, targetChain);
//     // }

//     // function testBridgeMintEmitsBridgeExecuted() public {
//     //     uint256 amount = 1000 * 1e6;
//     //     string memory sourceChain = "Ethereum";
//     //     vm.prank(OPERATOR);
//     //     vm.expectEmit(true, false, false, false);
//     //     emit TestMaven.BridgeExecuted(
//     //         USER,
//     //         amount,
//     //         sourceChain,
//     //         BaseStorage.BridgeAction.Mint
//     //     ); // 0 = Mint

//     //     MUSDProxy.bridgeMint(USER, amount, sourceChain);
//     //     assertEq(MUSDProxy.balanceOf(USER), amount);
//     // }

//     // function testBridgeBurnEmitsBridgeExecuted() public {
//     //     uint256 amount = 1000 * 1e6;
//     //     string memory sourceChain = "Ethereum";
//     //     vm.prank(OPERATOR);
//     //     MUSDProxy.mint(USER, amount);
//     //     vm.prank(OPERATOR);
//     //     vm.expectEmit(true, false, false, false);
//     //     emit TestMaven.BridgeExecuted(
//     //         USER,
//     //         amount,
//     //         sourceChain,
//     //         BaseStorage.BridgeAction.Burn
//     //     ); // 1 = Burn
//     //     MUSDProxy.bridgeBurn(USER, amount, sourceChain);
//     //     assertEq(MUSDProxy.balanceOf(USER), 0);
//     // }

//     // function testSendRevertsWhenPaused() public {
//     //     uint256 amount = 1000 * 1e6;
//     //     string memory targetChain = "Polygon";
//     //     vm.prank(OPERATOR);
//     //     MUSDProxy.mint(USER, amount);
//     //     vm.prank(OWNER);
//     //     MUSDProxy.pause();
//     //     vm.prank(USER);
//     //     vm.expectRevert();
//     //     MUSDProxy.send(USER2, amount, targetChain);
//     // }

//     // function testBridgeMintRevertsWhenPaused() public {
//     //     uint256 amount = 1000 * 1e6;
//     //     string memory sourceChain = "Ethereum";
//     //     vm.prank(OWNER);
//     //     MUSDProxy.pause();
//     //     vm.prank(OPERATOR);
//     //     vm.expectRevert();
//     //     MUSDProxy.bridgeMint(USER, amount, sourceChain);
//     // }

//     // function testBridgeBurnRevertsWhenPaused() public {
//     //     uint256 amount = 1000 * 1e6;
//     //     string memory sourceChain = "Ethereum";
//     //     vm.prank(OPERATOR);
//     //     MUSDProxy.mint(USER, amount);
//     //     vm.prank(OWNER);
//     //     MUSDProxy.pause();
//     //     vm.prank(OPERATOR);
//     //     vm.expectRevert();
//     //     MUSDProxy.bridgeBurn(USER, amount, sourceChain);
//     // }
// }
