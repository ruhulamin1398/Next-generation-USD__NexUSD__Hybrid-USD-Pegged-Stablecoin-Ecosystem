// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./CollateralVault.sol";

// Handles liquidation of risky positions
// @author mosharaf6
// Liquidators can buy collateral at discount when positions are undercollateralized
contract LiquidationEngine {
    uint256 public constant LIQUIDATION_THRESHOLD = 140;
    uint256 public constant LIQUIDATION_DISCOUNT = 10;

    // Liquidate someone's position if they're undercollateralized
    // Liquidator pays NexUSD and gets collateral at discount
    function liquidate(CollateralVault vault, address user) external {
        uint256 userCollateral = vault.collateralAmount(user);
        uint256 userMinted = vault.mintedAmount(user);

        require(userCollateral > 0, "No collateral to liquidate");
        require(userMinted > 0, "No debt to repay");

        uint256 price = vault.getCollateralPrice();
        uint256 currentCR = (userCollateral * price * 100) / (userMinted * 10 ** 18);

        require(currentCR < LIQUIDATION_THRESHOLD, "Position is not undercollateralized");

        // Total debt to be repaid (in NexUSD-C)
        // Max repay allowed by available collateral at discount
        // maxRepay = (userCollateral * price / 1e18) * 100 / (100 + discount)
        uint256 maxRepayByCollateral = ((userCollateral * price) / 1e18) * 100 / (100 + LIQUIDATION_DISCOUNT);
        uint256 amountToRepay = userMinted < maxRepayByCollateral ? userMinted : maxRepayByCollateral;
        require(amountToRepay > 0, "Nothing to liquidate");

        // Collateral to give for this repay
        uint256 collateralToReceive = ((amountToRepay * 1e18) / price) * (100 + LIQUIDATION_DISCOUNT) / 100;
        require(collateralToReceive <= userCollateral, "Not enough collateral to cover liquidation");

        // Pull NexUSD-C from liquidator and burn from the vault
        NexUSDC token = vault.nexUSD();
        require(token.transferFrom(msg.sender, address(vault), amountToRepay), "Transfer failed");
        vault.burnFromVault(amountToRepay);

        // Transfer collateral to the liquidator
        vault.transferOutCollateral(msg.sender, collateralToReceive);

        // Update the user's balances
        vault.updateCollateral(user, userCollateral - collateralToReceive);
        vault.updateMintedAmount(user, userMinted - amountToRepay);
    }
}
