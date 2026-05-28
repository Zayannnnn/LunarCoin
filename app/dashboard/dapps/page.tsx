'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { blockchainApi } from '@/lib/api/blockchain'
import { LunarSDK } from '@/lib/sdk/lunar-sdk'
import type { DeployedContract, VmStats } from '@/lib/types/blockchain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Boxes,
  Cpu,
  Activity,
  FileCode,
  Sparkles,
  Wallet,
  Play,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Plus
} from 'lucide-react'

// De-duplicate types or interfaces locally if needed
interface DAppTemplate {
  id: string
  title: string
  description: string
  icon: string
  author: string
  version: string
  defaultGas: number
  bytecode: string
}

const DAPP_TEMPLATES: DAppTemplate[] = [
  {
    id: 'voting',
    title: 'Decentralized Voting App',
    description: 'Cryptographically secure multi-candidate poll ledger with dynamic state storage and audits.',
    icon: '🗳️',
    author: 'LunarLabs',
    version: 'v1.0.0',
    defaultGas: 1500,
    bytecode: `[
  ["PUSH", 0],
  ["STORE", "candidate_A"],
  ["PUSH", 0],
  ["STORE", "candidate_B"],
  ["RETURN"]
]`
  },
  {
    id: 'token',
    title: 'LUNAR ERC-20 Utility Token',
    description: 'Deterministic token manager to mint, burn, transfer, and audit custom token supplies on-chain.',
    icon: '🪙',
    author: 'VM Standard',
    version: 'v1.2.0',
    defaultGas: 2500,
    bytecode: `[
  ["PUSH", 1000],
  ["STORE", "balance_owner"],
  ["PUSH", 0],
  ["STORE", "balance_recipient"],
  ["RETURN"]
]`
  },
  {
    id: 'dao',
    title: 'DAO Governance Council',
    description: 'Decentralized autonomous organization simulator managing proposal allocations and vote allocations.',
    icon: '🏛️',
    author: 'ConsensusDAO',
    version: 'v0.9.5',
    defaultGas: 3000,
    bytecode: `[
  ["PUSH", 0],
  ["STORE", "proposals_count"],
  ["PUSH", 100],
  ["STORE", "governance_shares"],
  ["RETURN"]
]`
  },
  {
    id: 'escrow',
    title: 'Escrow Trust Contract',
    description: 'Secure trade settlement agent holding and release transactions deterministically based on conditions.',
    icon: '💼',
    author: 'SecurityWG',
    version: 'v1.0.1',
    defaultGas: 1800,
    bytecode: `[
  ["PUSH", 500],
  ["STORE", "trust_funds"],
  ["PUSH", 0],
  ["STORE", "released"],
  ["RETURN"]
]`
  },
  {
    id: 'nft',
    title: 'LunarNFT Digital Registry',
    description: 'Register, own, and transfer unique non-fungible collectibles on top of stack VM structures.',
    icon: '🎨',
    author: 'ArtDAO',
    version: 'v1.1.0',
    defaultGas: 2200,
    bytecode: `[
  ["PUSH", "LunarCollectible #001"],
  ["STORE", "nft_id"],
  ["PUSH", "mock-wallet"],
  ["STORE", "nft_owner"],
  ["RETURN"]
]`
  },
  {
    id: 'staking',
    title: 'Staking Yield Pool',
    description: 'Stake LUNAR coins into on-chain yield reservoirs and calculate accumulated compound interest.',
    icon: '📈',
    author: 'DeFiLabs',
    version: 'v2.0.0',
    defaultGas: 2000,
    bytecode: `[
  ["PUSH", 0],
  ["STORE", "total_staked"],
  ["PUSH", 5],
  ["STORE", "apy_interest_rate"],
  ["RETURN"]
]`
  }
]

