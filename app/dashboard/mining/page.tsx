'use client'

import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { LiveMiningStats, MiningLog, WalletAddressInfo, WalletHistoryItem } from '@/lib/types/blockchain'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Activity,
  Award,
  Coins,
  Gauge,
  Hash,
  Pickaxe,
  Play,
  RotateCw,
  Square,
  Zap,
  Cpu,
  Terminal,
  Clock,
  Flame,
  TrendingUp,
  Copy,
  Check,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import {
  CHART_COLORS,
  chartAnimation,
  tooltipStyle,
  axisProps,
} from '@/components/dashboard/chart-theme'

// Extend global window for Electron lunarDesktop preload APIs
declare global {
  interface Window {
    lunarDesktop?: {
      backendUrl: string
      dataDirectory: string
      platform: string
      getCPUUsage: () => { percentCPUUsage: number }
    }
  }
}

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

function formatUptime(seconds: number): string {
  if (!seconds || seconds <= 0) return '00:00:00'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function formatDateTime(isoString: string): string {
  if (!isoString) return '-'
  try {
    const d = new Date(isoString)
    const dateStr = d.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    return `${dateStr} ${timeStr}`
  } catch {
    return isoString
  }
}

export default function MiningPage() {
  const [liveStats, setLiveStats] = useState<LiveMiningStats | null>(null)
  const [walletInfo, setWalletInfo] = useState<WalletAddressInfo | null>(null)
  const [walletHistory, setWalletHistory] = useState<WalletHistoryItem[]>([])
  
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [offline, setOffline] = useState(false)
  const [flashActive, setFlashActive] = useState(false)
  const [activeTab, setActiveTab] = useState<'stream' | 'charts'>('stream')
  
  // Real-time states
  const [logs, setLogs] = useState<MiningLog[]>([])
  const [notifications, setNotifications] = useState<Array<{ id: number; text: string }>>([])
  const [copied, setCopied] = useState(false)
  
  // Rolling histories
  const [hashrateHistory, setHashrateHistory] = useState<Array<{ time: string; hashrate: number }>>([])
  const [activityHistory, setActivityHistory] = useState<Array<{ time: string; delta: number }>>([])

  // DOM Refs for high-speed numeric shuffles (60fps visual updates)
  const visualNonceRef = useRef<HTMLDivElement>(null)
  const visualHashRef = useRef<HTMLDivElement>(null)
  const visualTimerRef = useRef<HTMLSpanElement>(null)
  const visualCpuValueRef = useRef<HTMLSpanElement>(null)
  const visualCpuBarRef = useRef<HTMLDivElement>(null)
  const visualTotalHashesValueRef = useRef<HTMLDivElement>(null)

  // Card Refs
  const cardNonceRef = useRef<HTMLDivElement>(null)
  const cardHashRef = useRef<HTMLDivElement>(null)
  const cardTotalHashesRef = useRef<HTMLDivElement>(null)

  const matrixCanvasRef = useRef<HTMLCanvasElement>(null)
  const terminalContainerRef = useRef<HTMLDivElement>(null)

  const lastBlocksMinedRef = useRef<number>(-1)
  const lastTotalHashesRef = useRef<number>(-1)

  const miningActive = useMemo(() => {
    return liveStats?.mining ?? false
  }, [liveStats])

  // Play sci-fi notification sound chime when block discovered
  const playChime = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtxClass) return
      const audioCtx = new AudioCtxClass()
      
      const playTone = (freq: number, start: number, duration: number, volume: number) => {
        const osc = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        
        osc.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, start)
        
        gainNode.gain.setValueAtTime(volume, start)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration)
        
        osc.start(start)
        osc.stop(start + duration)
      }
      
      const now = audioCtx.currentTime
      playTone(587.33, now, 0.25, 0.15)      // D5
      playTone(880.00, now + 0.10, 0.45, 0.10) // A5
    } catch (e) {
      console.warn('Web Audio chime not supported:', e)
    }
  }

  // Copy wallet address to clipboard helper
  const handleCopyAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Poll live stats and logs every 1 second
  useEffect(() => {
    let isActive = true

    const poll = async () => {
      try {
        // Fetch stats
        const data = await blockchainApi.getLiveMiningStats()
        if (!isActive) return
        
        const stats = data || ({} as LiveMiningStats)
        setLiveStats(stats)
        setOffline(false)

        // Block discovered notification triggers
        const currentMined = stats.blocks_mined || 0
        if (lastBlocksMinedRef.current !== -1 && currentMined > lastBlocksMinedRef.current) {
          const newId = Date.now()
          setNotifications(prev => [...prev, { id: newId, text: '+1 LUNAR' }])
          setFlashActive(true)
          playChime()
          setTimeout(() => {
            setFlashActive(false)
          }, 1500)
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newId))
          }, 3000)
        }
        lastBlocksMinedRef.current = currentMined

        // Work delta calculation for the Activity Bar Chart
        const currentTotal = stats.total_hashes || 0
        let delta = 0
        if (lastTotalHashesRef.current !== -1) {
          delta = Math.max(0, currentTotal - lastTotalHashesRef.current)
        }
        lastTotalHashesRef.current = currentTotal

        // Accumulate rolling chart histories
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        if (stats.mining) {
          setHashrateHistory(prev => {
            const updated = [...prev, { time: timeStr, hashrate: stats.hashrate || 0 }]
            return updated.slice(-15)
          })
          setActivityHistory(prev => {
            const updated = [...prev, { time: timeStr, delta }]
            return updated.slice(-15)
          })
        }
      } catch (err) {
        console.error('Failed to fetch live mining telemetry:', err)
        if (isActive) {
          setOffline(true)
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }

      // Fetch wallet address
      try {
        const walletData = await blockchainApi.getWalletAddressInfo()
        if (isActive && walletData) {
          setWalletInfo(walletData)
        }
      } catch (e) {
        console.error('Failed to fetch persistent wallet address info:', e)
      }

      // Fetch wallet history
      try {
        const historyData = await blockchainApi.getWalletHistory()
        if (isActive && historyData) {
          setWalletHistory(historyData)
        }
      } catch (e) {
        console.error('Failed to fetch wallet history Ledger:', e)
      }

      // Fetch logs
      try {
        const logsData = await blockchainApi.getMiningLogs()
        if (!isActive) return
        setLogs(logsData || [])
      } catch (e) {
        console.error('Failed to fetch mining logs:', e)
      }
    }

    poll()
    const interval = setInterval(poll, 1000)
    return () => {
      isActive = false
      clearInterval(interval)
    }
  }, [])

  // Toggle API engine state
  const handleMiningToggle = async () => {
    try {
      setActionLoading(true)
      if (miningActive) {
        await blockchainApi.stopMining()
      } else {
        await blockchainApi.startMining()
      }
      const data = await blockchainApi.getLiveMiningStats()
      setLiveStats(data || null)
      setOffline(false)
    } catch (err) {
      console.error('Failed to update mining status:', err)
      setOffline(true)
    } finally {
      setActionLoading(false)
    }
  }

  // Matrix canvas background scroll
  useEffect(() => {
    const canvas = matrixCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let lastDraw = 0

    const handleResize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 400
      canvas.height = canvas.parentElement?.offsetHeight || 140
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)

    const fontSize = 10
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * -20))

    const draw = (timestamp: number) => {
      if (!miningActive) {
        ctx.fillStyle = 'rgba(5, 7, 13, 0.95)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        ctx.fillStyle = 'rgba(0, 240, 255, 0.05)'
        ctx.font = '11px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('ENGINE OFFLINE', canvas.width / 2, canvas.height / 2)
        return
      }

      if (timestamp - lastDraw > 50) {
        lastDraw = timestamp

        ctx.fillStyle = 'rgba(5, 7, 13, 0.15)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = 'rgba(0, 240, 255, 0.5)'
        ctx.font = `${fontSize}px monospace`
        ctx.textAlign = 'left'

        for (let i = 0; i < drops.length; i++) {
          const char = Math.floor(Math.random() * 16).toString(16).toUpperCase()
          const x = i * fontSize
          const y = drops[i] * fontSize

          ctx.fillText(char, x, y)

          if (y > canvas.height && Math.random() > 0.98) {
            drops[i] = 0
          }
          drops[i]++
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    animationFrameId = requestAnimationFrame(draw)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [miningActive])

  // Direct fast loop for rendering live nonce and candidate hex shuffles at ~30 FPS
  useEffect(() => {
    let animationFrameId: number
    let lastUpdate = 0
    let currentNonce = liveStats?.nonce || 0
    let currentTotalHashes = liveStats?.total_hashes || 0
    let lastCpuTime = 0
    let sessionStart = Date.now() - (liveStats?.uptime ? liveStats.uptime * 1000 : 0)

    const nonceEl = visualNonceRef.current
    const hashEl = visualHashRef.current
    const timerEl = visualTimerRef.current
    const cpuValueEl = visualCpuValueRef.current
    const cpuBarEl = visualCpuBarRef.current
    const totalHashesValueEl = visualTotalHashesValueRef.current

    const cardNonceEl = cardNonceRef.current
    const cardHashEl = cardHashRef.current
    const cardTotalHashesEl = cardTotalHashesRef.current

    if (!miningActive) {
      if (cpuValueEl) cpuValueEl.innerText = '0%'
      if (cpuBarEl) cpuBarEl.style.width = '0%'
      if (timerEl) timerEl.innerText = '00:00:00'
      return
    }

    // Sync on updates
    currentNonce = liveStats?.nonce || 0
    currentTotalHashes = liveStats?.total_hashes || 0
    sessionStart = Date.now() - (liveStats?.uptime ? liveStats.uptime * 1000 : 0)

    const run = (timestamp: number) => {
      if (timestamp - lastUpdate > 33) {
        const elapsedSinceLastUpdate = timestamp - lastUpdate
        lastUpdate = timestamp

        const hashrate = liveStats?.hashrate || 0
        const delta = Math.max(1, Math.floor((hashrate * elapsedSinceLastUpdate) / 1000))

        currentNonce += delta
        currentTotalHashes += delta

        if (nonceEl) nonceEl.innerText = currentNonce.toLocaleString()
        if (cardNonceEl) cardNonceEl.innerText = currentNonce.toLocaleString()

        if (totalHashesValueEl) totalHashesValueEl.innerText = currentTotalHashes.toLocaleString()
        if (cardTotalHashesEl) cardTotalHashesEl.innerText = currentTotalHashes.toLocaleString()

        if (hashEl || cardHashEl) {
          const hex = '0123456789abcdef'
          let randomHash = '0000'
          for (let i = 4; i < 64; i++) {
            randomHash += hex[Math.floor(Math.random() * 16)]
          }
          if (hashEl) hashEl.innerText = randomHash
          if (cardHashEl) cardHashEl.innerText = truncateHash(randomHash)
        }

        if (timerEl) {
          const elapsedSecs = Math.floor((Date.now() - sessionStart) / 1000)
          const hrs = String(Math.floor(elapsedSecs / 3600)).padStart(2, '0')
          const mins = String(Math.floor((elapsedSecs % 3600) / 60)).padStart(2, '0')
          const secs = String(elapsedSecs % 60).padStart(2, '0')
          timerEl.innerText = `${hrs}:${mins}:${secs}`
        }

        // CPU Diagnostics query
        if (Date.now() - lastCpuTime > 600) {
          lastCpuTime = Date.now()
          let cpuPercent = 0
          if (window.lunarDesktop?.getCPUUsage) {
            const usage = window.lunarDesktop.getCPUUsage()
            cpuPercent = Math.min(100, Math.round(usage.percentCPUUsage))
          } else {
            cpuPercent = Math.floor(Math.random() * 12) + 48
          }
          if (cpuValueEl) cpuValueEl.innerText = `${cpuPercent}%`
          if (cpuBarEl) cpuBarEl.style.width = `${cpuPercent}%`
        }
      }

      animationFrameId = requestAnimationFrame(run)
    }

    animationFrameId = requestAnimationFrame(run)
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [miningActive, liveStats])

  // Terminal autoscroll hook
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className={`space-y-6 transition-all duration-300 relative ${flashActive ? 'neon-flash-active' : ''}`}>
      {/* CSS Keyframes for neon visual effects */}
      <style>{`
        @keyframes neon-flash-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 240, 255, 0);
          }
          15% {
            box-shadow: 0 0 45px 12px rgba(0, 240, 255, 0.45);
            border-color: #00f0ff;
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 240, 255, 0);
          }
        }
        .neon-flash-active {
          animation: neon-flash-pulse 1.5s ease-out;
        }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translate(-50%, 40px); }
          12% { opacity: 1; transform: translate(-50%, 0px); }
          85% { opacity: 1; transform: translate(-50%, 0px); }
          100% { opacity: 0; transform: translate(-50%, -40px); }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Floating "+1 LUNAR" block discovery banner notifications */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none space-y-2">
        {(notifications || []).map((notif) => (
          <div
            key={notif.id}
            className="bg-black/90 border border-green-500/60 shadow-[0_0_25px_rgba(34,197,94,0.4)] text-green-400 font-extrabold px-6 py-3.5 rounded-lg flex items-center gap-3 text-sm uppercase tracking-wider animate-slide-up-fade"
          >
            <img 
              src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" 
              alt="LunarCoin" 
              className="h-5 w-5 animate-pulse rounded-full"
            />
            <span>{notif.text} Block Found!</span>
          </div>
        ))}
      </div>

      {/* Header and Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" 
            alt="LunarCoin Logo" 
            className="h-9 w-9 shadow-[0_0_12px_rgba(0,240,255,0.3)] rounded-full border border-primary/25"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-foreground">Mining Control Room</h1>
              {miningActive && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_#00f0ff]"></span>
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">
              Real-time local LunarMiner diagnostic HUD
            </p>
          </div>
        </div>
        <Button
          onClick={handleMiningToggle}
          disabled={actionLoading}
          className={miningActive 
            ? 'glow-primary bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive/20 shadow-lg shadow-destructive/20' 
            : 'glow-primary shadow-lg shadow-primary/20'}
        >
          {actionLoading ? (
            <RotateCw className="h-4 w-4 mr-2 animate-spin" />
          ) : miningActive ? (
            <Square className="h-4 w-4 mr-2" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {miningActive ? 'Stop Engine' : 'Start Engine'}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Array.from({ length: 8 }) || []).map((_, i) => (
            <Skeleton key={i} className="h-[100px]" />
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
          {/* Main Status Header Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            
            {/* Engine status Card */}
            <Card className={`bg-card/50 border-border/50 overflow-hidden transition-all duration-500 xl:col-span-1 ${miningActive ? 'card-glow border-primary/40 shadow-lg shadow-primary/10' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-primary/10 border border-primary/20 transition-all ${miningActive ? 'glow-primary animate-pulse scale-105' : ''}`}>
                    {miningActive ? (
                      <img 
                        src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" 
                        alt="LunarCoin" 
                        className="h-7 w-7 animate-spin [animation-duration:10s]"
                      />
                    ) : (
                      <Pickaxe className="h-7 w-7 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Engine State</p>
                    <h2 className={`text-xl font-extrabold capitalize ${miningActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {miningActive ? 'Mining Running' : 'Miner Stopped'}
                    </h2>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PERSISTENT LOCAL WALLET HUB */}
            <Card className="bg-card/50 border-border/50 card-glow overflow-hidden xl:col-span-2">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 h-full">
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-cyan-400" />
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Account Address (Storage Key)</span>
                  </div>
                  <div className="flex items-center gap-1.5 w-full">
                    <span className="font-mono text-xs text-foreground bg-black/40 border border-border/10 px-2.5 py-1.5 rounded select-all break-all tracking-wide flex-grow max-w-[280px] truncate md:max-w-none">
                      {walletInfo?.address || '0x0000000000000000'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:text-primary-foreground hover:bg-primary/20 shrink-0"
                      onClick={handleCopyAddress}
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 md:text-right shrink-0 md:pl-4 md:border-l md:border-border/10">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Wallet ID</p>
                    <p className="font-mono text-xs font-bold text-primary mt-0.5">{walletInfo?.walletId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Balance</p>
                    <p className="font-mono text-xs font-bold text-green-400 mt-0.5">{(walletInfo?.balance ?? 0).toFixed(4)} LUN</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Genesis</p>
                    <p className="font-mono text-[10px] text-foreground mt-0.5">
                      {walletInfo?.createdAt ? new Date(walletInfo.createdAt).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* TELEMETRY STATS GRID (8 Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* 1. Current Nonce */}
            <Card className="bg-card/40 border-border/40 card-glow p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-primary" /> Current Nonce
                </p>
                <div className="text-xl font-bold font-mono text-primary mt-2 break-all" ref={cardNonceRef}>
                  {(liveStats?.nonce ?? 0).toLocaleString()}
                </div>
              </div>
            </Card>

            {/* 2. Candidate Hash */}
            <Card className="bg-card/40 border-border/40 card-glow p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Candidate Hash
                </p>
                <div className="text-xs font-mono text-muted-foreground/90 mt-2 break-all" ref={cardHashRef}>
                  {truncateHash(liveStats?.hash || '')}
                </div>
              </div>
            </Card>

            {/* 3. Hashes / Sec */}
            <Card className="bg-card/40 border-border/40 card-glow p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-primary" /> Hashes / Sec
                </p>
                <div className="text-xl font-bold font-mono text-primary mt-2">
                  {(liveStats?.hashrate ?? 0).toLocaleString()} H/s
                </div>
              </div>
            </Card>

            {/* 4. Total Hashes Attempted */}
            <Card className="bg-card/40 border-border/40 card-glow p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-primary" /> Total Hashes
                </p>
                <div className="text-xl font-bold font-mono mt-2" ref={cardTotalHashesRef}>
                  {(liveStats?.total_hashes ?? 0).toLocaleString()}
                </div>
              </div>
            </Card>

            {/* 5. Lifetime Blocks Mined */}
            <Card className="bg-card/40 border-border/40 card-glow p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" /> Blocks Mined (Lifetime)
                </p>
                <div className="text-xl font-bold text-green-400 mt-2">
                  {walletHistory.length}
                </div>
              </div>
            </Card>

            {/* 6. Estimated Next Block Time */}
            <Card className="bg-card/40 border-border/40 card-glow p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Est. Next Block
                </p>
                <div className="text-xl font-bold mt-2">
                  {liveStats?.estimated_block_time && liveStats.estimated_block_time > 0 && liveStats.estimated_block_time !== Infinity 
                    ? `${liveStats.estimated_block_time.toFixed(1)}s` 
                    : 'N/A'}
                </div>
              </div>
            </Card>

            {/* 7. Mining Uptime (Session) */}
            <Card className="bg-card/40 border-border/40 card-glow p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-primary" /> Uptime (Session)
                </p>
                <div className="text-xl font-bold mt-2">
                  {formatUptime(liveStats?.uptime ?? 0)}
                </div>
              </div>
            </Card>

            {/* 8. Blocks / Minute */}
            <Card className="bg-card/40 border-border/40 card-glow p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 text-primary" /> Blocks / Minute
                </p>
                <div className="text-xl font-bold mt-2">
                  {(liveStats?.blocks_per_minute ?? 0).toFixed(2)}
                </div>
              </div>
            </Card>

          </div>

          {/* MAIN VISUAL WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual Stream & Graph Tabs */}
            <Card className="bg-card/50 border-border/50 lg:col-span-2 overflow-hidden flex flex-col h-[340px]">
              <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/10 bg-muted/20">
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === 'stream' ? 'default' : 'ghost'}
                    size="sm"
                    className="text-xs h-8 px-3"
                    onClick={() => setActiveTab('stream')}
                  >
                    <Zap className="h-3.5 w-3.5 mr-1" /> Stream HUD
                  </Button>
                  <Button
                    variant={activeTab === 'charts' ? 'default' : 'ghost'}
                    size="sm"
                    className="text-xs h-8 px-3"
                    onClick={() => setActiveTab('charts')}
                  >
                    <TrendingUp className="h-3.5 w-3.5 mr-1" /> Work Diagnostics
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span ref={visualTimerRef} className="font-bold text-foreground">00:00:00</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 relative flex-grow bg-black/40 flex flex-col">
                {activeTab === 'stream' ? (
                  <div className="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x divide-border/10">
                    {/* Matrix scanner canvas */}
                    <div className="w-full md:w-3/5 h-full relative overflow-hidden bg-black/60">
                      <canvas ref={matrixCanvasRef} className="absolute inset-0 w-full h-full opacity-60" />
                      <div className="absolute top-3 left-3 bg-black/75 border border-primary/20 px-2 py-1 rounded text-[10px] font-mono text-primary z-10 select-none">
                        MATRIX HEX SCANNER
                      </div>
                    </div>

                    {/* Stream Sidebar */}
                    <div className="w-full md:w-2/5 p-4 flex flex-col justify-between gap-4 bg-muted/5">
                      <div className="space-y-4">
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                            <Hash className="h-3 w-3" /> Live Nonce
                          </div>
                          <div ref={visualNonceRef} className="text-2xl font-bold font-mono text-primary tabular-nums tracking-wide mt-1">
                            {(liveStats?.nonce ?? 0).toLocaleString()}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                            Candidate Hash
                          </div>
                          <div ref={visualHashRef} className="text-xs font-mono text-muted-foreground/90 break-all bg-black/40 border border-border/10 p-2.5 rounded mt-1 max-h-[60px] overflow-hidden select-all">
                            {liveStats?.hash || '0000000000000000000000000000000000000000000000000000000000000000'}
                          </div>
                        </div>
                      </div>

                      {/* CPU Usage diagnostic */}
                      <div className="border-t border-border/10 pt-3">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                            <Cpu className="h-3.5 w-3.5" /> CPU Core Loading
                          </span>
                          <span ref={visualCpuValueRef} className="font-mono text-primary font-bold">0%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-border/10">
                          <div ref={visualCpuBarRef} className="bg-gradient-to-r from-cyan-500 to-primary h-full rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto">
                    {/* Hashrate History Chart */}
                    <div className="flex flex-col h-[260px] bg-black/30 border border-border/10 p-3 rounded-lg">
                      <p className="text-[10px] text-primary uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5" /> Hashrate History (Last 15 ticks)
                      </p>
                      <div className="flex-grow">
                        {hashrateHistory.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
                            Waiting for mining workloads to execute...
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hashrateHistory}>
                              <defs>
                                <linearGradient id="hashrateGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.35} />
                                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                              <XAxis dataKey="time" {...axisProps} />
                              <YAxis {...axisProps} tickFormatter={(v) => `${v}`} />
                              <Tooltip {...tooltipStyle} />
                              <Area
                                type="monotone"
                                dataKey="hashrate"
                                stroke={CHART_COLORS.primary}
                                strokeWidth={1.5}
                                fill="url(#hashrateGradient)"
                                name="Hashrate"
                                {...chartAnimation}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Mining Activity Graph */}
                    <div className="flex flex-col h-[260px] bg-black/30 border border-border/10 p-3 rounded-lg">
                      <p className="text-[10px] text-green-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5" /> Mining Workload (Hashes/Sec delta)
                      </p>
                      <div className="flex-grow">
                        {activityHistory.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
                            Waiting for active attempts logging...
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityHistory}>
                              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                              <XAxis dataKey="time" {...axisProps} />
                              <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v)} />
                              <Tooltip {...tooltipStyle} />
                              <Bar
                                dataKey="delta"
                                fill={CHART_COLORS.success}
                                radius={[3, 3, 0, 0]}
                                name="Work Volume"
                                {...chartAnimation}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right-hand side stack: Logs & History ledger */}
            <div className="flex flex-col gap-4 h-[340px]">
              
              {/* Live Logs Terminal */}
              <Card className="bg-card/50 border-border/50 flex flex-col h-[160px]">
                <CardHeader className="py-2 border-b border-b-border/10 bg-muted/20 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                    <Terminal className="h-4 w-4" />
                    Miner Logs
                  </CardTitle>
                </CardHeader>
                <CardContent 
                  className="p-3 flex-grow bg-black/90 font-mono text-[9px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted" 
                  ref={terminalContainerRef}
                >
                  {logs.length === 0 ? (
                    <div className="text-muted-foreground italic">
                      {miningActive 
                        ? '[MINER] Connecting to local hardware daemon...' 
                        : '[MINER] Console ready. Toggle mining engine to begin...'}
                    </div>
                  ) : (
                    (logs || []).map((log, i) => (
                      <div key={i} className={`text-[9px] font-mono my-0.5 leading-relaxed ${
                        log.type === 'success' ? 'text-green-400 font-bold border-l border-green-500 pl-1.5' :
                        log.type === 'attempt' ? 'text-primary/70' : 'text-yellow-400/90'
                      }`}>
                        {log.message}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Mined Block Ledger (History Table) */}
              <Card className="bg-card/50 border-border/50 flex flex-col h-[164px]">
                <CardHeader className="py-2 border-b border-b-border/10 bg-muted/20 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                    <Award className="h-4 w-4 text-cyan-400 animate-pulse" />
                    Block Ledger
                  </CardTitle>
                  <span className="text-[9px] font-mono text-muted-foreground bg-black/40 border border-border/10 px-1.5 py-0.5 rounded">{walletHistory.length} lifetime</span>
                </CardHeader>
                <CardContent className="p-0 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-muted bg-black/35 font-mono text-[10px]">
                  {walletHistory.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground italic p-4 text-center leading-normal">
                      No historical reward records resolved yet on this node.
                    </div>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead className="bg-muted/10 text-muted-foreground text-left uppercase sticky top-0 border-b border-border/10 text-[8px] tracking-wider select-none z-10 backdrop-blur-md">
                        <tr>
                          <th className="py-1.5 px-2">Block</th>
                          <th className="py-1.5 px-2">Timestamp</th>
                          <th className="py-1.5 px-2 text-right">Reward</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/5">
                        {(walletHistory || []).map((tx, i) => (
                          <tr key={i} className="hover:bg-primary/5 transition-colors group">
                            <td className="py-1 px-2 font-bold text-primary group-hover:text-primary-foreground">
                              #{tx.block}
                            </td>
                            <td className="py-1 px-2 text-muted-foreground/80">
                              {formatDateTime(tx.timestamp)}
                            </td>
                            <td className="py-1 px-2 text-right text-green-400 font-bold">
                              +{tx.amount.toFixed(1)} LUN
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>

            </div>

          </div>
        </>
      )}
    </div>
  )
}
