import { env } from '@/lib/config/env'
import type {
  WsConnectionStatus,
  WsEventHandler,
  WsEventType,
  WsMessage,
  WsSubscribeEvent,
} from '@/lib/websocket/types'

const MAX_RECONNECT_ATTEMPTS = 10
const BASE_RECONNECT_DELAY_MS = 1000
const MAX_RECONNECT_DELAY_MS = 30000

type ListenerMap = Map<WsSubscribeEvent, Set<WsEventHandler>>

function resolveWsUrl(): string {
  const base = env.api.wsUrl.replace(/\/$/, '')
  if (base.endsWith('/ws')) return base
  return `${base}/ws`
}

function parseMessage(raw: MessageEvent): WsMessage | null {
  try {
    const data = JSON.parse(raw.data as string) as WsMessage
    return data
  } catch {
    return null
  }
}

function getEventType(message: WsMessage): WsEventType | null {
  return (message.event ?? message.type ?? null) as WsEventType | null
}

function getPayload<T>(message: WsMessage<T>): T {
  return (message.payload ?? message.data) as T
}

class BlockchainWebSocketService {
  private socket: WebSocket | null = null
  private listeners: ListenerMap = new Map()
  private statusListeners: Set<(status: WsConnectionStatus) => void> = new Set()
  private reconnectAttempts = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private intentionalClose = false
  private status: WsConnectionStatus = 'disconnected'
  private refCount = 0

  get connectionStatus(): WsConnectionStatus {
    return this.status
  }

  connect(): void {
    this.refCount++
    if (this.socket?.readyState === WebSocket.OPEN) return
    if (this.socket?.readyState === WebSocket.CONNECTING) return

    this.intentionalClose = false
    this.openSocket()
  }

  disconnect(): void {
    this.refCount = Math.max(0, this.refCount - 1)
    if (this.refCount > 0) return

    this.intentionalClose = true
    this.clearReconnectTimer()
    this.socket?.close()
    this.socket = null
    this.setStatus('disconnected')
  }

  subscribe<T>(event: WsSubscribeEvent, handler: WsEventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler as WsEventHandler)

    return () => {
      this.listeners.get(event)?.delete(handler as WsEventHandler)
    }
  }

  onStatusChange(listener: (status: WsConnectionStatus) => void): () => void {
    this.statusListeners.add(listener)
    listener(this.status)
    return () => this.statusListeners.delete(listener)
  }

  private setStatus(status: WsConnectionStatus): void {
    this.status = status
    this.statusListeners.forEach((fn) => fn(status))
  }

  private openSocket(): void {
    if (typeof WebSocket === 'undefined') return

    this.setStatus(this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting')

    try {
      this.socket = new WebSocket(resolveWsUrl())
    } catch {
      this.scheduleReconnect()
      return
    }

    this.socket.onopen = () => {
      this.reconnectAttempts = 0
      this.setStatus('connected')
      this.emit('connected', {})
    }

    this.socket.onmessage = (event) => {
      const message = parseMessage(event)
      if (!message) return

      const type = getEventType(message)
      if (!type) return

      const payload = getPayload(message)
      this.emit(type, payload)
      this.listeners.get('*')?.forEach((handler) => handler({ type, payload }))
    }

    this.socket.onerror = () => {
      this.emit('error', { message: 'WebSocket error' })
    }

    this.socket.onclose = () => {
      this.socket = null
      this.emit('disconnected', {})
      if (!this.intentionalClose) {
        this.scheduleReconnect()
      } else {
        this.setStatus('disconnected')
      }
    }
  }

  private scheduleReconnect(): void {
    if (this.intentionalClose) return
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this.setStatus('disconnected')
      return
    }

    const delay = Math.min(
      BASE_RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts),
      MAX_RECONNECT_DELAY_MS
    )
    this.reconnectAttempts++
    this.setStatus('reconnecting')

    this.clearReconnectTimer()
    this.reconnectTimer = setTimeout(() => {
      if (!this.intentionalClose && this.refCount > 0) {
        this.openSocket()
      }
    }, delay)
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private emit(type: WsEventType, payload: unknown): void {
    this.listeners.get(type)?.forEach((handler) => handler(payload))
    this.listeners.get('*')?.forEach((handler) => handler({ type, payload }))
  }
}

export const blockchainWebSocket = new BlockchainWebSocketService()
