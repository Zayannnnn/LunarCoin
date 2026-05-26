'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { MiningStats } from '@/lib/types/blockchain'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, Award, Coins, Gauge, Hash, Pickaxe, Play, RotateCw, Square, Zap } from 'lucide-react'

function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toLocaleString()
}

function truncateHash(hash: string): string {
  if (!hash) return '-'
  if (hash.length <= 24) return hash
  return `${hash.slice(0, 14)}...${hash.slice(-10)}`
}

export default function MiningPage() {
  const [stats, setStats] = useState<MiningStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [offline, setOffline] = useState(false)

  const miningActive = useMemo(() => {
    const status = stats?.miningStatus.toLowerCase() ?? ''
    return status === 'true' || status.includes('mining') || status.includes('active') || status.includes('running')
  }, [stats])

  const fetchMiningStats = useCallback(async () => {
    try {
      const data = await blockchainApi.getMiningStats()
      setStats(data || null)
      setOffline(false)
    } catch (err) {
      console.error('Failed to fetch mining data:', err)
      setStats(null)
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMiningStats()
    const interval = setInterval(fetchMiningStats, 2000)
    return () => clearInterval(interval)
  }, [fetchMiningStats])

  const handleMiningToggle = async () => {
    try {
      setActionLoading(true)
      if (miningActive) {
        await blockchainApi.stopMining()
      } else {
        await blockchainApi.startMining()
      }
      await fetchMiningStats()
    } catch (err) {
      console.error('Failed to update mining status:', err)
      setOffline(true)
    } finally {
      setActionLoading(false)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mining Statistics</h1>
          <p className="text-muted-foreground mt-1">
            Real-time local LunarMiner data
          </p>
        </div>
        <Button
          onClick={handleMiningToggle}
          disabled={actionLoading}
          className={miningActive ? 'glow-primary bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'glow-primary'}
        >
          {actionLoading ? (
            <RotateCw className="h-4 w-4 mr-2 animate-spin" />
          ) : miningActive ? (
            <Square className="h-4 w-4 mr-2" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {miningActive ? 'Stop Mining' : 'Start Mining'}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      ) : offline ? (
        <Card className="bg-card/50 border-border/50 card-glow">
          <CardContent className="py-12 text-center">
            <Pickaxe className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Miner Offline</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Start the local backend at http://127.0.0.1:5000 and retry.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className={`bg-card/50 border-border/50 overflow-hidden ${miningActive ? 'card-glow pulse-live' : ''}`}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-primary/10 border border-primary/20 ${miningActive ? 'glow-primary' : ''}`}>
                    <Pickaxe className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mining Status</p>
                    <h2 className="text-2xl font-bold capitalize">{stats?.miningStatus || 'stopped'}</h2>
                  </div>
                </div>
                <div className="font-mono text-xs text-muted-foreground break-all sm:text-right">
                  {truncateHash(stats?.currentHash ?? '')}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Hashrate</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.networkHashRate ?? '0 H/s'}</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Nonce</CardTitle>
                <Hash className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums">{formatNumber(stats?.nonce ?? 0)}</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Difficulty</CardTitle>
                <Gauge className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats?.currentDifficulty ?? 0)}</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Mined Blocks</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats?.totalMinedBlocks ?? 0)}</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
                <Coins className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats?.balance ?? 0).toFixed(4)}</div>
                <p className="text-xs text-muted-foreground">LUNAR</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Block Reward</CardTitle>
                <Award className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats?.blockReward ?? 0).toFixed(4)}</div>
                <p className="text-xs text-muted-foreground">LUNAR</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
