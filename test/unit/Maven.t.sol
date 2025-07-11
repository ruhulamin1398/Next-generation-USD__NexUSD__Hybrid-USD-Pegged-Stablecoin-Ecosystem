// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";
import {TestMaven} from "../../src/TestMaven.sol";
import {DeployMaven} from "../../script/DeployMaven.s.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "./Helper.t.sol";

contract MavenTest is HelperConfig, HelperTest {
    TestMaven MUSD;

    function setUp() external {
        DeployMaven deployer = new DeployMaven();
        address mUSD = deployer.run();

        console.log("Maven deployed at:", mUSD);
        MUSD = TestMaven(mUSD);
    }

    function testMavenDeployment() public {
        console.log("Maven deployed at:", address(MUSD));
        assert(address(MUSD) != address(0));
    }
}
