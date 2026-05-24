/**
 * Production blockchain API service — connects to the Python backend.
 */

import { env } from '@/lib/config/env'
import { apiGet } from '@/lib/api/http-client'
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

export type TransactionFilter = 'all' | 'pending' | 'confirmed' | 'failed'

export interface BlockchainApi {
  getNetworkStats(): Promise<NetworkStats>
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
  getTopMiners(limit?: number): Promise<MinerInfo[]>
  getPeers(limit?: number): Promise<Peer[]>
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

  async getBlocks(page = 1, limit = 10) {
    const raw = await apiGet<PaginatedResponse<BackendBlock> | BackendBlock[]>(
      endpoints.blocks,
      { params: { page, limit } }
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
    const raw = await apiGet<BackendMiningStats>(endpoints.miningStats)
    return mapMiningStats(raw)
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
