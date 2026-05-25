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
    <div className="space-y-6 md:space-y-8">
      <ApiErrorBanner error={error} onRetry={refetch} />

      <div className="animate-slide-up">
        <SearchHero />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Chain Height"
          value={`#${stats.chainHeight.toLocaleString()}`}
          subtitle="Latest confirmed block"
          icon={Blocks}
          pulse
          delay={50}
        />
        <StatsCard
          title="Network TPS"
          value={stats.tps.toFixed(1)}
          subtitle="Transactions per second"
          icon={Activity}
          delay={100}
        />
        <StatsCard
          title="Hash Rate"
          value={stats.hashRate}
          subtitle="Total network power"
          icon={Zap}
          delay={150}
        />
        <StatsCard
          title="Connected Peers"
          value={formatNumber(stats.connectedPeers)}
          subtitle={`${peers.length} visible nodes`}
          icon={Wifi}
          delay={200}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
        <StatsCard
          title="Supply"
          value={formatNumber(stats.circulatingSupply)}
          subtitle={`of ${formatNumber(stats.totalSupply)}`}
          icon={Database}
          compact
          delay={350}
        />
        <StatsCard
          title="Avg Fee"
          value={`${(stats.avgFee * 1e6).toFixed(2)} μLUNAR`}
          subtitle="Per transaction"
          icon={TrendingUp}
          compact
          delay={400}
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
