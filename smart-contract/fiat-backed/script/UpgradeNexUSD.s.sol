// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

import {NexUSDV2} from "../src/v2/NexUSDV2.sol";

contract UpgradeNexUSD is Script {
    function run(address proxy) external {
        // address proxy = DevOpsTools.get_most_recent_deployment(
        //     "ERC1967Proxy",
        //     block.chainid
        // );

        vm.startBroadcast();
        Upgrades.upgradeProxy(proxy, "NexUSDV2.sol", "");
        vm.stopBroadcast();
    }
}
