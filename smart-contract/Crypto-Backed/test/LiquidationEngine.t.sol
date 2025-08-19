// Tests for liquidation engine
// @author mosharaf6

import "forge-std/Test.sol";
import "src/LiquidationEngine.sol";
import "src/CollateralVault.sol";
import "src/NexUSD-C.sol";
import "test/mocks/MockOracle.sol";
import "test/mocks/MockERC20.sol";

contract LiquidationEngineTest is Test {
    LiquidationEngine liquidationEngine;
    CollateralVault vault;
    NexUSDC nexUSD;
    MockOracle oracle;
    MockERC20 collateralToken;

    address user = address(1);
    address liquidator = address(2);
    uint256 constant COLLATERALIZATION_RATIO = 140;

    function setUp() public {
        vm.startPrank(address(this)); // All calls within setUp are now from address(this)

        nexUSD = new NexUSDC();
        nexUSD.initialize(address(this));

        collateralToken = new MockERC20("Wrapped Ether", "WETH", 18);
        oracle = new MockOracle(2000 * 10 ** 8);

        vault = new CollateralVault(
            address(collateralToken),
            address(oracle),
            address(nexUSD),
            COLLATERALIZATION_RATIO,
            address(this), // initialOwner of vault is test contract
            address(0) // _liquidationEngineAddress is address(0) (temporary for debugging)
        );

        // Deploy LiquidationEngine and set its address in the vault
        liquidationEngine = new LiquidationEngine();
        vault.setLiquidationEngineAddress(address(liquidationEngine));

        collateralToken.mint(user, 10e18);
        nexUSD.mint(liquidator, 2000e18); // Mint to liquidator before ownership transfer
        nexUSD.transferOwnership(address(vault)); // nexUSD ownership transferred to vault

        vm.stopPrank(); // Stop pranking
    }

    function testLiquidate() public {
        // Setup user position
        vm.startPrank(user);
        vault.depositCollateral(1e18);
        vault.mintNexUSD(1400e18);
        vm.stopPrank();

        // Use a clean price for deterministic math: $1100 with 8 decimals
        // This yields max repay of 1000 NEXC and exactly 1.0 collateral transferred
        oracle.setPrice(1100 * 10 ** 8);

        // Liquidator liquidates the position
        vm.startPrank(liquidator);
        // Approve the liquidation engine to transfer tokens from liquidator
        nexUSD.approve(address(liquidationEngine), type(uint256).max);
        liquidationEngine.liquidate(vault, user);
        vm.stopPrank();

        // After liquidation at $1100 and 10% discount:
        // repay = 1000 NEXC, collateral transferred ≈ 1e18 (with potential 1 wei rounding)
        // remaining debt = 400 NEXC
        assertTrue(vault.collateralAmount(user) <= 1, "Collateral should be 0 or 1 wei due to rounding");
        assertEq(vault.mintedAmount(user), 400e18);
        assertTrue(
            collateralToken.balanceOf(liquidator) >= 999999999999999999, "Liquidator should receive ~1e18 collateral"
        );
    }

    function testLiquidate_Revert_IfNotUndercollateralized() public {
        // Setup user position
        vm.startPrank(user);
        vault.depositCollateral(1e18);
        vault.mintNexUSD(1400e18);
        vm.stopPrank();

        // Liquidator tries to liquidate the position
        vm.startPrank(liquidator);
        vm.expectRevert("Position is not undercollateralized");
        liquidationEngine.liquidate(vault, user);
        vm.stopPrank();
    }
}
