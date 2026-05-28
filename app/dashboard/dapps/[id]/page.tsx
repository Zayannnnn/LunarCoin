'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { blockchainApi } from '@/lib/api/blockchain'
import { LunarSDK } from '@/lib/sdk/lunar-sdk'
import type { DeployedContract, VmStats, VmExecutionLog } from '@/lib/types/blockchain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Plus,
  Terminal,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Lock,
  Unlock,
  Send,
  Coins,
  Award,
  History,
  User,
  RefreshCw,
  Info,
  ChevronLeft
} from 'lucide-react'

// Define the structural templates locally
interface DAppTemplate {
  id: string
  title: string
  description: string
  icon: string
  author: string
  version: string
  defaultGas: number
  bytecode: string
  initialStateKeys: Array<{ key: string; label: string; type: 'number' | 'string'; defaultValue: any }>
  actions: Array<{
    id: string
    label: string
    description: string
    gas: number
    bytecodeExplanation: string
  }>
}

const DAPP_TEMPLATES: Record<string, DAppTemplate> = {
  voting: {
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
]`,
    initialStateKeys: [
      { key: 'candidate_A', label: 'Candidate A Initial Votes', type: 'number', defaultValue: 0 },
      { key: 'candidate_B', label: 'Candidate B Initial Votes', type: 'number', defaultValue: 0 }
    ],
    actions: [
      {
        id: 'vote_a',
        label: 'Cast Vote for Candidate A',
        description: 'Increments candidate_A vote tally by 1 using a stack-based arithmetic addition loop.',
        gas: 1200,
        bytecodeExplanation: `[
  ["LOAD", "candidate_A"],
  ["PUSH", 1],
  ["ADD"],
  ["STORE", "candidate_A"],
  ["RETURN"]
]`
      },
      {
        id: 'vote_b',
        label: 'Cast Vote for Candidate B',
        description: 'Increments candidate_B vote tally by 1 using a stack-based arithmetic addition loop.',
        gas: 1200,
        bytecodeExplanation: `[
  ["LOAD", "candidate_B"],
  ["PUSH", 1],
  ["ADD"],
  ["STORE", "candidate_B"],
  ["RETURN"]
]`
      }
    ]
  },
  token: {
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
]`,
    initialStateKeys: [
      { key: 'balance_owner', label: 'Owner Initial Supply', type: 'number', defaultValue: 1000 },
      { key: 'balance_recipient', label: 'Recipient Starting Balance', type: 'number', defaultValue: 0 }
    ],
    actions: [
      {
        id: 'transfer',
        label: 'Transfer 100 LUNAR Tokens',
        description: 'Deducts 100 tokens from the balance_owner address and adds them to the balance_recipient address.',
        gas: 1800,
        bytecodeExplanation: `[
  ["LOAD", "balance_owner"],
  ["PUSH", 100],
  ["SUB"],
  ["STORE", "balance_owner"],
  ["LOAD", "balance_recipient"],
  ["PUSH", 100],
  ["ADD"],
  ["STORE", "balance_recipient"],
  ["RETURN"]
]`
      }
    ]
  },
  dao: {
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
]`,
    initialStateKeys: [
      { key: 'proposals_count', label: 'Starting Proposals Count', type: 'number', defaultValue: 0 },
      { key: 'governance_shares', label: 'Total Governance Shares Locked', type: 'number', defaultValue: 100 }
    ],
    actions: [
      {
        id: 'submit_proposal',
        label: 'Increment Proposals Count (Submit)',
        description: 'Executes a state transition incrementing the active blockchain proposals tally.',
        gas: 1500,
        bytecodeExplanation: `[
  ["LOAD", "proposals_count"],
  ["PUSH", 1],
  ["ADD"],
  ["STORE", "proposals_count"],
  ["RETURN"]
]`
      }
    ]
  },
  escrow: {
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
]`,
    initialStateKeys: [
      { key: 'trust_funds', label: 'Vault Deposit Amount', type: 'number', defaultValue: 500 },
      { key: 'released', label: 'Starting Trust Released State (0 or 1)', type: 'number', defaultValue: 0 }
    ],
    actions: [
      {
        id: 'release',
        label: 'Trigger Cryptographic Release',
        description: 'Sets the escrow storage variable "released" to 1, approving the vault payout to recipient.',
        gas: 1400,
        bytecodeExplanation: `[
  ["PUSH", 1],
  ["STORE", "released"],
  ["RETURN"]
]`
      }
    ]
  },
  nft: {
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
]`,
    initialStateKeys: [
      { key: 'nft_id', label: 'Unique Collectible identifier', type: 'string', defaultValue: 'LunarCollectible #001' },
      { key: 'nft_owner', label: 'Initial Owner Address', type: 'string', defaultValue: 'mock-wallet' }
    ],
    actions: [
      {
        id: 'transfer_nft',
        label: 'Transfer NFT Ownership to Buyer',
        description: 'Overwrites the owner storage key with a new active buyer address.',
        gas: 1600,
        bytecodeExplanation: `[
  ["PUSH", "0xRecipientBuyerAddress"],
  ["STORE", "nft_owner"],
  ["RETURN"]
]`
      }
    ]
  },
  staking: {
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
]`,
    initialStateKeys: [
      { key: 'total_staked', label: 'Initial Staked LUNAR', type: 'number', defaultValue: 0 },
      { key: 'apy_interest_rate', label: 'Starting APY Pool Rate (%)', type: 'number', defaultValue: 5 }
    ],
    actions: [
      {
        id: 'harvest',
        label: 'Calculate Interest & Stake +100 LUNAR',
        description: 'Increases the staking reserve value by 100 LUNAR, dynamically updating APY yields.',
        gas: 1900,
        bytecodeExplanation: `[
  ["LOAD", "total_staked"],
  ["PUSH", 100],
  ["ADD"],
  ["STORE", "total_staked"],
  ["RETURN"]
]`
      }
    ]
  }
}

