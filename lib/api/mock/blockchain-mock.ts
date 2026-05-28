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
  NetworkHealth,
  NodeReputation,
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
  getNetworkHealth: async (): Promise<NetworkHealth> => {
    await delay()
    return {
      status: 'Healthy',
      network_tps: 4.85,
      active_nodes_count: 5,
      total_chain_height: 10420,
      avg_peer_latency: 42.6,
      fork_warnings: [],
      topology: {
        nodes: [
          { id: '127.0.0.1:5000', label: 'Local Node (You)', ip: '127.0.0.1', port: 5000, trust: 100, height: 10420, type: 'local' },
          { id: '192.168.1.102:5000', label: 'Node A7B2', ip: '192.168.1.102', port: 5000, trust: 95.5, height: 10420, type: 'peer' },
          { id: '192.168.1.144:5000', label: 'Node C9D4', ip: '192.168.1.144', port: 5000, trust: 88.0, height: 10419, type: 'peer' },
          { id: '192.168.1.201:5000', label: 'Node E1F0', ip: '192.168.1.201', port: 5000, trust: 99.0, height: 10420, type: 'peer' },
          { id: '192.168.1.88:5000', label: 'Node 2B8C', ip: '192.168.1.88', port: 5000, trust: 14.5, height: 10405, type: 'peer' },
        ],
        edges: [
          { source: '127.0.0.1:5000', target: '192.168.1.102:5000', delay: 18.2 },
          { source: '127.0.0.1:5000', target: '192.168.1.144:5000', delay: 62.4 },
          { source: '127.0.0.1:5000', target: '192.168.1.201:5000', delay: 24.5 },
          { source: '127.0.0.1:5000', target: '192.168.1.88:5000', delay: 145.8 },
        ]
      }
    }
  },
  getNodeReputation: async (): Promise<{ reputations: NodeReputation[] }> => {
    await delay()
    return {
      reputations: [
        {
          peer: '192.168.1.102:5000',
          score: 95.5,
          uptime: 99.2,
          valid_blocks: 14,
          invalid_blocks: 0,
          malformed_txs: 0,
          sync_success_rate: 100.0,
          penalty_logs: [],
          blacklisted: false
        },
        {
          peer: '192.168.1.201:5000',
          score: 99.0,
          uptime: 100.0,
          valid_blocks: 22,
          invalid_blocks: 0,
          malformed_txs: 0,
          sync_success_rate: 100.0,
          penalty_logs: [],
          blacklisted: false
        },
        {
          peer: '192.168.1.144:5000',
          score: 88.0,
          uptime: 94.5,
          valid_blocks: 8,
          invalid_blocks: 1,
          malformed_txs: 0,
          sync_success_rate: 92.0,
          penalty_logs: [
            { timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), delta: -5.0, reason: 'Heartbeat ping failed / Unresponsive node', score_before: 93.0, score_after: 88.0 }
          ],
          blacklisted: false
        },
        {
          peer: '192.168.1.88:5000',
          score: 14.5,
          uptime: 45.0,
          valid_blocks: 1,
          invalid_blocks: 5,
          malformed_txs: 8,
          sync_success_rate: 34.0,
          penalty_logs: [
            { timestamp: new Date(Date.now() - 600000).toISOString(), delta: -25.0, reason: 'Invalid block: recalculated hash mismatch', score_before: 39.5, score_after: 14.5 },
            { timestamp: new Date(Date.now() - 1200000).toISOString(), delta: -15.0, reason: 'Malformed transaction: invalid sender signature', score_before: 54.5, score_after: 39.5 }
          ],
          blacklisted: true
        }
      ]
    }
  },
  getFederatedStats: async (): Promise<any> => {
    await delay()
    return {
      node_id: 'mock-local-node',
      chain_length: 10420,
      latest_block_hash: '0000abcd1234567890ef',
      mempool_size: 4,
      tps: 0.15,
      uptime: 3600.0,
      peers: ['192.168.1.102:5000', '192.168.1.144:5000', '192.168.1.201:5000'],
      chain_summary: [
        { index: 10419, hash: '0000abcd1234567890ef' }
      ]
    }
  },

  deployContract: async (code: any[], gasLimit: number): Promise<any> => {
    await delay()
    return {
      status: 'queued',
      message: 'Contract deployment queued for next mined block',
      contract_address: '0x3C8E' + Math.floor(Math.random() * 900000 + 100000).toString(16).toUpperCase(),
      transaction: {
        tx_id: 'tx_mock_deploy_' + Date.now(),
        type: 'contract_deploy',
        gas_limit: gasLimit
      }
    }
  },

  executeContract: async (address: string, gasLimit: number): Promise<any> => {
    await delay()
    return {
      status: 'queued',
      message: 'Contract execution queued for next mined block',
      contract_address: address,
      transaction: {
        tx_id: 'tx_mock_exec_' + Date.now(),
        type: 'contract_call',
        gas_limit: gasLimit
      },
      preview: {
        ok: true,
        result: 42,
        gas_used: Math.floor(Math.random() * 150 + 50)
      }
    }
  },

  getContracts: async (): Promise<any> => {
    await delay()
    return {
      contracts: [
        {
          address: '0x3A5B807CC0E53F18',
          code: '[["PUSH", 21], ["PUSH", 2], ["MUL"], ["STORE", "answer"], ["LOAD", "answer"], ["RETURN"]]',
          storage: { answer: 42 },
          created_block: 10410,
          creator: '0x2FB007CC0E53F181'
        },
        {
          address: '0x9E7F4C82D1A00C81',
          code: '[["PUSH", 10], ["STORE", "counter"], ["LOAD", "counter"], ["RETURN"]]',
          storage: { counter: 10 },
          created_block: 10415,
          creator: '0x2FB007CC0E53F181'
        }
      ],
      total: 2,
      pending_contract_transactions: [],
      execution_logs: [
        {
          timestamp: new Date(Date.now() - 60000).toISOString(),
          type: 'execute',
          contract_address: '0x3A5B807CC0E53F18',
          gas_used: 124,
          ok: true,
          message: 'Execution finished successfully'
        },
        {
          timestamp: new Date(Date.now() - 120000).toISOString(),
          type: 'deploy',
          contract_address: '0x9E7F4C82D1A00C81',
          gas_used: 432,
          ok: true,
          message: 'Contract deployed successfully'
        }
      ]
    }
  },

  getContractDetail: async (address: string): Promise<any> => {
    await delay()
    return {
      contract: {
        address: address,
        code: '[["PUSH", 21], ["PUSH", 2], ["MUL"], ["STORE", "answer"], ["LOAD", "answer"], ["RETURN"]]',
        storage: { answer: 42 },
        created_block: 10410,
        creator: '0x2FB007CC0E53F181'
      },
      state: { answer: 42 },
      logs: [
        {
          timestamp: new Date(Date.now() - 60000).toISOString(),
          type: 'execute',
          contract_address: address,
          gas_used: 124,
          ok: true,
          message: 'Execution finished successfully'
        }
      ]
    }
  },

  getVmStats: async (): Promise<any> => {
    await delay()
    return {
      contracts_per_second: 0.12,
      last_execution_time_ms: 2.4,
      avg_gas_used: 278,
      active_contracts: 2,
      total_executions: 12,
      contract_network_activity: {
        pending_contract_txs: 0,
        online_peers: 3
      },
      execution_logs: [
        {
          timestamp: new Date(Date.now() - 60000).toISOString(),
          type: 'execute',
          contract_address: '0x3A5B807CC0E53F18',
          gas_used: 124,
          ok: true,
          message: 'Execution finished successfully'
        },
        {
          timestamp: new Date(Date.now() - 120000).toISOString(),
          type: 'deploy',
          contract_address: '0x9E7F4C82D1A00C81',
          gas_used: 432,
          ok: true,
          message: 'Contract deployed successfully'
        }
      ]
    }
  },

  createProposal: async (title: string, description: string, proposal_type: string, param_key: string, param_value: any, deadline_hours: number) => {
    await delay()
    return { status: 'success', proposal: { proposal_id: 'DAO-MOCK', title, description, status: 'active', yes_votes: 0, no_votes: 0, abstain_votes: 0 } }
  },

  voteProposal: async (proposal_id: string, vote: 'yes' | 'no' | 'abstain') => {
    await delay()
    return { status: 'success', proposal: { proposal_id, status: 'active', yes_votes: 10, no_votes: 5, abstain_votes: 1 } }
  },

  getProposals: async () => {
    await delay()
    return { proposals: [
      { proposal_id: 'DAO-001', title: 'Adjust Gas Limit Cap', description: 'Double gas limits to 4000 units', creator: '0x2FB007CC0E53F181', status: 'active', yes_votes: 45.5, no_votes: 10.2, abstain_votes: 2.0, proposal_type: 'gas_adjustment', param_key: 'gas_limit_cap', param_value: '4000', voting_deadline: new Date(Date.now() + 86400000).toISOString() },
      { proposal_id: 'DAO-002', title: 'Fund Cyberpunk DApp Payout', description: 'Allocate 10 LUNAR to developer address', creator: '0x2FB007CC0E53F181', status: 'passed', yes_votes: 105.0, no_votes: 0.0, abstain_votes: 5.0, proposal_type: 'treasury_spending', param_key: '', param_value: '0x2FB007CC0E53F181:10.0', voting_deadline: new Date(Date.now() - 3600000).toISOString() }
    ]}
  },

  getProposal: async (id: string) => {
    await delay()
    return { proposal_id: id, title: 'Mock Proposal', description: 'Mock', status: 'active', yes_votes: 12, no_votes: 2, abstain_votes: 0 }
  },

  executeProposal: async (proposal_id: string) => {
    await delay()
    return { status: 'success', proposal: { proposal_id, status: 'executed', bytecode_execution: '[["PUSH", 4000], ["STORE", "gas_limit_cap"], ["RETURN"]]' } }
  },

  getTreasuryStats: async () => {
    await delay()
    return { balance: 450.5, total_allocated: 120.0, history: [
      { type: 'inflow', amount: 0.1, timestamp: new Date().toISOString(), block: 100, description: 'Block #100 mining reward allocation' },
      { type: 'outflow', amount: 10.0, timestamp: new Date(Date.now() - 3600000).toISOString(), block: 99, description: 'Sponsor Cyberpunk DApp Developer Payout' }
    ]}
  },

  getStakingStats: async () => {
    await delay()
    return { total_staked: 1500.0, stakers_count: 12, apy: 8.0, my_staked: 150.0 }
  },

  stakeCoins: async (amount: number) => {
    await delay()
    return { status: 'success', my_staked: 150.0 + amount, total_staked: 1500.0 + amount }
  },

  unstakeCoins: async (amount: number) => {
    await delay()
    return { status: 'success', my_staked: Math.max(0, 150.0 - amount), total_staked: Math.max(0, 1500.0 - amount) }
  },

  uploadFile: async (formData: FormData) => {
    await delay()
    return { status: 'success', metadata: { content_hash: 'LFS-MOCK' + generateHash().slice(0, 16), filename: 'cyber-artwork.png', size: 102400, creator: '0x2FB007CC0E53F181', chunks: ['CHK-MOCK-1', 'CHK-MOCK-2'], pinned: true, replicas: ['127.0.0.1:5000', '192.168.1.100:5000'] } }
  },

  mintNFT: async (name: string, description: string, content_hash: string, properties?: any) => {
    await delay()
    return { status: 'success', nft: { id: 'NFT-MOCK' + generateHash().slice(0, 8), name, description, content_hash, creator: '0x2FB007CC0E53F181', owner: '0x2FB007CC0E53F181', timestamp: new Date().toISOString(), contract_address: 'LC' + generateHash().slice(0, 16) } }
  },

  getNFTs: async () => {
    await delay()
    return { nfts: [
      { id: 'NFT-001', name: 'Cyber Neon Genesis', description: 'The first graphical NFT asset on LunarCoin network', creator: '0x2FB007CC0E53F181', owner: '0x2FB007CC0E53F181', content_hash: 'LFS-NEONGENESIS', contract_address: 'LC84A7F9D2E1C0A1B2', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 'NFT-002', name: 'Lunar Core Mechanism', description: 'Breathtaking 3D telemetry interface blueprint', creator: '0x2FB007CC0E53F181', owner: '0x2FB007CC0E53F181', content_hash: 'LFS-LUNARCORE', contract_address: 'LC99F4D2E1A1B2C0D4', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ]}
  },

  getNFT: async (id: string) => {
    await delay()
    return { id, name: 'Mock Collectible', description: 'Mock Description', creator: '0x2FB007CC0E53F181', owner: '0x2FB007CC0E53F181', content_hash: 'LFS-MOCK', timestamp: new Date().toISOString() }
  },

  getFiles: async () => {
    await delay()
    return { files: [
      { content_hash: 'LFS-NEONGENESIS', filename: 'cyber-neon-genesis.png', size: 124500, creator: '0x2FB007CC0E53F181', chunks: ['CHK-NEON1', 'CHK-NEON2'], pinned: true, replicas: ['127.0.0.1:5000', '192.168.1.102:5000', '192.168.1.201:5000'], timestamp: Date.now() / 1000 - 86400 },
      { content_hash: 'LFS-LUNARCORE', filename: 'lunar-core-telemetry.pdf', size: 450300, creator: '0x2FB007CC0E53F181', chunks: ['CHK-CORE1', 'CHK-CORE2', 'CHK-CORE3'], pinned: true, replicas: ['127.0.0.1:5000', '192.168.1.102:5000'], timestamp: Date.now() / 1000 - 3600 }
    ]}
  },

  pinFile: async (hash: string) => {
    await delay()
    return { status: 'success', pinned: true }
  },

  unpinFile: async (hash: string) => {
    await delay()
    return { status: 'success', pinned: false }
  },

  getAgents: async () => {
    await delay()
    return { agents: [
      { id: 'AGENT-GOV', name: 'AI Gov Delegate', role: 'governance', status: 'active', uptime: 3600, activity_sec: 0.125, permissions: ['read_chain', 'vote_proposals', 'detect_threats'], safety_limits: { max_votes_per_block: 5, max_simulations_per_run: 50 }, decision_logs: [{ timestamp: new Date().toISOString(), message: 'Agent secured and evaluating ledger.' }], threat_warnings: [], predictions: { consensus_attack_risk: 'LOW', treasury_health_score: 95.0, next_proposal_recommendation: 'Optimize gas cap' } },
      { id: 'AGENT-TREASURY', name: 'AI Treasury Optimizer', role: 'treasury', status: 'active', uptime: 3600, activity_sec: 0.105, permissions: ['read_treasury', 'simulate_yields'], safety_limits: { max_votes_per_block: 5 }, decision_logs: [{ timestamp: new Date().toISOString(), message: 'Compounding APY locks evaluated.' }], predictions: { staking_yield_forecast: '+8.4% APY', treasury_depletion_forecast: 'Stable', incentive_recommendation: 'Fund developer grants' } },
      { id: 'AGENT-SECURITY', name: 'LunarVM AI Auditor', role: 'security', status: 'active', uptime: 3600, activity_sec: 0.145, permissions: ['read_vm_states', 'audit_bytecodes'], safety_limits: { sandbox_depth: 10 }, decision_logs: [{ timestamp: new Date().toISOString(), message: 'Virtual machine instructions audited.' }], predictions: { network_vulnerability_risk: '0.01%', average_contract_security_score: '98.5/100', last_audited_signature: 'LC84A7 (Passed)' } },
      { id: 'AGENT-MARKET', name: 'AI Tokenomics Simulator', role: 'market', status: 'active', uptime: 3600, activity_sec: 0.115, permissions: ['read_market_telemetry', 'project_tokenomics'], safety_limits: { max_simulations_per_run: 50 }, decision_logs: [{ timestamp: new Date().toISOString(), message: 'Simulated pricing forecasts calculated.' }], predictions: { token_price_direction: 'UPWARD', market_cap_forecast: '$25,000.00', liquidity_health: 'OPTIMAL' } }
    ]}
  },

  spawnAgent: async (name: string, role: string) => {
    await delay()
    return { status: 'success', agent: { id: 'AGENT-' + Math.random().toString(36).substring(2, 6).toUpperCase(), name, role, status: 'active', uptime: 0, activity_sec: 0.12, permissions: [], safety_limits: {}, decision_logs: [] } }
  },

  getAgent: async (id: string) => {
    await delay()
    return { id, name: 'AI Agent', role: 'governance', status: 'active', uptime: 3600, activity_sec: 0.12, permissions: [], safety_limits: {}, decision_logs: [] }
  },

  executeAgent: async (id: string, payload: any = {}) => {
    await delay()
    if (payload.bytecode) {
      return { score: 95, severity: 'LOW', warnings: ['Instruction arity minimal'], dangerous_opcodes: [], gas_cost: 3 }
    }
    return { status: 'success', result: { executed: true } }
  }
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

