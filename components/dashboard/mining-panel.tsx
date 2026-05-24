'use client'

import Link from 'next/link'
import { Pickaxe, Zap, Award, Users, ArrowRight } from 'lucide-react'
import type { MiningStats } from '@/lib/types/blockchain'
import { GlassCard } from '@/components/dashboard/glass-card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface MiningPanelProps {
  stats: MiningStats
  className?: string
}

export function MiningPanel({ stats, className }: MiningPanelProps) {
  const halvingProgress =
    ((stats.nextHalvingBlock - stats.blocksUntilHalving) / stats.nextHalvingBlock) * 100

  return (
    <GlassCard
      title="Mining Analytics"
      description="Network hashrate & rewards"
      className={className}
      headerAction={
        <Button variant="ghost" size="sm" asChild className="text-primary h-8">
          <Link href="/dashboard/mining">
            Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/15">
          <div className="p-2 rounded-lg bg-primary/15">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight">{stats.networkHashRate}</p>
            <p className="text-xs text-muted-foreground">Network hash rate</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted/30 border border-border/40">
            <p className="text-sm font-bold tabular-nums">{stats.blocksLast24h}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Blocks / 24h</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/30 border border-border/40">
            <p className="text-sm font-bold tabular-nums flex items-center justify-center gap-1">
              <Users className="h-3 w-3 text-primary" />
              {stats.totalMinersActive}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Active miners</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Award className="h-3 w-3" /> Block reward
            </span>
            <span className="font-semibold text-primary">{stats.blockReward} LUNAR</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Pickaxe className="h-3 w-3" /> Next halving
            </span>
            <span className="font-mono text-xs tabular-nums">
              {stats.blocksUntilHalving.toLocaleString()} blocks
            </span>
          </div>
          <Progress value={halvingProgress} className="h-1.5" />
        </div>
      </div>
    </GlassCard>
  )
}
