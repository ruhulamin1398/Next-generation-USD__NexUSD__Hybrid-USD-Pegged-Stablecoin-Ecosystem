// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {TestMaven} from "../src/TestMaven.sol";

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract DeployMavenWithProxy is Script {
    function run() external returns (address) {
        address proxy = deployMaven();
        return proxy;
    }

    function deployMaven() public returns (address) {
        vm.startBroadcast();
        address proxy = Upgrades.deployUUPSProxy(
            "TestMaven.sol",
            abi.encodeCall(TestMaven.initialize, (msg.sender, msg.sender))
        );

        vm.stopBroadcast();
        return address(proxy);
    }
}
