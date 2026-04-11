// Simple mock liquidation engine for testing
// @author mosharaf6

contract MockLiquidationEngine {
    uint256 public liquidationThreshold = 140;

    function getLiquidationThreshold() external view returns (uint256) {
        return liquidationThreshold;
    }
}
