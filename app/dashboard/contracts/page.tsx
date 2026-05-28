'use client'

import { useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { DeployedContract, VmExecutionLog, VmStats } from '@/lib/types/blockchain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Cpu,
  Terminal,
  Activity,
  Database,
  Play,
  FileCode,
  Clock,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

const DEFAULT_ASM_CODE = `[
  ["PUSH", 21],
  ["PUSH", 2],
  ["MUL"],
  ["STORE", "answer"],
  ["LOAD", "answer"],
  ["RETURN"]
]`

export default function SmartContractsPage() {
  const [stats, setStats] = useState<VmStats | null>(null)
  const [contractsData, setContractsData] = useState<{
    contracts: DeployedContract[]
    total: number
    pending_contract_transactions: any[]
    execution_logs: VmExecutionLog[]
  } | null>(null)

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'deploy' | 'console'>('deploy')

  // Form states
  const [deployCode, setDeployCode] = useState(DEFAULT_ASM_CODE)
  const [deployGas, setDeployGas] = useState(1000)
  const [deployLoading, setDeployLoading] = useState(false)
  const [deployStatus, setDeployStatus] = useState<{ success: boolean; message: string } | null>(null)

  const [selectedContract, setSelectedContract] = useState('')
  const [executeGas, setExecuteGas] = useState(1000)
  const [executeLoading, setExecuteLoading] = useState(false)
  const [consoleResult, setConsoleResult] = useState<any>(null)

  // Inspected contract detail state
  const [inspectedContract, setInspectedContract] = useState<DeployedContract | null>(null)
  const [inspectedState, setInspectedState] = useState<Record<string, any> | null>(null)
  const [inspectedLogs, setInspectedLogs] = useState<VmExecutionLog[]>([])

  async function fetchVmAndContracts(showLoading = false) {
    try {
      if (showLoading) setLoading(true)
      const [vmStatsData, contractsListData] = await Promise.all([
        blockchainApi.getVmStats(),
        blockchainApi.getContracts()
      ])
      setStats(vmStatsData || null)
      setContractsData(contractsListData || null)

      // Auto-select first contract if none is selected
      const list = contractsListData?.contracts || []
      if (list.length > 0 && !selectedContract) {
        setSelectedContract(list[0].address)
      }
    } catch (err) {
      console.error('Failed to fetch smart contract metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVmAndContracts(true)
    const interval = setInterval(() => fetchVmAndContracts(false), 4000)
    return () => clearInterval(interval)
  }, [])

  // Auto-reload detail metrics of the inspected contract
  useEffect(() => {
    if (!inspectedContract) return
    let active = true
    async function reloadInspectDetail() {
      try {
        const detail = await blockchainApi.getContractDetail(inspectedContract.address)
        if (detail && active) {
          setInspectedState(detail.state || null)
          setInspectedLogs(detail.logs || [])
        }
      } catch (err) {
        console.error('Failed to fetch inspected contract detail:', err)
      }
    }
    reloadInspectDetail()
    const intv = setInterval(reloadInspectDetail, 4000)
    return () => {
      active = false
      clearInterval(intv)
    }
  }, [inspectedContract])

  const handleDeployContract = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeployLoading(true)
    setDeployStatus(null)
    try {
      // Safely parse user's assembly instructions
      let codeArray: any[]
      try {
        codeArray = JSON.parse(deployCode.trim())
        if (!Array.isArray(codeArray)) {
          throw new Error('Bytecode program must be a JSON array of instructions.')
        }
      } catch (parseErr: any) {
        setDeployStatus({
          success: false,
          message: `Code syntax error: ${parseErr.message}`
        })
        setDeployLoading(false)
        return
      }

      const res = await blockchainApi.deployContract(codeArray, deployGas)
      setDeployStatus({
        success: true,
        message: `Deployment transaction compiled and queued! Target address: ${res.contract_address}. Mine a block to seal it.`
      })
      fetchVmAndContracts(false)
    } catch (err: any) {
      setDeployStatus({
        success: false,
        message: err.message || 'Smart contract compilation failed.'
      })
    } finally {
      setDeployLoading(false)
    }
  }

  const handleExecuteContract = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedContract) return
    setExecuteLoading(true)
    setConsoleResult(null)
    try {
      const res = await blockchainApi.executeContract(selectedContract, executeGas)
      setConsoleResult(res.preview || res.transaction || res)
      fetchVmAndContracts(false)
    } catch (err: any) {
      setConsoleResult({ error: err.message || 'Contract call reverted or failed.' })
    } finally {
      setExecuteLoading(false)
    }
  }

  const contractsList = contractsData?.contracts || []
  const pendingTxs = contractsData?.pending_contract_transactions || []
  const vmLogsList = stats?.execution_logs || contractsData?.execution_logs || []

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">LunarVM Smart Contracts</h1>
          <p className="text-muted-foreground mt-1">Deploy and execute deterministic bytecode programs</p>
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
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary animate-pulse" />
            LunarVM Smart Contracts Workbench
          </h1>
          <p className="text-muted-foreground mt-1">
            Deterministic stack-based virtual machine sandbox. Build assembly models live on-chain.
          </p>
        </div>
        <div className="bg-muted/15 border border-border/10 rounded-lg px-4 py-2 text-xs font-mono select-none flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground mr-1 uppercase font-bold text-[10px]">VM Status:</span>
          <span className="text-primary font-bold">
            {(stats?.total_executions || 0) > 0 ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
      </div>

      {/* VM Telemetry Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              VM Throughput
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">
              {(stats?.contracts_per_second || 0).toFixed(3)}
            </div>
            <p className="text-xs text-muted-foreground">Transactions processed per sec</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Execution Speed
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.last_execution_time_ms || 0} ms
            </div>
            <p className="text-xs text-muted-foreground">Last deterministic run time</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Gas Consumption
            </CardTitle>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {stats?.avg_gas_used || 0}
            </div>
            <p className="text-xs text-muted-foreground">Average gas units spent per call</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Deployed Programs
            </CardTitle>
            <FileCode className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              {stats?.active_contracts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.contract_network_activity?.pending_contract_txs || 0} queued in mempool
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Workbench: Deploy and Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Workbench (Tabbed Deploy/Console) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader className="pb-0">
              <div className="flex border-b border-border/20">
                <button
                  onClick={() => setActiveTab('deploy')}
                  className={cn(
                    'px-4 py-2.5 text-sm font-bold tracking-wider uppercase border-b-2 transition-all',
                    activeTab === 'deploy'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  Deploy Smart Contract
                </button>
                <button
                  onClick={() => setActiveTab('console')}
                  className={cn(
                    'px-4 py-2.5 text-sm font-bold tracking-wider uppercase border-b-2 transition-all',
                    activeTab === 'console'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  Execution Console
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {activeTab === 'deploy' ? (
                <form onSubmit={handleDeployContract} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex justify-between">
                      <span>Assembler Bytecode (JSON Array Program)</span>
                      <span className="text-[9px] text-primary">Stack-Based Lunar VM</span>
                    </label>
                    <textarea
                      value={deployCode}
                      onChange={(e) => setDeployCode(e.target.value)}
                      spellCheck="false"
                      className="w-full min-h-[160px] bg-black/45 border border-border/20 p-3 rounded font-mono text-xs focus:outline-none focus:border-primary/50 text-foreground scrollbar-thin"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Gas Limit</label>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={deployGas}
                        onChange={(e) => setDeployGas(Number(e.target.value))}
                        className="w-full bg-black/40 border border-border/20 px-3 py-2 rounded text-sm font-mono text-foreground focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="sm:w-48 flex items-end">
                      <Button
                        type="submit"
                        disabled={deployLoading}
                        className="w-full py-5 text-xs font-bold"
                      >
                        {deployLoading ? 'Deploying...' : 'Compile & Deploy'}
                      </Button>
                    </div>
                  </div>

                  {deployStatus && (
                    <div
                      className={cn(
                        'text-xs font-mono border rounded p-3 leading-normal break-words flex gap-2.5',
                        deployStatus.success
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                      )}
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>{deployStatus.message}</div>
                    </div>
                  )}
                </form>
              ) : (
                <form onSubmit={handleExecuteContract} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Target Contract Address</label>
                    <select
                      value={selectedContract}
                      onChange={(e) => setSelectedContract(e.target.value)}
                      className="w-full bg-black/45 border border-border/20 p-2.5 rounded font-mono text-sm focus:outline-none focus:border-primary/50 text-foreground"
                    >
                      {(contractsList || []).length === 0 ? (
                        <option value="">No deployed contracts detected</option>
                      ) : (
                        (contractsList || []).map((c) => (
                          <option key={c.address} value={c.address}>
                            {c.address} (Created at Block #{c.created_block})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Call Gas Limit</label>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={executeGas}
                        onChange={(e) => setExecuteGas(Number(e.target.value))}
                        className="w-full bg-black/40 border border-border/20 px-3 py-2 rounded text-sm font-mono text-foreground focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="sm:w-48 flex items-end">
                      <Button
                        type="submit"
                        disabled={executeLoading || !selectedContract}
                        className="w-full py-5 text-xs font-bold"
                      >
                        <Play className="h-3.5 w-3.5 mr-1" />
                        {executeLoading ? 'Running...' : 'Queue Execution'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                      <Terminal className="h-3 w-3 text-cyan-400" />
                      LunarVM Workbench Output Console
                    </label>
                    <pre className="w-full min-h-[120px] bg-black/55 border border-border/25 p-3 rounded font-mono text-xs text-cyan-400/90 overflow-x-auto whitespace-pre scrollbar-thin">
                      {consoleResult
                        ? JSON.stringify(consoleResult, null, 2)
                        : 'Waiting for execution call... Output yields virtual machine stack return values.'}
                    </pre>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* VM Activity Logs Panel */}
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                LunarVM Execution Audit Trail
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time chronological trace of smart contract programs compiled and processed
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                {(vmLogsList || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-6">
                    Waiting for smart contract operations... Deploy programs to register events.
                  </p>
                ) : (
                  (vmLogsList || []).slice().reverse().map((log, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'border p-2.5 rounded-lg flex items-center justify-between text-xs font-mono transition-colors',
                        log.ok
                          ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/5 border-rose-500/10 text-rose-400'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">[{log.ok ? 'SUCCESS' : 'FAILED'}]</span>
                        <span className="text-foreground capitalize">{log.type.replace('contract_', '')}</span>
                        <span className="text-muted-foreground font-light text-[10px]">·</span>
                        <span className="text-muted-foreground text-[10px]" title={log.contract_address}>
                          {log.contract_address ? log.contract_address.slice(0, 16) + '...' : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px]">
                        <span>gas: {log.gas_used}</span>
                        <span className="text-muted-foreground">
                          {log.timestamp ? log.timestamp.split('T')[1].slice(0, 8) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Explorer/Inspector Workbench */}
        <div className="space-y-6">
          {/* Contracts Explorer list */}
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" />
                Contract Database Explorer
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect deterministic bytecodes, storage maps, and variables
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                {(contractsList || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-4 text-center">
                    No active smart contracts deployed yet.
                  </p>
                ) : (
                  (contractsList || []).map((c) => {
                    const isInspected = inspectedContract?.address === c.address
                    return (
                      <div
                        key={c.address}
                        onClick={() => {
                          if (isInspected) {
                            setInspectedContract(null)
                            setInspectedState(null)
                            setInspectedLogs([])
                          } else {
                            setInspectedContract(c)
                            setInspectedState(c.storage || null)
                          }
                        }}
                        className={cn(
                          'p-3 border rounded-xl bg-black/20 hover:bg-black/40 cursor-pointer transition-colors flex items-center justify-between',
                          isInspected ? 'border-primary/50' : 'border-border/10'
                        )}
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-mono text-xs font-semibold text-primary truncate select-all">{c.address}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                            <span>Block #{c.created_block}</span>
                            <span>·</span>
                            <span>{Object.keys(c.storage || {}).length} slots</span>
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 text-muted-foreground transition-transform shrink-0',
                            isInspected && 'rotate-90 text-primary'
                          )}
                        />
                      </div>
                    )
                  })
                )}

                {/* Pending mempool deploys */}
                {(pendingTxs || []).map((tx) => (
                  <div
                    key={tx.tx_id}
                    className="p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-xl flex items-center justify-between opacity-80"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-mono text-xs font-semibold text-yellow-400 truncate">
                        {tx.contract_address || tx.tx_id}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        Pending mempool: {tx.type.replace('contract_', '')}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-yellow-500/30 text-yellow-400 uppercase font-bold animate-pulse shrink-0">
                      Queue
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Storage slots & Code Inspector */}
          {inspectedContract && (
            <Card className="bg-[#0b0f19]/70 border border-primary/25 shadow-[0_0_20px_oklch(0.75_0.15_195/0.05)] animate-in fade-in slide-in-from-right-3 duration-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-1.5 font-bold">
                  <Database className="h-3.5 w-3.5 text-primary" />
                  Inspector: {inspectedContract.address.slice(0, 10)}...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active State Database Storage</span>
                  <div className="bg-black/35 p-3 rounded-lg border border-border/10 font-mono text-xs space-y-1 max-h-[140px] overflow-y-auto scrollbar-thin">
                    {!inspectedState || Object.keys(inspectedState).length === 0 ? (
                      <p className="text-[10px] text-muted-foreground italic">Storage is currently empty</p>
                    ) : (
                      Object.entries(inspectedState).map(([key, val]) => (
                        <div key={key} className="flex justify-between border-b border-border/5 pb-1">
                          <span className="text-cyan-400">{key}:</span>
                          <span className="text-foreground">{JSON.stringify(val)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Assembly Bytecode Code</span>
                  <pre className="bg-black/45 p-3 rounded-lg border border-border/10 font-mono text-[10px] text-muted-foreground max-h-[160px] overflow-y-auto whitespace-pre scrollbar-thin select-all">
                    {typeof inspectedContract.code === 'string'
                      ? inspectedContract.code
                      : JSON.stringify(inspectedContract.code, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
