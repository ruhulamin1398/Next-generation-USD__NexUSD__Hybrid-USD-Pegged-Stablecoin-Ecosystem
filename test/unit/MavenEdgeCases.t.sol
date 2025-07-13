// // SPDX-License-Identifier: MIT

// pragma solidity ^0.8.30;

// import {console, console2} from "forge-std/Script.sol";
// import {TestMaven} from "../../src/TestMaven.sol";
// import {BaseStorage} from "../../src/BaseStorage.sol";
// import {DeployMaven} from "../../script/DeployMaven.s.sol";

// import {HelperConfig} from "../../script/HelperConfig.s.sol";
// import {Vm} from "forge-std/Vm.sol";
// import {HelperTest} from "../unit/Helper.t.sol";
// import {MavenController} from "../../src/MavenController.sol";
// import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

// contract MavenEdgeCasesTest is HelperConfig, HelperTest {
//     TestMaven MUSDProxy;
//     address USER = address(0x1234);
//     address OPERATOR_2 = address(0x9999);

//     function setUp() public {
//         DeployMaven deployer = new DeployMaven();
//         address proxy = deployer.run();
//         MUSDProxy = TestMaven(proxy);

//         console.log(
//             "OWNER has DEFAULT_ADMIN_ROLE:",
//             MUSDProxy.hasRole(MUSDProxy.DEFAULT_ADMIN_ROLE(), OWNER)
//         );
//         console.log(
//             "OPERATOR has OPERATOR_ROLE:",
//             MUSDProxy.hasRole(MUSDProxy.OPERATOR_ROLE(), OPERATOR)
//         );
//         console.log(
//             "USER has DEFAULT_ADMIN_ROLE:",
//             MUSDProxy.hasRole(MUSDProxy.DEFAULT_ADMIN_ROLE(), USER)
//         );
//         console.log(
//             "USER2 has DEFAULT_ADMIN_ROLE:",
//             MUSDProxy.hasRole(MUSDProxy.DEFAULT_ADMIN_ROLE(), USER2)
//         );
//         console.log("DeployMaven contract address:", address(deployer));
//         console.log("Proxy contract address:", address(MUSDProxy));
//     }

//     // Add your edge case tests here

//     function testMintZeroAmount() public {
//         uint256 amount = 0;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         assertEq(MUSDProxy.balanceOf(USER), amount); // Should be 0
//     }

//     function testBurnZeroAmount() public {
//         uint256 initialAmount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, initialAmount);
//         assertEq(MUSDProxy.balanceOf(USER), initialAmount);

//         uint256 burnAmount = 0;
//         vm.prank(OPERATOR);
//         MUSDProxy.burn(USER, burnAmount);
//         assertEq(MUSDProxy.balanceOf(USER), initialAmount); // Should remain initialAmount
//     }

//     function testTransferZeroAmount() public {
//         uint256 initialAmount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, initialAmount);
//         assertEq(MUSDProxy.balanceOf(USER), initialAmount);

//         uint256 transferAmount = 0;
//         vm.prank(USER);
//         MUSDProxy.transfer(USER2, transferAmount);
//         assertEq(MUSDProxy.balanceOf(USER), initialAmount); // Should remain initialAmount
//         assertEq(MUSDProxy.balanceOf(USER2), 0);
//     }

//     function testMintToAddressZeroReverts() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         vm.expectRevert(); // ERC20: mint to the zero address
//         MUSDProxy.mint(address(0), amount);
//     }

//     function testBurnFromAddressZeroReverts() public {
//         uint256 amount = 1000 * 1e6;
//         // No need to mint to address(0) first, just try to burn from it
//         vm.prank(OPERATOR);
//         vm.expectRevert(); // ERC20: burn from the zero address
//         MUSDProxy.burn(address(0), amount);
//     }

//     function testTransferToAddressZeroReverts() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         vm.prank(USER);
//         vm.expectRevert(); // ERC20: transfer to the zero address
//         MUSDProxy.transfer(address(0), amount);
//     }

//     function testTransferFromAddressZeroReverts() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         vm.prank(USER);
//         vm.expectRevert(); // ERC20: transfer from the zero address
//         MUSDProxy.transferFrom(address(0), USER, amount);
//     }

