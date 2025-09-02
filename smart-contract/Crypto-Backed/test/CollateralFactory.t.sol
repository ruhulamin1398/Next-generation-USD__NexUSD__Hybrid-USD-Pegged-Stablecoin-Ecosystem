// Tests for collateral factory
// @author mosharaf6

import "forge-std/Test.sol";
import "src/CollateralFactory.sol";
import "src/NexUSD-C.sol";
import "src/LiquidationEngine.sol";
import "test/mocks/MockOracle.sol";
import "test/mocks/MockERC20.sol";
import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract CollateralFactoryTest is Test {
    CollateralFactory factory;
    NexUSDC nexUSD;
    LiquidationEngine liquidationEngine;
    MockERC20 weth;
    MockOracle wethOracle;

    function setUp() public {
        liquidationEngine = new LiquidationEngine(address(this));

        // Deploy factory implementation
        CollateralFactory factoryImpl = new CollateralFactory();

        // Deploy proxy
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(factoryImpl),
            abi.encodeWithSelector(CollateralFactory.initialize.selector, address(liquidationEngine))
        );

        factory = CollateralFactory(address(proxy));
        nexUSD = factory.nexUSD();

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

    function testSetDefaultCR() public {
        uint256 newCR = 150;
        factory.setDefaultCR(newCR);
        assertEq(factory.defaultCR(), newCR);
    }

    function testSetDefaultCR_Revert_IfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert();
        factory.setDefaultCR(150);
    }

    function testSetDefaultCR_Revert_IfTooLow() public {
        vm.expectRevert("CR must be at least 100%");
        factory.setDefaultCR(99);
    }

    function testSetDefaultCR_Revert_IfTooHigh() public {
        vm.expectRevert("CR cannot exceed 500%");
        factory.setDefaultCR(501);
    }

    function testSetDefaultCR_EmitsEvent() public {
        uint256 oldCR = factory.defaultCR();
        uint256 newCR = 160;

        vm.expectEmit(true, true, true, true);
        emit CollateralFactory.DefaultCRUpdated(oldCR, newCR);

        factory.setDefaultCR(newCR);
    }

    function testCreateVault_UsesUpdatedDefaultCR() public {
        // Update default CR
        factory.setDefaultCR(160);

        // Create vault with 0 (should use default)
        factory.createVault(address(weth), address(wethOracle), 0);

        (, , uint256 collateralizationRatio) = factory.collateralInfo(address(weth));
        assertEq(collateralizationRatio, 160);
    }
}