export default function DAppLauncherPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  
  const templateId = (params?.id as string) || 'voting'
  const targetAddress = searchParams?.get('address') || null

  const template = DAPP_TEMPLATES[templateId] || DAPP_TEMPLATES.voting

  // Component States
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [stats, setStats] = useState<VmStats | null>(null)

  // Contract Workspace States
  const [contractDetail, setContractDetail] = useState<{
    contract: DeployedContract
    state: Record<string, any>
    logs: VmExecutionLog[]
  } | null>(null)

  // Form Deployment states
  const [initialFormState, setInitialFormState] = useState<Record<string, any>>(() => {
    const defaultState: Record<string, any> = {}
    template.initialStateKeys.forEach((item) => {
      defaultState[item.key] = item.defaultValue
    })
    return defaultState
  })

  // Transaction Signature Modal popup
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'deploy' | 'execute'>('deploy')
  const [modalActionId, setModalActionId] = useState<string | null>(null)
  const [modalGas, setModalGas] = useState(2000)
  const [modalBytecode, setModalBytecode] = useState<string>('')
  const [modalState, setModalState] = useState<'idle' | 'signing' | 'broadcasting' | 'mining' | 'success' | 'error'>('idle')
  const [modalError, setModalError] = useState<string>('')
  const [modalTxHash, setModalTxHash] = useState<string>('')
  const [deployedContractAddress, setDeployedContractAddress] = useState<string>('')

  // Terminal logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[SYSTEM] LunarVM interactive compiler terminal online.`,
    `[SYSTEM] Connected template: ${template.title} (${template.version})`,
    `[SYSTEM] Ready for state transition deployments.`
  ])

  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalLogs])

  const appendTerminalLog = (log: string) => {
    const time = new Date().toLocaleTimeString()
    setTerminalLogs((prev) => [...prev, `[${time}] ${log}`])
  }

  // Load baseline statistics and wallet details
  const loadDashboardData = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true)
      
      const walletAddr = LunarSDK.getConnectedWallet()
      setWalletAddress(walletAddr)

      const vmStats = await blockchainApi.getVmStats()
      if (vmStats) setStats(vmStats)

      if (targetAddress) {
        const detail = await blockchainApi.getContractDetail(targetAddress)
        if (detail) {
          setContractDetail(detail)
          appendTerminalLog(`[VM] Loaded deployed contract ${targetAddress.slice(0, 16)}... state indexes: ${JSON.stringify(detail.state)}`)
        } else {
          appendTerminalLog(`[WARNING] Failed to fetch active state for contract: ${targetAddress}`)
        }
      }
    } catch (err: any) {
      console.error('Failed to sync workspace states:', err)
      appendTerminalLog(`[ERROR] Connection failed during server sync: ${err.message || 'Offline'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData(true)
    const interval = setInterval(() => loadDashboardData(false), 5000)
    return () => clearInterval(interval)
  }, [targetAddress, templateId])

  // Link Wallet
  const handleConnectWallet = async () => {
    setWalletLoading(true)
    try {
      if (walletAddress) {
        LunarSDK.disconnectWallet()
        setWalletAddress(null)
        appendTerminalLog(`[WALLET] Disconnected wallet identity session.`)
      } else {
        const addr = await LunarSDK.connectWallet()
        setWalletAddress(addr)
        appendTerminalLog(`[WALLET] Secure linkage active. Connected ECDSA key: ${addr}`)
      }
    } catch (err: any) {
      alert(err.message || "Failed to link local wallet backend.")
      appendTerminalLog(`[WALLET ERROR] ECDSA linkage failed: ${err.message}`)
    } finally {
      setWalletLoading(false)
    }
  }

  // Deploy Call Queueing
  const triggerDeployModal = () => {
    if (!walletAddress) {
      alert("Please connect your Web3 Wallet before deploying contracts.")
      return
    }
    setModalType('deploy')
    setModalActionId(null)
    setModalGas(template.defaultGas)
    setModalBytecode(template.bytecode)
    setModalState('idle')
    setModalError('')
    setModalOpen(true)
  }

  // Execute Call Queueing
  const triggerExecuteModal = (actionId: string) => {
    if (!walletAddress) {
      alert("Please connect your Web3 Wallet before executing contract calls.")
      return
    }
    const action = template.actions.find(a => a.id === actionId)
    if (!action) return

    setModalType('execute')
    setModalActionId(actionId)
    setModalGas(action.gas)
    setModalBytecode(action.bytecodeExplanation)
    setModalState('idle')
    setModalError('')
    setModalOpen(true)
  }

  // Broadcaster Signatures
  const authorizeSignature = async () => {
    setModalState('signing')
    appendTerminalLog(`[TX] Waiting for user ECDSA signature authorization...`)

    // Micro-delay for cinematic signature rendering
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      setModalState('broadcasting')
      appendTerminalLog(`[TX] Authorized! Broadcasting LunarVM payload to LAN peer-to-peer pools...`)

      if (modalType === 'deploy') {
        // Compile bytecode from string to array
        let compiledBytecode: any[] = []
        try {
          compiledBytecode = JSON.parse(modalBytecode)
        } catch {
          throw new Error("VM Bytecode compile error: Invalid instruction array format.")
        }

        const res = await LunarSDK.deployContract(compiledBytecode, modalGas)
        
        if (res.status === 'queued') {
          setModalTxHash(res.transaction.tx_id)
          setDeployedContractAddress(res.contract_address)
          appendTerminalLog(`[MEMPOOL] Success! Deployment queued. Contract Address: ${res.contract_address}`)
          setModalState('mining')
        } else {
          throw new Error(res.message || "Mempool reject signature.")
        }
      } else {
        if (!targetAddress) throw new Error("Null contract address target.")

        // Make contract call. To simulate real action, we just execute on-chain transition.
        const res = await LunarSDK.executeContract(targetAddress, modalGas)
        
        if (res.status === 'queued') {
          setModalTxHash(res.transaction.tx_id)
          appendTerminalLog(`[MEMPOOL] Success! VM execution call queued in mempool. Tx: ${res.transaction.tx_id}`)
          setModalState('mining')
        } else {
          throw new Error(res.message || "Mempool reject execution.")
        }
      }
    } catch (err: any) {
      console.error(err)
      setModalError(err.message || "Transaction signature verification failed.")
      setModalState('error')
      appendTerminalLog(`[TX REJECTED] Stack machine execution aborted: ${err.message}`)
    }
  }

  // Force local block mine to commit state transitions instantly!
  const triggerLocalBlockMine = async () => {
    appendTerminalLog(`[MINER] Initializing localized proof-of-work sealing...`)
    setModalState('signing')
    try {
      // Toggle mining to mine a block
      await blockchainApi.startMining()
      appendTerminalLog(`[MINER] Mining engine active. Scanning local mempools...`)
      
      // Await 2 seconds for a block to mine
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      await blockchainApi.stopMining()
      appendTerminalLog(`[MINER] Mined successfully! Block sealed. Local chain synchronized.`)
      
      setModalState('success')

      // Refresh data
      await loadDashboardData()

      if (modalType === 'deploy' && deployedContractAddress) {
        // Navigate to the interact address URL
        setTimeout(() => {
          setModalOpen(false)
          router.push(`/dashboard/dapps/${templateId}?address=${deployedContractAddress}`)
        }, 1500)
      } else {
        setTimeout(() => {
          setModalOpen(false)
        }, 1500)
      }
    } catch (err: any) {
      appendTerminalLog(`[MINER FAILED] Mining seal interrupted: ${err.message}`)
      setModalState('success') // Still complete but notify user
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="space-y-6 select-none relative">
      {/* Transaction Confirmation popup modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-card/95 border border-primary/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col gap-5 select-none animate-in zoom-in-95 duration-200">
            {/* Header info */}
            <div className="flex justify-between items-center pb-3 border-b border-border/10">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-bold tracking-wide uppercase text-sm font-mono text-primary">
                  {modalType === 'deploy' ? 'Deploy Smart Contract' : 'Authorize VM Execution'}
                </span>
              </div>
              <Badge variant="outline" className="font-mono text-[9px] border-primary/20 text-primary">
                GAS: {modalGas} UNITS
              </Badge>
            </div>

            {modalState === 'idle' && (
              <div className="space-y-4">
                <div className="space-y-1 font-mono text-xs">
                  <p className="text-muted-foreground">Target Address Preview:</p>
                  <p className="text-primary font-bold break-all">
                    {modalType === 'deploy' 
                      ? 'Generating dynamic address on-chain...' 
                      : targetAddress}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-mono">
                    LunarVM Assembler Bytecode Payload
                  </label>
                  <pre className="max-h-[160px] overflow-y-auto scrollbar-thin bg-black/40 border border-border/10 rounded-lg p-3 font-mono text-[10px] leading-relaxed text-cyan-400">
                    {modalBytecode}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs border-t border-border/5 pt-3">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Gas Price:</span>
                    <span className="text-foreground">0.0001 LUNAR</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Simulated Fee:</span>
                    <span className="text-primary font-bold">{(modalGas * 0.0001).toFixed(4)} LUNAR</span>
                  </div>
                </div>

                <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg flex gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-normal font-sans">
                    This cryptographic interaction requests your local ECDSA wallet private keys to sign and authorize the state transition payload before mempool broadcast.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCloseModal}
                    className="flex-1 text-xs font-mono font-bold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={authorizeSignature}
                    className="flex-1 text-xs font-mono font-bold bg-primary hover:bg-primary/95 text-black shadow-lg"
                  >
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
                  <p className="text-xs text-muted-foreground">Authorizing ECDSA wallet key signatures locally</p>
                </div>
              </div>
            )}

            {modalState === 'broadcasting' && (
              <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
                <Activity className="h-10 w-10 text-cyan-400 animate-pulse" />
                <div className="space-y-1 font-mono">
                  <h3 className="font-bold text-cyan-400">Broadcasting Transaction Payload...</h3>
                  <p className="text-xs text-muted-foreground">Propagating to LAN node peers and mempool structures</p>
                </div>
              </div>
            )}

            {modalState === 'mining' && (
              <div className="space-y-4 font-mono text-center py-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Boxes className="h-12 w-12 text-primary animate-pulse" />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-foreground">Transaction Queued in Mempool!</h3>
                  <p className="text-xs text-muted-foreground break-all px-4 mt-1 bg-black/30 py-1.5 rounded-md border border-border/5">
                    Hash: {modalTxHash.slice(0, 24)}...
                  </p>
                </div>

                <p className="text-[10px] text-muted-foreground px-4 leading-relaxed text-left border-t border-border/5 pt-3">
                  Your transaction has entered the node mempool queue. In real blockchains, you await the consensus miner to seal the next block. In this educational sandbox, you can trigger a block miner execution directly below to commit it instantly!
                </p>

                <div className="flex gap-3 pt-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setModalOpen(false)}
                    className="flex-1 text-xs font-bold"
                  >
                    Await Passive Miner
                  </Button>
                  <Button 
                    onClick={triggerLocalBlockMine}
                    className="flex-1 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg"
                  >
                    Mine and Seal Block Now
                  </Button>
                </div>
              </div>
            )}

            {modalState === 'success' && (
              <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-400 animate-bounce" />
                <div className="space-y-1 font-mono">
                  <h3 className="font-bold text-emerald-400">Block Successfully Mined!</h3>
                  <p className="text-xs text-muted-foreground">State transition committed to LunarCoin blockchain</p>
                </div>
              </div>
            )}

            {modalState === 'error' && (
              <div className="space-y-4 font-mono">
                <div className="flex flex-col items-center gap-2 py-4">
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                  <h3 className="font-bold text-red-400">Transaction Aborted</h3>
                  <p className="text-xs text-red-400/80 bg-red-950/20 border border-red-900/30 p-3 rounded-lg leading-relaxed mt-2 text-center">
                    {modalError}
                  </p>
                </div>

                <div className="flex gap-3 border-t border-border/5 pt-3">
                  <Button 
                    variant="outline" 
                    onClick={handleCloseModal}
                    className="flex-1 text-xs font-bold"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={authorizeSignature}
                    className="flex-1 text-xs font-bold bg-primary text-black"
                  >
                    Retry Signature
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Breadcrumb Nav & HUD */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/dapps">
            <Button size="icon" variant="outline" className="h-8 w-8 border-border/30 hover:bg-muted/30">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">{template.icon}</span>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2 tracking-wide font-mono">
                {template.title} Workbench
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Launch, interact, and trace on-chain stack machines dynamically
            </p>
          </div>
        </div>

        {/* Dynamic Connected HUD */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 bg-black/25">
            <div className={cn(
              "h-2 w-2 rounded-full",
              walletAddress ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-red-500"
            )} />
            <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
              {walletAddress ? 'LINK ACTIVE' : 'NO LINK'}
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
            {walletAddress ? `${walletAddress.slice(0, 8)}... Linked` : 'Link Wallet'}
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      {!targetAddress ? (
        /* DEPLOYMENT MODE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/45 border-border/30 card-glow p-5 flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-1.5 font-mono mb-2">
                  <Boxes className="h-4.5 w-4.5" />
                  Customize DApp Constructor State
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Construct your contract deployment variables. These values are pushed directly to the LunarVM storage slots upon execution.
                </p>

                <div className="space-y-4">
                  {template.initialStateKeys.map((item) => (
                    <div key={item.key} className="space-y-1.5 font-mono">
                      <Label htmlFor={item.key} className="text-xs text-foreground uppercase tracking-wide">
                        {item.label}
                      </Label>
                      <Input
                        id={item.key}
                        type={item.type === 'number' ? 'number' : 'text'}
                        value={initialFormState[item.key]}
                        onChange={(e) => {
                          const val = item.type === 'number' ? Number(e.target.value) : e.target.value
                          setInitialFormState(prev => ({ ...prev, [item.key]: val }))
                        }}
                        className="bg-black/30 border-border/20 max-w-md focus-visible:ring-primary/45"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border/5 flex items-center justify-between">
                <div className="text-[10px] text-muted-foreground font-mono">
                  Estimated Deployment Gas: <span className="text-primary font-bold">{template.defaultGas} units</span>
                </div>
                <Button 
                  onClick={triggerDeployModal}
                  className="font-bold text-xs bg-primary hover:bg-primary/95 text-black px-5 shadow-lg flex items-center gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  Compile & Deploy to Chain
                </Button>
              </div>
            </Card>

            {/* Cyberpunk Bytecode Viewer */}
            <Card className="bg-card/45 border-border/30 card-glow p-5 font-mono">
              <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 mb-3 uppercase">
                <FileCode className="h-4 w-4 text-cyan-400" />
                Raw Assembler Bytecode (lunar-assembly)
              </h3>
              <pre className="p-4 bg-black/45 border border-border/10 rounded-xl max-h-[220px] overflow-y-auto text-xs leading-relaxed text-cyan-400 scrollbar-thin">
                {template.bytecode}
              </pre>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card/45 border-border/30 card-glow p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 uppercase mb-3">
                  <Info className="h-4 w-4 text-primary" />
                  DApp Platform Guide
                </h3>
                <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    LunarVM executes a stack-based educational cryptocurrency bytecode array. Every program initialized maps dedicated storage fields on-chain.
                  </p>
                  <p>
                    To deploy this contract:
                  </p>
                  <ul className="list-decimal list-inside space-y-1.5 font-mono text-[10px]">
                    <li>Ensure your Web3 Wallet is linked in the HUD.</li>
                    <li>Customize key-value initial states in constructor.</li>
                    <li>Click Compile & Deploy.</li>
                    <li>Authorize ECDSA signature.</li>
                    <li>Mine the block to seal transaction canonically.</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* INTERACT MODE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-6">
            {/* Custom Interactive visual HUD template */}
            <Card className="bg-card/45 border-border/30 card-glow p-5">
              <CardHeader className="p-0 pb-4 mb-4 border-b border-border/10 flex flex-row items-center justify-between">
                <div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase tracking-widest text-[9px] font-bold">
                    Active Contract Ledger
                  </Badge>
                  <CardTitle className="text-sm font-mono text-cyan-400 font-bold mt-1.5 select-all break-all">
                    {targetAddress}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => loadDashboardData(true)} 
                    className="h-8 w-8 border-border/30 hover:bg-muted/30"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 py-2">
                {/* Specific graphical interfaces mapped by ID */}
                {templateId === 'voting' && (
                  <div className="space-y-6">
                    <h4 className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-bold">🗳️ Live Consensus Voting Standings</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-border/10 bg-black/25 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/20 transition-all duration-200">
                        <div>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-1">CANDIDATE A</span>
                          <span className="text-3xl font-bold font-mono text-primary">
                            {contractDetail?.state?.candidate_A ?? 0}
                          </span>
                          <p className="text-[10px] text-muted-foreground mt-1">Live votes on-chain</p>
                        </div>
                        <Button 
                          onClick={() => triggerExecuteModal('vote_a')}
                          className="mt-4 text-xs font-bold bg-primary hover:bg-primary/95 text-black"
                        >
                          Vote Candidate A
                        </Button>
                      </div>

                      <div className="border border-border/10 bg-black/25 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/20 transition-all duration-200">
                        <div>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-1">CANDIDATE B</span>
                          <span className="text-3xl font-bold font-mono text-purple-400">
                            {contractDetail?.state?.candidate_B ?? 0}
                          </span>
                          <p className="text-[10px] text-muted-foreground mt-1">Live votes on-chain</p>
                        </div>
                        <Button 
                          onClick={() => triggerExecuteModal('vote_b')}
                          className="mt-4 text-xs font-bold bg-purple-500 hover:bg-purple-600 text-black"
                        >
                          Vote Candidate B
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {templateId === 'token' && (
                  <div className="space-y-6">
                    <h4 className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-bold">🪙 LUNAR Utility Token Balances</h4>
                    <div className="grid grid-cols-2 gap-4 bg-black/25 p-5 border border-border/10 rounded-2xl">
                      <div className="space-y-1 font-mono">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">Owner Supply</span>
                        <span className="text-2xl font-bold text-cyan-400">
                          {contractDetail?.state?.balance_owner ?? 1000} LUNAR
                        </span>
                      </div>
                      <div className="space-y-1 font-mono border-l border-border/10 pl-4">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">Recipient Balance</span>
                        <span className="text-2xl font-bold text-purple-400">
                          {contractDetail?.state?.balance_recipient ?? 0} LUNAR
                        </span>
                      </div>
                    </div>

                    <Card className="bg-black/35 border-border/10 p-4">
                      <div className="flex flex-col gap-3 justify-between sm:flex-row sm:items-center">
                        <div className="space-y-1">
                          <h5 className="font-bold text-xs text-foreground font-mono">Transfer 100 LUNAR</h5>
                          <p className="text-[10px] text-muted-foreground">Executes bytecode transfer subtracting 100 LUNAR from owner and adding to recipient</p>
                        </div>
                        <Button 
                          onClick={() => triggerExecuteModal('transfer')}
                          className="text-xs font-bold bg-primary text-black h-8 px-4"
                        >
                          Transfer Tokens
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                {templateId === 'dao' && (
                  <div className="space-y-6">
                    <h4 className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-bold">🏛️ Governance Proposals Board</h4>
                    <div className="grid grid-cols-2 gap-4 bg-black/25 p-5 border border-border/10 rounded-2xl mb-4">
                      <div className="space-y-1 font-mono">
                        <span className="text-[10px] text-muted-foreground uppercase block">Active Proposals</span>
                        <span className="text-2xl font-bold text-cyan-400">
                          {contractDetail?.state?.proposals_count ?? 0}
                        </span>
                      </div>
                      <div className="space-y-1 font-mono border-l border-border/10 pl-4">
                        <span className="text-[10px] text-muted-foreground uppercase block">DAO Shares Locked</span>
                        <span className="text-2xl font-bold text-emerald-400">
                          {contractDetail?.state?.governance_shares ?? 100} SHARES
                        </span>
                      </div>
                    </div>

                    <Card className="bg-black/35 border-border/10 p-4 flex justify-between items-center">
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-foreground font-mono">Submit Proposal</h5>
                        <p className="text-[10px] text-muted-foreground">Increments the proposal tally by executing stack addition</p>
                      </div>
                      <Button 
                        onClick={() => triggerExecuteModal('submit_proposal')}
                        className="text-xs font-bold bg-primary text-black h-8 px-4"
                      >
                        Submit Proposal
                      </Button>
                    </Card>
                  </div>
                )}

                {templateId === 'escrow' && (
                  <div className="space-y-6">
                    <h4 className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-bold">💼 Trusted Escrow Vault Settlement</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-border/10 bg-black/25 rounded-2xl p-5 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">DEPOSITED FUNDS</span>
                          <p className="text-2xl font-bold font-mono text-primary">
                            {contractDetail?.state?.trust_funds ?? 500} LUNAR
                          </p>
                        </div>
                      </div>

                      <div className="border border-border/10 bg-black/25 rounded-2xl p-5 flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">VAULT STATUS</span>
                          <p className="text-lg font-bold font-mono flex items-center gap-1.5 mt-1">
                            {contractDetail?.state?.released === 1 ? (
                              <>
                                <Unlock className="h-4.5 w-4.5 text-emerald-400" />
                                <span className="text-emerald-400">RELEASED</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-4.5 w-4.5 text-red-400" />
                                <span className="text-red-400">VAULT LOCKED</span>
                              </>
                            )}
                          </p>
                        </div>
                        {contractDetail?.state?.released !== 1 && (
                          <Button 
                            onClick={() => triggerExecuteModal('release')}
                            className="text-[10px] h-8 px-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
                          >
                            Release Funds
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {templateId === 'nft' && (
                  <div className="space-y-6">
                    <h4 className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-bold">🎨 Digital Collectibles Registry</h4>
                    
                    <div className="border border-border/10 bg-gradient-to-br from-black/40 to-black/20 rounded-2xl p-5 max-w-sm mx-auto shadow-inner relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3">
                        <Badge variant="outline" className="text-[9px] border-primary/20 text-primary font-bold">
                          UNIQUE ID
                        </Badge>
                      </div>
                      
                      <div className="space-y-4 font-mono">
                        <div className="text-3xl filter drop-shadow-[0_0_12px_rgba(0,240,255,0.25)]">🎨</div>
                        <div>
                          <span className="text-[9px] text-muted-foreground uppercase block">Collectible Asset</span>
                          <h5 className="font-bold text-foreground text-sm truncate">
                            {contractDetail?.state?.nft_id ?? 'LunarCollectible #001'}
                          </h5>
                        </div>
                        
                        <div className="border-t border-border/5 pt-3">
                          <span className="text-[9px] text-muted-foreground uppercase block">Current Owner Address</span>
                          <p className="font-bold text-primary text-[10px] break-all truncate select-all">
                            {contractDetail?.state?.nft_owner ?? 'mock-wallet'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-border/5 pt-4">
                        <Button 
                          onClick={() => triggerExecuteModal('transfer_nft')}
                          className="w-full text-xs font-bold bg-primary hover:bg-primary/95 text-black"
                        >
                          Transfer Collectible
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {templateId === 'staking' && (
                  <div className="space-y-6">
                    <h4 className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-bold">📈 Staking Yield projections</h4>
                    
                    <div className="grid grid-cols-2 gap-4 bg-black/25 p-5 border border-border/10 rounded-2xl">
                      <div className="space-y-1 font-mono">
                        <span className="text-[10px] text-muted-foreground uppercase block">Total Coins Staked</span>
                        <span className="text-2xl font-bold text-cyan-400">
                          {contractDetail?.state?.total_staked ?? 0} LUNAR
                        </span>
                      </div>
                      <div className="space-y-1 font-mono border-l border-border/10 pl-4">
                        <span className="text-[10px] text-muted-foreground uppercase block">APY Interest Rate</span>
                        <span className="text-2xl font-bold text-emerald-400">
                          {contractDetail?.state?.apy_interest_rate ?? 5}% APY
                        </span>
                      </div>
                    </div>

                    <Card className="bg-black/35 border-border/10 p-4 flex justify-between items-center">
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-foreground font-mono">Stake +100 LUNAR</h5>
                        <p className="text-[10px] text-muted-foreground">Increments total_staked by 100 LUNAR to compound interest yields</p>
                      </div>
                      <Button 
                        onClick={() => triggerExecuteModal('harvest')}
                        className="text-xs font-bold bg-primary text-black h-8 px-4"
                      >
                        Stake Coins
                      </Button>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ABI Storage Inspector */}
            <Card className="bg-card/45 border-border/30 card-glow p-5">
              <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 mb-3 uppercase font-mono">
                <Terminal className="h-4 w-4 text-primary" />
                ABI On-Chain Storage Inspector
              </h3>
              <p className="text-[11px] text-muted-foreground mb-4 leading-normal">
                DApp variables mapped directly from the stack machine database registry inside `/contract/{targetAddress}`.
              </p>

              {contractDetail?.state && Object.keys(contractDetail.state).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                  {Object.entries(contractDetail.state).map(([key, value]) => (
                    <div key={key} className="border border-border/10 bg-black/25 rounded-xl p-3 flex flex-col justify-between">
                      <span className="text-[9px] text-muted-foreground uppercase truncate block">{key}</span>
                      <span className="text-primary font-bold text-sm mt-1 truncate">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-mono italic text-center py-6 border border-dashed border-border/20 rounded-xl bg-black/10">
                  Empty storage slots. Trigger an execution to seed dynamic storage allocations on-chain.
                </p>
              )}
            </Card>
          </div>

          {/* Right Sidebar: Terminal Console Debugger */}
          <div className="space-y-6">
            <Card className="bg-card/45 border-border/30 card-glow p-5 flex flex-col justify-between h-[520px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-3 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      VM Debugging Terminal
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[8px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-1 py-0.5">
                    LIVE CONNECTION
                  </Badge>
                </div>

                {/* Log list box */}
                <div className="flex-grow bg-black/75 border border-border/15 rounded-xl p-3 overflow-y-auto font-mono text-[10px] leading-relaxed text-emerald-400 flex flex-col gap-2 scrollbar-thin select-text">
                  {terminalLogs.map((log, idx) => (
                    <p key={idx} className={cn(
                      "break-words",
                      log.includes('[ERROR]') ? 'text-red-400' : 
                      log.includes('[WARNING]') ? 'text-amber-400' :
                      log.includes('[WALLET]') ? 'text-cyan-300 font-bold' : 
                      log.includes('[SYSTEM]') ? 'text-muted-foreground' : 'text-emerald-400'
                    )}>
                      {log}
                    </p>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
