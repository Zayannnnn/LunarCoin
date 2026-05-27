'use client'

import { useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { NodeReputation, PenaltyLog } from '@/lib/types/blockchain'
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
import { 
  ShieldAlert, 
  Shield, 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Skull,
  FileSpreadsheet
} from 'lucide-react'

function formatDateTime(isoString: string): string {
  if (!isoString) return 'N/A'
  try {
    const d = new Date(isoString)
    const dateStr = d.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    return `${dateStr} ${timeStr}`
  } catch {
    return isoString
  }
}

function getTrustScoreBadge(score: number): { label: string; className: string } {
  if (score >= 80) return { label: 'Trusted', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
  if (score >= 50) return { label: 'Degraded', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' }
  return { label: 'Dangerous', className: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold shadow-[0_0_8px_oklch(0.6_0.15_0/0.2)] animate-pulse' }
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-rose-400 font-bold'
}

export default function NodeReputationPage() {
  const [reputations, setReputations] = useState<NodeReputation[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchReputationData(showLoading = false) {
    try {
      if (showLoading) setLoading(true)
      const data = await blockchainApi.getNodeReputation()
      setReputations(data?.reputations || [])
    } catch (err) {
      console.error('Failed to fetch node reputations:', err)
      setReputations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReputationData(true)
    const interval = setInterval(() => fetchReputationData(false), 5000)
    return () => clearInterval(interval)
  }, [])

  // Derived metrics
  const activeNodesCount = reputations.length
  const blacklistedCount = reputations.filter(r => r.blacklisted).length
  const avgTrustScore = reputations.length > 0
    ? Math.round(reputations.reduce((sum, r) => sum + r.score, 0) / reputations.length)
    : 100

  const highestScore = reputations.length > 0
    ? Math.max(...reputations.map(r => r.score))
    : 100

  // Aggregate penalty logs across all peers
  interface FlatPenaltyLog extends PenaltyLog {
    peer: string
  }

  const allPenaltyLogs: FlatPenaltyLog[] = reputations.reduce((acc, rep) => {
    const logs = (rep.penalty_logs || []).map(log => ({
      ...log,
      peer: rep.peer
    }))
    return [...acc, ...logs]
  }, [] as FlatPenaltyLog[]).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (loading && reputations.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Node Reputation System</h1>
          <p className="text-muted-foreground mt-1">Real-time peer trust metrics and compliance index</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Node Reputation System
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time peer compliance index, spam defenses, and transient blacklists
          </p>
        </div>
        <div className="bg-muted/15 border border-border/10 rounded-lg px-4 py-2 text-xs font-mono select-none flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground mr-1 uppercase font-bold text-[10px]">Consensus Engine:</span>
          <span className="text-primary font-bold">Reputation V1</span>
        </div>
      </div>

      {/* Security Shield Banner */}
      {blacklistedCount > 0 && (
        <Card className="bg-rose-500/5 border-rose-500/25 shadow-[0_0_20px_oklch(0.6_0.15_0/0.05)] animate-pulse">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Skull className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <p className="font-semibold text-rose-400">Security Countermeasures Active</p>
              <p className="text-sm text-muted-foreground leading-normal">
                {blacklistedCount} host(s) have been banned from the node network. Automatically blocking blocks/transactions, rate-limiting spam requests, and rejecting connections.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Monitored Hosts
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeNodesCount}</div>
            <p className="text-xs text-muted-foreground">Local LAN peers discovered</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Avg Cluster Trust
            </CardTitle>
            <Shield className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getScoreColor(avgTrustScore))}>
              {avgTrustScore}/100
            </div>
            <p className="text-xs text-muted-foreground">General network security index</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Highest Reputation
            </CardTitle>
            <Zap className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{highestScore}/100</div>
            <p className="text-xs text-muted-foreground">Most reliable cluster node</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Blacklisted IPs
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", blacklistedCount > 0 ? "text-rose-400" : "text-muted-foreground")}>
              {blacklistedCount}
            </div>
            <p className="text-xs text-muted-foreground">Nodes blocked (Transient ban)</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Ledger Table */}
      <Card className="bg-card/50 border-border/50 card-glow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Trust Ledger</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Decentralized peer compliance metrics updated live
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Host Address</TableHead>
                  <TableHead className="text-muted-foreground">Trust Index</TableHead>
                  <TableHead className="text-muted-foreground">Status / Mode</TableHead>
                  <TableHead className="text-muted-foreground">Uptime</TableHead>
                  <TableHead className="text-muted-foreground">Mined Blocks (V/I)</TableHead>
                  <TableHead className="text-muted-foreground">Sync Rate</TableHead>
                  <TableHead className="text-muted-foreground">Malformed TXs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reputations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground italic">
                      No external node reputation records discovered. Connect peers to populate the ledger.
                    </TableCell>
                  </TableRow>
                ) : (
                  reputations.map((rep) => {
                    const badge = getTrustScoreBadge(rep.score)
                    return (
                      <TableRow key={rep.peer} className={cn("border-border/50 hover:bg-accent/40", rep.blacklisted && "bg-rose-950/10 hover:bg-rose-950/20")}>
                        <TableCell className="font-mono text-sm font-semibold select-all">
                          {rep.peer}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <span className={cn("font-mono text-lg font-bold w-12", getScoreColor(rep.score))}>
                              {rep.score}%
                            </span>
                            <div className="hidden sm:block w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full", 
                                  rep.score >= 80 ? "bg-emerald-400" : rep.score >= 50 ? "bg-yellow-400" : "bg-rose-500"
                                )}
                                style={{ width: `${rep.score}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-xs font-semibold tracking-wider uppercase", badge.className)}>
                            {rep.blacklisted ? 'BLACKLISTED' : badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {rep.uptime.toFixed(1)}%
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          <span className="text-emerald-400">{rep.valid_blocks}</span>
                          <span className="text-muted-foreground mx-1">/</span>
                          <span className={cn(rep.invalid_blocks > 0 ? "text-rose-400 font-bold" : "text-muted-foreground")}>
                            {rep.invalid_blocks}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-cyan-400">
                          {rep.sync_success_rate.toFixed(1)}%
                        </TableCell>
                        <TableCell className={cn("font-mono text-sm", rep.malformed_txs > 0 ? "text-rose-400 font-bold" : "text-muted-foreground")}>
                          {rep.malformed_txs}
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

      {/* Compliance Rules and Penalty Scroll */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Audit Scroll */}
        <Card className="bg-card/50 border-border/50 card-glow lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              Auditable Compliance Trail
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chronological log of cluster violations, latency penalties, and block audits
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {allPenaltyLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle className="h-8 w-8 text-emerald-400/80 mb-2 animate-bounce" />
                  <p className="text-sm font-semibold text-foreground">Zero Compliance Infractions</p>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    All LAN nodes are currently behaving in full accordance with the consensus protocols.
                  </p>
                </div>
              ) : (
                allPenaltyLogs.map((log, index) => (
                  <div key={index} className="flex gap-4 p-3 border border-border/20 rounded-xl bg-black/20 hover:bg-black/35 transition-colors">
                    <div className="mt-0.5 shrink-0">
                      {log.delta < 0 ? (
                        <div className="h-6 w-6 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">
                          -
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                          +
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold font-mono text-cyan-400 select-all">{log.peer}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{formatDateTime(log.timestamp)}</span>
                      </div>
                      <p className="text-xs text-foreground font-semibold leading-normal">{log.reason}</p>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                        <span>Trust Score Shift:</span>
                        <span className={cn("font-bold", log.delta < 0 ? "text-rose-400" : "text-emerald-400")}>
                          {log.delta > 0 ? `+${log.delta}` : log.delta}
                        </span>
                        <span>({log.score_before}% → {log.score_after}%)</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Compliance Matrix rules */}
        <Card className="bg-card/50 border-border/50 card-glow flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-cyan-400" />
              Trust Protocol Schema
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Preset modifiers determining host trust levels
            </p>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow flex flex-col justify-center">
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                <span className="text-muted-foreground">Valid Block Solved</span>
                <span className="text-emerald-400 font-bold">+5 Trust</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                <span className="text-muted-foreground">Invalid Recalculated Hash</span>
                <span className="text-rose-400 font-bold">-25 Trust</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                <span className="text-muted-foreground">Bad Signature/Tx Code</span>
                <span className="text-rose-400 font-bold">-15 Trust</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                <span className="text-muted-foreground">Active Rate-limit Flood</span>
                <span className="text-rose-400 font-bold">-20 Trust</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                <span className="text-muted-foreground">Fork / Divergent Chain</span>
                <span className="text-yellow-400 font-bold">-10 Trust</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Auto-Ban Threshold</span>
                <span className="text-rose-400 font-bold">&lt; 20 Score</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg border border-border/15 bg-black/15 flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-normal">
                Nodes dropping below the auto-ban threshold are transiently blacklisted for <span className="text-cyan-400 font-semibold">10 minutes</span>. If pings improve and block syncing recovers without spam, they are automatically restored to standard status.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
