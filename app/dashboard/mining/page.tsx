'use client'

import { useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { MiningStats, MinerInfo, ChartDataPoint } from '@/lib/types/blockchain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartCard } from '@/components/dashboard/chart-card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Pickaxe, Zap, Clock, Award, TrendingUp, Users } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 8)}...${address.slice(-6)}`
}

function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toLocaleString()
}

export default function MiningPage() {
  const [stats, setStats] = useState<MiningStats | null>(null)
  const [miners, setMiners] = useState<MinerInfo[]>([])
  const [hashRateHistory, setHashRateHistory] = useState<ChartDataPoint[]>([])
  const [difficultyHistory, setDifficultyHistory] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [statsData, minersData, hashData, diffData] = await Promise.all([
        blockchainApi.getMiningStats(),
        blockchainApi.getTopMiners(10),
        blockchainApi.getHashRateHistory(48),
        blockchainApi.getDifficultyHistory(48),
      ])
      setStats(statsData)
      setMiners(minersData)
      setHashRateHistory(hashData)
      setDifficultyHistory(diffData)
      setLoading(false)
    }
    
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const hashChartData = hashRateHistory.map(d => ({
    time: formatTime(d.timestamp),
    hashRate: d.value,
  }))

  const difficultyChartData = difficultyHistory.map(d => ({
    time: formatTime(d.timestamp),
    difficulty: d.value / 1e12,
  }))

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mining Statistics</h1>
          <p className="text-muted-foreground mt-1">Network mining and hash rate data</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mining Statistics</h1>
        <p className="text-muted-foreground mt-1">
          Network mining and hash rate data
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Network Hash Rate
              </CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.networkHashRate}</div>
              <p className="text-xs text-muted-foreground">Total computing power</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Difficulty
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.currentDifficulty)}</div>
              <p className="text-xs text-muted-foreground">Mining difficulty</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Block Time
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgBlockTime.toFixed(1)}s</div>
              <p className="text-xs text-muted-foreground">Target: 15s</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Blocks (24h)
              </CardTitle>
              <Pickaxe className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.blocksLast24h.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Mined in last 24 hours</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Block Reward
              </CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.blockReward} LUNAR</div>
              <p className="text-xs text-muted-foreground">Per block mined</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Miners
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalMinersActive)}</div>
              <p className="text-xs text-muted-foreground">Currently mining</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Halving Progress */}
      {stats && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Next Halving</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to block #{stats.nextHalvingBlock.toLocaleString()}</span>
              <span className="font-medium">{stats.blocksUntilHalving.toLocaleString()} blocks remaining</span>
            </div>
            <Progress 
              value={((stats.nextHalvingBlock - stats.blocksUntilHalving) / stats.nextHalvingBlock) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              After halving, block reward will reduce to {stats.blockReward / 2} LUNAR
            </p>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Hash Rate (48h)" description="Network computing power over time (EH/s)">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hashChartData}>
                <defs>
                  <linearGradient id="hashGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="oklch(0.5 0.01 265)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="oklch(0.5 0.01 265)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
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
                <Area
                  type="monotone"
                  dataKey="hashRate"
                  stroke="oklch(0.75 0.15 195)"
                  strokeWidth={2}
                  fill="url(#hashGradient)"
                  name="Hash Rate (EH/s)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Difficulty (48h)" description="Mining difficulty over time (T)">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={difficultyChartData}>
                <defs>
                  <linearGradient id="diffGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.18 280)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.65 0.18 280)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="oklch(0.5 0.01 265)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="oklch(0.5 0.01 265)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v.toFixed(0)}T`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.14 0.015 265)',
                    border: '1px solid oklch(0.25 0.02 265)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'oklch(0.65 0.01 265)' }}
                  formatter={(value: number) => [`${value.toFixed(2)}T`, 'Difficulty']}
                />
                <Area
                  type="monotone"
                  dataKey="difficulty"
                  stroke="oklch(0.65 0.18 280)"
                  strokeWidth={2}
                  fill="url(#diffGradient)"
                  name="Difficulty"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Top Miners Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Top Miners</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Rank</TableHead>
                  <TableHead className="text-muted-foreground">Miner Address</TableHead>
                  <TableHead className="text-muted-foreground">Blocks (24h)</TableHead>
                  <TableHead className="text-muted-foreground">Total Blocks</TableHead>
                  <TableHead className="text-muted-foreground">Hash Rate Share</TableHead>
                  <TableHead className="text-muted-foreground">Last Block</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {miners.map((miner, index) => (
                  <TableRow key={miner.address} className="border-border/50 hover:bg-accent/50">
                    <TableCell className="font-semibold">
                      <span className={`px-2 py-1 rounded ${
                        index === 0 ? 'bg-warning/20 text-warning' :
                        index === 1 ? 'bg-muted text-muted-foreground' :
                        index === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'text-muted-foreground'
                      }`}>
                        #{index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {truncateAddress(miner.address)}
                    </TableCell>
                    <TableCell>{miner.blocksMinedLast24h}</TableCell>
                    <TableCell>{miner.totalBlocksMined.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={miner.hashRateShare} className="w-16 h-2" />
                        <span className="text-sm">{miner.hashRateShare}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatTimeAgo(miner.lastBlockMined)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
