// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/Script.sol";
import {NexUSD} from "../src/NexUSD.sol";
import {CodeConstants} from "./HelperConfig.s.sol";

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract DeployNexUSD is CodeConstants {
    function run() external returns (address) {
        address proxy = deployNexUSD();
        return proxy;
    }

    function deployNexUSD() public returns (address) {
        vm.startBroadcast();
        address proxy = Upgrades.deployUUPSProxy(
            "NexUSD.sol",
            abi.encodeCall(NexUSD.initialize, (OWNER, OPERATOR))
        );

        vm.stopBroadcast();
        return address(proxy);
    }
}
