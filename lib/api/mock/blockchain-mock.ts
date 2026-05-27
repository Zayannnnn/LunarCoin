/**
 * Mock data generators — used only when NEXT_PUBLIC_USE_MOCK_API=true
 */

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
  LiveMiningStats,
  MiningLog,
  WalletAddressInfo,
  WalletHistoryItem,
} from '@/lib/types/blockchain'

function generateHash(): string {
  const chars = '0123456789abcdef'
  let hash = '0x'
  for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * chars.length)]
  return hash
}

function generateAddress(): string {
  const chars = '0123456789abcdef'
  let addr = '0x'
  for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * chars.length)]
  return addr
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateMockBlocks(count: number, startHeight: number = 1000000): Block[] {
  const blocks: Block[] = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const height = startHeight - i
    blocks.push({
      height,
      hash: generateHash(),
      previousHash: generateHash(),
      timestamp: now - i * 15000,
      transactions: randomBetween(50, 500),
      miner: generateAddress(),
      size: randomBetween(50000, 150000),
      reward: 6.25,
      difficulty: 85000000000000,
      nonce: randomBetween(0, 4294967295),
      gasUsed: randomBetween(8000000, 15000000),
      gasLimit: 15000000,
    })
  }
  return blocks
}

export function generateMockTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = []
  const now = Date.now()
  const statuses: Array<'pending' | 'confirmed' | 'failed'> = [
    'pending', 'confirmed', 'confirmed', 'confirmed', 'failed',
  ]
  for (let i = 0; i < count; i++) {
    const status = statuses[randomBetween(0, statuses.length - 1)]
    const isPending = status === 'pending'
    transactions.push({
      hash: generateHash(),
      blockHeight: isPending ? null : randomBetween(999900, 1000000),
      blockHash: isPending ? null : generateHash(),
      from: generateAddress(),
      to: generateAddress(),
      amount: Math.random() * 100,
      fee: Math.random() * 0.01,
      status,
      confirmations: isPending ? 0 : randomBetween(1, 100),
      timestamp: now - randomBetween(0, 3600000),
      gasPrice: randomBetween(10, 100),
      gasUsed: randomBetween(21000, 100000),
      nonce: randomBetween(0, 1000),
    })
  }
  return transactions.sort((a, b) => b.timestamp - a.timestamp)
}

export function generateNetworkStats(): NetworkStats {
  return {
    chainHeight: 1000000 + randomBetween(0, 100),
    difficulty: 85000000000000,
    hashRate: '125.4 EH/s',
    hashRateNumber: 125400000000000000000,
    totalSupply: 21000000,
    circulatingSupply: 19500000 + randomBetween(0, 10000),
    mempoolSize: randomBetween(50000000, 200000000),
    mempoolTransactions: randomBetween(5000, 25000),
    connectedPeers: randomBetween(8000, 12000),
    lastBlockTime: Date.now() - randomBetween(0, 600000),
    avgBlockTime: 15 + (Math.random() * 2 - 1),
    avgFee: 0.00025 + Math.random() * 0.0005,
    tps: randomBetween(15, 45),
  }
}

export function generateMockAddress(address: string): Address {
  const balance = Math.random() * 1000
  const totalReceived = balance + Math.random() * 500
  return {
    address,
    balance,
    totalReceived,
    totalSent: totalReceived - balance,
    transactionCount: randomBetween(10, 10000),
    firstSeen: Date.now() - randomBetween(86400000 * 30, 86400000 * 365 * 3),
    lastSeen: Date.now() - randomBetween(0, 86400000),
  }
}

export function generateMockPeers(count: number): Peer[] {
  const peers: Peer[] = []
  const versions = ['v1.2.3', 'v1.2.2', 'v1.2.1']
  const countries = ['United States', 'Germany', 'Japan', 'Singapore']
  for (let i = 0; i < count; i++) {
    peers.push({
      id: generateHash().slice(0, 18),
      ip: `${randomBetween(1, 255)}.${randomBetween(0, 255)}.${randomBetween(0, 255)}.${randomBetween(1, 254)}`,
      version: versions[randomBetween(0, versions.length - 1)],
      latency: randomBetween(10, 300),
      connectionTime: Date.now() - randomBetween(0, 86400000 * 7),
      bytesSent: randomBetween(1000000, 10000000000),
      bytesReceived: randomBetween(1000000, 10000000000),
      lastSeen: Date.now() - randomBetween(0, 60000),
      country: countries[randomBetween(0, countries.length - 1)],
    })
  }
  return peers.sort((a, b) => a.latency - b.latency)
}

