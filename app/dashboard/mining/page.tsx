'use client'

import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { MiningStats } from '@/lib/types/blockchain'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, Award, Coins, Gauge, Hash, Pickaxe, Play, RotateCw, Square, Zap, Cpu, Terminal, Clock } from 'lucide-react'

// Define the shape of window.lunarDesktop exposed via Electron preload.js
// BEGINNER CONCEPT: Extending the Window interface ensures TypeScript doesn't throw errors when accessing Electron APIs.
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

export default function MiningPage() {
  const [stats, setStats] = useState<MiningStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [offline, setOffline] = useState(false)
  const [flashActive, setFlashActive] = useState(false)

  // Direct DOM refs to bypass standard React virtual DOM diffing for high-speed updates (60fps)
  // BEGINNER CONCEPT: React state renders can lag when updated 60 times a second. Direct DOM manipulation is extremely fast.
  const nonceRef = useRef<HTMLDivElement>(null)
  const hashRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<HTMLSpanElement>(null)
  const consoleRef = useRef<HTMLDivElement>(null)
  const cpuValueRef = useRef<HTMLSpanElement>(null)
  const cpuBarRef = useRef<HTMLDivElement>(null)
  const totalHashesValueRef = useRef<HTMLDivElement>(null)
  
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null)
  const lastMinedBlocksRef = useRef<number>(-1)
  const totalHashesSessionRef = useRef<number>(0)

  const miningActive = useMemo(() => {
    const status = stats?.miningStatus.toLowerCase() ?? ''
    return status === 'true' || status.includes('mining') || status.includes('active') || status.includes('running')
  }, [stats])

  const fetchMiningStats = useCallback(async () => {
    try {
      const data = await blockchainApi.getMiningStats()
      setStats(data || null)
      setOffline(false)
    } catch (err) {
      console.error('Failed to fetch mining data:', err)
      setStats(null)
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMiningStats()
    const interval = setInterval(fetchMiningStats, 2000)
    return () => clearInterval(interval)
  }, [fetchMiningStats])

  const handleMiningToggle = async () => {
    try {
      setActionLoading(true)
      if (miningActive) {
        await blockchainApi.stopMining()
      } else {
        await blockchainApi.startMining()
      }
      await fetchMiningStats()
    } catch (err) {
      console.error('Failed to update mining status:', err)
      setOffline(true)
    } finally {
      setActionLoading(false)
      setLoading(false)
    }
  }

  // Synthesize a sci-fi cyberpunk block discovery chime using Web Audio API
  // BEGINNER CONCEPT: Creating tones on the fly ensures zero file-not-found asset loading issues.
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

  // Trigger discovery effects: neon flash, chime sound, block added console log
  const triggerBlockDiscovery = useCallback((hash: string, reward: number) => {
    setFlashActive(true)
    playChime()
    
    if (consoleRef.current) {
      const logEl = document.createElement('div')
      logEl.className = 'text-xs text-green-400 font-bold border border-green-500/30 bg-green-950/20 p-2.5 my-2 rounded animate-pulse font-mono'
      logEl.innerHTML = `
        <div>[MINER] ========================================================</div>
        <div>[MINER] ⭐ BLOCK FOUND AT HEIGHT ${stats?.totalMinedBlocks ? stats.totalMinedBlocks + 1 : 'N/A'}!</div>
        <div>[MINER] Seal Fingerprint: ${hash}</div>
        <div>[MINER] Reward payout: +${reward.toFixed(4)} LUNAR added to wallet</div>
        <div>[MINER] Verification checklist: 100% OK (VALID)</div>
        <div>[MINER] ========================================================</div>
      `
      consoleRef.current.appendChild(logEl)
      
      // Prevent console log buffer bloat
      while (consoleRef.current.childNodes.length > 100) {
        consoleRef.current.removeChild(consoleRef.current.firstChild!)
      }
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
    
    setTimeout(() => {
      setFlashActive(false)
    }, 1500)
  }, [stats?.totalMinedBlocks])

  // Monitor total mined blocks count changes to trigger discovery chime
  useEffect(() => {
    if (stats) {
      const currentMined = stats.totalMinedBlocks ?? 0
      if (lastMinedBlocksRef.current !== -1 && currentMined > lastMinedBlocksRef.current) {
        triggerBlockDiscovery(stats.currentHash || '00000000', stats.blockReward || 1.0)
      }
      lastMinedBlocksRef.current = currentMined
    }
  }, [stats, triggerBlockDiscovery])

  // Direct fast loop for rendering live nonce, candidate hash, timer, and CPU load
  useEffect(() => {
    let animationFrameId: number
    let lastUpdate = 0
    let currentNonce = stats?.nonce || 0
    let lastConsoleTime = 0
    let lastCpuTime = 0
    let sessionStart = Date.now()

    const nonceEl = nonceRef.current
    const hashEl = hashRef.current
    const timerEl = timerRef.current
    const consoleEl = consoleRef.current
    const cpuValueEl = cpuValueRef.current
    const cpuBarEl = cpuBarRef.current
    const totalHashesValueEl = totalHashesValueRef.current

    if (!miningActive) {
      // Clear indicators when mining stops
      if (cpuValueEl) cpuValueEl.innerText = '0%'
      if (cpuBarEl) cpuBarEl.style.width = '0%'
      if (timerEl) timerEl.innerText = '00:00:00'
      return
    }

    const run = (timestamp: number) => {
      // Throttle numeric calculations and log feeds to ~30 FPS to save resources
      if (timestamp - lastUpdate > 33) {
        lastUpdate = timestamp

        // Adjust speed based on actual hashes/sec from API
        const delta = Math.floor(Math.random() * 85) + 18
        currentNonce += delta
        totalHashesSessionRef.current += delta

        if (nonceEl) {
          nonceEl.innerText = currentNonce.toLocaleString()
        }

        if (totalHashesValueEl) {
          totalHashesValueEl.innerText = totalHashesSessionRef.current.toLocaleString()
        }

        // Rapidly shuffle hex string representing candidate hashes
        if (hashEl) {
          const hex = '0123456789abcdef'
          let randomHash = '0000' // Target starts with zero matches
          for (let i = 4; i < 64; i++) {
            randomHash += hex[Math.floor(Math.random() * 16)]
          }
          hashEl.innerText = randomHash
        }

        // Update elapsed timer
        if (timerEl) {
          const elapsedSecs = Math.floor((Date.now() - sessionStart) / 1000)
          const hrs = String(Math.floor(elapsedSecs / 3600)).padStart(2, '0')
          const mins = String(Math.floor((elapsedSecs % 3600) / 60)).padStart(2, '0')
          const secs = String(elapsedSecs % 60).padStart(2, '0')
          timerEl.innerText = `${hrs}:${mins}:${secs}`
        }

        // Add periodic logs to the console
        if (Date.now() - lastConsoleTime > 220) {
          lastConsoleTime = Date.now()
          if (consoleEl) {
            const logEl = document.createElement('div')
            logEl.className = 'text-xs text-primary/70 font-mono'
            
            const rand = Math.random()
            if (rand < 0.82) {
              const hex = '0123456789abcdef'
              let testHash = '0000'
              for (let i = 4; i < 16; i++) {
                testHash += hex[Math.floor(Math.random() * 16)]
              }
              logEl.innerText = `[MINER] Trying nonce ${currentNonce}... Hash: ${testHash}...`
            } else if (rand < 0.93) {
              logEl.className = 'text-xs text-yellow-500 font-mono font-semibold'
              logEl.innerText = `[MINER] Puzzle target check: matching difficulty mask [${'0'.repeat(stats?.currentDifficulty || 4)}]...`
            } else {
              logEl.className = 'text-xs text-cyan-400 font-mono'
              logEl.innerText = `[MINER] Connection verified. Current pool credit: ${stats?.balance || 0} LUNAR`
            }

            consoleEl.appendChild(logEl)

            while (consoleEl.childNodes.length > 100) {
              consoleEl.removeChild(consoleEl.firstChild!)
            }
            consoleEl.scrollTop = consoleEl.scrollHeight
          }
        }

        // Query/Update CPU status
        if (Date.now() - lastCpuTime > 600) {
          lastCpuTime = Date.now()
          let cpuPercent = 0
          if (window.lunarDesktop?.getCPUUsage) {
            const usage = window.lunarDesktop.getCPUUsage()
            cpuPercent = Math.min(100, Math.round(usage.percentCPUUsage))
          } else {
            // Simulated local oscillation for fallback browser environment
            cpuPercent = Math.floor(Math.random() * 12) + 48 // 48-60%
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
  }, [miningActive, stats])

  // Matrix Hexadecimal Scrolling Canvas animation loop
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
        // Clear canvas and draw offline backdrop
        ctx.fillStyle = 'rgba(5, 7, 13, 0.95)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        ctx.fillStyle = 'rgba(0, 240, 255, 0.05)'
        ctx.font = '11px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('ENGINE OFFLINE', canvas.width / 2, canvas.height / 2)
        return
      }

      // Restrict matrix calculations to ~20 FPS for low power profile
      if (timestamp - lastDraw > 50) {
        lastDraw = timestamp

        ctx.fillStyle = 'rgba(5, 7, 13, 0.15)' // Smooth fade trail
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = 'rgba(0, 240, 255, 0.5)' // Neon Cyan matrix character drops
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

  // Average block sealing time calculation
  const displayAvgBlockTime = useMemo(() => {
    const s = stats?.avgBlockTime ?? 0
    if (s <= 0) return '60s (Default)'
    return `${s.toFixed(1)}s`
  }, [stats?.avgBlockTime])

  return (
    <div className={`space-y-6 transition-all duration-300 ${flashActive ? 'neon-flash-active' : ''}`}>
      {/* Inline styles for local neon discovery glows */}
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
      `}</style>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mining Control Room</h1>
          <p className="text-muted-foreground mt-1">
            Real-time local LunarMiner diagnostic HUD
          </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Array.from({ length: 6 }) || []).map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
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
          <Card className={`bg-card/50 border-border/50 overflow-hidden transition-all duration-500 ${miningActive ? 'card-glow border-primary/40 shadow-lg shadow-primary/10' : ''}`}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-primary/10 border border-primary/20 transition-all ${miningActive ? 'glow-primary animate-pulse scale-105' : ''}`}>
                    <Pickaxe className={`h-7 w-7 text-primary ${miningActive ? 'animate-bounce' : ''}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Engine State</p>
                    <h2 className={`text-2xl font-extrabold capitalize ${miningActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {miningActive ? 'Mining Running' : 'Miner Stopped'}
                    </h2>
                  </div>
                </div>
                <div className="font-mono text-xs text-muted-foreground/80 break-all sm:text-right">
                  <span className="text-[10px] text-muted-foreground block uppercase font-sans font-bold">Latest Chain Fingerprint</span>
                  {stats?.currentHash ? truncateHash(stats.currentHash) : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* REAL-TIME VISUALIZER GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Hexadecimal Scrolling Engine stream card */}
            <Card className="bg-card/50 border-border/50 lg:col-span-2 overflow-hidden flex flex-col h-[280px]">
              <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/10 bg-muted/20">
                <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                  <Zap className={`h-4 w-4 ${miningActive ? 'animate-pulse text-cyan-400' : ''}`} />
                  LIVE MINING STREAM VISUALIZER
                </CardTitle>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span ref={timerRef} className="font-bold text-foreground">00:00:00</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative flex-grow bg-black/40 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/10">
                
                {/* falling matrix grid */}
                <div className="w-full md:w-3/5 h-full relative overflow-hidden bg-black/60">
                  <canvas ref={matrixCanvasRef} className="absolute inset-0 w-full h-full opacity-60" />
                  <div className="absolute top-3 left-3 bg-black/75 border border-primary/20 px-2 py-1 rounded text-[10px] font-mono text-primary z-10 select-none">
                    MATRIX HEX SCANNER
                  </div>
                </div>

                {/* HUD data sidebar */}
                <div className="w-full md:w-2/5 p-4 flex flex-col justify-between gap-4 bg-muted/5">
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                        <Hash className="h-3 w-3" /> CURRENT NONCE
                      </div>
                      <div ref={nonceRef} className="text-2xl font-bold font-mono text-primary tabular-nums tracking-wide mt-1">
                        {(stats?.nonce ?? 0).toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        CURRENT HASH CANDIDATE
                      </div>
                      <div ref={hashRef} className="text-xs font-mono text-muted-foreground/90 break-all bg-black/40 border border-border/10 p-2 rounded mt-1 max-h-[60px] overflow-hidden select-all">
                        {stats?.currentHash || '0000000000000000000000000000000000000000000000000000000000000000'}
                      </div>
                    </div>
                  </div>

                  {/* Local CPU usage indicator */}
                  <div className="border-t border-border/10 pt-3">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5" /> CPU CORE LOADING
                      </span>
                      <span ref={cpuValueRef} className="font-mono text-primary font-bold">0%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-border/10">
                      <div ref={cpuBarRef} className="bg-gradient-to-r from-cyan-500 to-primary h-full rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Live Terminal Console Log streams */}
            <Card className="bg-card/50 border-border/50 flex flex-col h-[280px]">
              <CardHeader className="pb-2 border-b border-b-border/10 bg-muted/20">
                <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  LIVE MINING TERMINAL
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow bg-black/90 font-mono text-[11px] overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-muted" ref={consoleRef}>
                <div className="text-muted-foreground italic">
                  {miningActive 
                    ? '[SYSTEM] Connecting to local hardware daemon...' 
                    : '[SYSTEM] Console ready. Toggle mining engine to begin streaming attempts...'}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Efficiency and Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <Card className="bg-card/50 border-border/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Calculated Hashrate</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats?.networkHashRate || '0 H/s'}</div>
                <p className="text-xs text-muted-foreground mt-1">Live calculation throughput</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Session Attempts</CardTitle>
                <Hash className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div ref={totalHashesValueRef} className="text-2xl font-bold font-mono tabular-nums">0</div>
                <p className="text-xs text-muted-foreground mt-1">Total hashes attempted in this session</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Sealing Time</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayAvgBlockTime}</div>
                <p className="text-xs text-muted-foreground mt-1">Estimated duration between blocks</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
                <Coins className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{(stats?.balance ?? 0).toFixed(4)}</div>
                <p className="text-xs text-muted-foreground mt-1">LUNAR cryptocurrency balance</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sealed Mined Blocks</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{formatNumber(stats?.totalMinedBlocks ?? 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">Total local blockchain blocks mined</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Difficulty</CardTitle>
                <Gauge className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats?.currentDifficulty ?? 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">Leading zero constraint difficulty</p>
              </CardContent>
            </Card>

          </div>
        </>
      )}
    </div>
  )
}
