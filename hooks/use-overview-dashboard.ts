'use client'

import { useCallback, useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import { ApiError, toApiError } from '@/lib/api/errors'
import { blockchainWebSocket } from '@/lib/websocket/websocket-service'
import {
  mapBlock,
  mapTransaction,
  mapNetworkStats,
  mapMempool,
} from '@/lib/api/mappers'
import type {
  NetworkStats,
  Block,
  Transaction,
  FeeChartData,
  MempoolData,
  MiningStats,
  Peer,
  ChartDataPoint,
} from '@/lib/types/blockchain'
import type {
  BackendBlock,
  BackendTransaction,
  BackendNetworkStats,
  BackendMempool,
} from '@/lib/api/types/backend'
import type { WsConnectionStatus } from '@/lib/websocket/types'

export interface OverviewDashboardData {
  stats: NetworkStats
  blocks: Block[]
  transactions: Transaction[]
  feeHistory: FeeChartData[]
  tpsHistory: ChartDataPoint[]
  mempool: MempoolData
  mining: MiningStats
  peers: Peer[]
}

export function useOverviewDashboard() {
  const [data, setData] = useState<OverviewDashboardData | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [wsStatus, setWsStatus] = useState<WsConnectionStatus>('disconnected')

  const fetchAll = useCallback(async () => {
    try {
      const [
        stats,
        blocksData,
        txData,
        feeHistory,
        tpsHistory,
        mempool,
        mining,
        peers,
      ] = await Promise.all([
        blockchainApi.getNetworkStats(),
        blockchainApi.getBlocks(1, 6),
        blockchainApi.getTransactions(1, 8),
        blockchainApi.getFeeHistory(24),
        blockchainApi.getTpsHistory(24),
        blockchainApi.getMempool(),
        blockchainApi.getMiningStats(),
        blockchainApi.getPeers(8),
      ])

      setData({
        stats,
        blocks: blocksData.blocks,
        transactions: txData.transactions,
        feeHistory,
        tpsHistory,
        mempool,
        mining,
        peers,
      })
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      setError(toApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 15000)
    return () => clearInterval(interval)
  }, [fetchAll])

  // WebSocket real-time patches (connection managed by BlockchainProvider)
  useEffect(() => {
    const unsubStatus = blockchainWebSocket.onStatusChange(setWsStatus)

    const unsubStats = blockchainWebSocket.subscribe('network_stats', (payload) => {
      const raw = payload as { stats?: BackendNetworkStats } & BackendNetworkStats
      const statsRaw = raw.stats ?? raw
      setData((prev) =>
        prev ? { ...prev, stats: mapNetworkStats(statsRaw) } : prev
      )
      setLastUpdated(new Date())
    })

    const unsubBlock = blockchainWebSocket.subscribe('new_block', (payload) => {
      const raw = payload as { block?: BackendBlock } & BackendBlock
      const blockRaw = raw.block ?? raw
      const block = mapBlock(blockRaw)
      setData((prev) => {
        if (!prev) return prev
        const blocks = [block, ...prev.blocks.filter((b) => b.height !== block.height)].slice(0, 6)
        return { ...prev, blocks }
      })
      setLastUpdated(new Date())
    })

    const unsubTx = blockchainWebSocket.subscribe('new_transaction', (payload) => {
      const raw = payload as { transaction?: BackendTransaction } & BackendTransaction
      const txRaw = raw.transaction ?? raw
      const tx = mapTransaction(txRaw)
      setData((prev) => {
        if (!prev) return prev
        const transactions = [tx, ...prev.transactions.filter((t) => t.hash !== tx.hash)].slice(0, 8)
        return { ...prev, transactions }
      })
      setLastUpdated(new Date())
    })

    const unsubMempool = blockchainWebSocket.subscribe('mempool_update', (payload) => {
      const raw = payload as { mempool?: BackendMempool } & BackendMempool
      const mempoolRaw = raw.mempool ?? raw
      setData((prev) =>
        prev ? { ...prev, mempool: mapMempool(mempoolRaw) } : prev
      )
      setLastUpdated(new Date())
    })

    return () => {
      unsubStatus()
      unsubStats()
      unsubBlock()
      unsubTx()
      unsubMempool()
    }
  }, [])

  return {
    data,
    error,
    loading,
    lastUpdated,
    wsStatus,
    refetch: fetchAll,
  }
}
