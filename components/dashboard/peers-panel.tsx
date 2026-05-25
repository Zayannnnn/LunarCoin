'use client'

import Link from 'next/link'
import { Wifi, Globe, ArrowRight } from 'lucide-react'
import type { Peer } from '@/lib/types/blockchain'
import { GlassCard } from '@/components/dashboard/glass-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PeersPanelProps {
  peers: Peer[]
  connectedCount: number
  className?: string
}

function getLatencyColor(latency: number): string {
  if (latency < 50) return 'bg-success'
  if (latency < 150) return 'bg-warning'
  return 'bg-destructive'
}

export function PeersPanel({ peers, connectedCount, className }: PeersPanelProps) {
  const list = peers || []
  const topPeers = list.slice(0, 5)
  const avgLatency =
    list.length > 0
      ? Math.round(list.reduce((sum, p) => sum + p.latency, 0) / list.length)
      : 0

  const countries = new Set(list.map((p) => p.country).filter(Boolean))

  return (
    <GlassCard
      title="Connected Peers"
      description="P2P network status"
      className={className}
      headerAction={
        <Button variant="ghost" size="sm" asChild className="text-primary h-8">
          <Link href="/dashboard/network">
            Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-success/5 border border-success/15">
            <p className="text-lg font-bold text-success tabular-nums">{connectedCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Peers</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/5 border border-primary/15">
            <p className="text-lg font-bold tabular-nums">{avgLatency}ms</p>
            <p className="text-[10px] text-muted-foreground uppercase">Avg ping</p>
          </div>
          <div className="p-2 rounded-lg bg-secondary/5 border border-secondary/15">
            <p className="text-lg font-bold tabular-nums">{countries.size}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Regions</p>
          </div>
        </div>

        <div className="space-y-1.5">
          {topPeers.map((peer) => (
            <div
              key={peer.id}
              className="flex items-center justify-between py-2 px-2.5 rounded-lg bg-muted/20 border border-border/30 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Wifi className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-mono truncate">{peer.ip}</span>
                {peer.country && (
                  <span className="hidden sm:inline text-muted-foreground flex items-center gap-0.5 shrink-0">
                    <Globe className="h-3 w-3" />
                    {peer.country}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    getLatencyColor(peer.latency)
                  )}
                />
                <span className="font-mono tabular-nums">{peer.latency}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
