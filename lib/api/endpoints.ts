/**
 * REST API route definitions for the Lunar Python blockchain backend.
 * Base URL: NEXT_PUBLIC_API_URL (default https://lunar-backend-1mzo.onrender.com)
 */

import { env } from '@/lib/config/env'

const API_PREFIX = env.api.baseUrl

export const endpoints = {
  health: `${API_PREFIX}/health`,
  networkStats: `${API_PREFIX}/network/stats`,
  blocks: `${API_PREFIX}/blocks`,
  block: (hashOrHeight: string | number) => `${API_PREFIX}/blocks/${hashOrHeight}`,
  transactions: `${API_PREFIX}/transactions`,
  transaction: (hash: string) => `${API_PREFIX}/transactions/${encodeURIComponent(hash)}`,
  address: (address: string) => `${API_PREFIX}/addresses/${encodeURIComponent(address)}`,
  addressTransactions: (address: string) =>
    `${API_PREFIX}/addresses/${encodeURIComponent(address)}/transactions`,
  mempool: `${API_PREFIX}/mempool`,
  feeEstimates: `${API_PREFIX}/fees`,
  feeHistory: `${API_PREFIX}/fees/history`,
  miningStats: `${API_PREFIX}/mining/stats`,
  miningMiners: `${API_PREFIX}/mining/miners`,
  peers: `${API_PREFIX}/network/peers`,
  chartHashRate: `${API_PREFIX}/charts/hashrate`,
  chartDifficulty: `${API_PREFIX}/charts/difficulty`,
  chartTps: `${API_PREFIX}/charts/tps`,
} as const
