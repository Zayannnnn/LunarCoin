'use client'

import { useEffect, useState } from 'react'

export function MinerStatusBadge() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'offline'>('checking')

  useEffect(() => {
    let active = true

    const checkStatus = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      try {
        const res = await fetch('http://127.0.0.1:5000/status', {
          signal: controller.signal,
          cache: 'no-store'
        })
        clearTimeout(timeoutId)
        if (res.ok && active) {
          setStatus('connected')
        } else if (active) {
          setStatus('offline')
        }
      } catch {
        clearTimeout(timeoutId)
        if (active) {
          setStatus('offline')
        }
      }
    }

    checkStatus()
    // Poll every 5 seconds to keep node status updated
    const interval = setInterval(checkStatus, 5000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/10 border border-muted/20">
        <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />
        <span className="text-xs text-muted-foreground font-medium">Checking Miner...</span>
      </div>
    )
  }

  if (status === 'connected') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
        <div className="h-2 w-2 rounded-full bg-success pulse-live" />
        <span className="text-xs text-success font-medium">Local Miner Connected</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
      <div className="h-2 w-2 rounded-full bg-destructive" />
      <span className="text-xs text-destructive font-medium">Desktop Miner Offline</span>
    </div>
  )
}
