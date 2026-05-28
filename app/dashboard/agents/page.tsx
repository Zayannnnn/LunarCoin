'use client'

import { useEffect, useState, useRef } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import { LunarSDK } from '@/lib/sdk/lunar-sdk'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Bot,
  Cpu,
  Terminal,
  Activity,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Percent,
  Play,
  UserPlus,
  HelpCircle,
  FileCode,
  DollarSign,
  AlertTriangle,
  Lock,
} from 'lucide-react'

const AUDIT_SAMPLE = `[
  ["PUSH", 21],
  ["PUSH", 2],
  ["MUL"],
  ["STORE", "answer"],
  ["LOAD", "answer"],
  ["RETURN"]
]`

const VULNERABLE_SAMPLE = `[
  ["PUSH", 1],
  ["STORE", "counter"],
  ["LOAD", "counter"],
  ["PUSH", 1],
  ["ADD"],
  ["STORE", "counter"],
  ["JMP", 2],
  ["DIV"],
  ["RETURN"]
]`

export default function AIAgentsHubPage() {
  const [loading, setLoading] = useState(true)
  const [agents, setAgents] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  
  // Forms & Wizards
  const [spawnName, setSpawnName] = useState('')
  const [spawnRole, setSpawnRole] = useState<'governance' | 'treasury' | 'security' | 'market'>('governance')
  const [spawnLoading, setSpawnLoading] = useState(false)

  // Smart Contract Auditor Box
  const [auditCode, setAuditCode] = useState(AUDIT_SAMPLE)
  const [auditing, setAuditing] = useState(false)
  const [auditResult, setAuditResult] = useState<any>(null)

  // Sliders for Market Simulation
  const [simDifficulty, setSimDifficulty] = useState(4)
  const [simActiveMiners, setSimActiveMiners] = useState(5)
  const [simRandomSteps, setSimRandomSteps] = useState(12)
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState<any[] | null>(null)

  // Execution Console output
  const [consoleResult, setConsoleResult] = useState<any>(null)
  const [executingId, setExecutingId] = useState<string | null>(null)

  async function loadAgentsData(showLoader = false) {
    if (showLoader) setLoading(true)
    try {
      const res = await blockchainApi.getAgents().catch(() => ({ agents: [] }))
      const list = res?.agents || []
      setAgents(list)
      
      // Auto-select first agent
      if (list.length > 0 && !selectedAgent) {
        setSelectedAgent(list[0])
      } else if (list.length > 0 && selectedAgent) {
        // Update selected agent details
        const updated = list.find((a: any) => a.id === selectedAgent.id)
        if (updated) setSelectedAgent(updated)
      }
    } catch (err) {
      console.error('Failed to load LunarAgents:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAgentsData(true)
    const interval = setInterval(() => loadAgentsData(false), 5000)
    return () => clearInterval(interval)
  }, [])

  // Trigger spawn agent
  const handleSpawnAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!spawnName.trim()) return
    setSpawnLoading(true)
    try {
      await blockchainApi.spawnAgent(spawnName.trim(), spawnRole)
      setSpawnName('')
      loadAgentsData(false)
    } catch (err) {
      console.error('Failed to spawn agent:', err)
    } finally {
      setSpawnLoading(false)
    }
  }

  // Trigger manual loop execution
  const handleExecuteAgent = async (id: string) => {
    setExecutingId(id)
    setConsoleResult(null)
    try {
      const payload: any = {}
      if (selectedAgent?.role === 'security') {
        payload.bytecode = JSON.parse(auditCode.trim())
      }
      const res = await blockchainApi.executeAgent(id, payload)
      setConsoleResult(res.result || res)
      loadAgentsData(false)
    } catch (err: any) {
      setConsoleResult({ error: err.message || 'Execution loop failed.' })
    } finally {
      setExecutingId(null)
    }
  }

  // Trigger Smart Contract auditor box analysis
  const handleAuditCode = async () => {
    setAuditing(true)
    setAuditResult(null)
    try {
      const codeArray = JSON.parse(auditCode.trim())
      // Use security agent to audit code directly
      const securityAgent = agents.find(a => a.role === 'security')
      if (securityAgent) {
        const res = await blockchainApi.executeAgent(securityAgent.id, { bytecode: codeArray })
        setAuditResult(res.result || res)
      } else {
        throw new Error('AI Security Auditor agent is offline.')
      }
    } catch (err: any) {
      setAuditResult({ error: err.message || 'Invalid bytecode sequence array format.' })
    } finally {
      setAuditing(false)
    }
  }

  // Trigger Tokenomics market simulation random walk
  const handleMarketSimulation = async () => {
    setSimulating(true)
    setSimResult(null)
    try {
      const marketAgent = agents.find(a => a.role === 'market')
      if (marketAgent) {
        const res = await blockchainApi.executeAgent(marketAgent.id, {
          difficulty: simDifficulty,
          active_miners: simActiveMiners,
          random_steps: simRandomSteps
        })
        const simData = res.result?.pricing_simulation || []
        setSimResult(simData)
      }
    } catch (err) {
      console.error('Simulation failed:', err)
    } finally {
      setSimulating(false)
    }
  }

  // Combined decision logs aggregation across all spawned agents
  const getAllDecisionLogs = () => {
    const logs: any[] = []
    agents.forEach(a => {
      if (a.decision_logs) {
        a.decision_logs.forEach((log: any) => {
          logs.push({ ...log, agent_name: a.name, agent_role: a.role })
        })
      }
    })
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Calculations for Telemetry HUD
  const totalAgents = agents.length
  const avgLoopsSec = agents.reduce((acc, a) => acc + (a.activity_sec || 0), 0)
  
  // Threat assessment
  const activeThreats = agents.reduce((acc, a) => acc + (a.threat_warnings?.length || 0), 0)
  const isAttackActive = activeThreats > 0

  // Staking projection for Treasury Optimizer
  const treasuryAgent = agents.find(a => a.role === 'treasury')
  const govAgent = agents.find(a => a.role === 'governance')
  
  if (loading && agents.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">LunarAgents Hub</h1>
          <p className="text-muted-foreground mt-1">Autonomous AI-powered blockchain ecosystem sandbox</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] bg-muted/20 border-border/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[450px] bg-muted/20" />
          <Skeleton className="h-[450px] bg-muted/20" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary animate-pulse" />
            LunarAgents Autonomous AI Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Intelligent sandboxed consensus delegates, smart auditing nodes, and tokenomic simulation engines.
          </p>
        </div>
        
        <div className="bg-muted/15 border border-border/10 rounded-lg px-4 py-2 text-xs font-mono flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-muted-foreground mr-1 uppercase font-bold text-[10px]">AI Sandbox Status:</span>
          <span className="text-primary font-bold">SECURE</span>
        </div>
      </div>

      {/* Telemetry HUD Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Spawned AI Nodes
            </CardTitle>
            <Bot className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{totalAgents} Agents</div>
            <p className="text-xs text-muted-foreground">Running isolated educational threads</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              AI Throughput
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{avgLoopsSec.toFixed(3)} loops/sec</div>
            <p className="text-xs text-muted-foreground">Real-time model logic speed metrics</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Threat Assessment
            </CardTitle>
            {isAttackActive ? <ShieldAlert className="h-4 w-4 text-rose-500 animate-bounce" /> : <ShieldCheck className="h-4 w-4 text-emerald-400" />}
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", isAttackActive ? "text-rose-500 animate-pulse" : "text-emerald-400")}>
              {isAttackActive ? "ATTACK DETECTED" : "NOMINAL"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAttackActive ? `${activeThreats} security threat warnings` : "Consensus attack detectors clean"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Governance Prediction
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-yellow-400 truncate max-w-[210px]" title={govAgent?.predictions?.next_proposal_recommendation}>
              {govAgent?.predictions?.next_proposal_recommendation || "Evaluating Proposals..."}
            </div>
            <p className="text-xs text-muted-foreground">Automatic yield/gas adjustments recommendation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main AI management workbench */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 font-bold uppercase tracking-wider">
                <Cpu className="h-4 w-4 text-primary" />
                Autonomous Agent Sandbox Monitor
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect details, logs, permissions, and trigger sandboxed manual logic executions.
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Spawn Wizard + Agent List */}
                <div className="space-y-4 md:border-r border-border/10 md:pr-4">
                  
                  {/* Spawner */}
                  <form onSubmit={handleSpawnAgent} className="space-y-2 border-b border-border/5 pb-4">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Spawn New AI Node</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI Sentinel-1"
                      value={spawnName}
                      onChange={(e) => setSpawnName(e.target.value)}
                      className="w-full bg-black/45 border border-border/20 px-3 py-1.5 rounded font-mono text-[11px] focus:outline-none focus:border-primary/50 text-foreground"
                    />
                    
                    <select
                      value={spawnRole}
                      onChange={(e) => setSpawnRole(e.target.value as any)}
                      className="w-full bg-black/45 border border-border/20 px-3 py-1.5 rounded font-mono text-[11px] focus:outline-none focus:border-primary/50 text-foreground"
                    >
                      <option value="governance">Governance Delegate</option>
                      <option value="treasury">Treasury Optimizer</option>
                      <option value="security">VM Smart Auditor</option>
                      <option value="market">Tokenomic Simulator</option>
                    </select>

                    <Button
                      type="submit"
                      disabled={spawnLoading}
                      className="w-full py-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="h-3 w-3" />
                      {spawnLoading ? 'Spawning...' : 'Spawn Agent'}
                    </Button>
                  </form>

                  {/* List */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active Instances</span>
                    {agents.map((a) => {
                      const isSelected = selectedAgent?.id === a.id
                      return (
                        <div
                          key={a.id}
                          onClick={() => { setSelectedAgent(a); setConsoleResult(null); }}
                          className={cn(
                            "p-2.5 border rounded-lg bg-black/15 hover:bg-black/35 cursor-pointer transition-all duration-150 flex items-center justify-between",
                            isSelected ? "border-primary/50 bg-black/25 shadow-[0_0_10px_oklch(0.75_0.15_195/0.03)]" : "border-border/5"
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-[11px] font-semibold text-primary truncate">{a.name}</p>
                            <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">{a.role}</p>
                          </div>
                          
                          <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 text-[8px] font-mono font-bold scale-90">
                            ONLINE
                          </Badge>
                        </div>
                      )
                    })}
                  </div>

                </div>

                {/* 2. Detail Inspector & Execute (2 cols) */}
                <div className="md:col-span-2 space-y-4 flex flex-col justify-between min-h-[300px]">
                  {selectedAgent ? (
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      
                      {/* Top Header details */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xs font-bold text-foreground font-mono">{selectedAgent.name}</h3>
                            <p className="text-[9px] text-muted-foreground font-mono mt-0.5">UID: {selectedAgent.id}</p>
                          </div>
                          <Badge className="bg-primary/20 text-primary border-none text-[8px] font-mono font-bold uppercase tracking-wider py-0 rounded">
                            {selectedAgent.role}
                          </Badge>
                        </div>

                        {/* Telemetry and parameters */}
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono bg-black/15 p-2.5 rounded-lg border border-border/5">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">UPTIME:</span>
                            <span className="text-foreground font-semibold">{selectedAgent.uptime}s</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">LOOP RATE:</span>
                            <span className="text-foreground font-semibold">{selectedAgent.activity_sec}s</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Permissions Sandbox Checklist */}
                      <div className="space-y-1">
                        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">AI Permission sandboxes</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(selectedAgent.permissions || []).map((perm: string) => (
                            <Badge
                              key={perm}
                              variant="outline"
                              className="text-[8px] font-mono border-emerald-500/20 text-emerald-400 bg-emerald-500/5 px-2 py-0"
                            >
                              ✓ {perm.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Predictive indicators if governance/treasury */}
                      {selectedAgent.predictions && (
                        <div className="space-y-1 bg-black/35 p-2 rounded border border-border/5 text-[9px] font-mono space-y-1 text-muted-foreground">
                          <span className="text-foreground font-bold flex gap-1 items-center mb-1">
                            <TrendingUp className="h-3 w-3 text-cyan-400" />
                            Model Forecasts & Optimizations
                          </span>
                          {Object.entries(selectedAgent.predictions).map(([key, val]: [string, any]) => (
                            <div key={key} className="flex justify-between border-b border-border/5 pb-0.5">
                              <span className="text-cyan-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="text-foreground font-semibold text-right">{val}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Danger attack warning alerts from Delegate */}
                      {selectedAgent.role === 'governance' && selectedAgent.threat_warnings?.length > 0 && (
                        <div className="bg-rose-500/5 border border-rose-500/20 p-2.5 rounded-lg text-[9px] font-mono text-rose-400 flex gap-2">
                          <ShieldAlert className="h-4.5 w-4.5 shrink-0 animate-bounce" />
                          <div className="space-y-0.5">
                            <span className="font-bold">SUSPICIOUS NETWORK ATTACKS DETECTED:</span>
                            {selectedAgent.threat_warnings.map((w: string, idx: number) => (
                              <p key={idx}>· {w}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Console Trigger Execution */}
                      <div className="pt-2 border-t border-border/5 space-y-2">
                        <Button
                          disabled={executingId === selectedAgent.id}
                          onClick={() => handleExecuteAgent(selectedAgent.id)}
                          className="w-full py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                        >
                          <Play className="h-3.5 w-3.5 mr-1" />
                          {executingId === selectedAgent.id ? 'Running loop audit...' : 'Manual Loop Execution'}
                        </Button>

                        {/* Console terminal response */}
                        {consoleResult && (
                          <div className="space-y-1">
                            <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-1">
                              <Terminal className="h-2.5 w-2.5 text-cyan-400" />
                              Sandbox Outputs
                            </span>
                            <pre className="bg-black/55 border border-border/25 p-2 rounded font-mono text-[9px] text-cyan-400/90 max-h-[100px] overflow-y-auto scrollbar-thin whitespace-pre-wrap select-all">
                              {JSON.stringify(consoleResult, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center italic text-xs text-muted-foreground py-20 flex-1 flex items-center justify-center">
                      Select or spawn an AI Node to audit details.
                    </div>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Smart Contract Auditor workbench */}
          <Card className="bg-card/50 border-border/50 card-glow animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 font-bold uppercase tracking-wider text-primary">
                <FileCode className="h-5 w-5 text-primary" />
                LunarVM AI Smart Contract Auditor
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Analyze and audit LunarVM assembly bytecodes for dangerous infinite loops, division-by-zero risk, or gas abuse before deployment on-chain.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Code input */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    <span>Bytecode Instructions Sandbox</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAuditCode(AUDIT_SAMPLE)}
                        className="text-[9px] text-primary hover:underline"
                      >
                        Sample Safe
                      </button>
                      <span>|</span>
                      <button
                        onClick={() => setAuditCode(VULNERABLE_SAMPLE)}
                        className="text-[9px] text-rose-400 hover:underline"
                      >
                        Sample Unsafe
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={auditCode}
                    onChange={(e) => setAuditCode(e.target.value)}
                    spellCheck="false"
                    className="w-full min-h-[160px] bg-black/45 border border-border/20 p-3 rounded font-mono text-xs focus:outline-none focus:border-primary/50 text-foreground scrollbar-thin"
                  />
                  
                  <Button
                    disabled={auditing}
                    onClick={handleAuditCode}
                    className="w-full py-4 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                  >
                    {auditing ? 'Auditing assembly...' : 'Run Security AI Analysis'}
                  </Button>
                </div>

                {/* Audit gauge & diagnostics */}
                <div className="bg-[#0b0f19]/30 border border-border/10 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                  {auditResult ? (
                    auditResult.error ? (
                      <div className="bg-rose-500/5 border border-rose-500/20 p-3 rounded text-rose-400 text-xs font-mono flex gap-2">
                        <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                        <div>{auditResult.error}</div>
                      </div>
                    ) : (
                      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                        
                        <div className="flex justify-between items-start border-b border-border/5 pb-2">
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Security Grade</span>
                            <div className={cn(
                              "text-3xl font-extrabold",
                              auditResult.score >= 85 ? "text-emerald-400" :
                              auditResult.score >= 60 ? "text-yellow-400" :
                              "text-rose-500 animate-pulse"
                            )}>
                              {auditResult.score} / 100
                            </div>
                          </div>
                          
                          <Badge className={cn(
                            "border-none font-bold uppercase tracking-widest text-[9px] scale-105",
                            auditResult.severity === 'LOW' ? "bg-emerald-500/20 text-emerald-400" :
                            auditResult.severity === 'MEDIUM' ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-rose-500/20 text-rose-500 animate-pulse"
                          )}>
                            {auditResult.severity} RISK
                          </Badge>
                        </div>

                        {/* Diagnostics warnings */}
                        <div className="space-y-1 flex-1">
                          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Auditor diagnostic concerns</span>
                          <div className="bg-black/35 rounded border border-border/5 p-2 font-mono text-[9px] max-h-[100px] overflow-y-auto scrollbar-thin text-muted-foreground space-y-1.5">
                            {auditResult.warnings?.length === 0 ? (
                              <p className="text-emerald-400/90 font-bold flex gap-1 items-center">
                                <ShieldCheck className="h-3 w-3" /> No security vulnerabilities detected. Code ready for consensus.
                              </p>
                            ) : (
                              auditResult.warnings.map((w: string, idx: number) => (
                                <p key={idx} className="text-rose-400 font-medium">· {w}</p>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Dangerous indices highlight */}
                        <div className="flex justify-between items-center text-[10px] font-mono bg-black/15 p-2 rounded">
                          <span className="text-muted-foreground">TOTAL PROGRAM GAS:</span>
                          <span className="text-primary font-bold">{auditResult.gas_cost || 0} gas units</span>
                        </div>

                      </div>
                    )
                  ) : (
                    <div className="text-center italic text-xs text-muted-foreground py-16 flex-1 flex items-center justify-center">
                      Paste assembly bytecode on the left and run analysis.
                    </div>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right column: Tokenomics simulator and activity feed */}
        <div className="space-y-6">
          
          {/* Tokenomics Simulator */}
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-1.5 font-bold uppercase tracking-wider text-cyan-400">
                <DollarSign className="h-4 w-4 text-cyan-400" />
                AI Tokenomics Simulator
              </CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Simulate random-walk pricing and pool reserves by optimizing network PoW anchors.
              </p>
            </CardHeader>

            <CardContent className="space-y-4 font-mono">
              <div className="space-y-3 border-b border-border/5 pb-4">
                
                {/* Sliders */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                    <span>Block Difficulty Target</span>
                    <span className="text-foreground">{simDifficulty} Target</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={simDifficulty}
                    onChange={(e) => setSimDifficulty(Number(e.target.value))}
                    className="w-full bg-muted/20 accent-primary rounded-lg cursor-pointer h-1.5"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                    <span>Active Network Miners</span>
                    <span className="text-foreground">{simActiveMiners} Nodes</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={simActiveMiners}
                    onChange={(e) => setSimActiveMiners(Number(e.target.value))}
                    className="w-full bg-muted/20 accent-primary rounded-lg cursor-pointer h-1.5"
                  />
                </div>
              </div>

              <Button
                disabled={simulating}
                onClick={handleMarketSimulation}
                className="w-full py-4 text-xs font-bold uppercase tracking-wider"
              >
                {simulating ? 'Processing walk walk...' : 'Compute Tokenomic Projections'}
              </Button>

              {/* Render dynamic inline simulated chart using SVG! */}
              {simResult && simResult.length > 0 && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Projected Price Trajectory ($)</span>
                  
                  <div className="bg-black/35 rounded-lg border border-border/5 p-3 relative h-[140px] flex items-end justify-center">
                    
                    {/* SVG Line Graph */}
                    <svg className="w-full h-full absolute inset-0 p-2" viewBox="0 0 100 50" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      
                      {/* Line */}
                      <path
                        d={`M ${simResult.map((pt, idx) => {
                          const x = (idx / (simResult.length - 1)) * 100
                          // Map prices ($0.5 to $2.5) to SVG height y (45 to 5)
                          const price = pt.simulated_price
                          const y = 45 - ((price - 0.5) / 2.0) * 40
                          return `${x} ${y}`
                        }).join(' L ')}`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      
                      {/* Gradient fill */}
                      <path
                        d={`M 0 50 L ${simResult.map((pt, idx) => {
                          const x = (idx / (simResult.length - 1)) * 100
                          const price = pt.simulated_price
                          const y = 45 - ((price - 0.5) / 2.0) * 40
                          return `${x} ${y}`
                        }).join(' L ')} L 100 50 Z`}
                        fill="url(#grad)"
                        opacity="0.15"
                      />

                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Pricing indicators at the end */}
                    <div className="absolute top-2 right-2 bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 text-[8px] px-1.5 py-0.5 rounded font-bold">
                      Max: ${Math.max(...simResult.map(pt => pt.simulated_price)).toFixed(2)}
                    </div>
                    
                    <div className="absolute bottom-2 left-2 text-[8px] text-muted-foreground">
                      Start: ${simResult[0].simulated_price.toFixed(2)}
                    </div>
                    
                    <div className="absolute bottom-2 right-2 text-[8px] text-cyan-400 font-bold">
                      End: ${simResult[simResult.length - 1].simulated_price.toFixed(2)}
                    </div>

                  </div>

                  <div className="bg-black/15 p-2 rounded-lg border border-border/5 text-[9px] space-y-1 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>PROJECTED POOL LIQUIDITY:</span>
                      <span className="text-cyan-400 font-bold">
                        ${simResult[simResult.length - 1].simulated_liquidity.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>STAKING APY OPTIMIZATION:</span>
                      <span className="text-emerald-400 font-bold">APY COMPOUND MULTIPLIER: 2.0x</span>
                    </div>
                  </div>

                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Decision & Activity feed */}
          <Card className="bg-[#0b0f19]/70 border border-border/40 card-glow">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Terminal className="h-4 w-4 text-cyan-400" />
                AI Network Decision logs
              </CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Real-time chronologic logs generated by active agents operating across the consensus.
              </p>
            </CardHeader>

            <CardContent>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {getAllDecisionLogs().length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-10">
                    No active agent decision logs recorded. Spawn agents to seed metrics.
                  </p>
                ) : (
                  getAllDecisionLogs().map((log, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-2 rounded border border-border/5 font-mono text-[9px] transition-colors bg-black/10 text-muted-foreground space-y-1"
                      )}
                    >
                      <div className="flex justify-between items-center text-[8px]">
                        <span className="text-primary font-bold">[{log.agent_name}]</span>
                        <span className="text-[7px] text-muted-foreground">
                          {log.timestamp ? log.timestamp.split('T')[1].slice(0, 8) : 'N/A'}
                        </span>
                      </div>
                      <p className="text-foreground">{log.message}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  )
}