export function generateFeeEstimates(): FeeEstimate[] {
  return [
    { priority: 'low', fee: 0.00015, estimatedTime: 3600 },
    { priority: 'medium', fee: 0.00025, estimatedTime: 600 },
    { priority: 'high', fee: 0.0004, estimatedTime: 60 },
  ]
}

export function generateMiningStats(): MiningStats {
  return {
    currentDifficulty: 85000000000000,
    networkHashRate: '125.4 EH/s',
    avgBlockTime: 15,
    blocksLast24h: randomBetween(5700, 5900),
    totalMinersActive: randomBetween(800000, 1200000),
    blockReward: 6.25,
    nextHalvingBlock: 1050000,
    blocksUntilHalving: 50000,
    nonce: randomBetween(100000, 999999),
    currentHash: generateHash(),
    totalMinedBlocks: randomBetween(1000, 2000),
    miningStatus: 'mining',
    balance: randomBetween(10, 500),
  }
}

export function generateTopMiners(count: number): MinerInfo[] {
  const miners: MinerInfo[] = []
  let remainingShare = 100
  for (let i = 0; i < count; i++) {
    const share = i === count - 1 ? remainingShare : Math.min(randomBetween(5, 25), remainingShare)
    remainingShare -= share
    miners.push({
      address: generateAddress(),
      blocksMinedLast24h: randomBetween(10, 500),
      totalBlocksMined: randomBetween(10000, 100000),
      hashRateShare: share,
      lastBlockMined: Date.now() - randomBetween(0, 3600000),
    })
  }
  return miners.sort((a, b) => b.hashRateShare - a.hashRateShare)
}

export function generateChartData(
  points: number,
  baseValue: number,
  variance: number,
  timeIntervalMs: number = 3600000
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = Date.now()
  for (let i = points - 1; i >= 0; i--) {
    data.push({
      timestamp: now - i * timeIntervalMs,
      value: baseValue + (Math.random() * variance * 2 - variance),
    })
  }
  return data
}

export function generateFeeChartData(points: number): FeeChartData[] {
  const data: FeeChartData[] = []
  const now = Date.now()
  for (let i = points - 1; i >= 0; i--) {
    const baseFee = 0.0002 + Math.random() * 0.0001
    data.push({
      timestamp: now - i * 3600000,
      low: baseFee * 0.6,
      medium: baseFee,
      high: baseFee * 1.6,
    })
  }
  return data
}

export function generateMempoolData(): MempoolData {
  const pendingTxs = generateMockTransactions(50).filter((tx) => tx.status === 'pending')
  return {
    size: randomBetween(50000000, 200000000),
    transactions: randomBetween(5000, 25000),
    feeDistribution: [
      { range: '0-0.0001', count: randomBetween(500, 2000) },
      { range: '0.0001-0.0002', count: randomBetween(1000, 4000) },
      { range: '0.0002-0.0003', count: randomBetween(2000, 6000) },
      { range: '0.0003-0.0005', count: randomBetween(1000, 3000) },
      { range: '0.0005+', count: randomBetween(200, 1000) },
    ],
    pendingTransactions: pendingTxs.map((tx) => ({
      ...tx,
      status: 'pending' as const,
      blockHeight: null,
      blockHash: null,
    })),
  }
}

const delay = () => new Promise((r) => setTimeout(r, 100))

