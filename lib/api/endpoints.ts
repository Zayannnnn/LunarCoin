/**
 * REST API route definitions for the Lunar Python blockchain backend.
 * Base URL: NEXT_PUBLIC_API_URL (default http://127.0.0.1:5000)
 */

import { env } from '@/lib/config/env'

const API_PREFIX = env.api.baseUrl

export const endpoints = {
  health: `${API_PREFIX}/status`,
  status: `${API_PREFIX}/status`,
  networkStats: `${API_PREFIX}/status`,
  wallet: `${API_PREFIX}/wallet`,
  blocks: `${API_PREFIX}/blocks`,
  block: (hashOrHeight: string | number) => `${API_PREFIX}/blocks/${hashOrHeight}`,
  transactions: `${API_PREFIX}/transactions`,
  transaction: (hash: string) => `${API_PREFIX}/transactions/${encodeURIComponent(hash)}`,
  address: (address: string) => `${API_PREFIX}/addresses/${encodeURIComponent(address)}`,
  addressTransactions: (address: string) =>
    `${API_PREFIX}/addresses/${encodeURIComponent(address)}/transactions`,
  mempool: `${API_PREFIX}/mempool`,
  sendTransaction: `${API_PREFIX}/send-transaction`,
  receiveTransaction: `${API_PREFIX}/receive-transaction`,
  feeEstimates: `${API_PREFIX}/fees`,
  feeHistory: `${API_PREFIX}/fees/history`,
  miningStats: `${API_PREFIX}/mining-stats`,
  liveMiningStats: `${API_PREFIX}/live-mining-stats`,
  miningLogs: `${API_PREFIX}/mining-logs`,
  walletHistory: `${API_PREFIX}/wallet-history`,
  walletAddress: `${API_PREFIX}/wallet-address`,
  startMining: `${API_PREFIX}/start-mining`,
  stopMining: `${API_PREFIX}/stop-mining`,
  miningMiners: `${API_PREFIX}/mining/miners`,
  peers: `${API_PREFIX}/peers`,
  connectPeer: `${API_PREFIX}/connect-peer`,
  chartHashRate: `${API_PREFIX}/charts/hashrate`,
  chartDifficulty: `${API_PREFIX}/charts/difficulty`,
  chartTps: `${API_PREFIX}/charts/tps`,
} as const
