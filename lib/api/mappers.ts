import type {
  Block,
  Transaction,
  Address,
  NetworkStats,
  Peer,
  FeeEstimate,
  MiningStats,
  MinerInfo,
  ChartDataPoint,
  FeeChartData,
  MempoolData,
} from '@/lib/types/blockchain'
import type {
  BackendBlock,
  BackendTransaction,
  BackendAddress,
  BackendNetworkStats,
  BackendPeer,
  BackendFeeEstimate,
  BackendMiningStats,
  BackendMinerInfo,
  BackendChartPoint,
  BackendFeeChartPoint,
  BackendMempool,
  PaginatedResponse,
} from '@/lib/api/types/backend'

/** Normalize hash/address to 0x-prefixed hex when value is hex; pass through otherwise */
export function normalizeHex(value: string): string {
  if (!value) return value
  const trimmed = value.trim()
  const hexPart = trimmed.replace(/^0x/i, '')
  if (!/^[0-9a-fA-F]+$/.test(hexPart)) {
    return trimmed
  }
  return `0x${hexPart.toLowerCase()}`
}

/** Convert seconds or ISO string to milliseconds */
export function toTimestampMs(value: number | string): number {
  if (typeof value === 'number') {
    return value < 1e12 ? value * 1000 : value
  }
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? Date.now() : parsed
}

function txCount(block: BackendBlock): number {
  if (typeof block.transaction_count === 'number') return block.transaction_count
  if (typeof block.transactions === 'number') return block.transactions
  if (Array.isArray(block.transactions)) return block.transactions.length
  return 0
}

export function mapBlock(raw: BackendBlock): Block {
  const height = raw.height ?? raw.index ?? 0
  return {
    height,
    hash: normalizeHex(raw.hash),
    previousHash: normalizeHex(raw.previous_hash ?? raw.previousHash ?? '0x' + '0'.repeat(64)),
    timestamp: toTimestampMs(raw.timestamp),
    transactions: txCount(raw),
    miner: normalizeHex(raw.miner ?? raw.miner_address ?? ''),
    size: raw.size ?? 0,
    reward: raw.reward ?? 6.25,
    difficulty: raw.difficulty ?? 0,
    nonce: raw.nonce ?? 0,
    gasUsed: raw.gas_used ?? raw.gasUsed ?? 0,
    gasLimit: raw.gas_limit ?? raw.gasLimit ?? 15_000_000,
  }
}

export function mapTransaction(raw: BackendTransaction): Transaction {
  const from = raw.from ?? raw.sender ?? ''
  const to = raw.to ?? raw.recipient ?? ''
  const blockHeight = raw.block_height ?? raw.blockHeight ?? null

  let status: Transaction['status'] = raw.status ?? 'confirmed'
  if (!raw.status) {
    status = blockHeight === null ? 'pending' : 'confirmed'
  }

  return {
    hash: normalizeHex(raw.hash),
    blockHeight,
    blockHash: raw.block_hash ?? raw.blockHash ? normalizeHex(raw.block_hash ?? raw.blockHash!) : null,
    from: from ? normalizeHex(from) : from,
    to: to ? normalizeHex(to) : to,
    amount: Number(raw.amount),
    fee: Number(raw.fee ?? 0),
    status,
    confirmations: raw.confirmations ?? (blockHeight !== null ? 1 : 0),
    timestamp: toTimestampMs(raw.timestamp),
    gasPrice: raw.gas_price ?? raw.gasPrice ?? 0,
    gasUsed: raw.gas_used ?? raw.gasUsed ?? 21000,
    nonce: raw.nonce ?? 0,
    data: raw.data,
  }
}

export function mapAddress(raw: BackendAddress): Address {
  return {
    address: normalizeHex(raw.address),
    balance: Number(raw.balance),
    totalReceived: Number(raw.total_received ?? raw.totalReceived ?? 0),
    totalSent: Number(raw.total_sent ?? raw.totalSent ?? 0),
    transactionCount: raw.transaction_count ?? raw.transactionCount ?? 0,
    firstSeen: toTimestampMs(raw.first_seen ?? raw.firstSeen ?? Date.now()),
    lastSeen: toTimestampMs(raw.last_seen ?? raw.lastSeen ?? Date.now()),
  }
}

