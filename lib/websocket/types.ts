import type {
  Block,
  Transaction,
  NetworkStats,
  MempoolData,
} from '@/lib/types/blockchain'

export type WsEventType =
  | 'network_stats'
  | 'new_block'
  | 'new_transaction'
  | 'mempool_update'
  | 'peer_update'
  | 'connected'
  | 'disconnected'
  | 'error'

/** Wildcard — subscribe to all events */
export type WsSubscribeEvent = WsEventType | '*'

export interface WsMessage<T = unknown> {
  event?: WsEventType
  type?: WsEventType
  payload?: T
  data?: T
}

export interface WsNetworkStatsPayload {
  stats: NetworkStats
}

export interface WsBlockPayload {
  block: Block
}

export interface WsTransactionPayload {
  transaction: Transaction
}

export interface WsMempoolPayload {
  mempool: MempoolData
}

export type WsEventHandler<T = unknown> = (payload: T) => void

export type WsConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
