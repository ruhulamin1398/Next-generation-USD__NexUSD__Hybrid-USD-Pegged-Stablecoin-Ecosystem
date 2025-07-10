// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {TestMaven} from "../src/TestMaven.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployMaven is Script {
    function run() external returns (address) {
        address proxy = deployMaven();
        return proxy;
    }

    function deployMaven() public returns (address) {
        vm.startBroadcast();
        TestMaven MUSD = new TestMaven();
        ERC1967Proxy proxy = new ERC1967Proxy(address(MUSD), "");
        TestMaven(address(proxy)).initialize(msg.sender, msg.sender);
        vm.stopBroadcast();
        return address(proxy);
    }
}