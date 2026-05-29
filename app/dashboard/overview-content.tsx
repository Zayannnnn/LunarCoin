'use client'

import Link from 'next/link'
import {
  Blocks,
  Layers,
  Wifi,
  TrendingUp,
  Clock,
  Zap,
  Database,
  ArrowRight,
  Activity,
  Pickaxe,
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ChartCard } from '@/components/dashboard/chart-card'
import { BlockCard } from '@/components/dashboard/block-card'
import { TransactionRow } from '@/components/dashboard/transaction-row'
import { MempoolPanel } from '@/components/dashboard/mempool-panel'
import { MiningPanel } from '@/components/dashboard/mining-panel'
import { PeersPanel } from '@/components/dashboard/peers-panel'
import { TransactionsTable } from '@/components/dashboard/transactions-table'
import { SearchHero } from '@/components/dashboard/search-hero'
import { LiveBadge } from '@/components/dashboard/live-badge'
import { OverviewSkeleton } from '@/components/dashboard/overview-skeleton'
import { ApiErrorBanner } from '@/components/dashboard/api-error-banner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOverviewDashboard } from '@/hooks/use-overview-dashboard'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts'
import {
  CHART_COLORS,
  chartAnimation,
  tooltipStyle,
  axisProps,
} from '@/components/dashboard/chart-theme'
import { cn } from '@/lib/utils'

