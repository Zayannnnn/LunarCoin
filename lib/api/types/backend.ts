/**
 * Raw API response shapes from the Python blockchain backend.
 * Supports snake_case (Python) with optional camelCase fallbacks.
 */

export interface BackendBlock {
  index?: number
  height?: number
  hash: string
  previous_hash?: string
  previousHash?: string
  timestamp: number | string
  transactions?: number | unknown[]
  transaction_count?: number
  miner?: string
  miner_address?: string
  size?: number
  reward?: number
  mining_reward?: number
  miningReward?: number
  difficulty?: number
  nonce?: number
  gas_used?: number
  gasUsed?: number
  gas_limit?: number
  gasLimit?: number
}

export interface BackendTransaction {
  hash: string
  block_height?: number | null
  blockHeight?: number | null
  block_hash?: string | null
  blockHash?: string | null
  sender?: string
  from?: string
  recipient?: string
  to?: string
  amount: number
  fee?: number
  status?: 'pending' | 'confirmed' | 'failed'
  confirmations?: number
  timestamp: number | string
  gas_price?: number
  gasPrice?: number
  gas_used?: number
  gasUsed?: number
  nonce?: number
  data?: string
}

export interface BackendAddress {
  address: string
  balance: number
  mined_rewards?: number
  minedRewards?: number
  rewards?: number
  total_received?: number
  totalReceived?: number
  total_sent?: number
  totalSent?: number
  transaction_count?: number
  transactionCount?: number
  first_seen?: number | string
  firstSeen?: number | string
  last_seen?: number | string
  lastSeen?: number | string
}

export interface BackendNetworkStats {
  chain_height?: number
  chainHeight?: number
  difficulty?: number
  hash_rate?: string
  hashRate?: string
  hash_rate_number?: number
  hashRateNumber?: number
  total_supply?: number
  totalSupply?: number
  circulating_supply?: number
  circulatingSupply?: number
  mempool_size?: number
  mempoolSize?: number
  mempool_transactions?: number
  mempoolTransactions?: number
  connected_peers?: number
  connectedPeers?: number
  last_block_time?: number | string
  lastBlockTime?: number | string
  avg_block_time?: number
  avgBlockTime?: number
  avg_fee?: number
  avgFee?: number
  tps?: number
}

export interface BackendPeer {
  id: string
  ip: string
  version: string
  latency: number
  connection_time?: number
  connectionTime?: number
  bytes_sent?: number
  bytesSent?: number
  bytes_received?: number
  bytesReceived?: number
  last_seen?: number | string
  lastSeen?: number | string
  country?: string
  city?: string
}

export interface BackendFeeEstimate {
  priority: 'low' | 'medium' | 'high'
  fee: number
  estimated_time?: number
  estimatedTime?: number
}

export interface BackendMiningStats {
  mining?: boolean
  running?: boolean
  hashrate?: string | number
  hash_rate?: string | number
  hashRate?: string | number
  network_hash_rate?: string | number
  networkHashRate?: string | number
  nonce?: number
  current_hash?: string
  currentHash?: string
  total_mined_blocks?: number
  totalMinedBlocks?: number
  total_blocks_mined?: number
  totalBlocksMined?: number
  mining_status?: string | boolean
  miningStatus?: string | boolean
  is_mining?: boolean
  isMining?: boolean
  difficulty?: number
  balance?: number
  current_difficulty?: number
  currentDifficulty?: number
  avg_block_time?: number
  avgBlockTime?: number
  blocks_last_24h?: number
  blocksLast24h?: number
  blocks_mined_this_session?: number
  blocksMinedThisSession?: number
  total_blocks?: number
  totalBlocks?: number
  total_hashes?: number
  totalHashes?: number
  total_miners_active?: number
  totalMinersActive?: number
  block_reward?: number
  blockReward?: number
  next_halving_block?: number
  nextHalvingBlock?: number
  blocks_until_halving?: number
  blocksUntilHalving?: number
}

export interface BackendMinerInfo {
  address: string
  blocks_mined_last_24h?: number
  blocksMinedLast24h?: number
  total_blocks_mined?: number
  totalBlocksMined?: number
  hash_rate_share?: number
  hashRateShare?: number
  last_block_mined?: number | string
  lastBlockMined?: number | string
}

export interface BackendChartPoint {
  timestamp: number | string
  value: number
  label?: string
}

export interface BackendFeeChartPoint {
  timestamp: number | string
  low: number
  medium: number
  high: number
}

export interface BackendMempool {
  size: number
  transactions: number
  fee_distribution?: { range: string; count: number }[]
  feeDistribution?: { range: string; count: number }[]
  pending_transactions?: BackendTransaction[]
  pendingTransactions?: BackendTransaction[]
}

export interface PaginatedResponse<T> {
  data?: T[]
  items?: T[]
  blocks?: T[]
  transactions?: T[]
  peers?: T[]
  miners?: T[]
  total?: number
  page?: number
  limit?: number
}

export interface BackendLiveMiningStats {
  mining: boolean
  nonce: number
  hash: string
  hashrate: number
  total_hashes: number
  estimated_block_time: number
  blocks_per_minute: number
  uptime: number
  blocks_mined: number
  difficulty: number
  balance: number
}

export interface BackendMiningLog {
  timestamp: string
  type: string
  message: string
}

export interface BackendMiningLogsResponse {
  logs: BackendMiningLog[]
}

