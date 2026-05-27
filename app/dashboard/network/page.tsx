'use client'

import { useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { Peer, NetworkStats } from '@/lib/types/blockchain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Wifi, Clock, Activity, Server, Zap } from 'lucide-react'

function formatDuration(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

function formatDateTime(isoString: string): string {
  if (!isoString || isoString === 'N/A') return 'N/A'
  try {
    const d = new Date(isoString)
    const dateStr = d.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    return `${dateStr} ${timeStr}`
  } catch {
    return isoString
  }
}

function getLatencyColor(latency: number): string {
  if (latency < 0) return 'text-muted-foreground'
  if (latency < 50) return 'text-success'
  if (latency < 150) return 'text-warning'
  return 'text-destructive'
}

function getLatencyBadge(latency: number): { label: string; className: string } {
  if (latency < 0) return { label: 'Offline', className: 'bg-muted/10 text-muted-foreground border-border/30' }
  if (latency < 50) return { label: 'Excellent', className: 'bg-success/10 text-success border-success/30' }
  if (latency < 150) return { label: 'Good', className: 'bg-warning/10 text-warning border-warning/30' }
  return { label: 'Poor', className: 'bg-destructive/10 text-destructive border-destructive/30' }
}

export default function NetworkPage() {
  const [stats, setStats] = useState<NetworkStats | null>(null)
  const [peers, setPeers] = useState<Peer[]>([])
  const [nodeInfo, setNodeInfo] = useState<{ node_id: string; chain_length: number } | null>(null)
  const [loading, setLoading] = useState(true)

  // Manual connect form states
  const [connectAddress, setConnectAddress] = useState('')
  const [connectLoading, setConnectLoading] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [connectSuccess, setConnectSuccess] = useState<string | null>(null)

  async function fetchData(showLoading = false) {
    try {
      if (showLoading) setLoading(true)
      const [statsData, peersData] = await Promise.all([
        blockchainApi.getNetworkStats(),
        blockchainApi.getPeers(50),
      ])
      setStats(statsData || null)
      setPeers(peersData || [])

      // Also try fetching node-info directly
      try {
        const res = await fetch('http://127.0.0.1:5000/node-info')
        if (res.ok) {
          const info = await res.json()
          setNodeInfo(info)
        }
      } catch {
        // Silent catch for node-info
      }

    } catch (err) {
      console.error('Failed to fetch network data:', err)
      setStats(null)
      setPeers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(true)
    const interval = setInterval(() => fetchData(false), 8000)
    return () => clearInterval(interval)
  }, [])

  const handleConnectPeer = async (e: React.FormEvent) => {
    e.preventDefault()
    const addr = connectAddress.trim()
    if (!addr) return

    try {
      setConnectLoading(true)
      setConnectError(null)
      setConnectSuccess(null)

      const result = await blockchainApi.connectPeer(addr)
      setConnectSuccess(result?.message || `Successfully linked to peer ${addr}!`)
      setConnectAddress('')
      
      // Instantly reload peers list
      fetchData(false)
      
      // Clear success notification after 5s
      setTimeout(() => setConnectSuccess(null), 5000)
    } catch (err: any) {
      setConnectError(err?.message || `Failed to establish connection link to ${addr}.`)
    } finally {
      setConnectLoading(false)
    }
  }

  // Calculate peer stats
  const list = peers || []
  const onlinePeersList = list.filter(p => (p as any).status === 'online' || p.latency >= 0)
  const avgLatency = onlinePeersList.length > 0 
    ? Math.round(onlinePeersList.reduce((sum, p) => sum + (p?.latency ?? 0), 0) / onlinePeersList.length)
    : 0
  
  const versionDistribution = list.reduce((acc, peer) => {
    const version = peer?.version || '1.0.0'
    acc[version] = (acc[version] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Local LAN Network</h1>
          <p className="text-muted-foreground mt-1">Peer connections and local subnet status</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[240px]" />
          <Skeleton className="h-[240px]" />
          <Skeleton className="h-[240px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Local LAN Network</h1>
          <p className="text-muted-foreground mt-1">
            Manage educational peer connections and ledger synchronizations
          </p>
        </div>
        {nodeInfo && (
          <div className="bg-muted/15 border border-border/10 rounded-lg px-4 py-2 text-xs font-mono select-none">
            <span className="text-muted-foreground mr-1.5 uppercase font-bold text-[10px]">Local ID:</span>
            <span className="text-primary font-bold">{nodeInfo.node_id}</span>
          </div>
        )}
      </div>

      {/* Network Status Banner */}
      <Card className="bg-success/5 border-success/20 card-glow">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="h-3 w-3 rounded-full bg-success animate-pulse shadow-[0_0_8px_#10b981]" />
          <div>
            <p className="font-medium text-foreground">Subnet Cluster: Online & Active</p>
            <p className="text-sm text-muted-foreground leading-normal">
              Dynamics peer-to-peer discoveries active. Broadcasting UDP pings on port 5001.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase font-bold tracking-wider">
                LAN Peers Count
              </CardTitle>
              <Wifi className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onlinePeersList.length.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active LAN Nodes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase font-bold tracking-wider">
                Average Latency
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={cn('text-2xl font-bold', getLatencyColor(avgLatency))}>
                {avgLatency > 0 ? `${avgLatency}ms` : '-'}
              </div>
              <p className="text-xs text-muted-foreground">Network response speed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase font-bold tracking-wider">
                Miners Hash Rate
              </CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hashRate}</div>
              <p className="text-xs text-muted-foreground">Subnet solving power</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase font-bold tracking-wider">
                Local Block Height
              </CardTitle>
              <Server className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{stats.chainHeight.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ledger blocks height</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Distribution & Linker Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Node Versions */}
        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              Node Protocols
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(versionDistribution).length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No peer nodes detected.</p>
            ) : (
              Object.entries(versionDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([version, count]) => {
                  const percentage = ((count / list.length) * 100).toFixed(1)
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
                })
            )}
          </CardContent>
        </Card>

        {/* MANUAL PEER LINKER FORM */}
        <Card className="bg-card/50 border-border/50 card-glow flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-cyan-400">
              <Server className="h-4 w-4 text-cyan-400" />
              Manual Peer Linker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
            <p className="text-xs text-muted-foreground leading-normal">
              Enter the IP and port of another LunarMiner node on your local network to manually synchronize blockchain ledgers.
            </p>
            <form onSubmit={handleConnectPeer} className="space-y-3 mt-1.5">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Peer Address (IP:Port)</label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.45:5000"
                  value={connectAddress}
                  onChange={(e) => setConnectAddress(e.target.value)}
                  className="w-full bg-black/40 border border-border/20 px-3 py-2 rounded text-sm font-mono focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/35 text-foreground"
                />
              </div>
              
              {connectError && (
                <p className="text-[10px] text-destructive bg-destructive/5 border border-destructive/10 px-2 py-1.5 rounded font-mono break-words leading-tight">
                  {connectError}
                </p>
              )}
              
              {connectSuccess && (
                <p className="text-[10px] text-green-400 bg-success/5 border border-success/10 px-2 py-1.5 rounded font-mono break-words leading-tight">
                  {connectSuccess}
                </p>
              )}

              <Button
                type="submit"
                disabled={connectLoading || !connectAddress.trim()}
                className="w-full mt-2 text-xs"
              >
                {connectLoading ? 'Connecting...' : 'Establish LAN Link'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Latency Distribution */}
        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Latency Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { range: '< 50ms', count: list.filter(p => p.latency >= 0 && p.latency < 50).length, color: 'bg-success' },
              { range: '50-150ms', count: list.filter(p => p.latency >= 50 && p.latency < 150).length, color: 'bg-warning' },
              { range: '150-300ms', count: list.filter(p => p.latency >= 150 && p.latency < 300).length, color: 'bg-orange-500' },
              { range: 'Offline/Inactive', count: list.filter(p => p.latency < 0).length, color: 'bg-muted border border-border/20' },
            ].map(({ range, count, color }) => {
              const percentage = list.length > 0 ? ((count / list.length) * 100).toFixed(1) : '0'
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
      <Card className="bg-card/50 border-border/50 card-glow">
        <CardHeader>
          <CardTitle>Registered LAN Nodes Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Node ID</TableHead>
                  <TableHead className="text-muted-foreground">LAN Address</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Latency</TableHead>
                  <TableHead className="text-muted-foreground">Chain Height</TableHead>
                  <TableHead className="text-muted-foreground">Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground italic">
                      No active LAN peers registered yet. Dynamic UDP broadcast discoveries active...
                    </TableCell>
                  </TableRow>
                ) : (
                  list.slice(0, 30).map((peer) => {
                    const latencyBadge = getLatencyBadge(peer.latency)
                    const status = (peer as any).status || (peer.latency >= 0 ? 'online' : 'offline')
                    const chainLength = (peer as any).chain_length || 0
                    const lastSeenVal = (peer as any).last_seen || 'N/A'
                    
                    return (
                      <TableRow key={peer.id} className="border-border/50 hover:bg-accent/50">
                        <TableCell className="font-mono text-xs text-primary font-bold">
                          {peer.id && peer.id !== 'Unknown' ? (peer.id.length > 20 ? peer.id.slice(0, 16) + '...' : peer.id) : 'Unknown Node'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {peer.ip || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-xs uppercase tracking-wider font-bold",
                            status === 'online' 
                              ? "bg-green-500/10 text-green-400 border-green-500/30" 
                              : "bg-muted/10 text-muted-foreground border-border/30"
                          )}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {peer.latency >= 0 ? (
                            <span className={cn(
                              'inline-flex items-center px-2 py-1 rounded text-xs font-medium border font-mono',
                              latencyBadge.className
                            )}>
                              {peer.latency}ms
                            </span>
                          ) : (
                            <span className="text-muted-foreground font-mono text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-foreground font-bold">
                          {chainLength > 0 ? `#${chainLength.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">
                          {lastSeenVal && lastSeenVal !== 'N/A' && lastSeenVal !== 'Unknown' 
                            ? formatDateTime(lastSeenVal) 
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
