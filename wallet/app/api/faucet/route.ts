import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL!;
const BACKEND_TOKEN = process.env.BACKEND_API_TOKEN!;
const FAUCET_AMOUNT = parseInt(process.env.FAUCET_AMOUNT ?? "100", 10);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { network, address } = body;

        if (!network || !address) {
            return NextResponse.json(
                { error: "network and address are required" },
                { status: 400 },
            );
        }

        if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
            return NextResponse.json({ error: "Invalid address" }, { status: 400 });
        }

        const res = await fetch(`${BACKEND_URL}/airdrop`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: BACKEND_TOKEN,
            },
            body: JSON.stringify({ network, address, amount: FAUCET_AMOUNT }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data?.error ?? "Faucet request failed" },
                { status: res.status },
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
