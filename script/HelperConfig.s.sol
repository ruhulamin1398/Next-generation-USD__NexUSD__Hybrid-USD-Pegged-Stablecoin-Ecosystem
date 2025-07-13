// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";

import {TestMaven} from "../src/TestMaven.sol";
import {TestMavenV2} from "../src/v2/TestMavenV2.sol";

abstract contract CodeConstants is Script {
    struct CCIPChain {
        uint64 chainSelector;
        string name;
        address router;
        address linkToken;
        address nativeToken;
    }

    address immutable MUSD_BNB_CONTRACT;
    address immutable OWNER;
    address immutable OPERATOR;
    address immutable ADMIN;
    address immutable USER1;
    address immutable USER2;

    TestMaven MUSDv1;
    TestMavenV2 MUSDv2;
    address proxy;

    mapping(string => CCIPChain) public CCIPchains; // all chains for ccip

    constructor() {
        OWNER = vm.envAddress("OWNER");
        ADMIN = msg.sender;
        OPERATOR = vm.envAddress("OPERATOR");
        USER1 = vm.envAddress("USER1");
        USER2 = vm.envAddress("USER2");
        MUSD_BNB_CONTRACT = vm.envAddress("MUSD_BNB_CONTRACT");
        CCIPchains["amoy"] = CCIPChain({
            chainSelector: 16281711391670634445,
            name: "Amoy",
            router: 0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2,
            linkToken: 0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904,
            nativeToken: 0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9
        });
        CCIPchains["BNB"] = CCIPChain({
            chainSelector: 13264668187771770619,
            name: "BNB",
            router: 0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f,
            linkToken: 0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06,
            nativeToken: 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd
        });
    }
}

contract HelperConfig is CodeConstants {}
