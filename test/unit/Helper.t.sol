// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Script} from "forge-std/Script.sol";

import {TestMaven} from "../../src/TestMaven.sol";
import {TestMavenV2} from "../../src/v2/TestMavenV2.sol";

import {DeployMaven} from "../../script/DeployMaven.s.sol";
import {UpgradeMaven} from "../../script/UpgradeMaven.s.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

contract HelperTest is Test, HelperConfig {
    function upgradeToV2() public {
        UpgradeMaven upgrader = new UpgradeMaven();
        upgrader.run(proxy);
        MUSDv2 = TestMavenV2(proxy);
    }
}
