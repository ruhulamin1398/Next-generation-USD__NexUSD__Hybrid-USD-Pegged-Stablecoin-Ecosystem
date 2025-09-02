// Tests for NexUSD-C token
// @author mosharaf6

import "forge-std/Test.sol";
import "src/NexUSD-C.sol";

contract NexUSDCTest is Test {
    NexUSDC nexUSD;

    function setUp() public {
        nexUSD = new NexUSDC();
        nexUSD.initialize(address(this));
    }

    function testInitialState() public {
        assertEq(nexUSD.name(), "NexUSD-C");
        assertEq(nexUSD.symbol(), "NEXC");
        assertEq(nexUSD.owner(), address(this));
    }

    function testMint() public {
        nexUSD.mint(address(1), 100e18);
        assertEq(nexUSD.balanceOf(address(1)), 100e18);
    }

    function testBurn() public {
        nexUSD.mint(address(1), 100e18);
        nexUSD.burn(address(1), 50e18);
        assertEq(nexUSD.balanceOf(address(1)), 50e18);
    }

    function testMint_NotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", address(1)));
        nexUSD.mint(address(1), 100e18);
    }

    function testBurn_NotOwner() public {
        nexUSD.mint(address(this), 100e18);
        vm.prank(address(1));
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", address(1)));
        nexUSD.burn(address(this), 50e18);
    }
}
