// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/Script.sol";
import {TestMaven} from "../src/TestMaven.sol";
import {CodeConstants} from "./HelperConfig.s.sol";

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract DeployMaven is CodeConstants {
    function run() external returns (address) {
        console.log(" OWNER ", OWNER);
        console.log(" OPERATOR ", OPERATOR);
        console.log(" ADMIN ", ADMIN);

        address proxy = deployMaven();
        return proxy;
    }

    function deployMaven() public returns (address) {
        vm.startBroadcast();
        address proxy =
            Upgrades.deployUUPSProxy("TestMaven.sol", abi.encodeCall(TestMaven.initialize, (OWNER, OPERATOR)));

        vm.stopBroadcast();
        return address(proxy);
    }
}