function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toLocaleString()
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function OverviewContent() {
  const { data, error, loading, lastUpdated, wsStatus, refetch } = useOverviewDashboard()

  if (loading && !data) {
    return <OverviewSkeleton />
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <ApiErrorBanner error={error} onRetry={refetch} />
        <OverviewSkeleton />
      </div>
    )
  }

  const {
    stats,
    blocks = [],
    transactions = [],
    feeHistory = [],
    tpsHistory = [],
    mempool = null,
    mining = null,
    peers = [],
  } = data

  const feeChartData = (feeHistory || []).map((d) => ({
    time: formatTime(d.timestamp),
    low: d.low * 1000000,
    medium: d.medium * 1000000,
    high: d.high * 1000000,
  }))

  const tpsChartData = (tpsHistory || []).map((d) => ({
    time: formatTime(d.timestamp),
    tps: d.value,
  }))

  return (
    <div className="space-y-6 md:space-y-8 font-mono select-none">
      <ApiErrorBanner error={error} onRetry={refetch} />

      <div className="animate-slide-up">
        <SearchHero />
      </div>

      {/* Central Engineering HUD focusing on CPU Mining */}
      <Card className="bg-card/35 border border-border/30 overflow-hidden font-mono text-xs card-glow">
        <div className="bg-black/25 border-b border-border/20 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Pickaxe className="h-4.5 w-4.5 text-primary animate-pulse" />
            <span className="font-bold text-sm tracking-wider uppercase">Local CPU Mining Node Status</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "h-2 w-2 rounded-full",
              mining?.mining ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-muted-foreground animate-pulse"
            )} />
            <span className={cn(
              "font-bold uppercase text-[10px] tracking-widest",
              mining?.mining ? "text-emerald-400" : "text-muted-foreground"
            )}>
              {mining?.mining ? "Active Mining Thread" : "Node Standby"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border/20">
          <div className="p-5 flex flex-col justify-between h-[100px] hover:bg-white/[0.01] transition-colors">
            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Node Hash Rate</span>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {mining?.mining ? `${(mining.hashrate).toFixed(2)} H/s` : "0.00 H/s"}
            </div>
            <span className="text-[9px] text-muted-foreground/60 uppercase">Real CPU hashes per second</span>
          </div>

          <div className="p-5 flex flex-col justify-between h-[100px] hover:bg-white/[0.01] transition-colors">
            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Consensus Difficulty</span>
            <div className="text-xl font-bold font-mono text-amber-400 tracking-widest">
              {stats.difficulty ? "0".repeat(stats.difficulty) : "0000"}
            </div>
            <span className="text-[9px] text-muted-foreground/60 uppercase">Leading zero mask target</span>
          </div>

          <div className="p-5 flex flex-col justify-between h-[100px] hover:bg-white/[0.01] transition-colors">
            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Mined This Session</span>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {mining?.blocks_mined || 0} Blocks
            </div>
            <span className="text-[9px] text-muted-foreground/60 uppercase">Reward weight locks committed</span>
          </div>

          <div className="p-5 flex flex-col justify-between h-[100px] hover:bg-white/[0.01] transition-colors">
            <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Ledger Tip Height</span>
            <div className="text-xl font-bold font-mono text-foreground">
              #{stats.chainHeight.toLocaleString()}
            </div>
            <span className="text-[9px] text-muted-foreground/60 uppercase">Total confirmed blocks</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Network TPS"
          value={stats.tps.toFixed(1)}
          subtitle="Transactions per second"
          icon={Activity}
          compact
          delay={100}
        />
        <StatsCard
          title="Connected Peers"
          value={formatNumber(stats.connectedPeers)}
          subtitle={`${peers.length} visible nodes`}
          icon={Wifi}
          compact
          delay={200}
        />
        <StatsCard
          title="Block Time"
          value={`${stats.avgBlockTime.toFixed(1)}s`}
          subtitle="Target: 15s"
          icon={Clock}
          compact
          delay={250}
        />
        <StatsCard
          title="Mempool"
          value={formatNumber(stats.mempoolTransactions)}
          subtitle={`${(stats.mempoolSize / 1e6).toFixed(1)} MB`}
          icon={Layers}
          compact
          delay={300}
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Network TPS" description="Live transaction throughput (24h)" live delay={450}>
          <div className="h-[260px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tpsChartData}>
                <defs>
                  <linearGradient id="tpsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => `${v}`} />
                <Tooltip {...tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="tps"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  fill="url(#tpsGradient)"
                  name="TPS"
                  {...chartAnimation}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Gas Fees" description="Fee tiers over 24 hours (μLUNAR)" live delay={500}>
          <div className="h-[260px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => v.toFixed(0)} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="low" stroke={CHART_COLORS.success} strokeWidth={2} dot={false} name="Low" {...chartAnimation} />
                <Line type="monotone" dataKey="medium" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} name="Medium" {...chartAnimation} />
                <Line type="monotone" dataKey="high" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={false} name="High" {...chartAnimation} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '550ms' }}>
        <MempoolPanel data={mempool} />
        <MiningPanel stats={mining} />
        <PeersPanel peers={peers} connectedCount={stats.connectedPeers} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">Recent Blocks</h2>
              <LiveBadge label={wsStatus === 'connected' ? 'Live' : 'Syncing'} />
            </div>
            <Button variant="ghost" size="sm" asChild className="text-primary shrink-0">
              <Link href="/dashboard/blocks">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {blocks.map((block, i) => (
              <div key={block.height} className="animate-slide-up" style={{ animationDelay: `${650 + i * 50}ms` }}>
                <BlockCard block={block} />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 animate-slide-up" style={{ animationDelay: '650ms' }}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Recent Transactions</h2>
            <Button variant="ghost" size="sm" asChild className="text-primary shrink-0">
              <Link href="/dashboard/transactions">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="hidden md:block">
            <TransactionsTable transactions={transactions || []} />
          </div>
          <div className="md:hidden space-y-3">
            {(transactions || []).slice(0, 6).map((tx) => (
              <TransactionRow key={tx.hash} transaction={tx} />
            ))}
          </div>
        </section>
      </div>

      {lastUpdated && (
        <p className="text-center text-[10px] text-muted-foreground/60 pb-2">
          Last updated {lastUpdated.toLocaleTimeString()}
          {wsStatus === 'connected' ? ' · WebSocket connected' : ' · Polling every 15s'}
        </p>
      )}
    </div>
  )
}
