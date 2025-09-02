# Deployment Script for NexUSD-C

## What this script does
This script deploys the complete NexUSD-C stablecoin system to a blockchain network.

## Prerequisites
1. Make sure you have Foundry installed
2. Have a funded wallet with private key
3. Network RPC URL

## Quick Deployment

### Local Network (Anvil)
```bash
# Terminal 1: Start local blockchain
anvil

# Terminal 2: Deploy contracts
make deploy-local
```

### Other Networks
```bash
# Example for Sepolia testnet
forge script script/Deploy.s.sol \
  --rpc-url https://sepolia.infura.io/v3/YOUR_API_KEY \
  --private-key YOUR_PRIVATE_KEY \
  --broadcast \
  --verify

# Example for mainnet (be careful!)
forge script script/Deploy.s.sol \
  --rpc-url https://mainnet.infura.io/v3/YOUR_API_KEY \
  --private-key YOUR_PRIVATE_KEY \
  --broadcast \
  --verify
```

## What gets deployed
1. **LiquidationEngine** - Handles liquidations
2. **CollateralFactory Implementation** - The upgradeable factory contract implementation
3. **CollateralFactory Proxy** - ERC1967 proxy pointing to the implementation
4. **NexUSD-C Token Implementation** - The upgradeable stablecoin implementation
5. **NexUSD-C Token Proxy** - ERC1967 proxy for the stablecoin
6. **Example CollateralVault** - A vault for WETH (if available)

## After Deployment
The script will output all contract addresses. Save these for future reference.

## Environment Variables (Optional)
You can set these in a `.env` file:
```
PRIVATE_KEY=your_private_key_here
RPC_URL=your_rpc_url_here
ETHERSCAN_API_KEY=your_etherscan_key_here
```

## Security Notes
- Never commit private keys to git
- Always test on testnets first
- Verify contracts on block explorers
- Consider using hardware wallets for mainnet
