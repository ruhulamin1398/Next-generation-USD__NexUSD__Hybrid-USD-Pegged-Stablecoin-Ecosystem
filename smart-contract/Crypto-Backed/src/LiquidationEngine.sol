// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "./CollateralVault.sol";

// Handles liquidation of risky positions
// @author mosharaf6
// Liquidators can buy collateral at discount when positions are undercollateralized
contract LiquidationEngine is Ownable {
    uint256 public liquidationThreshold = 140; // 140%
    uint256 public constant LIQUIDATION_DISCOUNT = 10; // 10%

    event LiquidationThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);
    event LiquidationExecuted(
        address indexed vault,
        address indexed user,
        address indexed liquidator,
        uint256 repayAmount,
        uint256 collateralReceived,
        uint256 liquidationPrice
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    // Liquidate someone's position if they're undercollateralized
    // Liquidator pays NexUSD and gets collateral at discount
    function liquidate(CollateralVault vault, address user) external {
        require(address(vault) != address(0), "Invalid vault address");
        require(user != address(0), "Invalid user address");
        
        uint256 userCollateral = vault.collateralAmount(user);
        uint256 userMinted = vault.mintedAmount(user);

        require(userCollateral > 0, "No collateral to liquidate");
        require(userMinted > 0, "No debt to repay");

        uint256 price = vault.getCollateralPrice();
        require(price > 0, "Invalid price from oracle");
        
        // Calculate current collateralization ratio with better precision
        // Use safe multiplication to avoid overflow
        {
            uint256 collateralValue = userCollateral * price / 10 ** 18;
            uint256 currentCR = (collateralValue * 100) / userMinted;
            require(currentCR < liquidationThreshold, "Position is not undercollateralized");
        }

        // Calculate max repay and collateral to receive
        uint256 amountToRepay;
        uint256 collateralToReceive;
        {
            // maxRepay = (userCollateral * price * 100) / (100 + discount) / 1e18
            uint256 collateralValueScaled = userCollateral * price / 10 ** 18;
            uint256 maxRepayByCollateral = (collateralValueScaled * 100) / (100 + LIQUIDATION_DISCOUNT);
            amountToRepay = userMinted < maxRepayByCollateral ? userMinted : maxRepayByCollateral;
            require(amountToRepay > 0, "Nothing to liquidate");

            // collateralToReceive = (amountToRepay * 1e18 * (100 + discount)) / (price * 100)
            uint256 numerator = amountToRepay * (100 + LIQUIDATION_DISCOUNT);
            uint256 denominator = price * 100;
            collateralToReceive = (numerator * 10 ** 18) / denominator;
            require(collateralToReceive <= userCollateral, "Not enough collateral to cover liquidation");
            require(collateralToReceive > 0, "Invalid collateral amount to receive");
        }

        // Execute liquidation
        {
            NexUSDC token = vault.nexUSD();
            require(token.balanceOf(msg.sender) >= amountToRepay, "Insufficient NexUSD balance");

            // Pull NexUSD-C from liquidator and burn from the vault
            require(token.transferFrom(msg.sender, address(vault), amountToRepay), "Transfer failed");
        }
        
        vault.burnFromVault(amountToRepay);
        vault.transferOutCollateral(msg.sender, collateralToReceive);

        // Update the user's balances
        vault.updateCollateral(user, userCollateral - collateralToReceive);
        vault.updateMintedAmount(user, userMinted - amountToRepay);

        // Emit liquidation event
        emit LiquidationExecuted(address(vault), user, msg.sender, amountToRepay, collateralToReceive, price);
    }

    // Update liquidation threshold - only owner can call
    function setLiquidationThreshold(uint256 _newThreshold) external onlyOwner {
        require(_newThreshold >= 100, "Threshold must be at least 100%");
        require(_newThreshold <= 200, "Threshold cannot exceed 200%");
        uint256 oldThreshold = liquidationThreshold;
        liquidationThreshold = _newThreshold;
        emit LiquidationThresholdUpdated(oldThreshold, _newThreshold);
    }
}
