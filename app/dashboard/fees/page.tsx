'use client'

import { useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { FeeEstimate, FeeChartData } from '@/lib/types/blockchain'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartCard } from '@/components/dashboard/chart-card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { TrendingUp, Zap, Clock, AlertTriangle } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts'

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`
  if (seconds < 3600) return `~${Math.floor(seconds / 60)}m`
  return `~${Math.floor(seconds / 3600)}h`
}

const priorityConfig = {
  low: {
    label: 'Low Priority',
    description: 'Economical, slower confirmation',
    icon: Clock,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
  },
  medium: {
    label: 'Medium Priority',
    description: 'Balanced speed and cost',
    icon: TrendingUp,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
  },
  high: {
    label: 'High Priority',
    description: 'Fast confirmation, higher fee',
    icon: Zap,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
  },
}

export default function FeesPage() {
  const [estimates, setEstimates] = useState<FeeEstimate[]>([])
  const [feeHistory, setFeeHistory] = useState<FeeChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [estimatesData, historyData] = await Promise.all([
        blockchainApi.getFeeEstimates(),
        blockchainApi.getFeeHistory(48),
      ])
      setEstimates(estimatesData)
      setFeeHistory(historyData)
      setLoading(false)
    }
    
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const chartData = feeHistory.map(d => ({
    time: formatTime(d.timestamp),
    low: d.low * 1e6,
    medium: d.medium * 1e6,
    high: d.high * 1e6,
  }))

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fee Analytics</h1>
          <p className="text-muted-foreground mt-1">Gas fee estimates and historical data</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[160px]" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fee Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Gas fee estimates and historical data
        </p>
      </div>

      {/* Fee Estimates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {estimates.map((estimate) => {
          const config = priorityConfig[estimate.priority]
          const Icon = config.icon
          
          return (
            <Card 
              key={estimate.priority} 
              className={cn(
                'bg-card/50 border-2 transition-all duration-200 hover:scale-[1.02]',
                config.borderColor
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={cn('p-2 rounded-lg', config.bgColor)}>
                    <Icon className={cn('h-5 w-5', config.color)} />
                  </div>
                  <span className={cn('text-xs font-medium px-2 py-1 rounded', config.bgColor, config.color)}>
                    {formatDuration(estimate.estimatedTime)}
                  </span>
                </div>
                <CardTitle className="text-lg mt-3">{config.label}</CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{(estimate.fee * 1e6).toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">μLUNAR</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ {estimate.fee.toFixed(6)} LUNAR per transaction
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Info Card */}
      <Card className="bg-info/5 border-info/20">
        <CardContent className="flex items-start gap-3 py-4">
          <AlertTriangle className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Understanding Gas Fees</p>
            <p className="text-sm text-muted-foreground mt-1">
              Gas fees fluctuate based on network demand. Higher fees result in faster confirmation 
              times as miners prioritize transactions with better rewards. During periods of high 
              network activity, fees may increase significantly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fee History Chart */}
      <ChartCard 
        title="Fee History (48 Hours)" 
        description="Historical gas prices across priority levels (μLUNAR)"
      >
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.8 0.18 85)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.8 0.18 85)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="oklch(0.5 0.01 265)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="oklch(0.5 0.01 265)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toFixed(0)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.14 0.015 265)',
                  border: '1px solid oklch(0.25 0.02 265)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'oklch(0.65 0.01 265)' }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground capitalize">{value} Priority</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="low"
                stroke="oklch(0.72 0.19 155)"
                strokeWidth={2}
                fill="url(#lowGradient)"
                name="low"
              />
              <Area
                type="monotone"
                dataKey="medium"
                stroke="oklch(0.75 0.15 195)"
                strokeWidth={2}
                fill="url(#mediumGradient)"
                name="medium"
              />
              <Area
                type="monotone"
                dataKey="high"
                stroke="oklch(0.8 0.18 85)"
                strokeWidth={2}
                fill="url(#highGradient)"
                name="high"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  )
}