export default function DAppsExplorerPage() {
  const [stats, setStats] = useState<VmStats | null>(null)
  const [contractsList, setContractsList] = useState<DeployedContract[]>([])
  const [loading, setLoading] = useState(true)

  // Wallet State
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)

  // Fee simulator state
  const [simulateGas, setSimulateGas] = useState(2000)

  async function fetchDAppDashboard(showLoading = false) {
    try {
      if (showLoading) setLoading(true)
      const [vmStatsData, contractsData] = await Promise.all([
        blockchainApi.getVmStats(),
        blockchainApi.getContracts()
      ])
      setStats(vmStatsData || null)
      setContractsList(contractsData?.contracts || [])
      setConnectedWallet(LunarSDK.getConnectedWallet())
    } catch (err) {
      console.error('Failed to load DApp dashboard metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDAppDashboard(true)
    const interval = setInterval(() => fetchDAppDashboard(false), 4000)
    return () => clearInterval(interval)
  }, [])

  const handleConnectWallet = async () => {
    setWalletLoading(true)
    try {
      if (connectedWallet) {
        LunarSDK.disconnectWallet()
        setConnectedWallet(null)
      } else {
        const addr = await LunarSDK.connectWallet()
        setConnectedWallet(addr)
      }
    } catch (err) {
      alert("Failed to connect wallet: Make sure the blockchain backend server is running.")
    } finally {
      setWalletLoading(false)
    }
  }

  // Calculate simulated fee (LUNAR) based on gas units
  const simulatedFee = Number((simulateGas * 0.0001).toFixed(4))

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">DApps Workspace</h1>
          <p className="text-muted-foreground mt-1">Discover, deploy, and interact with decentralized applications</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <Skeleton className="h-[280px]" />
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
            <Boxes className="h-6 w-6 text-primary" />
            LunarVM DApps Workbench
          </h1>
          <p className="text-muted-foreground mt-1">
            Build, launch, and execute programmables on top of stack VM decentralized networks
          </p>
        </div>
        
        {/* Wallet Connector button */}
        <Button
          onClick={handleConnectWallet}
          disabled={walletLoading}
          variant="outline"
          className={cn(
            'flex items-center gap-2 text-xs font-mono font-bold tracking-wider select-none px-4 py-2 border shadow-lg transition-all',
            connectedWallet
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-primary/10 text-primary border-primary/25 hover:bg-primary/20 animate-pulse'
          )}
        >
          <Wallet className="h-4 w-4" />
          {walletLoading ? (
            'Linking...'
          ) : connectedWallet ? (
            `${connectedWallet.slice(0, 10)}... Connected`
          ) : (
            'Connect Web3 Wallet'
          )}
        </Button>
      </div>

      {/* VM Analytics Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              VM Telemetries
            </CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">
              {stats?.active_contracts || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active DApps deployed on-chain</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              DApp Throughput
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.contracts_per_second || 0).toFixed(3)}
            </div>
            <p className="text-xs text-muted-foreground">Smart contracts processed/sec</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              VM Average Gas
            </CardTitle>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {stats?.avg_gas_used || 0}
            </div>
            <p className="text-xs text-muted-foreground">Gas spent per contract execution</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Mempool Queues
            </CardTitle>
            <FileCode className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              {stats?.contract_network_activity?.pending_contract_txs || 0}
            </div>
            <p className="text-xs text-muted-foreground">VM calls waiting in mempool</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Templates Carousel layout */}
      <Card className="bg-card/50 border-border/50 card-glow">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Featured DApp Templates</span>
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary uppercase text-[9px] tracking-widest px-2 py-0.5 font-bold">
              Starter Packs
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select an educational starter pack to launch, inspect, and evaluate VM contracts instantly
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAPP_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="border border-border/10 rounded-2xl p-4 bg-black/25 flex flex-col justify-between hover:border-primary/20 hover:bg-black/35 transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">{tmpl.icon}</span>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase">{tmpl.author}</span>
                      <p className="text-[10px] font-mono text-primary font-semibold">{tmpl.version}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{tmpl.title}</h3>
                  <p className="text-xs text-muted-foreground leading-normal">{tmpl.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-border/5 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-muted-foreground">
                    Est. Gas: <span className="text-cyan-400 font-bold">{tmpl.defaultGas} units</span>
                  </div>
                  
                  <Link href={`/dashboard/dapps/${tmpl.id}`}>
                    <Button size="sm" className="text-[10px] h-8 px-3 font-bold flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Launch DApp
                      <ArrowRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* On-Chain DApp Registry & Fee Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* On-Chain DApp Registry */}
        <Card className="bg-card/50 border-border/50 card-glow lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" />
              On-Chain DApp Registry
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live index of active deployed contracts that are registered or interactive
            </p>
          </CardHeader>
          <CardContent className="p-0 max-h-[300px] overflow-y-auto scrollbar-thin">
            {contractsList.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-10">
                No active DApp contracts deployed yet. Select a template above to deploy!
              </p>
            ) : (
              <div className="divide-y divide-border/10 font-mono text-xs">
                {contractsList.map((contract) => (
                  <div key={contract.address} className="p-3 hover:bg-black/10 transition-colors flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="text-primary font-bold truncate select-all">{contract.address}</p>
                      <div className="flex gap-2.5 text-[9px] text-muted-foreground">
                        <span>Block #{contract.created_block}</span>
                        <span>·</span>
                        <span>{Object.keys(contract.storage || {}).length} storage variables</span>
                      </div>
                    </div>
                    <Link href={`/dashboard/dapps/voting?address=${contract.address}`}>
                      <Button size="sm" variant="outline" className="text-[10px] border-primary/20 text-primary h-7 px-2 font-bold shrink-0">
                        Interact
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Fee Simulator widgets */}
        <Card className="bg-card/50 border-border/50 card-glow flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Fee Estimator Simulator
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Predict DApp execution gas costs dynamically
            </p>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3 mt-1.5 flex-grow flex flex-col justify-center">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex justify-between">
                  <span>Estimated VM Gas units</span>
                  <span className="text-cyan-400 font-bold font-mono">{simulateGas} units</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="8000"
                  step="100"
                  value={simulateGas}
                  onChange={(e) => setSimulateGas(Number(e.target.value))}
                  className="w-full accent-primary h-1 bg-muted rounded-full cursor-pointer appearance-none"
                />
              </div>

              <div className="space-y-3 border-t border-border/10 pt-4 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Price Ratio:</span>
                  <span className="text-foreground">0.0001 LUNAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Fee:</span>
                  <span className="text-primary font-bold">{simulatedFee} LUNAR</span>
                </div>
              </div>
            </div>

            <div className="p-3 border border-border/15 bg-black/15 rounded-lg flex gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
              <p className="text-[9px] text-muted-foreground leading-normal">
                Estimated fees are settled directly from your connected local ECDSA wallet balance. Insufficient LUNAR balance triggers transaction rejection warnings dynamically.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