//     function testApproveAddressZeroReverts() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(USER);
//         vm.expectRevert(); // ERC20: approve to the zero address
//         MUSDProxy.approve(address(0), amount);
//     }

//     function testAddExistingBlocklistAddressReverts() public {
//         vm.prank(OPERATOR);
//         MUSDProxy.addToBlocklist(USER);
//         vm.expectRevert(); // No specific revert message for adding existing blocklisted address
//         MUSDProxy.addToBlocklist(USER);
//     }

//     function testRemoveNonExistingBlocklistAddressReverts() public {
//         vm.prank(OPERATOR);
//         // MUSDProxy.removeFromBlocklist(USER); // This will not revert, simply setting to false.
//     }

//     function testTransferToBlocklistedAddressReverts() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);

//         vm.prank(OPERATOR);
//         MUSDProxy.addToBlocklist(USER2);

//         vm.prank(USER);
//         vm.expectRevert(
//             abi.encodeWithSelector(
//                 MavenController.BlocklistedRecipient.selector,
//                 USER2
//             )
//         );
//         MUSDProxy.transfer(USER2, amount);
//     }

//     function testTransferFromBlocklistedSenderReverts() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);

//         vm.prank(OPERATOR);
//         MUSDProxy.addToBlocklist(USER);

//         vm.prank(USER);
//         vm.expectRevert(
//             abi.encodeWithSelector(
//                 MavenController.BlocklistedSender.selector,
//                 USER
//             )
//         );
//         MUSDProxy.transfer(USER2, amount);
//     }

//     function testTransferFromFromBlocklistedSenderReverts() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);

//         vm.prank(OPERATOR);
//         MUSDProxy.addToBlocklist(USER);

//         vm.prank(USER);
//         MUSDProxy.approve(USER2, amount);

//         vm.prank(USER2);
//         vm.expectRevert(
//             abi.encodeWithSelector(
//                 MavenController.BlocklistedSender.selector,
//                 USER
//             )
//         );
//         MUSDProxy.transferFrom(USER, USER2, amount);
//     }

//     function testPausePreventsMint() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OWNER);
//         MUSDProxy.pause();
//         vm.prank(OPERATOR);
//         vm.expectRevert(); // Pausable: paused
//         MUSDProxy.mint(USER, amount);
//     }

//     function testPausePreventsBurn() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         vm.prank(OWNER);
//         MUSDProxy.pause();
//         vm.prank(OPERATOR);
//         vm.expectRevert(); // Pausable: paused
//         MUSDProxy.burn(USER, amount);
//     }

//     // function testPausePreventsBridgeMint() public {
//     //     uint256 amount = 1000 * 1e6;
//     //     string memory sourceChain = "Ethereum";
//     //     vm.prank(OWNER);
//     //     MUSDProxy.pause();
//     //     vm.prank(OPERATOR);
//     //     vm.expectRevert(); // Pausable: paused
//     //     MUSDProxy.bridgeMint(USER, amount, sourceChain);
//     // }

//     // function testPausePreventsBridgeBurn() public {
//     //     uint256 amount = 1000 * 1e6;
//     //     string memory sourceChain = "Ethereum";
//     //     vm.prank(OPERATOR);
//     //     MUSDProxy.mint(USER, amount);
//     //     vm.prank(OWNER);
//     //     MUSDProxy.pause();
//     //     vm.prank(OPERATOR);
//     //     vm.expectRevert(); // Pausable: paused
//     //     MUSDProxy.bridgeBurn(USER, amount, sourceChain);
//     // }

//     function testOwnerCanPauseAndUnpause() public {
//         vm.prank(OWNER);
//         MUSDProxy.pause();
//         assertEq(MUSDProxy.paused(), true);
//         vm.prank(OWNER);
//         MUSDProxy.unpause();
//         assertEq(MUSDProxy.paused(), false);
//     }

//     function testTransferAfterUnpause() public {
//         uint256 amount = 1000 * 1e6;
//         vm.prank(OPERATOR);
//         MUSDProxy.mint(USER, amount);
//         vm.prank(OWNER);
//         MUSDProxy.pause();
//         vm.prank(OWNER);
//         MUSDProxy.unpause();

//         vm.prank(USER);
//         MUSDProxy.transfer(USER2, amount);
//         assertEq(MUSDProxy.balanceOf(USER2), amount);
//     }
// }
