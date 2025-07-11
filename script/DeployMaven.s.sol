// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/Script.sol";
import {TestMaven} from "../src/TestMaven.sol";
import {CodeConstants} from "./HelperConfig.s.sol";

contract DeployMaven is CodeConstants {
    function run() external returns (address) {
        console.log(OWNER, OPERATOR, ADMIN);
        vm.startBroadcast();
        TestMaven MUSD = new TestMaven();
        MUSD.initialize(OWNER, OPERATOR);

        vm.stopBroadcast();

        return (address(MUSD));
    }
}
