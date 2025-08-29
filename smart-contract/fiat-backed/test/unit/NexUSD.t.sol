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
        assertEq(NexUSDv1.name(), "Next Generation USD");
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
 

    function testBurnRevertsIfNotOperator() public {
        uint256 amount = 1000 * 1e6;
        vm.prank(OPERATOR);
        NexUSDv1.mint(USER, amount);
        vm.prank(USER);
        vm.expectRevert();
        NexUSDv1.burn(USER, amount);
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

 

 


 
}
