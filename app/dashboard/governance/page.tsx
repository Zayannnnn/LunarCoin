'use client'

import { useEffect, useState, useRef } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import { LunarSDK } from '@/lib/sdk/lunar-sdk'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  Vote,
  TrendingUp,
  Coins,
  Cpu,
  ShieldCheck,
  Play,
  ArrowRight,
  Sparkles,
  Wallet,
  Activity,
  History,
  Lock,
  Unlock,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Plus,
  Terminal,
  Send,
  Building,
  Users,
  ChevronRight,
  Info
} from 'lucide-react'

interface Proposal {
  proposal_id: string
  title: string
  description: string
  creator: string
  creation_timestamp: string
  voting_deadline: string
  status: 'active' | 'passed' | 'defeated' | 'executed'
  proposal_type: 'protocol_upgrade' | 'gas_adjustment' | 'mining_difficulty' | 'treasury_spending' | 'network_parameter_change'
  param_key: string
  param_value: string
  votes: Record<string, { vote: string; power: number; timestamp: string }>
  yes_votes: number
  no_votes: number
  abstain_votes: number
  quorum_required: number
  bytecode_execution?: string
}

export default function GovernanceDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState<Proposal[]>([])
  
  // Staking & Treasury metrics states
  const [stakingStats, setStakingStats] = useState({
    total_staked: 0,
    stakers_count: 0,
    apy: 8.0,
    my_staked: 0
  })

  const [treasuryStats, setTreasuryStats] = useState<{
    balance: number
    total_allocated: number
    history: any[]
  }>({
    balance: 0,
    total_allocated: 0,
    history: []
  })

  // Wallet and local HUD link states
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)

  // Staking form states
  const [stakeAmount, setStakeAmount] = useState<number>(10)
  const [stakeActionType, setStakeActionType] = useState<'stake' | 'unstake'>('stake')
  const [stakeLoading, setStakeLoading] = useState(false)

  // Proposal wizard creation states
  const [wizardOpen, setWizardOpen] = useState(false)
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    type: 'treasury_spending',
    param_key: '',
    param_value: '',
    deadline_hours: 24
  })
  const [proposalSubmitLoading, setProposalSubmitLoading] = useState(false)

  // Web3 confirmation modal
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'vote' | 'execute' | 'proposal'>('vote')
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [voteChoice, setVoteChoice] = useState<'yes' | 'no' | 'abstain'>('yes')
  const [modalState, setModalState] = useState<'idle' | 'signing' | 'broadcasting' | 'mining' | 'success' | 'error'>('idle')
  const [modalError, setModalError] = useState('')
  const [modalTxHash, setModalTxHash] = useState('')

  // Terminal console feed log
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[DAO] Decentralized autonomous governance system online.`,
    `[DAO] Staking APY locked rate: 8.00% yield projection active.`,
    `[DAO] Treasury block-reward percentage: 10% on-chain sweep sweep.`
  ])
  const terminalEndRef = useRef<HTMLDivElement>(null)

  const appendTerminalLog = (log: string) => {
    const time = new Date().toLocaleTimeString()
    setTerminalLogs((prev) => [...prev, `[${time}] ${log}`])
  }

  // Load DAO stats dynamically
  const loadDAOStats = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true)
      
      const addr = LunarSDK.getConnectedWallet()
      setWalletAddress(addr)

      const [propData, stakeData, treasuryData] = await Promise.all([
        blockchainApi.getProposals(),
        blockchainApi.getStakingStats(),
        blockchainApi.getTreasuryStats()
      ])

      if (propData?.proposals) setProposals(propData.proposals)
      if (stakeData) setStakingStats(stakeData)
      if (treasuryData) setTreasuryStats(treasuryData)
      
    } catch (err: any) {
      console.error('Failed to sync DAO metrics:', err)
      appendTerminalLog(`[ERROR] Synchronization desync: ${err.message || 'Offline'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDAOStats(true)
    const interval = setInterval(() => loadDAOStats(false), 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalLogs])

  // Link Wallet HUD
  const handleConnectWallet = async () => {
    setWalletLoading(true)
    try {
      if (walletAddress) {
        LunarSDK.disconnectWallet()
        setWalletAddress(null)
        appendTerminalLog(`[WALLET] Linkage severed. Wallet cleared.`)
      } else {
        const addr = await LunarSDK.connectWallet()
        setWalletAddress(addr)
        appendTerminalLog(`[WALLET] Wallet linked securely: ${addr}`)
      }
    } catch (err: any) {
      alert(err.message || "Failed to establish secure wallet connection.")
      appendTerminalLog(`[WALLET ERROR] Signature linking failed.`)
    } finally {
      setWalletLoading(false)
    }
  }

  // Staking/Unstaking logic
  const handleStakingAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletAddress) {
      alert("Please connect your Web3 Wallet before locking LUNAR assets.")
      return
    }
    if (stakeAmount <= 0) return

    setStakeLoading(true)
    appendTerminalLog(`[STAKING] Drafting locked asset contract: ${stakeAmount} LUNAR for staking...`)
    
    try {
      if (stakeActionType === 'stake') {
        const res = await blockchainApi.stakeCoins(stakeAmount)
        if (res.status === 'success') {
          appendTerminalLog(`[STAKING SUCCESS] Stake locked! Total wallet staked: ${res.my_staked} LUNAR. Boost: 2.0x voting power active.`)
        } else {
          throw new Error(res.error || "Mempool staking reject.")
        }
      } else {
        const res = await blockchainApi.unstakeCoins(stakeAmount)
        if (res.status === 'success') {
          appendTerminalLog(`[STAKING SUCCESS] Unstake unlocked! Released ${stakeAmount} LUNAR back to spendable wallet.`)
        } else {
          throw new Error(res.error || "Mempool unstaking reject.")
        }
      }
      setStakeAmount(10)
      await loadDAOStats()
    } catch (err: any) {
      alert(err.message || "Staking action failed.")
      appendTerminalLog(`[STAKING ERROR] Staking rejected: ${err.message}`)
    } finally {
      setStakeLoading(false)
    }
  }

  // Trigger vote modal
  const openVoteModal = (prop: Proposal, choice: 'yes' | 'no' | 'abstain') => {
    if (!walletAddress) {
      alert("Please connect your Web3 Wallet before voting.")
      return
    }
    setSelectedProposal(prop)
    setVoteChoice(choice)
    setModalType('vote')
    setModalState('idle')
    setModalError('')
    setModalOpen(true)
  }

  // Trigger execute modal
  const openExecuteModal = (prop: Proposal) => {
    if (!walletAddress) {
      alert("Please connect your Web3 Wallet before triggering execution.")
      return
    }
    setSelectedProposal(prop)
    setModalType('execute')
    setModalState('idle')
    setModalError('')
    setModalOpen(true)
  }

  // Authorize Vote or Execute Signature
  const authorizeGovernanceSignature = async () => {
    if (!selectedProposal) return
    setModalState('signing')
    appendTerminalLog(`[TX] Waiting for user ECDSA signature authorization...`)

    // Cinematic delay
    await new Promise((r) => setTimeout(r, 800))

    try {
      setModalState('broadcasting')
      appendTerminalLog(`[TX] Authorized! Broadcasting payload to mempools...`)

      if (modalType === 'vote') {
        const res = await blockchainApi.voteProposal(selectedProposal.proposal_id, voteChoice)
        if (res.status === 'success') {
          appendTerminalLog(`[DAO SUCCESS] Vote queued! Choice: ${voteChoice.toUpperCase()} registered.`)
          setModalState('mining')
        } else {
          throw new Error(res.error || "Mempool vote reject.")
        }
      } else if (modalType === 'execute') {
        const res = await blockchainApi.executeProposal(selectedProposal.proposal_id)
        if (res.status === 'success') {
          appendTerminalLog(`[DAO SUCCESS] Execute queued! Bytecode Compiled successfully.`)
          setModalState('mining')
        } else {
          throw new Error(res.error || "Mempool execution reject.")
        }
      }
    } catch (err: any) {
      setModalError(err.message || "Transaction signature verification failed.")
      setModalState('error')
      appendTerminalLog(`[TX REJECTED] Governance transaction aborted: ${err.message}`)
    }
  }

  // Force local block mine to seal
  const triggerDAOBlockMine = async () => {
    setModalState('signing')
    appendTerminalLog(`[MINER] Sealing mempool with Proof-of-Work blockchain logs...`)
    
    try {
      await blockchainApi.startMining()
      await new Promise((r) => setTimeout(r, 2000))
      await blockchainApi.stopMining()
      
      setModalState('success')
      appendTerminalLog(`[MINER SUCCESS] Block sealed canonically. Dynamic treasury sweep complete.`)
      
      await loadDAOStats()
      setTimeout(() => setModalOpen(false), 1500)
    } catch (err: any) {
      appendTerminalLog(`[MINER ERROR] PoW seal failed: ${err.message}`)
      setModalState('success')
    }
  }

  // Draft new proposal wizard submission
  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletAddress) {
      alert("Please connect your Web3 Wallet before drafting proposals.")
      return
    }
    
    setProposalSubmitLoading(true)
    appendTerminalLog(`[DAO] Broadcasting drafted proposal mempool envelope...`)
    
    try {
      const res = await blockchainApi.createProposal(
        newProposal.title,
        newProposal.description,
        newProposal.type,
        newProposal.param_key,
        newProposal.param_value,
        newProposal.deadline_hours
      )
      
      if (res.status === 'success') {
        appendTerminalLog(`[DAO SUCCESS] Proposal drafted in mempool! ID: ${res.proposal.proposal_id}`)
        setWizardOpen(false)
        setNewProposal({
          title: '',
          description: '',
          type: 'treasury_spending',
          param_key: '',
          param_value: '',
          deadline_hours: 24
        })
        
        // Open confirmation modal in mining state so they can seal the proposal!
        setSelectedProposal(res.proposal)
        setModalType('proposal')
        setModalState('mining')
        setModalTxHash(res.proposal.proposal_id)
        setModalOpen(true)
      } else {
        throw new Error(res.error || "Mempool reject proposal creation.")
      }
    } catch (err: any) {
      alert(err.message || "Failed to draft proposal.")
      appendTerminalLog(`[DAO ERROR] Proposal rejected: ${err.message}`)
    } finally {
      setProposalSubmitLoading(false)
    }
  }

  // Calculations for forecast multipliers
  const simulatedVotingPower = Number(stakingStats.my_staked * 2.0)
  
  if (loading && proposals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-border/10">
          <Skeleton className="h-[40px] w-[250px]" />
          <Skeleton className="h-[36px] w-[120px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[120px]" />)}
        </div>
        <Skeleton className="h-[380px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6 relative select-none">
      {/* Dynamic Glassmorphic web3 confirmation modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-card/95 border border-primary/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col gap-5 select-none animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-border/10 font-mono text-xs text-primary">
              <span className="font-bold flex items-center gap-1.5 uppercase">
                <Vote className="h-4.5 w-4.5 animate-pulse" />
                {modalType === 'vote' ? 'Draft ECDSA Vote Signature' : 
                 modalType === 'proposal' ? 'Proposal Staged' : 'Authorize Proposal Execution'}
              </span>
              <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">
                GAS: 1200 UNITS
              </Badge>
            </div>

            {modalState === 'idle' && selectedProposal && (
              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground block uppercase text-[10px]">Proposal Target:</span>
                  <p className="font-bold text-foreground text-sm leading-normal">{selectedProposal.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 break-all">{selectedProposal.proposal_id}</p>
                </div>

                {modalType === 'vote' ? (
                  <div className="p-3.5 border border-border/10 bg-black/25 rounded-xl flex items-center justify-between">
                    <span className="text-muted-foreground">My Vote Weight Selection:</span>
                    <Badge className={cn(
                      "font-bold uppercase font-mono px-3 py-1 text-black",
                      voteChoice === 'yes' ? 'bg-primary' : 
                      voteChoice === 'no' ? 'bg-red-500' : 'bg-muted-foreground'
                    )}>
                      {voteChoice} (+{stakingStats.my_staked * 2.0 + (100 - stakingStats.my_staked)} votes)
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Compiled LunarVM execution Instructions
                    </span>
                    <pre className="max-h-[140px] overflow-y-auto scrollbar-thin bg-black/45 border border-border/10 rounded-lg p-3 font-mono text-[10px] text-cyan-400">
                      {selectedProposal.proposal_type === 'treasury_spending' ? `[
  ["PUSH", ${selectedProposal.param_value.split(':')[1]}],
  ["STORE", "transfer_amount_${selectedProposal.param_value.split(':')[0].slice(0,8)}"],
  ["RETURN"]
]` : `[
  ["PUSH", "${selectedProposal.param_value}"],
  ["STORE", "${selectedProposal.param_key || 'param'}"],
  ["RETURN"]
]`}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 border-t border-border/5 pt-3">
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase">Gas Price Limit:</span>
                    <span className="text-foreground">0.0001 LUNAR</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase">Simulated Fee:</span>
                    <span className="text-primary font-bold">0.1200 LUNAR</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 font-bold text-xs">
                    Cancel
                  </Button>
                  <Button onClick={authorizeGovernanceSignature} className="flex-1 font-bold text-xs bg-primary text-black">
                    Authorize ECDSA Signature
                  </Button>
                </div>
              </div>
            )}

            {modalState === 'signing' && (
              <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <div className="space-y-1 font-mono">
                  <h3 className="font-bold text-foreground">Signing Cryptographic Envelope...</h3>
                  <p className="text-xs text-muted-foreground">Linking ECDSA private keys locally</p>
                </div>
              </div>
            )}

            {modalState === 'broadcasting' && (
              <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
                <Activity className="h-10 w-10 text-cyan-400 animate-pulse" />
                <div className="space-y-1 font-mono">
                  <h3 className="font-bold text-cyan-400">Broadcasting Transaction Payload...</h3>
                  <p className="text-xs text-muted-foreground">Propagating to DAO ledger pool...</p>
                </div>
              </div>
            )}

            {modalState === 'mining' && (
              <div className="space-y-4 font-mono text-center py-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Plus className="h-12 w-12 text-primary animate-pulse" />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-foreground">Transaction Staged in Mempool!</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Draft successfully registered on local nodes.
                  </p>
                </div>

                <p className="text-[10px] text-muted-foreground px-4 leading-relaxed text-left border-t border-border/5 pt-3">
                  This transaction is queued in the local mempool. Click below to trigger immediateProof-of-Work block sealing to dynamically commit this consensus state changes on-chain!
                </p>

                <div className="flex gap-3 pt-3">
                  <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 text-xs font-bold">
                    Await Passive Miner
                  </Button>
                  <Button onClick={triggerDAOBlockMine} className="flex-1 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg">
                    Mine and Seal Block Now
                  </Button>
                </div>
              </div>
            )}

            {modalState === 'success' && (
              <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-400 animate-bounce" />
                <div className="space-y-1 font-mono">
                  <h3 className="font-bold text-emerald-400">Block Successfully Sealed!</h3>
                  <p className="text-xs text-muted-foreground">State committed to LunarCoin blockchain</p>
                </div>
              </div>
            )}

            {modalState === 'error' && (
              <div className="space-y-4 font-mono">
                <div className="flex flex-col items-center gap-2 py-4">
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                  <h3 className="font-bold text-red-400">Governance Aborted</h3>
                  <p className="text-xs text-red-400/80 bg-red-950/20 border border-red-900/30 p-3 rounded-lg leading-relaxed mt-2 text-center">
                    {modalError}
                  </p>
                </div>
                <div className="flex gap-3 border-t border-border/5 pt-3">
                  <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 text-xs font-bold">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 tracking-wide font-mono">
            <Vote className="h-6 w-6 text-primary" />
            Decentralized DAO Governance
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Self-governing parameter shifts, APY staking rewards, and dynamically funded treasury reserves
          </p>
        </div>

        {/* HUD Linkage */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 bg-black/25">
            <div className={cn(
              "h-2 w-2 rounded-full",
              walletAddress ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-red-500 animate-pulse"
            )} />
            <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
              {walletAddress ? 'LINK ACTIVE' : 'NO WALLET'}
            </span>
          </div>

          <Button
            onClick={handleConnectWallet}
            disabled={walletLoading}
            variant="outline"
            className={cn(
              'flex items-center gap-2 text-xs font-mono font-bold px-3.5 py-1.5 h-8 border select-none transition-all shadow-md',
              walletAddress
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 animate-pulse'
            )}
          >
            <Wallet className="h-3.5 w-3.5" />
            {walletAddress ? `${walletAddress.slice(0, 8)}... Connected` : 'Connect Web3 Wallet'}
          </Button>
        </div>
      </div>

      {/* Telemetry HUD head */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/45 border-border/30 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
              Treasury Balance
            </CardTitle>
            <Coins className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {treasuryStats.balance.toFixed(4)} LUN
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Dynamically sweeped rewards & gas</p>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border/30 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
              Total Staked Pool
            </CardTitle>
            <Lock className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {stakingStats.total_staked.toFixed(2)} LUN
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stakingStats.stakers_count} active locked stakers</p>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border/30 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
              Staking Reward Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-400">
              {stakingStats.apy.toFixed(1)}% APY
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Yield projections locking LUNAR</p>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border/30 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
              Active DAO proposals
            </CardTitle>
            <Cpu className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {proposals.length} drafted
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Quorum target: 20 LUN weight</p>
          </CardContent>
        </Card>
      </div>

      {/* Staking & Treasury dashboard tabs grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Governance Locked Staking Hub */}
        <Card className="bg-card/45 border-border/30 card-glow p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 uppercase font-mono mb-3">
              <Lock className="h-4 w-4 text-emerald-400" />
              Ecosystem Governance Staking
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-normal">
              Lock LUNAR in the staking reservoir to obtain a **2.0x weight boost** on governance voting power and earn staking yield allocations.
            </p>

            <form onSubmit={handleStakingAction} className="space-y-4">
              <div className="flex rounded-lg border border-border/20 bg-black/25 overflow-hidden p-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStakeActionType('stake')}
                  className={cn(
                    "flex-1 text-xs font-mono font-bold h-7.5 rounded-md",
                    stakeActionType === 'stake' ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Lock LUNAR
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStakeActionType('unstake')}
                  className={cn(
                    "flex-1 text-xs font-mono font-bold h-7.5 rounded-md",
                    stakeActionType === 'unstake' ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Unlock className="h-3 w-3 mr-1" />
                  Unlock LUNAR
                </Button>
              </div>

              <div className="space-y-1.5 font-mono">
                <Label htmlFor="stake-amount" className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Amount to {stakeActionType === 'stake' ? 'Lock' : 'Withdraw'} (LUNAR)
                </Label>
                <div className="relative">
                  <Input
                    id="stake-amount"
                    type="number"
                    min="1"
                    step="1"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                    className="bg-black/30 border-border/20 focus-visible:ring-primary/45 font-bold"
                  />
                  <span className="absolute top-2.5 right-3 text-[10px] text-muted-foreground font-bold">LUN</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={stakeLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-mono font-bold text-xs h-9.5 shadow-md flex items-center justify-center gap-1.5"
              >
                {stakeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : stakeActionType === 'stake' ? (
                  <>
                    <Lock className="h-4.5 w-4.5 fill-black" />
                    Lock Assets
                  </>
                ) : (
                  <>
                    <Unlock className="h-4.5 w-4.5 fill-black" />
                    Withdraw Assets
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 border-t border-border/5 pt-4 font-mono text-[10px] text-muted-foreground space-y-2.5">
              <div className="flex justify-between">
                <span>My Staked Lock:</span>
                <span className="text-emerald-400 font-bold">{stakingStats.my_staked.toFixed(2)} LUNAR</span>
              </div>
              <div className="flex justify-between border-t border-border/5 pt-2">
                <span>Voting Power Boost:</span>
                <span className="text-primary font-bold">{simulatedVotingPower.toFixed(2)} POWER (+2.0x)</span>
              </div>
            </div>
          </div>

          <div className="p-3 border border-border/10 bg-black/15 rounded-lg flex gap-2 mt-4">
            <Info className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[9px] text-muted-foreground leading-normal font-sans">
              Locked assets cannot be transferred, spent, or gas-executed in standard wallet forms until withdrawn back to spendable reserves. APY rewards compound dynamically.
            </p>
          </div>
        </Card>

        {/* Network Treasury Analytics Flow */}
        <Card className="bg-card/45 border-border/30 card-glow p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 uppercase font-mono mb-3">
              <Coins className="h-4 w-4 text-cyan-400 animate-pulse" />
              Decentralized Treasury Flow
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-normal">
              dynamic audited registry tracking block sweeps (+0.1 LUN block allocations) and passed ecosystem payouts.
            </p>

            <div className="bg-black/40 border border-border/10 rounded-xl p-3 max-h-[160px] overflow-y-auto scrollbar-thin space-y-2 select-text">
              {treasuryStats.history.length === 0 ? (
                <p className="text-xs text-muted-foreground font-mono italic text-center py-6">
                  Empty treasury flow ledger. Mine blocks or execute payouts to populate records.
                </p>
              ) : (
                <div className="divide-y divide-border/5 font-mono text-[10px]">
                  {treasuryStats.history.slice().reverse().map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between items-start gap-1">
                      <div className="space-y-0.5">
                        <span className={cn(
                          "font-bold uppercase text-[9px] px-1 rounded-sm",
                          item.type === 'inflow' ? 'bg-cyan-500/10 text-cyan-400' : 
                          item.type === 'stake_locked' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        )}>
                          {item.type}
                        </span>
                        <p className="text-muted-foreground mt-0.5 max-w-[170px] leading-relaxed truncate">{item.description}</p>
                      </div>
                      <span className={cn(
                        "font-bold shrink-0 mt-0.5",
                        item.type === 'inflow' || item.type === 'stake_locked' ? 'text-emerald-400' : 'text-red-400'
                      )}>
                        {item.type === 'inflow' || item.type === 'stake_locked' ? '+' : '-'}{item.amount.toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-border/5 pt-4 font-mono text-[10px] text-muted-foreground space-y-2">
            <div className="flex justify-between">
              <span>Dynamic Sweep Inflows:</span>
              <span className="text-cyan-400 font-bold">{(treasuryStats.balance + treasuryStats.total_allocated).toFixed(4)} LUNAR</span>
            </div>
            <div className="flex justify-between border-t border-border/5 pt-2">
              <span>Total Ecosystem Outflows:</span>
              <span className="text-red-400 font-bold">{treasuryStats.total_allocated.toFixed(4)} LUNAR</span>
            </div>
          </div>
        </Card>

        {/* Live VM Console activity feed */}
        <Card className="bg-card/45 border-border/30 card-glow p-5 flex flex-col justify-between h-[360px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-3 font-mono">
              <div className="flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-xs font-bold text-foreground uppercase">
                  Governance Activity Logs
                </span>
              </div>
              <Badge variant="outline" className="text-[8px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-1 py-0.5">
                LIVE
              </Badge>
            </div>

            <div className="flex-grow bg-black/75 border border-border/15 rounded-xl p-3 overflow-y-auto font-mono text-[9px] leading-relaxed text-emerald-400 flex flex-col gap-2 scrollbar-thin select-text">
              {terminalLogs.map((log, idx) => (
                <p key={idx} className={cn(
                  "break-words",
                  log.includes('[ERROR]') ? 'text-red-400' : 
                  log.includes('[WALLET]') ? 'text-cyan-300 font-bold' : 
                  log.includes('[MINER]') ? 'text-emerald-300' : 'text-emerald-400'
                )}>
                  {log}
                </p>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </Card>
      </div>

      {/* DAO Proposal Explorer Dashboard list */}
      <Card className="bg-card/45 border-border/30 card-glow p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-4 mb-4 font-mono">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
              <Vote className="h-4.5 w-4.5 text-primary" />
              DAO Proposals Explorer
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Draft network parameters or vote on proposals directly inside mempools
            </p>
          </div>
          
          <Button 
            onClick={() => setWizardOpen(!wizardOpen)}
            className="text-xs font-bold bg-primary text-black h-8 px-4 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Draft New Proposal
          </Button>
        </div>

        {/* Wizard creation form */}
        {wizardOpen && (
          <div className="bg-black/35 border border-primary/20 rounded-2xl p-5 mb-6 animate-in slide-in-from-top-4 duration-300">
            <h4 className="text-xs text-primary font-bold uppercase tracking-wider font-mono mb-4 flex items-center gap-1">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Governance Wizard Creator Draft
            </h4>
            <form onSubmit={handleCreateProposal} className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prop-title" className="text-[10px] text-muted-foreground uppercase">Proposal Title</Label>
                  <Input
                    id="prop-title"
                    required
                    value={newProposal.title}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="E.g. Adjust Mining Difficulty Target"
                    className="bg-black/30 border-border/20 focus-visible:ring-primary/45"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prop-desc" className="text-[10px] text-muted-foreground uppercase">Description & Details</Label>
                  <Textarea
                    id="prop-desc"
                    required
                    value={newProposal.description}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Explain the technical background of this governance change..."
                    className="bg-black/30 border-border/20 min-h-[90px] focus-visible:ring-primary/45"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="prop-type" className="text-[10px] text-muted-foreground uppercase">Proposal Type</Label>
                    <select
                      id="prop-type"
                      value={newProposal.type}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, type: e.target.value }))}
                      className="bg-black/30 border border-border/20 rounded-md h-9 w-full px-3 outline-none focus:border-primary/40 text-foreground"
                    >
                      <option value="treasury_spending" className="bg-black text-foreground">Treasury Spending</option>
                      <option value="mining_difficulty" className="bg-black text-foreground">Mining Difficulty</option>
                      <option value="gas_adjustment" className="bg-black text-foreground">Gas Adjustment</option>
                      <option value="protocol_upgrade" className="bg-black text-foreground">Protocol Upgrade</option>
                      <option value="network_parameter_change" className="bg-black text-foreground">Param Change</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prop-deadline" className="text-[10px] text-muted-foreground uppercase">Deadline (Hours)</Label>
                    <Input
                      id="prop-deadline"
                      type="number"
                      min="1"
                      max="168"
                      value={newProposal.deadline_hours}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, deadline_hours: Number(e.target.value) }))}
                      className="bg-black/30 border-border/20 h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="prop-key" className="text-[10px] text-muted-foreground uppercase">Target Key (Optional)</Label>
                    <Input
                      id="prop-key"
                      value={newProposal.param_key}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, param_key: e.target.value }))}
                      placeholder="E.g. difficulty / apy"
                      className="bg-black/30 border-border/20 h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prop-value" className="text-[10px] text-muted-foreground uppercase">Target Value / Recipient</Label>
                    <Input
                      id="prop-value"
                      required
                      value={newProposal.param_value}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, param_value: e.target.value }))}
                      placeholder="address:amount / target value"
                      className="bg-black/30 border-border/20 h-9"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setWizardOpen(false)}
                    className="flex-1 text-xs h-9.5"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={proposalSubmitLoading}
                    className="flex-1 text-xs h-9.5 bg-primary text-black font-bold"
                  >
                    {proposalSubmitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Proposal Envelope'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Proposals Grid List */}
        {proposals.length === 0 ? (
          <div className="border border-dashed border-border/20 rounded-2xl py-12 bg-black/10 text-center font-mono">
            <p className="text-xs text-muted-foreground italic">No governance proposals drafted yet.</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Staker weight locks are ready. Select New Proposal above to draft!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposals.slice().reverse().map((prop) => {
              const yesVotes = Number(prop.yes_votes || 0)
              const noVotes = Number(prop.no_votes || 0)
              const abstainVotes = Number(prop.abstain_votes || 0)
              const totalVotesWeight = yesVotes + noVotes + abstainVotes
              const quorumPct = Math.min(100, (totalVotesWeight / prop.quorum_required) * 100)
              
              const isVoteClosed = new Date() > new Date(prop.voting_deadline)
              
              return (
                <div 
                  key={prop.proposal_id}
                  className={cn(
                    "border border-border/10 rounded-2xl p-5 bg-black/25 flex flex-col justify-between relative hover:border-primary/20 hover:bg-black/35 transition-all duration-200 font-mono",
                    prop.status === 'executed' ? 'border-emerald-500/10' : 
                    prop.status === 'passed' ? 'border-primary/10' : ''
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="text-[9px] border-primary/25 text-primary uppercase font-bold px-2 py-0.5">
                        {prop.proposal_type.replace('_', ' ')}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[9px] uppercase font-bold",
                          prop.status === 'active' ? 'text-amber-400 bg-amber-400/5 animate-pulse' : 
                          prop.status === 'passed' ? 'text-cyan-400 bg-cyan-400/5' : 
                          prop.status === 'executed' ? 'text-emerald-400 bg-emerald-400/5' : 'text-red-400 bg-red-400/5'
                        )}
                      >
                        {prop.status}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-foreground leading-snug">{prop.title}</h4>
                      <p className="text-[9px] text-muted-foreground select-all">{prop.proposal_id}</p>
                    </div>

                    <p className="text-xs text-muted-foreground/80 leading-relaxed font-sans">{prop.description}</p>

                    {/* Voting Progress bar gauges */}
                    <div className="space-y-2 border-t border-border/5 pt-3 text-[10px]">
                      {/* Quorum Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-muted-foreground uppercase">
                          <span>Quorum Progress ({prop.quorum_required} weight)</span>
                          <span className="font-bold">{totalVotesWeight.toFixed(2)} locked ({quorumPct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              quorumPct >= 100 ? "bg-emerald-400" : "bg-primary"
                            )} 
                            style={{ width: `${quorumPct}%` }} 
                          />
                        </div>
                      </div>

                      {/* Yes/No/Abstain values */}
                      <div className="grid grid-cols-3 gap-2 border border-border/5 bg-black/15 p-2 rounded-lg text-center text-[9px]">
                        <div>
                          <span className="text-primary font-bold uppercase block">YES</span>
                          <span className="text-foreground font-mono block mt-0.5">{yesVotes.toFixed(1)} POWER</span>
                        </div>
                        <div className="border-l border-border/5 pl-2">
                          <span className="text-red-400 font-bold uppercase block">NO</span>
                          <span className="text-foreground font-mono block mt-0.5">{noVotes.toFixed(1)} POWER</span>
                        </div>
                        <div className="border-l border-border/5 pl-2">
                          <span className="text-muted-foreground font-bold uppercase block">ABSTAIN</span>
                          <span className="text-foreground font-mono block mt-0.5">{abstainVotes.toFixed(1)} POWER</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-border/5 flex flex-col gap-3 justify-between sm:flex-row sm:items-center">
                    <div className="text-[9px] text-muted-foreground">
                      Deadline: <span className="text-primary font-bold">{new Date(prop.voting_deadline).toLocaleString()}</span>
                    </div>

                    {prop.status === 'active' && !isVoteClosed ? (
                      <div className="flex gap-1.5">
                        <Button 
                          size="sm" 
                          onClick={() => openVoteModal(prop, 'yes')}
                          className="h-7 px-2.5 bg-primary hover:bg-primary/95 text-black text-[9px] font-bold"
                        >
                          Vote Yes
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => openVoteModal(prop, 'no')}
                          className="h-7 px-2.5 bg-red-500 hover:bg-red-600 text-black text-[9px] font-bold"
                        >
                          Vote No
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => openVoteModal(prop, 'abstain')}
                          className="h-7 px-2.5 bg-muted-foreground hover:bg-muted-foreground/80 text-black text-[9px] font-bold"
                        >
                          Abstain
                        </Button>
                      </div>
                    ) : prop.status === 'passed' ? (
                      <Button 
                        size="sm" 
                        onClick={() => openExecuteModal(prop)}
                        className="h-7 px-3 bg-emerald-500 hover:bg-emerald-600 text-black text-[9px] font-bold flex items-center gap-1 animate-pulse"
                      >
                        <Play className="h-3 w-3 fill-black animate-ping" />
                        Execute Proposal
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-[8px] uppercase tracking-wider text-muted-foreground shrink-0 self-end border-border/10 py-1 px-2.5 rounded-full select-text">
                        Concluded
                      </Badge>
                    )}
                  </div>

                  {prop.bytecode_execution && (
                    <div className="mt-3.5 border-t border-dashed border-border/15 pt-3 font-mono text-[9px]">
                      <span className="text-emerald-400 font-bold block mb-1">Executed Assembler Bytecode:</span>
                      <pre className="p-2 bg-black/40 border border-border/5 rounded-md text-emerald-400 select-text max-h-[80px] overflow-y-auto scrollbar-thin">
                        {prop.bytecode_execution}
                      </pre>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