export function mapNetworkStats(raw: BackendNetworkStats): NetworkStats {
  return {
    chainHeight: raw.chain_height ?? raw.chainHeight ?? 0,
    difficulty: raw.difficulty ?? 0,
    hashRate: raw.hash_rate ?? raw.hashRate ?? '0 H/s',
    hashRateNumber: raw.hash_rate_number ?? raw.hashRateNumber ?? 0,
    totalSupply: raw.total_supply ?? raw.totalSupply ?? 21_000_000,
    circulatingSupply: raw.circulating_supply ?? raw.circulatingSupply ?? 0,
    mempoolSize: raw.mempool_size ?? raw.mempoolSize ?? 0,
    mempoolTransactions: raw.mempool_transactions ?? raw.mempoolTransactions ?? 0,
    connectedPeers: raw.connected_peers ?? raw.connectedPeers ?? 0,
    lastBlockTime: toTimestampMs(raw.last_block_time ?? raw.lastBlockTime ?? Date.now()),
    avgBlockTime: raw.avg_block_time ?? raw.avgBlockTime ?? 15,
    avgFee: raw.avg_fee ?? raw.avgFee ?? 0,
    tps: raw.tps ?? 0,
  }
}

export function mapPeer(raw: BackendPeer): Peer {
  return {
    id: raw.id,
    ip: raw.ip,
    version: raw.version,
    latency: raw.latency,
    connectionTime: toTimestampMs(raw.connection_time ?? raw.connectionTime ?? Date.now()),
    bytesSent: raw.bytes_sent ?? raw.bytesSent ?? 0,
    bytesReceived: raw.bytes_received ?? raw.bytesReceived ?? 0,
    lastSeen: toTimestampMs(raw.last_seen ?? raw.lastSeen ?? Date.now()),
    country: raw.country,
    city: raw.city,
  }
}

export function mapFeeEstimate(raw: BackendFeeEstimate): FeeEstimate {
  return {
    priority: raw.priority,
    fee: raw.fee,
    estimatedTime: raw.estimated_time ?? raw.estimatedTime ?? 600,
  }
}

export function mapMiningStats(raw: BackendMiningStats): MiningStats {
  return {
    currentDifficulty: raw.current_difficulty ?? raw.currentDifficulty ?? 0,
    networkHashRate: raw.network_hash_rate ?? raw.networkHashRate ?? '0 H/s',
    avgBlockTime: raw.avg_block_time ?? raw.avgBlockTime ?? 15,
    blocksLast24h: raw.blocks_last_24h ?? raw.blocksLast24h ?? 0,
    totalMinersActive: raw.total_miners_active ?? raw.totalMinersActive ?? 0,
    blockReward: raw.block_reward ?? raw.blockReward ?? 6.25,
    nextHalvingBlock: raw.next_halving_block ?? raw.nextHalvingBlock ?? 0,
    blocksUntilHalving: raw.blocks_until_halving ?? raw.blocksUntilHalving ?? 0,
  }
}

export function mapMinerInfo(raw: BackendMinerInfo): MinerInfo {
  return {
    address: normalizeHex(raw.address),
    blocksMinedLast24h: raw.blocks_mined_last_24h ?? raw.blocksMinedLast24h ?? 0,
    totalBlocksMined: raw.total_blocks_mined ?? raw.totalBlocksMined ?? 0,
    hashRateShare: raw.hash_rate_share ?? raw.hashRateShare ?? 0,
    lastBlockMined: toTimestampMs(raw.last_block_mined ?? raw.lastBlockMined ?? Date.now()),
  }
}

export function mapChartPoint(raw: BackendChartPoint): ChartDataPoint {
  return {
    timestamp: toTimestampMs(raw.timestamp),
    value: raw.value,
    label: raw.label,
  }
}

export function mapFeeChartPoint(raw: BackendFeeChartPoint): FeeChartData {
  return {
    timestamp: toTimestampMs(raw.timestamp),
    low: raw.low,
    medium: raw.medium,
    high: raw.high,
  }
}

export function mapMempool(raw: BackendMempool): MempoolData {
  const pending = raw.pending_transactions ?? raw.pendingTransactions ?? []
  return {
    size: raw.size,
    transactions: raw.transactions,
    feeDistribution: raw.fee_distribution ?? raw.feeDistribution ?? [],
    pendingTransactions: pending.map(mapTransaction),
  }
}

export function extractList<T>(response: PaginatedResponse<T> | T[] | Record<string, unknown>, key?: string): T[] {
  if (Array.isArray(response)) return response
  const obj = response as PaginatedResponse<T>
  if (obj.data) return obj.data
  if (obj.items) return obj.items
  if (key && (obj as Record<string, T[]>)[key]) return (obj as Record<string, T[]>)[key]
  if (obj.blocks) return obj.blocks as T[]
  if (obj.transactions) return obj.transactions as T[]
  if (obj.peers) return obj.peers as T[]
  if (obj.miners) return obj.miners as T[]
  return []
}

export function extractTotal(response: PaginatedResponse<unknown> | unknown[], fallback: number): number {
  if (Array.isArray(response)) return fallback
  const obj = response as Record<string, unknown>
  return (
    (obj.total as number | undefined) ??
    (obj.total_blocks as number | undefined) ??
    fallback
  )
}
