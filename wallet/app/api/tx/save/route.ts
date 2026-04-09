import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { TransactionType } from "@/lib/transactions";

interface SaveTxBody {
    address: string;
    chain: string;
    txHash: string;
    type: TransactionType;
    amount: string;
    token: string;
    tokenType: "fiat" | "crypto";
    from: string;
    to: string;
    status: string;
    timestamp: number;
    metadata?: {
        networkTitle?: string;
        explorerUrl?: string;
    };
}

export async function POST(req: NextRequest) {
    try {
        const body: SaveTxBody = await req.json();

        const required = [
            "address",
            "chain",
            "txHash",
            "type",
            "amount",
            "token",
            "tokenType",
            "from",
            "to",
            "status",
            "timestamp",
        ];

        for (const field of required) {
            if (!body[field as keyof SaveTxBody]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 },
                );
            }
        }

        const db = await getDb();
        const txs = db.collection("transactions");
        const id = randomUUID();

        await txs.updateOne(
            { txHash: body.txHash },
            {
                $setOnInsert: {
                    id,
                    address: body.address.toLowerCase(),
                    chain: body.chain,
                    txHash: body.txHash,
                    type: body.type,
                    token: body.token,
                    tokenType: body.tokenType,
                    amount: body.amount,
                    from: body.from.toLowerCase(),
                    to: body.to.toLowerCase(),
                    status: body.status,
                    timestamp: body.timestamp,
                    networkTitle: body.metadata?.networkTitle ?? null,
                    explorerUrl: body.metadata?.explorerUrl ?? null,
                    createdAt: Date.now(),
                },
            },
            { upsert: true },
        );

        return NextResponse.json({ success: true, id, txHash: body.txHash });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
