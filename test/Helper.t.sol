// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Script} from "forge-std/Script.sol";

import {TestMaven} from "../src/TestMaven.sol";
import {TestMavenV2} from "../src/v2/TestMavenV2.sol";

import {DeployMaven} from "../script/DeployMaven.s.sol";
import {UpgradeMaven} from "../script/UpgradeMaven.s.sol";

import {HelperConfig} from "../script/HelperConfig.s.sol";

contract HelperTest is Test, HelperConfig {
    function deployV1() public {
        DeployMaven deployer = new DeployMaven();
        proxy = deployer.run();
        MUSDv1 = TestMaven(proxy);
    }

    function upgradeToV2() public {
        UpgradeMaven upgrader = new UpgradeMaven();
        upgrader.run(proxy);
        MUSDv2 = TestMavenV2(proxy);
    }

    function allowNewChainV1(uint64 chainSelector) public {
        vm.prank(ADMIN);
        MUSDv1.addAllowlistedChain(chainSelector, CCIPchains[chainSelector]);
        vm.stopPrank();
    }

    function allowNewChainV2(uint64 chainSelector) public {
        vm.prank(ADMIN);
        MUSDv2.addAllowlistedChain(chainSelector, CCIPchains[chainSelector]);
        vm.stopPrank();
    }
}
