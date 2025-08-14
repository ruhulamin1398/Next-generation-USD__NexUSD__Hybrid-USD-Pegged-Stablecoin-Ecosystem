import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { networks } from "../../utils/const/networks";

// ERC20 ABI for minting function (basic functions needed)
const ERC20_ABI = [
  "function mint(address to, uint256 amount) external",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function symbol() view returns (string)",
];

interface FaucetRequest {
  address: string;
  network: string;
  amount: string;
  type: "fiat" | "crypto";
}

export async function POST(request: NextRequest) {
  try {
    const { address, network, amount, type }: FaucetRequest =
      await request.json();

    // Validation
    if (!address || !network || !amount || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate amount
    const tokenAmount = parseFloat(amount);
    if (isNaN(tokenAmount) || tokenAmount <= 0 || tokenAmount > 500) {
      return NextResponse.json(
        { error: "Amount must be between 1 and 500 tokens" },
        { status: 400 }
      );
    }

    // Validate address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(address)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    // Find the network configuration
    const networkConfig = networks.find(
      (net) =>
        net.name === network && net.type === type && net.status === "live"
    );

    if (!networkConfig) {
      return NextResponse.json(
        { error: "Network not found or not available" },
        { status: 400 }
      );
    }

    if (!networkConfig.contractAddress || !networkConfig.rpcUrl) {
      return NextResponse.json(
        { error: "Network configuration incomplete" },
        { status: 400 }
      );
    }

    // Get operator private key from environment
    const operatorPrivateKey = process.env.OPERATOR_PRIVATE_KEY;
    if (!operatorPrivateKey) {
      console.error("OPERATOR_PRIVATE_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const wallet = new ethers.Wallet(operatorPrivateKey, provider);

    // Connect to the contract
    const contract = new ethers.Contract(
      networkConfig.contractAddress,
      ERC20_ABI,
      wallet
    );

    // Get token decimals
    let decimals: number;
    try {
      decimals = await contract.decimals();
    } catch (error) {
      console.error("Error getting token decimals:", error);
      return NextResponse.json(
        { error: "Failed to connect to token contract" },
        { status: 500 }
      );
    }

    // Calculate amount with decimals
    const amountWithDecimals = ethers.parseUnits(amount, decimals);

    // Check operator balance (if applicable)
    try {
      const balance = await provider.getBalance(wallet.address);
      console.log(" native balance at operator is " , balance)
      if (balance === BigInt(0)) {
        return NextResponse.json(
          { error: "Insufficient gas balance in operator wallet" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error checking operator balance:", error);
    }

    // Mint tokens
    try {
      console.log(`Minting ${amount} tokens to ${address} on ${network}`);

      const tx = await contract.mint(address, amountWithDecimals, {
        gasLimit: 200000, // Set a reasonable gas limit
      });

      console.log(`Transaction sent: ${tx.hash}`);

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        console.log(`Transaction confirmed: ${tx.hash}`);
        return NextResponse.json({
          success: true,
          transactionHash: tx.hash,
          message: `Successfully minted ${amount} NexUSD tokens`,
          network: {
            name: networkConfig.name,
            explorerUrl: networkConfig.explorerUrl,
          },
        });
      } else {
        console.error(`Transaction failed: ${tx.hash}`);
        return NextResponse.json(
          { error: "Transaction failed" },
          { status: 500 }
        );
      }
    } catch (error: unknown) {
      console.error("Error minting tokens:", error);

      // Handle specific error cases
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorCode = (error as { code?: string })?.code;

      if (errorCode === "INSUFFICIENT_FUNDS") {
        return NextResponse.json(
          { error: "Insufficient gas funds in operator wallet" },
          { status: 500 }
        );
      } else if (errorCode === "UNPREDICTABLE_GAS_LIMIT") {
        return NextResponse.json(
          {
            error: "Transaction would fail. Please check contract permissions.",
          },
          { status: 500 }
        );
      } else if (errorMessage.includes("revert")) {
        return NextResponse.json(
          { error: "Contract execution failed. Please check token contract." },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { error: "Failed to mint tokens. Please try again." },
          { status: 500 }
        );
      }
    }
  } catch (error: unknown) {
    console.error("Faucet API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle GET requests with API info
export async function GET() {
  return NextResponse.json({
    message: "NexUSD Faucet API",
    usage: "POST /api/faucet with { address, network, amount, type }",
    limits: {
      maxAmount: 500,
      supportedTypes: ["fiat", "crypto"],
    },
    availableNetworks: networks
      .filter((net) => net.status === "live")
      .map((net) => ({
        name: net.name,
        type: net.type,
        contractAddress: net.contractAddress,
      })),
  });
}
