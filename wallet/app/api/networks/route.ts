import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL!;
const BACKEND_TOKEN = process.env.BACKEND_API_TOKEN!;

export async function GET() {
    try {
        const res = await fetch(`${BACKEND_URL}/configs`, {
            headers: { token: BACKEND_TOKEN },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch network configs" },
                { status: 502 },
            );
        }

        const configs: any[] = await res.json();

        const networks = configs.map((c) => ({
            network: c.network,
            title: c.title,
            contractAddress: c.contractAddress,
            explorerUrl: c.explorerUrl,
            rpcUrl: c.rpcUrl,
            decimals: c.decimals,
            logoUrl: c.logoUrl,
            tokenType: "fiat" as const,
        }));

        return NextResponse.json({ networks });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
