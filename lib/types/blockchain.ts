// Types for the LunarScan blockchain explorer

export interface Block {
  height: number
  hash: string
  previousHash: string
  timestamp: number
  transactions: number
  miner: string
  size: number
  reward: number
  difficulty: number
  nonce: number
  gasUsed: number
  gasLimit: number
}

export interface Transaction {
  hash: string
  blockHeight: number | null
  blockHash: string | null
  from: string
  to: string
  amount: number
  fee: number
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  timestamp: number
  gasPrice: number
  gasUsed: number
  nonce: number
  data?: string
}

export interface Address {
  address: string
  balance: number
  totalReceived: number
  totalSent: number
  transactionCount: number
  firstSeen: number
  lastSeen: number
}

export interface NetworkStats {
  chainHeight: number
  difficulty: number
  hashRate: string
  hashRateNumber: number
  totalSupply: number
  circulatingSupply: number
  mempoolSize: number
  mempoolTransactions: number
  connectedPeers: number
  lastBlockTime: number
  avgBlockTime: number
  avgFee: number
  tps: number // transactions per second
}

export interface Peer {
  id: string
  ip: string
  version: string
  latency: number
  connectionTime: number
  bytesSent: number
  bytesReceived: number
  lastSeen: number
  country?: string
  city?: string
}

export interface FeeEstimate {
  priority: 'low' | 'medium' | 'high'
  fee: number
  estimatedTime: number // in seconds
}

export interface MiningStats {
  currentDifficulty: number
  networkHashRate: string
  avgBlockTime: number
  blocksLast24h: number
  totalMinersActive: number
  blockReward: number
  nextHalvingBlock: number
  blocksUntilHalving: number
}

export interface MinerInfo {
  address: string
  blocksMinedLast24h: number
  totalBlocksMined: number
  hashRateShare: number
  lastBlockMined: number
}

export interface ChartDataPoint {
  timestamp: number
  value: number
  label?: string
}

export interface FeeChartData {
  timestamp: number
  low: number
  medium: number
  high: number
}

export interface MempoolData {
  size: number
  transactions: number
  feeDistribution: {
    range: string
    count: number
  }[]
  pendingTransactions: Transaction[]
}
