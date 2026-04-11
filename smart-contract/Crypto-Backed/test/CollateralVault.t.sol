// Tests for collateral vault functionality
// @author mosharaf6

import "forge-std/Test.sol";
import "src/CollateralVault.sol";
import "src/NexUSD-C.sol";
import "test/mocks/MockOracle.sol";
import "test/mocks/MockERC20.sol";
import "test/mocks/MockLiquidationEngine.sol";
import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract CollateralVaultTest is Test {
    CollateralVault vault;
    NexUSDC nexUSD;
    MockOracle oracle;
    MockERC20 collateralToken;
    MockLiquidationEngine liquidationEngine;

    address user = address(1);
    uint256 constant COLLATERALIZATION_RATIO = 140;

    function setUp() public {
        nexUSD = new NexUSDC();
        nexUSD.initialize(address(this));

        collateralToken = new MockERC20("Wrapped Ether", "WETH", 18);
        oracle = new MockOracle(2000 * 10 ** 8);
        liquidationEngine = new MockLiquidationEngine();

        // Deploy vault implementation
        CollateralVault vaultImpl = new CollateralVault();

        // Deploy proxy for vault
        ERC1967Proxy vaultProxy = new ERC1967Proxy(
            address(vaultImpl),
            abi.encodeWithSelector(
                CollateralVault.initialize.selector,
                address(collateralToken),
                address(oracle),
                address(nexUSD),
                COLLATERALIZATION_RATIO,
                address(this),
                address(liquidationEngine)
            )
        );

        vault = CollateralVault(address(vaultProxy));

        nexUSD.transferOwnership(address(vault));

        collateralToken.mint(user, 10e18);
    }

    function testDepositCollateral() public {
        vm.prank(user);
        vault.depositCollateral(1e18);
        assertEq(vault.collateralAmount(user), 1e18);
        assertEq(collateralToken.balanceOf(user), 9e18);
    }

    function testWithdrawCollateral() public {
        vm.startPrank(user);
        vault.depositCollateral(2e18);
        vault.mintNexUSD(1000e18);
        vault.withdrawCollateral(0.5e18);
        vm.stopPrank();

        assertEq(vault.collateralAmount(user), 1.5e18);
        assertEq(collateralToken.balanceOf(user), 8.5e18);
    }

    function testMintNexUSD() public {
        vm.startPrank(user);
        vault.depositCollateral(1e18);
        vault.mintNexUSD(1400e18);
        assertEq(nexUSD.balanceOf(user), 1400e18);
        vm.stopPrank();
    }

    function testBurnNexUSD() public {
        vm.startPrank(user);
        vault.depositCollateral(1e18);
        vault.mintNexUSD(1400e18);
        vault.burnNexUSD(400e18);
        vm.stopPrank();

        assertEq(nexUSD.balanceOf(user), 1000e18);
    }

    function testWithdrawCollateral_Revert_IfUndercollateralized() public {
        vm.startPrank(user);
        vault.depositCollateral(1e18);
        vault.mintNexUSD(1400e18);
        vm.expectRevert("Withdrawal would make position undercollateralized");
        vault.withdrawCollateral(0.1e18);
        vm.stopPrank();
    }

    function testMintNexUSD_Revert_IfExceedsMax() public {
        vm.startPrank(user);
        vault.depositCollateral(1e18);
        vm.expectRevert("Mint amount exceeds maximum allowed");
        vault.mintNexUSD(1500e18);
        vm.stopPrank();
    }
}
