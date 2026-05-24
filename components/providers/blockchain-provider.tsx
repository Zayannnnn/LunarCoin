'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePathname } from 'next/navigation'
import { blockchainWebSocket } from '@/lib/websocket/websocket-service'
import type { WsConnectionStatus, WsSubscribeEvent, WsEventHandler } from '@/lib/websocket/types'

interface BlockchainContextValue {
  wsStatus: WsConnectionStatus
  subscribe: <T>(event: WsSubscribeEvent, handler: WsEventHandler<T>) => () => void
}

const BlockchainContext = createContext<BlockchainContextValue | undefined>(undefined)

export function BlockchainProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [wsStatus, setWsStatus] = useState<WsConnectionStatus>('disconnected')

  const isDashboard = pathname?.startsWith('/dashboard') ?? false

  useEffect(() => {
    if (!isDashboard) {
      blockchainWebSocket.disconnect()
      return
    }

    blockchainWebSocket.connect()
    const unsub = blockchainWebSocket.onStatusChange(setWsStatus)
    return () => {
      unsub()
      blockchainWebSocket.disconnect()
    }
  }, [isDashboard])

  const value = useMemo(
    () => ({
      wsStatus,
      subscribe: blockchainWebSocket.subscribe.bind(blockchainWebSocket),
    }),
    [wsStatus]
  )

  return (
    <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>
  )
}

export function useBlockchainRealtime() {
  const ctx = useContext(BlockchainContext)
  if (!ctx) {
    throw new Error('useBlockchainRealtime must be used within BlockchainProvider')
  }
  return ctx
}
