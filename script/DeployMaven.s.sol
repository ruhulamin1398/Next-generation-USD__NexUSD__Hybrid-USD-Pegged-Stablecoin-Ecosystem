// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/Script.sol";
import {TestMaven} from "../src/TestMaven.sol";
import {CodeConstants} from "./HelperConfig.s.sol";

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract DeployMaven is CodeConstants {
    function run() external returns (address) {
        address proxy = deployMaven();
        return proxy;
    }

    function deployMaven() public returns (address) {
        CCIPChain memory chain = CCIPchains["amoy"]; // Use the Amoy chain for deployment
        vm.startBroadcast();
        address proxy = Upgrades.deployUUPSProxy(
            "TestMaven.sol",
            abi.encodeCall(
                TestMaven.initialize,
                (OWNER, OPERATOR, chain.router, chain.linkToken)
            )
        );

        vm.stopBroadcast();
        return address(proxy);
    }
}
