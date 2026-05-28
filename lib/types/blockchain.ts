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
  minedRewards?: number
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
  nonce: number
  currentHash: string
  totalMinedBlocks: number
  miningStatus: string
  balance: number
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

export interface LiveMiningStats {
  mining: boolean
  nonce: number
  current_nonce: number
  hash: string
  current_hash: string
  hashrate: number
  total_hashes: number
  estimated_block_time: number
  blocks_per_minute: number
  uptime: number
  blocks_mined: number
  difficulty: number
  balance: number
  peers_count?: number
  sync_status?: string
  activity_logs?: Array<{ timestamp: string; message: string }>
  tps?: number
  mempool_size?: number
  pending_transfers?: any[]
}

export interface MiningLog {
  timestamp: string
  type: string
  message: string
}

export interface WalletAddressInfo {
  address: string
  walletId: string
  createdAt: string
  balance: number
}

export interface WalletHistoryItem {
  type: string
  amount: number
  timestamp: string
  block: number
}

export interface TopologyNode {
  id: string
  label: string
  ip: string
  port: number
  trust: number
  height: number
  type: 'local' | 'peer'
}

export interface TopologyEdge {
  source: string
  target: string
  delay: number
}

export interface TopologyGraph {
  nodes: TopologyNode[]
  edges: TopologyEdge[]
}

export interface ForkWarning {
  peer: string
  height: number
  local_hash: string
  peer_hash: string
  timestamp: string
}

export interface NetworkHealth {
  status: string
  network_tps: number
  active_nodes_count: number
  total_chain_height: number
  avg_peer_latency: number
  fork_warnings: ForkWarning[]
  topology: TopologyGraph
}

export interface PenaltyLog {
  timestamp: string
  delta: number;
  reason: string;
  score_before: number;
  score_after: number;
}

export interface NodeReputation {
  peer: string
  score: number
  uptime: number
  valid_blocks: number
  invalid_blocks: number
  malformed_txs: number
  sync_success_rate: number
  penalty_logs: PenaltyLog[]
  blacklisted: boolean
}

export interface DeployedContract {
  address: string
  code: any[] | string
  storage: Record<string, any>
  created_block: number
  creator?: string
  gas_limit?: number
}

export interface VmExecutionLog {
  timestamp: string
  type: string
  contract_address: string
  gas_used: number
  ok: boolean
  message?: string
  result?: any
}

export interface VmStats {
  contracts_per_second: number
  last_execution_time_ms: number
  avg_gas_used: number
  active_contracts: number
  total_executions: number
  contract_network_activity: {
    pending_contract_txs: number
    online_peers: number
  }
  execution_logs?: VmExecutionLog[]
}

