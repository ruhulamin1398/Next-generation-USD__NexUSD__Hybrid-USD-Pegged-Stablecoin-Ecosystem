import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const address = searchParams.get("address");
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
        const tokenType = searchParams.get("tokenType") || undefined;
        const type = searchParams.get("type") || undefined;

        if (!address) {
            return NextResponse.json({ error: "address is required" }, { status: 400 });
        }

        const db = await getDb();
        const txs = db.collection("transactions");
        const normalizedAddress = address.toLowerCase();

        const filter: Record<string, any> = { address: normalizedAddress };
        if (tokenType) filter.tokenType = tokenType;
        if (type) filter.type = type;

        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        if (startDate) {
            const timestamp = Date.parse(startDate)
            if (!Number.isNaN(timestamp)) {
                filter.timestamp = filter.timestamp ?? {}
                filter.timestamp.$gte = timestamp
            }
        }
        if (endDate) {
            const timestamp = Date.parse(endDate)
            if (!Number.isNaN(timestamp)) {
                filter.timestamp = filter.timestamp ?? {}
                filter.timestamp.$lte = timestamp + 86_399_999
            }
        }

        const total = await txs.countDocuments(filter);
        const rows = await txs
            .find(filter)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .project({
                _id: 0,
                id: 1,
                txHash: 1,
                chain: 1,
                type: 1,
                token: 1,
                tokenType: 1,
                amount: 1,
                from: 1,
                to: 1,
                status: 1,
                timestamp: 1,
                networkTitle: 1,
                explorerUrl: 1,
            })
            .toArray();

        return NextResponse.json({ address, page, limit, total, transactions: rows });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
