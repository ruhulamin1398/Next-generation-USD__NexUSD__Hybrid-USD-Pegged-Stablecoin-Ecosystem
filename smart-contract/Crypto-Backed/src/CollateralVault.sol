// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "./interfaces/IOracle.sol";
import "./NexUSD-C.sol";

// Vault for holding collateral and minting NexUSD-C
// @author mosharaf6
// Each vault handles one collateral type (like WETH, WBTC, etc)
contract CollateralVault is Ownable {
    // Set liquidation engine address - needed for liquidations
    function setLiquidationEngineAddress(address _liquidationEngineAddress) public onlyOwner {
        liquidationEngineAddress = _liquidationEngineAddress;
    }

    IERC20 public immutable collateralToken;
    IOracle public immutable oracle;
    NexUSDC public immutable nexUSD;
    uint256 public immutable collateralizationRatio;

    mapping(address => uint256) public collateralAmount;
    mapping(address => uint256) public mintedAmount;

    // This address can be used in the future to delegate collateral for yield generation.
    address public yieldGenerator;

    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event NexUSDMinted(address indexed user, uint256 amount);
    event NexUSDBurned(address indexed user, uint256 amount);

    address public liquidationEngineAddress;

    modifier onlyLiquidationEngine() {
        require(msg.sender == liquidationEngineAddress, "Only liquidation engine can call this function");
        _;
    }

    constructor(
        address _collateralToken,
        address _oracle,
        address _nexUSD,
        uint256 _collateralizationRatio,
        address initialOwner,
        address _liquidationEngineAddress
    ) Ownable(initialOwner) {
        collateralToken = IERC20(_collateralToken);
        oracle = IOracle(_oracle);
        nexUSD = NexUSDC(_nexUSD);
        collateralizationRatio = _collateralizationRatio;
        liquidationEngineAddress = _liquidationEngineAddress;
    }

    // For transferring collateral during liquidations
    function transferOutCollateral(address to, uint256 amount) external onlyLiquidationEngine {
        collateralToken.transfer(to, amount);
    }

    // Update user's collateral balance - used by liquidation engine
    function updateCollateral(address user, uint256 amount) external onlyLiquidationEngine {
        collateralAmount[user] = amount;
    }

    // Update user's minted amount - used by liquidation engine
    function updateMintedAmount(address user, uint256 amount) external onlyLiquidationEngine {
        mintedAmount[user] = amount;
    }

    // Burn NexUSD from user's wallet
    function burnFromUser(address from, uint256 amount) external onlyLiquidationEngine {
        nexUSD.burnFrom(from, amount);
    }

    // Burn NexUSD from this vault's balance
    function burnFromVault(uint256 amount) external onlyLiquidationEngine {
        nexUSD.burn(address(this), amount);
    }

    // Set yield generator for future yield farming strategies
    function setYieldGenerator(address _yieldGenerator) public onlyOwner {
        yieldGenerator = _yieldGenerator;
    }

    // Deposit collateral to the vault
    function depositCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        collateralToken.transferFrom(msg.sender, address(this), amount);
        collateralAmount[msg.sender] += amount;
        emit CollateralDeposited(msg.sender, amount);
    }

    // Withdraw collateral (but keep enough for existing debt)
    function withdrawCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(collateralAmount[msg.sender] >= amount, "Insufficient collateral");

        uint256 maxWithdraw = collateralAmount[msg.sender] - requiredCollateral(mintedAmount[msg.sender]);
        require(amount <= maxWithdraw, "Withdrawal would make position undercollateralized");

        collateralAmount[msg.sender] -= amount;
        collateralToken.transfer(msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, amount);
    }

    // Mint NexUSD against your collateral
    function mintNexUSD(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        uint256 maxMint = maxMintable(msg.sender);
        require(amount <= maxMint, "Mint amount exceeds maximum allowed");

        mintedAmount[msg.sender] += amount;
        nexUSD.mint(msg.sender, amount);
        emit NexUSDMinted(msg.sender, amount);
    }

    // Burn NexUSD to reduce debt
    function burnNexUSD(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(mintedAmount[msg.sender] >= amount, "Insufficient minted amount");

        mintedAmount[msg.sender] -= amount;
        nexUSD.burnFrom(msg.sender, amount);
        emit NexUSDBurned(msg.sender, amount);
    }

    // Calculate how much collateral is needed for given NexUSD amount
    function requiredCollateral(uint256 nexUSDAmount) public view returns (uint256) {
        if (nexUSDAmount == 0) {
            return 0;
        }
        uint256 price = _getPrice();
        return (nexUSDAmount * collateralizationRatio * 1e18) / (price * 100);
    }

    // Calculate max NexUSD user can mint with their collateral
    function maxMintable(address user) public view returns (uint256) {
        uint256 price = _getPrice();
        uint256 maxNexUSD = (collateralAmount[user] * price * 100) / (collateralizationRatio * 1e18);
        return maxNexUSD - mintedAmount[user];
    }

    // Get price from chainlink oracle, convert to 18 decimals
    function _getPrice() internal view returns (uint256) {
        (, int256 answer,, uint256 updatedAt,) = oracle.latestRoundData();
        require(updatedAt > 0 && (block.timestamp - updatedAt) < 3600, "Stale price data");
        require(answer > 0, "Invalid price");
        uint256 oraclePrice = uint256(answer);
        uint8 oracleDecimals = oracle.decimals();
        return oraclePrice * (10 ** (18 - oracleDecimals));
    }

    // Public function to get collateral price
    function getCollateralPrice() public view returns (uint256) {
        return _getPrice();
    }
}
