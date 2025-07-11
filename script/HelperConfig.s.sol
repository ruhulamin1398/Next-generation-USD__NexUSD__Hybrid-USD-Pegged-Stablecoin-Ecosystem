// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";

abstract contract CodeConstants is Script {
    address immutable OWNER;
    address immutable OPERATOR;
    address immutable ADMIN;

    constructor() {
        OWNER = vm.envAddress("OWNER");
        OPERATOR = vm.envAddress("OPERATOR");
        ADMIN = msg.sender;
    }
}

contract HelperConfig is CodeConstants {}
