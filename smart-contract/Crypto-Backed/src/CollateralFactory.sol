// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import "./CollateralVault.sol";
import "./NexUSD-C.sol";
import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

// Factory for creating collateral vaults
// @author mosharaf6
// Deploys vault contracts for different collateral types
contract CollateralFactory is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    NexUSDC public nexUSD;
    address public liquidationEngine;
    uint256 public defaultCR = 140; // 140%

    struct VaultInfo {
        address vaultAddress;
        address oracle;
        uint256 collateralizationRatio;
    }

    mapping(address => VaultInfo) public collateralInfo;
    address[] public supportedCollaterals;

    event VaultCreated(address indexed collateralToken, address vaultAddress);
    event DefaultCRUpdated(uint256 oldCR, uint256 newCR);

    mapping(address => bool) public isVault;

    modifier onlyVault() {
        require(isVault[msg.sender], "Not vault");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Initialize the factory - only called once during deployment
    function initialize(address _liquidationEngine) external initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
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
        require(_collateralToken != address(0), "Invalid collateral token");
        require(_oracle != address(0), "Invalid oracle address");
        require(collateralInfo[_collateralToken].vaultAddress == address(0), "Vault already exists");
        
        uint256 cr = _collateralizationRatio == 0 ? defaultCR : _collateralizationRatio;
        require(cr >= 100, "CR must be at least 100%");
        require(cr <= 1000, "CR cannot exceed 1000%");

        // Deploy vault implementation
        CollateralVault vaultImpl = new CollateralVault();

        // Deploy proxy for vault
        ERC1967Proxy vaultProxy = new ERC1967Proxy(
            address(vaultImpl),
            abi.encodeWithSelector(
                CollateralVault.initialize.selector,
                _collateralToken,
                _oracle,
                address(nexUSD),
                cr,
                address(this),
                liquidationEngine
            )
        );

        CollateralVault newVault = CollateralVault(address(vaultProxy));

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

    // Update default collateralization ratio
    function setDefaultCR(uint256 _defaultCR) external onlyOwner {
        require(_defaultCR >= 100, "CR must be at least 100%");
        require(_defaultCR <= 500, "CR cannot exceed 500%");
        uint256 oldCR = defaultCR;
        defaultCR = _defaultCR;
        emit DefaultCRUpdated(oldCR, _defaultCR);
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

    // Required for UUPS upgrades
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
