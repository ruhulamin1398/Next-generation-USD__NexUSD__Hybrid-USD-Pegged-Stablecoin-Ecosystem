import { NextResponse } from "next/server";
import { getDummyWalletAddress } from "@/lib/dummy-wallet";

export async function GET() {
  try {
    const address = getDummyWalletAddress();
    return NextResponse.json({ address });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load demo wallet.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