export const mockBlockchainApi = {
  getNetworkStats: async () => { await delay(); return generateNetworkStats() },
  getBlocks: async (page = 1, limit = 10) => {
    await delay()
    return { blocks: generateMockBlocks(limit, 1000000 - (page - 1) * limit), total: 1000000 }
  },
  getBlock: async (hashOrHeight: string | number) => {
    await delay()
    const h = typeof hashOrHeight === 'number' ? hashOrHeight : 1000000
    return generateMockBlocks(1, h)[0] ?? null
  },
  getTransactions: async (page = 1, limit = 10, filter?: string) => {
    await delay()
    let txs = generateMockTransactions(limit * 3)
    if (filter && filter !== 'all') txs = txs.filter((tx) => tx.status === filter)
    return { transactions: txs.slice(0, limit), total: 50000 }
  },
  getTransaction: async (hash: string) => {
    await delay()
    const tx = generateMockTransactions(1)[0]
    return tx ? { ...tx, hash } : null
  },
  getWallet: async () => { await delay(); return generateMockAddress('mock-wallet') },
  getAddress: async (address: string) => { await delay(); return generateMockAddress(address) },
  getAddressTransactions: async (address: string, _page = 1, limit = 10) => {
    await delay()
    const txs = generateMockTransactions(limit).map((tx, i) => ({
      ...tx,
      from: i % 2 === 0 ? address : tx.from,
      to: i % 2 === 1 ? address : tx.to,
    }))
    return { transactions: txs, total: randomBetween(100, 10000) }
  },
  getMempool: async () => { await delay(); return generateMempoolData() },
  getFeeEstimates: async () => { await delay(); return generateFeeEstimates() },
  getMiningStats: async () => { await delay(); return generateMiningStats() },
  getLiveMiningStats: async () => { await delay(); return generateLiveMiningStats() },
  getMiningLogs: async () => { await delay(); return generateMiningLogs() },
  getWalletAddressInfo: async () => { await delay(); return generateMockWalletAddressInfo() },
  getWalletHistory: async () => { await delay(); return generateMockWalletHistory() },
  startMining: async () => { await delay() },
  stopMining: async () => { await delay() },
  getTopMiners: async (limit = 10) => { await delay(); return generateTopMiners(limit) },
  getPeers: async (limit = 50) => { await delay(); return generateMockPeers(limit) },
  connectPeer: async (address: string) => {
    await delay()
    return { status: 'success', message: `Successfully connected to mock peer ${address}` }
  },
  sendTransaction: async (recipient: string, amount: number) => {
    await delay()
    return { status: 'success', message: `Transaction compiled, signed, and broadcast successfully!`, transaction: { hash: generateHash(), from: 'mock-wallet', to: recipient, amount, timestamp: Date.now() } }
  },
  getHashRateHistory: async (hours = 24) => { await delay(); return generateChartData(hours, 125, 10) },
  getDifficultyHistory: async (hours = 24) => { await delay(); return generateChartData(hours, 8.5e13, 1e12) },
  getFeeHistory: async (hours = 24) => { await delay(); return generateFeeChartData(hours) },
  getTpsHistory: async (hours = 24) => { await delay(); return generateChartData(hours, 30, 15) },
}

export function generateLiveMiningStats(): LiveMiningStats {
  return {
    mining: true,
    nonce: randomBetween(100000, 999999),
    current_nonce: randomBetween(100000, 999999),
    hash: generateHash(),
    current_hash: generateHash(),
    hashrate: randomBetween(100, 1000),
    total_hashes: randomBetween(50000, 500000),
    estimated_block_time: randomBetween(10, 120),
    blocks_per_minute: Number((Math.random() * 2).toFixed(2)),
    uptime: randomBetween(10, 1000),
    blocks_mined: randomBetween(1, 10),
    difficulty: 4,
    balance: randomBetween(100, 200),
    peers_count: randomBetween(1, 5),
    sync_status: 'Synced',
    activity_logs: [
      { timestamp: new Date().toISOString(), message: 'Node initialized' },
      { timestamp: new Date().toISOString(), message: 'UDP Broadcaster active' },
    ],
  }
}

export function generateMiningLogs(): MiningLog[] {
  return [
    {
      timestamp: new Date().toISOString(),
      type: 'info',
      message: '[MINER] Started mining block #101. Zero-mask difficulty target: 0000'
    },
    {
      timestamp: new Date().toISOString(),
      type: 'attempt',
      message: '[MINER] Hashing nonce 842991... Candidate: 000ab23...'
    },
    {
      timestamp: new Date().toISOString(),
      type: 'success',
      message: '[MINER] Difficulty target matched! Block #101 accepted!'
    },
    {
      timestamp: new Date().toISOString(),
      type: 'success',
      message: '[MINER] Reward payout: +1 LUNAR credited!'
    }
  ]
}

export function generateMockWalletAddressInfo(): WalletAddressInfo {
  return {
    address: '0x2FB007CC0E53F181',
    walletId: 'W-A4B7C9D2E1F0',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    balance: 204.0
  }
}

export function generateMockWalletHistory(): WalletHistoryItem[] {
  const history: WalletHistoryItem[] = []
  const now = Date.now()
  for (let i = 0; i < 10; i++) {
    history.push({
      type: 'mining_reward',
      amount: 1.0,
      timestamp: new Date(now - i * 3600000 * 2).toISOString(),
      block: 100 - i
    })
  }
  return history
}

