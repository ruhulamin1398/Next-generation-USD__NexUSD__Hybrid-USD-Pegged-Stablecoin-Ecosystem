import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, formatUnits } from "viem";
import { ERC20_BALANCE_ABI, NETWORK_CHAIN_IDS } from "@/lib/networks";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const address = body?.address as `0x${string}` | undefined;

        if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
            return NextResponse.json({ error: "Invalid address" }, { status: 400 });
        }

        const origin = req.nextUrl.origin;
        const networksRes = await fetch(`${origin}/api/networks`);
        if (!networksRes.ok) {
            return NextResponse.json(
                { error: "Failed to load networks" },
                { status: 502 },
            );
        }

        const { networks } = await networksRes.json();

        const balances = await Promise.all(
            networks.map(async (n: any) => {
                try {
                    const chainId = NETWORK_CHAIN_IDS[n.network];
                    if (!chainId) return null;

                    const client = createPublicClient({
                        transport: http(n.rpcUrl),
                    });

                    const raw = await client.readContract({
                        address: n.contractAddress as `0x${string}`,
                        abi: ERC20_BALANCE_ABI,
                        functionName: "balanceOf",
                        args: [address],
                    });

                    const balance = formatUnits(raw as bigint, n.decimals);

                    return {
                        network: n.network,
                        title: n.title,
                        contractAddress: n.contractAddress,
                        explorerUrl: n.explorerUrl,
                        logoUrl: n.logoUrl,
                        symbol: "NexUSD",
                        decimals: n.decimals,
                        balance,
                        usdValue: balance,
                        tokenType: n.tokenType,
                    };
                } catch (error) {
                    return {
                        network: n.network,
                        title: n.title,
                        contractAddress: n.contractAddress,
                        explorerUrl: n.explorerUrl,
                        logoUrl: n.logoUrl,
                        symbol: "NexUSD",
                        decimals: n.decimals,
                        balance: "0",
                        usdValue: "0",
                        tokenType: n.tokenType,
                    };
                }
            }),
        );

        return NextResponse.json({ balances: balances.filter(Boolean) });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
