// Simple mock ERC20 for testing
// @author mosharaf6

import "forge-std/Test.sol";

contract MockERC20 is Test {
    string public name;
    string public symbol;
    uint8 public decimals;
    mapping(address => uint256) public balances;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }

    function balanceOf(address owner) public view returns (uint256) {
        return balances[owner];
    }

    function mint(address to, uint256 amount) public {
        balances[to] += amount;
    }

    function burn(address from, uint256 amount) public {
        balances[from] -= amount;
    }
}
