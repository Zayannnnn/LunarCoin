'use client'

import { useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { Peer, NetworkStats, NetworkHealth, ForkWarning, TopologyNode } from '@/lib/types/blockchain'
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
import { 
  Wifi, 
  Clock, 
  Activity, 
  Server, 
  Zap, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  Radio,
  Globe,
  Plus
} from 'lucide-react'

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
  if (latency < 50) return 'text-emerald-400'
  if (latency < 150) return 'text-yellow-400'
  return 'text-rose-500 font-bold'
}

function getLatencyBadge(latency: number): { label: string; className: string } {
  if (latency < 0) return { label: 'Offline', className: 'bg-muted/10 text-muted-foreground border-border/30' }
  if (latency < 50) return { label: 'Excellent', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
  if (latency < 150) return { label: 'Good', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' }
  return { label: 'Poor', className: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
}

export default function NetworkPage() {
  const [stats, setStats] = useState<NetworkStats | null>(null)
  const [peers, setPeers] = useState<Peer[]>([])
  const [nodeInfo, setNodeInfo] = useState<{ node_id: string; chain_length: number } | null>(null)
  const [networkHealth, setNetworkHealth] = useState<NetworkHealth | null>(null)
  const [loading, setLoading] = useState(true)

  // Interactive Topology state
  const [hoveredNode, setHoveredNode] = useState<TopologyNode | null>(null)

  // Manual connect form states
  const [connectAddress, setConnectAddress] = useState('')
  const [connectLoading, setConnectLoading] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [connectSuccess, setConnectSuccess] = useState<string | null>(null)

  async function fetchData(showLoading = false) {
    try {
      if (showLoading) setLoading(true)
      const [statsData, peersData, healthData] = await Promise.all([
        blockchainApi.getNetworkStats(),
        blockchainApi.getPeers(50),
        blockchainApi.getNetworkHealth().catch(() => null)
      ])
      setStats(statsData || null)
      setPeers(peersData || [])
      setNetworkHealth(healthData || null)

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
    const interval = setInterval(() => fetchData(false), 5000)
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

  // Calculate coordinates for dynamic SVG Topology Graph
  const centerX = 300
  const centerY = 160
  const radius = 100

  const nodes = networkHealth?.topology?.nodes || []
  const edges = networkHealth?.topology?.edges || []

  // Assign coordinate mappings centered around local node
  const positionedNodes = nodes.map((node, i) => {
    if (node.type === 'local') {
      return { ...node, x: centerX, y: centerY }
    }
    const peerNodes = nodes.filter(n => n.type !== 'local')
    const peerIndex = peerNodes.findIndex(n => n.id === node.id)
    const peerCount = peerNodes.length || 1
    const angle = (peerIndex / peerCount) * 2 * Math.PI - Math.PI / 2
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    }
  })

  const getCoordinates = (nodeId: string) => {
    const node = positionedNodes.find(n => n.id === nodeId)
    return node ? { x: node.x, y: node.y } : { x: centerX, y: centerY }
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
          <Skeleton className="lg:col-span-2 h-[320px]" />
          <Skeleton className="h-[320px]" />
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
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Radio className="h-6 w-6 text-primary animate-pulse" />
            Visual Network Control Deck
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor distributed LAN topology, p2p latency relays, and consensus warnings
          </p>
        </div>
        {nodeInfo && (
          <div className="bg-muted/15 border border-border/10 rounded-lg px-4 py-2 text-xs font-mono select-none">
            <span className="text-muted-foreground mr-1.5 uppercase font-bold text-[10px]">Local ID:</span>
            <span className="text-primary font-bold">{nodeInfo.node_id}</span>
          </div>
        )}
      </div>

      {/* Blinking Cyberpunk Fork Warning Banner */}
      {networkHealth && networkHealth.fork_warnings && networkHealth.fork_warnings.length > 0 && (
        <Card className="bg-rose-500/10 border-rose-500/30 shadow-[0_0_25px_oklch(0.6_0.15_0/0.15)] animate-pulse">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-6 w-6 text-rose-400" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-bold text-rose-400 text-sm tracking-wider uppercase">Chain Tip Divergence Warning!</p>
              <div className="text-xs text-muted-foreground leading-normal space-y-1">
                {networkHealth.fork_warnings.map((warn, index) => (
                  <div key={index} className="font-mono bg-black/30 p-2 border border-rose-500/10 rounded">
                    <span className="text-rose-400 font-bold">[FORK DETECTED]</span> Peer <span className="text-foreground">{warn.peer}</span> at block height <span className="text-yellow-400 font-bold">#{warn.height}</span>. 
                    <div className="mt-1 flex flex-col md:flex-row gap-1 md:gap-4 text-[10px]">
                      <span>Local Hash Tip: <code className="text-cyan-400">{warn.local_hash.slice(0, 16)}...</code></span>
                      <span>Conflicting Hash Tip: <code className="text-rose-400">{warn.peer_hash.slice(0, 16)}...</code></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Status Banner (Success when healthy and no forks) */}
      {(!networkHealth || networkHealth.fork_warnings.length === 0) && (
        <Card className="bg-emerald-500/5 border-emerald-500/20 card-glow">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#10b981]" />
            <div>
              <p className="font-medium text-foreground">Subnet Cluster: Sync Status Healthy</p>
              <p className="text-sm text-muted-foreground leading-normal">
                Peer-to-peer heartbeats active. Automatic fork detection fully operational.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                LAN Peers Count
              </CardTitle>
              <Wifi className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onlinePeersList.length.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active discovered peers</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Cluster Average Latency
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
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Decentralized Cluster TPS
              </CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">
                {networkHealth ? networkHealth.network_tps.toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">Combined transactions/sec</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Cluster Chain Height
              </CardTitle>
              <Server className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                #{networkHealth ? networkHealth.total_chain_height.toLocaleString() : stats.chainHeight.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Highest verified block height</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Topology Graph & Stats Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Topology Graph Container */}
        <Card className="bg-card/50 border-border/50 card-glow lg:col-span-2 flex flex-col justify-between overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Live Subnet Topology Graph
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                Interactive Map
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Decentralized mesh layout. Hover nodes to audit network telemetry details.
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center py-4 relative min-h-[300px]">
            {positionedNodes.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Generating cluster map...</p>
            ) : (
              <svg width="100%" height="280" viewBox="0 0 600 320" className="overflow-visible select-none">
                <defs>
                  <radialGradient id="localGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="peerGlowGreen" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="peerGlowYellow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#eab308" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="peerGlowRose" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Edges Linkages */}
                {edges.map((edge, idx) => {
                  const source = getCoordinates(edge.source)
                  const target = getCoordinates(edge.target)
                  
                  // Color based on edge delay
                  let strokeColor = 'rgba(16, 185, 129, 0.4)' // Green
                  if (edge.delay >= 150) {
                    strokeColor = 'rgba(244, 63, 94, 0.5)' // Rose
                  } else if (edge.delay >= 50) {
                    strokeColor = 'rgba(234, 179, 8, 0.45)' // Yellow
                  }

                  return (
                    <g key={`edge-${idx}`}>
                      {/* Connection Wire */}
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={strokeColor}
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className="transition-all duration-300"
                      />
                      {/* Animated Ping Relay Pulse traveling along connection line */}
                      <circle r="3" fill="#06b6d4" className="shadow-[0_0_8px_#06b6d4]">
                        <animateMotion
                          dur={`${Math.max(1, (edge.delay / 50))}s`}
                          repeatCount="indefinite"
                          path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                        />
                      </circle>
                    </g>
                  )
                })}

                {/* Nodes Drawing */}
                {positionedNodes.map((node) => {
                  const isLocal = node.type === 'local'
                  const r = isLocal ? 16 : 8 + (node.trust / 100) * 8
                  
                  let strokeColor = '#06b6d4'
                  let glowId = 'localGlow'
                  
                  if (!isLocal) {
                    if (node.trust >= 80) {
                      strokeColor = '#10b981'
                      glowId = 'peerGlowGreen'
                    } else if (node.trust >= 50) {
                      strokeColor = '#eab308'
                      glowId = 'peerGlowYellow'
                    } else {
                      strokeColor = '#f43f5e'
                      glowId = 'peerGlowRose'
                    }
                  }

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Glowing Radar Range */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r + 14}
                        fill={`url(#${glowId})`}
                        className={cn(isLocal && "animate-pulse")}
                      />
                      {/* Outer Border Wire */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r}
                        stroke={strokeColor}
                        strokeWidth={isLocal ? 2.5 : 1.5}
                        fill="#0b0f19"
                        className={cn(!isLocal && node.trust < 50 && "animate-pulse")}
                      />
                      {/* Inner Core Solid */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r - 4}
                        fill={strokeColor}
                        fillOpacity="0.25"
                      />
                      {/* IP Label */}
                      <text
                        x={node.x}
                        y={node.y - r - 6}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.7)"
                        className="font-mono text-[9px] font-bold"
                      >
                        {isLocal ? 'Local Node' : node.ip}
                      </text>
                    </g>
                  )
                })}
              </svg>
            )}

            {/* Hover Node Tooltip Panel */}
            {hoveredNode && (
              <div className="absolute bottom-4 left-4 right-4 bg-[#0a0e17]/90 border border-primary/30 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] flex justify-between items-center text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="space-y-0.5">
                  <div className="font-mono font-bold flex items-center gap-1.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", hoveredNode.type === 'local' ? "bg-cyan-400" : hoveredNode.trust >= 80 ? "bg-emerald-400" : "bg-rose-500")} />
                    {hoveredNode.label} <code className="text-muted-foreground text-[10px]">({hoveredNode.ip}:{hoveredNode.port})</code>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Height: <span className="text-foreground font-bold">#{hoveredNode.height}</span> | 
                    Type: <span className="capitalize">{hoveredNode.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Node Trust Index</div>
                  <div className={cn("font-mono font-bold text-sm", getScoreColor(hoveredNode.trust))}>
                    {hoveredNode.trust}%
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MANUAL PEER LINKER FORM */}
        <Card className="bg-card/50 border-border/50 card-glow flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-cyan-400">
              <Plus className="h-4 w-4 text-cyan-400" />
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
                <p className="text-[10px] text-rose-400 bg-rose-500/5 border border-rose-500/10 px-2 py-1.5 rounded font-mono break-words leading-tight">
                  {connectError}
                </p>
              )}
              
              {connectSuccess && (
                <p className="text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-1.5 rounded font-mono break-words leading-tight">
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
      </div>

      {/* Consensus Sync Checklist Map & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consensus Checklist */}
        <Card className="bg-card/50 border-border/50 card-glow lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Consensus Synchronization Checklist
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comparison map of peer block heights relative to the local block tip
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground text-xs font-bold uppercase">Node Address</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-bold uppercase">Height Index</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-bold uppercase">Status Check</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-bold uppercase">Trust Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positionedNodes.map((node) => {
                    const localHeight = stats?.chainHeight || 0
                    const nodeHeight = node.height
                    const isLocal = node.type === 'local'

                    let syncStatus = 'Synced'
                    let syncBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    
                    if (nodeHeight < localHeight) {
                      syncStatus = 'Syncing / Behind'
                      syncBadgeClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                    } else if (nodeHeight > localHeight) {
                      syncStatus = 'Ahead / Divergent'
                      syncBadgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
                    }

                    return (
                      <TableRow key={node.id} className="border-border/50 hover:bg-accent/40">
                        <TableCell className="font-mono text-xs font-semibold">
                          {isLocal ? `${node.ip}:${node.port} (You)` : `${node.ip}:${node.port}`}
                        </TableCell>
                        <TableCell className="font-mono text-sm font-bold text-foreground">
                          #{nodeHeight.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-xs font-bold uppercase", syncBadgeClass)}>
                            {syncStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className={cn("font-mono text-xs font-bold", getScoreColor(node.trust))}>
                          {node.trust}%
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Latency Distribution Diagnostic (from peers info) */}
        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Latency Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { range: '< 50ms (Optimal)', count: list.filter(p => p.latency >= 0 && p.latency < 50).length, color: 'bg-emerald-400' },
              { range: '50-150ms (Normal)', count: list.filter(p => p.latency >= 50 && p.latency < 150).length, color: 'bg-yellow-400' },
              { range: '150-300ms (High)', count: list.filter(p => p.latency >= 150 && p.latency < 300).length, color: 'bg-orange-500' },
              { range: 'Offline / Timed Out', count: list.filter(p => p.latency < 0).length, color: 'bg-muted border border-border/20' },
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
                    <span className="text-xs text-muted-foreground w-12 text-right font-mono">
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
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
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

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-rose-400 font-bold'
}
