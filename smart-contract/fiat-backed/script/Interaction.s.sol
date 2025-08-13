// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {NexUSD} from "../src/NexUSD.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract Interaction is HelperConfig {
    function run() external {
        proxy = DevOpsTools.get_most_recent_deployment(
            "ERC1967Proxy",
            block.chainid
        );
        NexUSDv1 = NexUSD(proxy);

        vm.startBroadcast();

        // mint();
        // fundLink();
        // send();
        vm.stopBroadcast();
    }

    function mint() public {
        NexUSDv1.mint(USER1, 1000 * 10 ** 6);
    }

    // function transfer() public {
    //     NexUSD.transfer(0x3a93D544242a24c66Eb1BCceE00d7AA04f55B12c, 15 * 10 ** 6);
    // }

    function fundLink() public {
        IERC20(0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904).transfer(
            proxy,
            10 * 10 ** 18
        );
    }

    // function send() public {
    //     NexUSD.send(
    //         CCIPchains["BNB"].chainSelector,
    //         USER2,
    //         NexUSD_BNB_CONTRACT,
    //         15 * 10 ** 6
    //     );
    // }
}
