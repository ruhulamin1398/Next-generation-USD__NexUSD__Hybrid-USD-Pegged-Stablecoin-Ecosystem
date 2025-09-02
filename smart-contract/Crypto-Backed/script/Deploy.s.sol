// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/CollateralFactory.sol";
import "../src/LiquidationEngine.sol";
import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy LiquidationEngine first
        LiquidationEngine liquidationEngine = new LiquidationEngine(msg.sender);

        // Deploy CollateralFactory implementation
        CollateralFactory factoryImpl = new CollateralFactory();

        // Deploy proxy for CollateralFactory
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(factoryImpl),
            abi.encodeWithSelector(CollateralFactory.initialize.selector, address(liquidationEngine))
        );

        CollateralFactory factory = CollateralFactory(address(proxy));

        vm.stopBroadcast();

        // Log deployed addresses
        console.log("LiquidationEngine deployed at:", address(liquidationEngine));
        console.log("CollateralFactory proxy deployed at:", address(factory));
        console.log("CollateralFactory implementation deployed at:", address(factoryImpl));
    }
}
