# NexUSD-C: Crypto-Backed Stablecoin

A modular, upgradeable smart contract system for a crypto-backed stablecoin built with Foundry.

## Overview

NexUSD-C is a crypto-backed stablecoin system featuring:
- **Upgradeable ERC-20 token** using UUPS proxy pattern
- **Modular collateral vaults** for different assets
- **Automated liquidation system** with incentives
- **Oracle integration** for real-time price feeds
- **Future-ready architecture** for yield generation

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  CollateralFactory  │    │   NexUSD-C Token   │    │  LiquidationEngine  │
│                 │    │   (Upgradeable)    │    │                 │
│  • Deploy vaults│    │   • Mint/Burn      │    │  • Liquidate    │
│  • Manage assets│    │   • Transfer       │    │  • Incentivize  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ CollateralVault │
                    │                 │
                    │ • Hold assets   │
                    │ • Check ratios  │
                    │ • Mint tokens   │
                    └─────────────────┘
```

## Quick Start

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Git

### Setup
```bash
# Clone and setup
git clone <repository-url>
cd smart-contract/Crypto-Backed

# Install dependencies
make install

# Build contracts
make build

# Run tests
make test
```

## Development

### Available Commands
```bash
make help           # Show all available commands
make build          # Compile contracts
make test           # Run all tests
make test-verbose   # Run tests with detailed output
make coverage       # Generate test coverage
make format         # Format code
make lint           # Check code style
make check          # Run all checks
```

### Testing Specific Components
```bash
make test-NexUSDC                    # Test token contract
make test-CollateralVault            # Test vault contract
make test-func-testLiquidate         # Test specific function
```

## Contracts

### Core Contracts
- **`NexUSD-C.sol`** - Upgradeable ERC-20 stablecoin token
- **`CollateralFactory.sol`** - Factory for deploying collateral vaults
- **`CollateralVault.sol`** - Individual asset vaults
- **`LiquidationEngine.sol`** - Handles undercollateralized positions

### Key Features
- **140% collateralization ratio** for minting
- **110% liquidation threshold** for safety
- **10% liquidation discount** for incentives
- **Oracle price feeds** with staleness checks
- **Modular design** for easy upgrades

## Security

### Auditing
- Comprehensive test suite with 15+ test cases
- Edge case coverage for liquidations
- Access control verification
- Oracle failure simulations

### Best Practices
- Checks-effects-interactions pattern
- Reentrancy protection
- Proper access controls
- Upgradeable proxy pattern

## Deployment

### Local Development
```bash
# Start local blockchain
anvil

# Deploy contracts
make deploy-local
```

### Network Configuration
Configure networks in `foundry.toml` for different environments.

## Testing

### Test Coverage
- Happy path scenarios (mint, burn, deposit, withdraw)
- Edge cases (insufficient collateral, oracle failures)
- Liquidation scenarios (undercollateralized positions)
- Access control and permissions

### Run Tests
```bash
make test              # All tests
make test-verbose      # Detailed output
make coverage          # Coverage report
make gas-report        # Gas usage analysis
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run `make check` to ensure code quality
4. Submit a pull request

## License

MIT License - see LICENSE file for details
