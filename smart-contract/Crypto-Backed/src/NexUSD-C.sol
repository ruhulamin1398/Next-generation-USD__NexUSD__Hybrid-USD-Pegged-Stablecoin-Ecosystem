// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts-upgradeable/contracts/token/ERC20/ERC20Upgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";

// NexUSD-C Token contract
// @author mosharaf6
// Main stablecoin token - upgradeable via UUPS proxy
// CollateralFactory will be the owner and handle minting/burning
contract NexUSDC is ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    // Initialize the token - only called once during deployment
    function initialize(address initialOwner) external initializer {
        __ERC20_init("NexUSD-C", "NEXC");
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    // Only owner can mint tokens
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        _mint(to, amount);
    }

    // Burn tokens from address (only owner can call)
    function burn(address from, uint256 amount) public onlyOwner {
        require(from != address(0), "Cannot burn from zero address");
        require(amount > 0, "Amount must be greater than 0");
        _burn(from, amount);
    }

    // Burn tokens from caller's address (user can burn their own tokens)
    function burnFrom(address from, uint256 amount) public onlyOwner {
        require(from != address(0), "Cannot burn from zero address");
        require(amount > 0, "Amount must be greater than 0");
        _burn(from, amount);
    }

    // Required for UUPS upgrades
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
