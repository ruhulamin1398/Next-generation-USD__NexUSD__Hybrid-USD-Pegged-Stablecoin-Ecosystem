// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/Script.sol";
import {NexUSD} from "../src/NexUSD.sol";
import {NexUSDProxy} from "../src/NexUSDProxy.sol";
import {CodeConstants} from "./HelperConfig.s.sol";

import {Upgrades} from "lib/openzeppelin-foundry-upgrades/src/Upgrades.sol";
import {Options} from "lib/openzeppelin-foundry-upgrades/src/Options.sol";

contract DeployNexUSD is CodeConstants {
    function run() external returns (address) {
        address proxy = deployNexUSD();
        return proxy;
    }

    function deployNexUSD() public returns (address) {
        vm.startBroadcast();

        // First deploy the implementation contract
        Options memory opts;
        address implementation = Upgrades.deployImplementation("NexUSD.sol", opts);

        // Then deploy our custom NexUSDProxy with the implementation and initialization data
        NexUSDProxy proxy = new NexUSDProxy(implementation, abi.encodeCall(NexUSD.initialize, (OWNER, OPERATOR)));

        vm.stopBroadcast();
        return address(proxy);
    }
}
