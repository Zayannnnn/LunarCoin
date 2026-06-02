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
  const [isDetecting, setIsDetecting] = useState(true)

  const isDashboard = pathname?.startsWith('/dashboard') ?? false

  useEffect(() => {
    if (typeof window === 'undefined') return

    const detectLocalMiner = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200)

      try {
        const response = await fetch('http://127.0.0.1:5000/status', {
          method: 'GET',
          mode: 'cors',
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (response.ok) {
          console.log('[LOCAL-FIRST] Local miner connected successfully at http://127.0.0.1:5000')
          ;(window as any).__lunarActiveBaseUrl = 'http://127.0.0.1:5000'
        } else {
          throw new Error('Non-ok response from local node')
        }
      } catch (e) {
        clearTimeout(timeoutId)
        console.warn('[LOCAL-FIRST] Local miner not reachable or CORS blocked, falling back to public Render backend')
        ;(window as any).__lunarActiveBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'https://lunar-backend-1mzo.onrender.com').replace(/\/$/, '')
      } finally {
        setIsDetecting(false)
      }
    }

    detectLocalMiner()
  }, [])

  useEffect(() => {
    if (isDetecting || !isDashboard) {
      blockchainWebSocket.disconnect()
      return
    }

    blockchainWebSocket.connect()
    const unsub = blockchainWebSocket.onStatusChange(setWsStatus)
    return () => {
      unsub()
      blockchainWebSocket.disconnect()
    }
  }, [isDashboard, isDetecting])

  const value = useMemo(
    () => ({
      wsStatus,
      subscribe: blockchainWebSocket.subscribe.bind(blockchainWebSocket),
    }),
    [wsStatus]
  )

  if (isDetecting) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030712] text-white overflow-hidden font-sans">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6 p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl max-w-sm w-full mx-4 text-center">
          {/* Glowing Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-[3px] border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent animate-spin duration-1000" />
            <div className="absolute inset-2 rounded-full border-[3px] border-b-indigo-500 border-l-indigo-500 border-t-transparent border-r-transparent animate-spin duration-[1500ms] reverse" style={{ animationDirection: 'reverse' }} />
            <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-[10px] font-bold tracking-widest text-white">L</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold tracking-tight text-white/90">LunarCoin Web Bridge</h3>
            <p className="text-xs text-white/40 tracking-wider font-mono">detecting local-first blockchain node...</p>
          </div>

          {/* Micro-loader bar */}
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 animate-pulse rounded-full w-4/5 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

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
