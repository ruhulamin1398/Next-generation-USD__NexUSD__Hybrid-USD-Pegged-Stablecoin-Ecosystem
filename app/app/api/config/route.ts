import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const BACKEND_API_TOKEN = process.env.BACKEND_API_TOKEN;

export async function GET(request: NextRequest) {
  if (!BACKEND_URL || !BACKEND_API_TOKEN) {
    return NextResponse.json(
      {
        error: "Backend configuration is missing.",
        detail: "Set BACKEND_URL and BACKEND_API_TOKEN in the environment.",
      },
      { status: 500 }
    );
  }

  const network = request.nextUrl.searchParams.get("network");
  if (!network) {
    return NextResponse.json(
      { error: "Missing required query parameter: network." },
      { status: 400 }
    );
  }

  const backendEndpoint = `${BACKEND_URL.replace(/\/$/, "")}/config?network=${encodeURIComponent(network)}`;

  try {
    const backendResponse = await fetch(backendEndpoint, {
      method: "GET",
      headers: {
        token: BACKEND_API_TOKEN,
      },
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
        error: "Unable to reach backend config service.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }
}
