import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, http, parseUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
} from 'viem/chains'

const TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

const CHAIN_BY_NETWORK: Record<string, any> = {
  sepolia,
  'base-sepolia': baseSepolia,
  'arbitrum-sepolia': arbitrumSepolia,
  'optimism-sepolia': optimismSepolia,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const network = body?.network as string | undefined
    const to = body?.to as string | undefined
    const amount = body?.amount as string | undefined
    const contractAddress = body?.contractAddress as `0x${string}` | undefined
    const decimals = Number(body?.decimals)

    if (!network || !to || !amount || !contractAddress || Number.isNaN(decimals)) {
      return NextResponse.json({ error: 'Missing required transfer fields' }, { status: 400 })
    }

    if (!/^0x[0-9a-fA-F]{40}$/.test(to)) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 })
    }

    const chain = CHAIN_BY_NETWORK[network]
    if (!chain) {
      return NextResponse.json({ error: `Unsupported network: ${network}` }, { status: 400 })
    }

    const origin = req.nextUrl.origin
    const networksResponse = await fetch(`${origin}/api/networks`)
    if (!networksResponse.ok) {
      return NextResponse.json({ error: 'Failed to load network metadata' }, { status: 502 })
    }

    const { networks } = await networksResponse.json()
    const networkInfo = networks.find((item: any) => item.network === network)
    if (!networkInfo?.rpcUrl) {
      return NextResponse.json({ error: 'RPC URL not available for network' }, { status: 400 })
    }

    const privateKey = process.env.DUMMY_WALLET_PRIVATE_KEY
    if (!privateKey) {
      return NextResponse.json({ error: 'Dummy wallet credentials are not configured' }, { status: 500 })
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const client = createWalletClient({
      chain,
      transport: http(networkInfo.rpcUrl),
      account,
    })

    const amountValue = parseUnits(amount, decimals)

    async function sendTransactionAttempt() {
      return client.writeContract({
        chain,
        address: contractAddress as `0x${string}`,
        abi: TRANSFER_ABI,
        functionName: 'transfer',
        args: [to as `0x${string}`, amountValue],
      })
    }

    let txHash: string
    try {
      txHash = await sendTransactionAttempt()
    } catch (firstError: unknown) {
      const message = firstError instanceof Error ? firstError.message : ''
      if (message.includes('fetch failed') || message.includes('Unable to fetch')) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        txHash = await sendTransactionAttempt()
      } else {
        throw firstError
      }
    }

    return NextResponse.json({ txHash })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
