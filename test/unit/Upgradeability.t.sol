//SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";
import {TestMaven} from "../../src/TestMaven.sol";
import {TestMavenV2} from "../../src/v2/TestMavenV2.sol";

import {DeployMaven} from "../../script/DeployMaven.s.sol";
import {UpgradeMaven} from "../../script/UpgradeMaven.s.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "./Helper.t.sol";

contract UpgradeabilityTest is HelperConfig, HelperTest {
    TestMaven MUSDv1;
    TestMavenV2 MUSDv2;
    address proxy;

    function setUp() public {
        DeployMaven deployer = new DeployMaven();
        proxy = deployer.run();
        MUSDv1 = TestMaven(proxy);
    }

    function testUpgrade() public {
        assertEq(MUSDv1.version(), "1.0");
        assertEq(MUSDv1.decimals(), 6);
        vm.roll(100);
        UpgradeMaven upgrader = new UpgradeMaven();
        upgrader.run(proxy);

        MUSDv2 = TestMavenV2(proxy);

        assertEq(MUSDv2.version(), "2.0");
        assertEq(MUSDv2.decimals(), 6);
    }
}
