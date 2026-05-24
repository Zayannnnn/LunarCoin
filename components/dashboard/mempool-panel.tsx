'use client'

import Link from 'next/link'
import { Layers, Database, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import type { MempoolData } from '@/lib/types/blockchain'
import { GlassCard } from '@/components/dashboard/glass-card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface MempoolPanelProps {
  data: MempoolData
  className?: string
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB'
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(1) + ' KB'
  return bytes + ' B'
}

export function MempoolPanel({ data, className }: MempoolPanelProps) {
  const totalFees = data.feeDistribution.reduce((sum, d) => sum + d.count, 0)
  const maxCount = Math.max(...data.feeDistribution.map((d) => d.count), 1)

  return (
    <GlassCard
      title="Mempool"
      description="Pending transaction pool"
      className={className}
      headerAction={
        <Button variant="ghost" size="sm" asChild className="text-primary h-8">
          <Link href="/dashboard/mempool">
            Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <Layers className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-lg font-bold tabular-nums">{data.transactions.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending txns</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <Database className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-lg font-bold tabular-nums">{formatBytes(data.size)}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pool size</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Fee distribution
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> ~{Math.round(totalFees / 120)}s avg wait
            </span>
          </div>
          {data.feeDistribution.map((tier, i) => (
            <div key={tier.range} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{tier.range}</span>
                <span className="font-mono tabular-nums">{tier.count}</span>
              </div>
              <Progress
                value={(tier.count / maxCount) * 100}
                className={cn('h-1.5', i === 0 && '[&>div]:bg-success')}
              />
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
