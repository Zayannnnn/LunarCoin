/**
 * Production blockchain API service — connects to the Python backend.
 */

import { env } from '@/lib/config/env'
import { apiGet, apiPost } from '@/lib/api/http-client'
import { endpoints } from '@/lib/api/endpoints'
import { mockBlockchainApi } from '@/lib/api/mock/blockchain-mock'
import {
  mapBlock,
  mapTransaction,
  mapAddress,
  mapNetworkStats,
  mapPeer,
  mapFeeEstimate,
  mapMiningStats,
  mapMinerInfo,
  mapChartPoint,
  mapFeeChartPoint,
  mapMempool,
  extractList,
  extractTotal,
  normalizeHex,
  mapLiveMiningStats,
  mapMiningLog,
  mapWalletAddressInfo,
  mapWalletHistoryItem,
} from '@/lib/api/mappers'
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
  DeployedContract,
  VmExecutionLog,
  VmStats,
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
  BackendLiveMiningStats,
  BackendMiningLog,
  BackendMiningLogsResponse,
  BackendWalletAddressInfo,
  BackendWalletHistoryResponse,
} from '@/lib/api/types/backend'

export type TransactionFilter = 'all' | 'pending' | 'confirmed' | 'failed'

export interface BlockchainApi {
  getNetworkStats(): Promise<NetworkStats>
  getWallet(): Promise<Address>
  getBlocks(page?: number, limit?: number): Promise<{ blocks: Block[]; total: number }>
  getBlock(hashOrHeight: string | number): Promise<Block | null>
  getTransactions(
    page?: number,
    limit?: number,
    filter?: TransactionFilter
  ): Promise<{ transactions: Transaction[]; total: number }>
  getTransaction(hash: string): Promise<Transaction | null>
  getAddress(address: string): Promise<Address | null>
  getAddressTransactions(
    address: string,
    page?: number,
    limit?: number
  ): Promise<{ transactions: Transaction[]; total: number }>
  getMempool(): Promise<MempoolData>
  getFeeEstimates(): Promise<FeeEstimate[]>
  getMiningStats(): Promise<MiningStats>
  getLiveMiningStats(): Promise<LiveMiningStats>
  getMiningLogs(): Promise<MiningLog[]>
  getWalletAddressInfo(): Promise<WalletAddressInfo>
  getWalletHistory(): Promise<WalletHistoryItem[]>
  startMining(): Promise<void>
  stopMining(): Promise<void>
  getTopMiners(limit?: number): Promise<MinerInfo[]>
  getPeers(limit?: number): Promise<Peer[]>
  connectPeer(address: string): Promise<any>
  sendTransaction(recipient: string, amount: number): Promise<any>
  getNetworkHealth(): Promise<NetworkHealth>
  getNodeReputation(): Promise<{ reputations: NodeReputation[] }>
  getFederatedStats(): Promise<any>
  deployContract(code: any[], gasLimit: number): Promise<any>
  executeContract(address: string, gasLimit: number): Promise<any>
  getContracts(): Promise<{ contracts: DeployedContract[]; total: number; pending_contract_transactions: any[]; execution_logs: VmExecutionLog[] }>
  getContractDetail(address: string): Promise<{ contract: DeployedContract; state: Record<string, any>; logs: VmExecutionLog[] } | null>
  getVmStats(): Promise<VmStats>
  getHashRateHistory(hours?: number): Promise<ChartDataPoint[]>
  getDifficultyHistory(hours?: number): Promise<ChartDataPoint[]>
  getFeeHistory(hours?: number): Promise<FeeChartData[]>
  getTpsHistory(hours?: number): Promise<ChartDataPoint[]>
  createProposal(title: string, description: string, proposal_type: string, param_key: string, param_value: any, deadline_hours: number): Promise<any>
  voteProposal(proposal_id: string, vote: 'yes' | 'no' | 'abstain'): Promise<any>
  getProposals(): Promise<{ proposals: any[] }>
  getProposal(id: string): Promise<any>
  executeProposal(proposal_id: string): Promise<any>
  getTreasuryStats(): Promise<{ balance: number; total_allocated: number; history: any[] }>
  getStakingStats(): Promise<{ total_staked: number; stakers_count: number; apy: number; my_staked: number }>
  stakeCoins(amount: number): Promise<any>
  unstakeCoins(amount: number): Promise<any>
  uploadFile(formData: FormData): Promise<any>
  mintNFT(name: string, description: string, content_hash: string, properties?: any): Promise<any>
  getNFTs(): Promise<{ nfts: any[] }>
  getNFT(id: string): Promise<any>
  getFiles(): Promise<{ files: any[] }>
  pinFile(hash: string): Promise<any>
  unpinFile(hash: string): Promise<any>
  getAgents(): Promise<{ agents: any[] }>
  spawnAgent(name: string, role: string): Promise<any>
  getAgent(id: string): Promise<any>
  executeAgent(id: string, payload?: any): Promise<any>
}

