// Mock oracle for testing - simulates chainlink price feeds
// @author mosharaf6

import "../../src/interfaces/IOracle.sol";

contract MockOracle is IOracle {
    int256 public price;
    uint8 public constant MOCK_DECIMALS = 8;

    constructor(int256 _price) {
        price = _price;
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, price, block.timestamp, block.timestamp, 1);
    }

    function decimals() external view returns (uint8) {
        return MOCK_DECIMALS;
    }

    function setPrice(int256 _price) public {
        price = _price;
    }
}
