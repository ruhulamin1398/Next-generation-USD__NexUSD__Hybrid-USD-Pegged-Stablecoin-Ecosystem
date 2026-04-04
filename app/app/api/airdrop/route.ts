import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const BACKEND_API_TOKEN = process.env.BACKEND_API_TOKEN;

export async function POST(request: NextRequest) {


  if (!BACKEND_URL || !BACKEND_API_TOKEN) {
    return NextResponse.json(
      {
        error: "Backend configuration is missing.",
        detail: "Set BACKEND_URL and BACKEND_API_TOKEN in the environment.",
      },
      { status: 500 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const { network, address, amount } = payload;
  if (!network || !address || amount == null) {
    return NextResponse.json(
      { error: "Missing required fields: network, address, and amount are required." },
      { status: 400 }
    );
  }

  const backendEndpoint = `${BACKEND_URL.replace(/\/$/, "")}/airdrop`;

  try {
    const backendResponse = await fetch(backendEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: BACKEND_API_TOKEN,
      },
      body: JSON.stringify({ network, address, amount }),
    });

    const text = await backendResponse.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to reach backend airdrop service.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Airdrop proxy route is available.",
      usage: "POST /api/airdrop with { network, address, amount }",
    },
    { status: 200 }
  );
}
