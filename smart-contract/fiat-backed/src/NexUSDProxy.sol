// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC1967Proxy} from "lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title NexUSDProxy
 * @dev A custom proxy contract for NexUSD that inherits from ERC1967Proxy
 * This allows the deployed contract to have the name "NexUSDProxy" instead of "ERC1967Proxy"
 */
contract NexUSDProxy is ERC1967Proxy {
    /**
     * @dev Initializes the proxy with the implementation contract and initialization data
     * @param implementation Address of the implementation contract
     * @param _data Encoded initialization data
     */
    constructor(address implementation, bytes memory _data) ERC1967Proxy(implementation, _data) {}
}
