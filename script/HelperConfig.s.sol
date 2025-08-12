// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";

import {TestMaven} from "../src/TestMaven.sol";
import {TestMavenV2} from "../src/v2/TestMavenV2.sol";

abstract contract CodeConstants is Script {
    address immutable OWNER = 0x3ff88B69d1762AA444c85c30C4B0B795f9c48B59;
    address immutable OPERATOR = 0x93d918a0f5c16a1a2dBbE60f8dfD014B6CdD4013;
    address immutable BRIDGE_OPERATOR =
        0x93d918a0f5c16a1a2dBbE60f8dfD014B6CdD4013;
    address immutable ADMIN;

    address USER = 0xddD4759f7a7762c17910706E3F4c773c198687B3;
    address immutable USER1 = 0x71D7F36C664Bb2fE8eA895d16AF14928eB812ebB;
    address immutable USER2 = 0xF948d3261917e59F13394423b6e5f1C4D9F85452;

    TestMaven MUSDv1;
    TestMavenV2 MUSDv2;
    address proxy;

    mapping(uint64 => address) public CCIPchains; // all chains for ccip

    uint64 amoy = 8002;
    uint64 bnb = 11;
    uint64 mainnet = 1;

    constructor() {
        ADMIN = msg.sender;
        CCIPchains[amoy] = 0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9;
        CCIPchains[bnb] = 0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9; // BNB Testnet
        CCIPchains[mainnet] = 0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9; // Mainnet
    }
}

contract HelperConfig is CodeConstants {}
