// Tests for collateral factory
// @author mosharaf6

import "forge-std/Test.sol";
import "src/CollateralFactory.sol";
import "src/NexUSD-C.sol";
import "src/LiquidationEngine.sol";
import "test/mocks/MockOracle.sol";
import "test/mocks/MockERC20.sol";

contract CollateralFactoryTest is Test {
    CollateralFactory factory;
    NexUSDC nexUSD;
    LiquidationEngine liquidationEngine;
    MockERC20 weth;
    MockOracle wethOracle;

    function setUp() public {
        nexUSD = new NexUSDC();
        nexUSD.initialize(address(this));

        liquidationEngine = new LiquidationEngine();

        factory = new CollateralFactory(address(this), address(liquidationEngine));

        weth = new MockERC20("Wrapped Ether", "WETH", 18);
        wethOracle = new MockOracle(2000 * 10 ** 8);
    }

    function testCreateVault() public {
        factory.createVault(address(weth), address(wethOracle), 140);

        (address vaultAddress, address oracle, uint256 collateralizationRatio) = factory.collateralInfo(address(weth));
        assertTrue(vaultAddress != address(0));
        assertEq(oracle, address(wethOracle));
        assertEq(collateralizationRatio, 140);

        address[] memory supportedCollaterals = factory.getSupportedCollaterals();
        assertEq(supportedCollaterals.length, 1);
        assertEq(supportedCollaterals[0], address(weth));
    }

    function testCreateVault_Revert_IfVaultExists() public {
        factory.createVault(address(weth), address(wethOracle), 140);

        vm.expectRevert("Vault already exists");
        factory.createVault(address(weth), address(wethOracle), 140);
    }
}
