export type TransactionType = 'transfer' | 'bridge'
export type TransactionDirection = 'sent' | 'received'

export interface ITransactionMetadata {
    networkTitle?: string
    explorerUrl?: string
}

export interface ITransaction {
    address: string
    chain: string
    txHash: string
    type: TransactionType | 'receive'
    token: string
    tokenType: 'fiat' | 'crypto'
    amount: string
    from: string
    to: string
    status: string
    timestamp: number
    networkTitle?: string | null
    explorerUrl?: string | null
    createdAt: number
}

export interface ITransactionApiItem extends ITransaction {
    direction?: TransactionDirection
}

export const TransactionSchema = {
    address: { type: String, required: true },
    chain: { type: String, required: true },
    txHash: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['transfer', 'bridge'] },
    token: { type: String, required: true },
    tokenType: { type: String, required: true, enum: ['fiat', 'crypto'] },
    amount: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Number, required: true },
    networkTitle: { type: String, default: null },
    explorerUrl: { type: String, default: null },
    createdAt: { type: Number, default: Date.now },
} as const

export interface TransactionRecord extends ITransaction { }
export interface TransactionApiItem extends ITransactionApiItem { }

export function normalizeAddress(address: string) {
    return address.trim().toLowerCase()
}

export function deriveTransactionDirection(
    tx: TransactionRecord | TransactionApiItem,
    currentAddress: string,
): TransactionDirection | undefined {
    const normalizedAddress = normalizeAddress(currentAddress)
    const from = normalizeAddress(tx.from)
    const to = normalizeAddress(tx.to)

    if (tx.type === 'bridge') {
        return undefined
    }

    if (to === normalizedAddress) {
        return 'received'
    }

    if (from === normalizedAddress) {
        return 'sent'
    }

    return undefined
}

export function buildTransactionQueryFilter(
    address: string,
    type?: string,
): Record<string, unknown> {
    const normalizedAddress = normalizeAddress(address)
    const defaultAddressFilter = {
        $or: [
            { from: normalizedAddress },
            { to: normalizedAddress },
            { address: normalizedAddress },
        ],
    }

    if (!type || type === 'all') {
        return defaultAddressFilter
    }

    if (type === 'receive') {
        return {
            $or: [
                { type: 'transfer', to: normalizedAddress },
                { type: 'receive', to: normalizedAddress },
            ],
        }
    }

    if (type === 'transfer') {
        return {
            type: 'transfer',
            from: normalizedAddress,
        }
    }

    if (type === 'bridge') {
        return {
            type: 'bridge',
            $or: [
                { from: normalizedAddress },
                { to: normalizedAddress },
                { address: normalizedAddress },
            ],
        }
    }

    return defaultAddressFilter
}
