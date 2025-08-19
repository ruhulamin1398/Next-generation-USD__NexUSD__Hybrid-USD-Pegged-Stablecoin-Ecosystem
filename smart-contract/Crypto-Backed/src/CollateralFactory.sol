// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "./CollateralVault.sol";
import "./NexUSD-C.sol";
import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

// Factory for creating collateral vaults
// @author mosharaf6
// Deploys vault contracts for different collateral types
contract CollateralFactory is Ownable {
    NexUSDC public nexUSD;
    address public liquidationEngine;
    uint256 public constant DEFAULT_CR = 140; // 140%

    struct VaultInfo {
        address vaultAddress;
        address oracle;
        uint256 collateralizationRatio;
    }

    mapping(address => VaultInfo) public collateralInfo;
    address[] public supportedCollaterals;

    event VaultCreated(address indexed collateralToken, address vaultAddress);

    mapping(address => bool) public isVault;

    modifier onlyVault() {
        require(isVault[msg.sender], "Not vault");
        _;
    }

    constructor(address _owner, address _liquidationEngine) Ownable(_owner) {
        liquidationEngine = _liquidationEngine;

        // Deploy the main NexUSD token with upgradeable proxy
        NexUSDC impl = new NexUSDC();
        ERC1967Proxy proxy =
            new ERC1967Proxy(address(impl), abi.encodeWithSelector(NexUSDC.initialize.selector, address(this)));
        nexUSD = NexUSDC(address(proxy));
    }

    // Create a new vault for a collateral type
    function createVault(address _collateralToken, address _oracle, uint256 _collateralizationRatio)
        external
        onlyOwner
    {
        require(collateralInfo[_collateralToken].vaultAddress == address(0), "Vault already exists");
        uint256 cr = _collateralizationRatio == 0 ? DEFAULT_CR : _collateralizationRatio;

        CollateralVault newVault =
            new CollateralVault(_collateralToken, _oracle, address(nexUSD), cr, address(this), liquidationEngine);

        // Make sure liquidation engine is set correctly
        newVault.setLiquidationEngineAddress(liquidationEngine);
        isVault[address(newVault)] = true;

        collateralInfo[_collateralToken] =
            VaultInfo({vaultAddress: address(newVault), oracle: _oracle, collateralizationRatio: cr});

        supportedCollaterals.push(_collateralToken);
        emit VaultCreated(_collateralToken, address(newVault));
    }

    // Update liquidation engine address
    function setLiquidationEngine(address _liquidationEngine) external onlyOwner {
        liquidationEngine = _liquidationEngine;
    }

    // Vaults can call this to mint NexUSD
    function mintFromVault(address to, uint256 amount) external onlyVault {
        nexUSD.mint(to, amount);
    }

    // Vaults can call this to burn NexUSD
    function burnFromVault(address from, uint256 amount) external onlyVault {
        nexUSD.burn(from, amount);
    }

    // Owner can mint for testing/emergency
    function mint(address to, uint256 amount) external onlyOwner {
        nexUSD.mint(to, amount);
    }

    // Owner can burn for testing/emergency
    function burn(address from, uint256 amount) external onlyOwner {
        nexUSD.burn(from, amount);
    }

    // Get list of all supported collateral tokens
    function getSupportedCollaterals() external view returns (address[] memory) {
        return supportedCollaterals;
    }
}