const realBlockchainApi: BlockchainApi = {
  async getNetworkStats() {
    const raw = await apiGet<BackendNetworkStats>(endpoints.networkStats)
    return mapNetworkStats(raw)
  },

  async getWallet() {
    const raw = await apiGet<BackendAddress>(endpoints.wallet)
    return mapAddress(raw)
  },

  async getBlocks(page = 1, limit = 10) {
    const raw = await apiGet<PaginatedResponse<BackendBlock> | BackendBlock[]>(
      endpoints.blocks,
      { params: { page, limit, start: (page - 1) * limit } }
    )
    const list = extractList(raw, 'blocks')
    const total = extractTotal(raw, list.length)
    return { blocks: list.map(mapBlock), total }
  },

  async getBlock(hashOrHeight: string | number) {
    try {
      const raw = await apiGet<BackendBlock>(endpoints.block(hashOrHeight))
      return mapBlock(raw)
    } catch {
      return null
    }
  },

  async getTransactions(page = 1, limit = 10, filter = 'all') {
    const raw = await apiGet<PaginatedResponse<BackendTransaction> | BackendTransaction[]>(
      endpoints.transactions,
      { params: { page, limit, status: filter === 'all' ? undefined : filter } }
    )
    const list = extractList(raw, 'transactions')
    const total = extractTotal(raw, list.length)
    return { transactions: list.map(mapTransaction), total }
  },

  async getTransaction(hash: string) {
    try {
      const raw = await apiGet<BackendTransaction>(
        endpoints.transaction(normalizeHex(hash))
      )
      return mapTransaction(raw)
    } catch {
      return null
    }
  },

  async getAddress(address: string) {
    try {
      const raw = await apiGet<BackendAddress>(endpoints.address(normalizeHex(address)))
      return mapAddress(raw)
    } catch {
      return null
    }
  },

  async getAddressTransactions(address: string, page = 1, limit = 10) {
    const raw = await apiGet<PaginatedResponse<BackendTransaction> | BackendTransaction[]>(
      endpoints.addressTransactions(normalizeHex(address)),
      { params: { page, limit } }
    )
    const list = extractList(raw, 'transactions')
    const total = extractTotal(raw, list.length)
    return { transactions: list.map(mapTransaction), total }
  },

  async getMempool() {
    const raw = await apiGet<BackendMempool>(endpoints.mempool)
    return mapMempool(raw)
  },

  async getFeeEstimates() {
    const raw = await apiGet<BackendFeeEstimate[] | { estimates: BackendFeeEstimate[] }>(
      endpoints.feeEstimates
    )
    const list = Array.isArray(raw) ? raw : raw.estimates ?? []
    return list.map(mapFeeEstimate)
  },

  async getMiningStats() {
    const [statsRaw, statusRaw, walletRaw] = await Promise.all([
      apiGet<BackendMiningStats>(endpoints.miningStats),
      apiGet<BackendMiningStats>(endpoints.status).catch(() => ({} as BackendMiningStats)),
      apiGet<BackendAddress>(endpoints.wallet).catch(() => ({} as BackendAddress)),
    ])
    const totalBlocks = statusRaw.total_blocks ?? statusRaw.totalBlocks ?? 0
    const blocksRaw = await apiGet<PaginatedResponse<BackendBlock> | BackendBlock[]>(endpoints.blocks, {
      params: { start: Math.max(0, totalBlocks - 1), limit: 1 },
    }).catch(() => ({ blocks: [] } as PaginatedResponse<BackendBlock>))
    const blocks = extractList(blocksRaw, 'blocks')
    const latestBlock = blocks[blocks.length - 1]

    return mapMiningStats({
      ...statusRaw,
      ...statsRaw,
      balance: statsRaw.balance ?? statusRaw.balance ?? walletRaw.balance,
      current_hash: statsRaw.current_hash ?? statsRaw.currentHash ?? latestBlock?.hash,
      nonce: statsRaw.nonce ?? statsRaw.total_hashes ?? statsRaw.totalHashes ?? latestBlock?.nonce,
    })
  },

  async getLiveMiningStats() {
    const raw = await apiGet<BackendLiveMiningStats>(endpoints.liveMiningStats)
    return mapLiveMiningStats(raw)
  },

  async getMiningLogs() {
    const raw = await apiGet<BackendMiningLogsResponse>(endpoints.miningLogs)
    return (raw?.logs || []).map(mapMiningLog)
  },

  async getWalletAddressInfo() {
    const raw = await apiGet<BackendWalletAddressInfo>(endpoints.walletAddress)
    return mapWalletAddressInfo(raw)
  },

  async getWalletHistory() {
    const raw = await apiGet<BackendWalletHistoryResponse>(endpoints.walletHistory)
    return (raw?.history || []).map(mapWalletHistoryItem)
  },

  async startMining() {
    await apiPost<unknown>(endpoints.startMining)
  },

  async stopMining() {
    await apiPost<unknown>(endpoints.stopMining)
  },

  async getTopMiners(limit = 10) {
    const raw = await apiGet<PaginatedResponse<BackendMinerInfo> | BackendMinerInfo[]>(
      endpoints.miningMiners,
      { params: { limit } }
    )
    return extractList(raw, 'miners').map(mapMinerInfo)
  },

  async getPeers(limit = 50) {
    const raw = await apiGet<PaginatedResponse<BackendPeer> | BackendPeer[]>(
      endpoints.peers,
      { params: { limit } }
    )
    return extractList(raw, 'peers').map(mapPeer)
  },

  async connectPeer(address: string) {
    return await apiPost<any>(endpoints.connectPeer, { address })
  },

  async sendTransaction(recipient: string, amount: number) {
    return await apiPost<any>(endpoints.sendTransaction, { recipient, amount })
  },

  async getNetworkHealth() {
    return await apiGet<NetworkHealth>(endpoints.networkHealth)
  },

  async getNodeReputation() {
    return await apiGet<{ reputations: NodeReputation[] }>(endpoints.nodeReputation)
  },

  async getFederatedStats() {
    return await apiGet<any>(endpoints.federatedStats)
  },

  async deployContract(code: any[], gasLimit: number) {
    return await apiPost<any>(endpoints.deployContract, { code, gas_limit: gasLimit })
  },

  async executeContract(address: string, gasLimit: number) {
    return await apiPost<any>(endpoints.executeContract, { contract_address: address, gas_limit: gasLimit })
  },

  async getContracts() {
    return await apiGet<any>(endpoints.contracts)
  },

  async getContractDetail(address: string) {
    try {
      return await apiGet<any>(endpoints.contractDetail(address))
    } catch {
      return null
    }
  },

  async getVmStats() {
    return await apiGet<VmStats>(endpoints.vmStats)
  },

  async getHashRateHistory(hours = 24) {
    const raw = await apiGet<BackendChartPoint[]>(endpoints.chartHashRate, {
      params: { hours },
    })
    return (Array.isArray(raw) ? raw : []).map(mapChartPoint)
  },

  async getDifficultyHistory(hours = 24) {
    const raw = await apiGet<BackendChartPoint[]>(endpoints.chartDifficulty, {
      params: { hours },
    })
    return (Array.isArray(raw) ? raw : []).map(mapChartPoint)
  },

  async getFeeHistory(hours = 24) {
    const raw = await apiGet<BackendFeeChartPoint[]>(endpoints.feeHistory, {
      params: { hours },
    })
    return (Array.isArray(raw) ? raw : []).map(mapFeeChartPoint)
  },

  async getTpsHistory(hours = 24) {
    const raw = await apiGet<BackendChartPoint[]>(endpoints.chartTps, {
      params: { hours },
    })
    return (Array.isArray(raw) ? raw : []).map(mapChartPoint)
  },

  async createProposal(title: string, description: string, proposal_type: string, param_key: string, param_value: any, deadline_hours: number) {
    return await apiPost<any>('/create-proposal', { title, description, proposal_type, param_key, param_value, deadline_hours })
  },

  async voteProposal(proposal_id: string, vote: 'yes' | 'no' | 'abstain') {
    return await apiPost<any>('/vote', { proposal_id, vote })
  },

  async getProposals() {
    return await apiGet<{ proposals: any[] }>('/proposals')
  },

  async getProposal(id: string) {
    return await apiGet<any>('/proposal/' + id)
  },

  async executeProposal(proposal_id: string) {
    return await apiPost<any>('/execute-proposal', { proposal_id })
  },

  async getTreasuryStats() {
    return await apiGet<{ balance: number; total_allocated: number; history: any[] }>('/treasury')
  },

  async getStakingStats() {
    return await apiGet<{ total_staked: number; stakers_count: number; apy: number; my_staked: number }>('/staking-stats')
  },

  async stakeCoins(amount: number) {
    return await apiPost<any>('/stake', { amount })
  },

  async unstakeCoins(amount: number) {
    return await apiPost<any>('/unstake', { amount })
  },

  async uploadFile(formData: FormData) {
    return await apiPost<any>('/upload-file', formData)
  },

  async mintNFT(name: string, description: string, content_hash: string, properties?: any) {
    return await apiPost<any>('/mint-nft', { name, description, content_hash, properties })
  },

  async getNFTs() {
    return await apiGet<{ nfts: any[] }>('/nfts')
  },

  async getNFT(id: string) {
    return await apiGet<any>('/nft/' + id)
  },

  async getFiles() {
    return await apiGet<{ files: any[] }>('/files')
  },

  async pinFile(hash: string) {
    return await apiPost<any>(`/file/${hash}/pin`)
  },

  async unpinFile(hash: string) {
    return await apiPost<any>(`/file/${hash}/unpin`)
  },

  async getAgents() {
    return await apiGet<{ agents: any[] }>('/agents')
  },

  async spawnAgent(name: string, role: string) {
    return await apiPost<any>('/spawn-agent', { name, role })
  },

  async getAgent(id: string) {
    return await apiGet<any>('/agent/' + id)
  },

  async executeAgent(id: string, payload: any = {}) {
    return await apiPost<any>(`/agent/${id}/execute`, payload)
  },
}

/** Active API — real backend unless mock flag is set */
export const blockchainApi: BlockchainApi = env.api.useMock
  ? mockBlockchainApi
  : realBlockchainApi

export { realBlockchainApi, mockBlockchainApi }
