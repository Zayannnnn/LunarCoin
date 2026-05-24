'use client'

import { useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { Peer, NetworkStats } from '@/lib/types/blockchain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Wifi, Globe, Clock, Activity, Server, Zap } from 'lucide-react'

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB'
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB'
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB'
  return bytes + ' B'
}

function formatDuration(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

function getLatencyColor(latency: number): string {
  if (latency < 50) return 'text-success'
  if (latency < 150) return 'text-warning'
  return 'text-destructive'
}

function getLatencyBadge(latency: number): { label: string; className: string } {
  if (latency < 50) return { label: 'Excellent', className: 'bg-success/10 text-success border-success/30' }
  if (latency < 150) return { label: 'Good', className: 'bg-warning/10 text-warning border-warning/30' }
  return { label: 'Poor', className: 'bg-destructive/10 text-destructive border-destructive/30' }
}

export default function NetworkPage() {
  const [stats, setStats] = useState<NetworkStats | null>(null)
  const [peers, setPeers] = useState<Peer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [statsData, peersData] = await Promise.all([
        blockchainApi.getNetworkStats(),
        blockchainApi.getPeers(30),
      ])
      setStats(statsData)
      setPeers(peersData)
      setLoading(false)
    }
    
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  // Calculate peer stats
  const avgLatency = peers.length > 0 
    ? Math.round(peers.reduce((sum, p) => sum + p.latency, 0) / peers.length)
    : 0
  
  const versionDistribution = peers.reduce((acc, peer) => {
    acc[peer.version] = (acc[peer.version] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const countryDistribution = peers.reduce((acc, peer) => {
    const country = peer.country || 'Unknown'
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCountries = Object.entries(countryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Network Health</h1>
          <p className="text-muted-foreground mt-1">Peer connections and network status</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <Skeleton className="h-[500px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Network Health</h1>
        <p className="text-muted-foreground mt-1">
          Peer connections and network status
        </p>
      </div>

      {/* Network Status Banner */}
      <Card className="bg-success/5 border-success/20">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="h-3 w-3 rounded-full bg-success pulse-live" />
          <div>
            <p className="font-medium text-foreground">Network Status: Healthy</p>
            <p className="text-sm text-muted-foreground">
              All systems operational. {stats?.connectedPeers.toLocaleString()} peers connected globally.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Connected Peers
              </CardTitle>
              <Wifi className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.connectedPeers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active connections</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Latency
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={cn('text-2xl font-bold', getLatencyColor(avgLatency))}>
                {avgLatency}ms
              </div>
              <p className="text-xs text-muted-foreground">Network response time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hash Rate
              </CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hashRate}</div>
              <p className="text-xs text-muted-foreground">Network power</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chain Height
              </CardTitle>
              <Server className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{stats.chainHeight.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Current block</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Version Distribution */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              Node Versions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(versionDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([version, count]) => {
                const percentage = ((count / peers.length) * 100).toFixed(1)
                return (
                  <div key={version} className="flex items-center justify-between">
                    <span className="text-sm font-mono">{version}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Top Regions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCountries.map(([country, count]) => {
              const percentage = ((count / peers.length) * 100).toFixed(1)
              return (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-sm">{country}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Latency Distribution */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Latency Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { range: '< 50ms', count: peers.filter(p => p.latency < 50).length, color: 'bg-success' },
              { range: '50-150ms', count: peers.filter(p => p.latency >= 50 && p.latency < 150).length, color: 'bg-warning' },
              { range: '150-300ms', count: peers.filter(p => p.latency >= 150 && p.latency < 300).length, color: 'bg-orange-500' },
              { range: '> 300ms', count: peers.filter(p => p.latency >= 300).length, color: 'bg-destructive' },
            ].map(({ range, count, color }) => {
              const percentage = peers.length > 0 ? ((count / peers.length) * 100).toFixed(1) : '0'
              return (
                <div key={range} className="flex items-center justify-between">
                  <span className="text-sm">{range}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn('h-full rounded-full', color)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Peers Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Connected Peers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Peer ID</TableHead>
                  <TableHead className="text-muted-foreground">IP Address</TableHead>
                  <TableHead className="text-muted-foreground">Version</TableHead>
                  <TableHead className="text-muted-foreground">Latency</TableHead>
                  <TableHead className="text-muted-foreground">Connected</TableHead>
                  <TableHead className="text-muted-foreground">Data In</TableHead>
                  <TableHead className="text-muted-foreground">Data Out</TableHead>
                  <TableHead className="text-muted-foreground">Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {peers.slice(0, 20).map((peer) => {
                  const latencyBadge = getLatencyBadge(peer.latency)
                  return (
                    <TableRow key={peer.id} className="border-border/50 hover:bg-accent/50">
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {peer.id}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {peer.ip}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {peer.version}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          'inline-flex items-center px-2 py-1 rounded text-xs font-medium border',
                          latencyBadge.className
                        )}>
                          {peer.latency}ms
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDuration(peer.connectionTime)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatBytes(peer.bytesReceived)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatBytes(peer.bytesSent)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {peer.country || '-'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
