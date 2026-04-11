// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";

import {NexUSD} from "../src/NexUSD.sol";
import {NexUSDV2} from "../src/v2/NexUSDV2.sol";

abstract contract CodeConstants is Script {
    address immutable OWNER = 0x3ff88B69d1762AA444c85c30C4B0B795f9c48B59;
    address immutable OPERATOR = 0x93d918a0f5c16a1a2dBbE60f8dfD014B6CdD4013;
    address immutable ADMIN;

    address USER = 0xddD4759f7a7762c17910706E3F4c773c198687B3;
    address immutable USER1 = 0x71D7F36C664Bb2fE8eA895d16AF14928eB812ebB;
    address immutable USER2 = 0xF948d3261917e59F13394423b6e5f1C4D9F85452;

    NexUSD NexUSDv1;
    NexUSDV2 NexUSDv2;
    address proxy;

    mapping(uint256 => address) public deploymentProxies;

    uint256 sepolia = 11155111;
    uint256 amoy = 80002;
    uint256 bscTestnet = 97;
    uint256 fuji = 43113;
    uint256 arbitrumSepoliaTestnet = 421614;
    uint256 optimismSepoliaTestnet = 11155420;
    uint256 baseSepoliaTestnet = 84532;
    uint256 ethereumHoodi = 560048;
    uint256 genosisChaido = 10200;
    uint256 mantleTestnet = 5003;

    constructor() {
        ADMIN = msg.sender;
        deploymentProxies[sepolia] = 0x9768F4a36a9748D0a03A4Cefe70087758295747f;
        deploymentProxies[amoy] = 0x6Db9d8fea1B96FE25B2382a6b26656D9Eb260502;
        deploymentProxies[bscTestnet] = 0x71E53ea9f5a19A0aFB72d4fFCEBB5c0Da9c57152; // BSC Testnet
        deploymentProxies[fuji] = 0x8ff02cFB12F00C023E24743744E59e8e79D22d76; // Avalanche Fuji Testnet
        deploymentProxies[arbitrumSepoliaTestnet] = 0x58F427707474346B30163EE69c24681c18Cf87DA; // Arbitrum sepolia Testnet
        deploymentProxies[optimismSepoliaTestnet] = 0x58F427707474346B30163EE69c24681c18Cf87DA; // Optimism sepolia Testnet
        deploymentProxies[baseSepoliaTestnet] = 0x58F427707474346B30163EE69c24681c18Cf87DA; // Base sepolia Testnet
        deploymentProxies[ethereumHoodi] = 0x58F427707474346B30163EE69c24681c18Cf87DA; // Ethereum Hoodi
        deploymentProxies[genosisChaido] = 0x58F427707474346B30163EE69c24681c18Cf87DA; // Gnosis Chaido
        deploymentProxies[mantleTestnet] = 0xaB0B261DF6d672069288D8C8Dfdd01c1626e2d07; // Mantle Testnet
    }
}

contract HelperConfig is CodeConstants {}
