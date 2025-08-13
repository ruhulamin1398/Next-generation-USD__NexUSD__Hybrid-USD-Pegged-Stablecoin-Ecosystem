// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Script} from "forge-std/Script.sol";

import {NexUSD} from "../src/NexUSD.sol";
import {NexUSDV2} from "../src/v2/NexUSDV2.sol";

import {DeployNexUSD} from "../script/DeployNexUSD.s.sol";
import {UpgradeNexUSD} from "../script/UpgradeNexUSD.s.sol";

import {HelperConfig} from "../script/HelperConfig.s.sol";

contract HelperTest is Test, HelperConfig {
    function deployV1() public {
        DeployNexUSD deployer = new DeployNexUSD();
        proxy = deployer.run();
        NexUSDv1 = NexUSD(proxy);
        vm.startPrank(OWNER);
        NexUSDv1.grantRole(NexUSDv1.BRIDGE_OPERATOR_ROLE(), BRIDGE_OPERATOR);
        vm.stopPrank();
    }

    function upgradeToV2() public {
        UpgradeNexUSD upgrader = new UpgradeNexUSD();
        upgrader.run(proxy);
        NexUSDv2 = NexUSDV2(proxy);
    }

    function allowNewChainV1(uint64 chainSelector) public {
        vm.startPrank(ADMIN);
        NexUSDv1.addAllowlistedChain(chainSelector, CCIPchains[chainSelector]);
        vm.stopPrank();
    }

    function allowNewChainV2(uint64 chainSelector) public {
        vm.startPrank(ADMIN);
        NexUSDv2.addAllowlistedChain(chainSelector, CCIPchains[chainSelector]);
        vm.stopPrank();
    }
}
