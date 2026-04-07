export const NETWORK_CHAIN_IDS: Record<string, number> = {
    sepolia: 11155111,
    "base-sepolia": 84532,
    "arbitrum-sepolia": 421614,
    "optimism-sepolia": 11155420,
    "mantle-sepolia": 5003,
    "hoodi-sepolia": 17000,
    "chaido-sepolia": 10200,
    "bsc-testnet": 97,
    "avalanche-fuji": 43113,
    "polygon-amoy": 80002,
};

export const ERC20_BALANCE_ABI = [
    {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
] as const;
