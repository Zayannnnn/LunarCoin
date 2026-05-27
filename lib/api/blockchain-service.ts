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
  getHashRateHistory(hours?: number): Promise<ChartDataPoint[]>
  getDifficultyHistory(hours?: number): Promise<ChartDataPoint[]>
  getFeeHistory(hours?: number): Promise<FeeChartData[]>
  getTpsHistory(hours?: number): Promise<ChartDataPoint[]>
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
}

/** Active API — real backend unless mock flag is set */
export const blockchainApi: BlockchainApi = env.api.useMock
  ? mockBlockchainApi
  : realBlockchainApi

export { realBlockchainApi, mockBlockchainApi }
