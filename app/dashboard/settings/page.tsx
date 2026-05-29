'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Server, Pickaxe, ShieldAlert, Cpu, Database, Save, CheckCircle } from 'lucide-react'
import { blockchainApi } from '@/lib/api/blockchain'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [nodeUrl, setNodeUrl] = useState('http://127.0.0.1:5000')
  const [difficulty, setDifficulty] = useState(4)
  const [cpuThreads, setCpuThreads] = useState(1)
  const [saved, setSaved] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await blockchainApi.getNetworkStats()
        if (res) {
          setStats(res)
          setDifficulty(res.difficulty || 4)
        }
      } catch (err) {
        console.error('Failed to load stats in settings:', err)
      }
    }
    loadStats()
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl font-mono">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 tracking-wide font-mono">
          <Settings className="h-6 w-6 text-primary" />
          System Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure local-first network parameters, CPU mining thread counts, and storage locations
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Node configuration */}
        <Card className="bg-card/35 border-border/30 card-glow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-4.5 w-4.5 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Node Connection</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Primary connection parameters for the local educational cryptocurrency engine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <label htmlFor="node-url" className="text-muted-foreground uppercase font-bold tracking-wider">Flask API Server URL</label>
              <Input
                id="node-url"
                value={nodeUrl}
                onChange={(e) => setNodeUrl(e.target.value)}
                className="bg-black/30 border-border/20 font-mono focus-visible:ring-primary/45"
              />
            </div>
          </CardContent>
        </Card>

        {/* CPU mining options */}
        <Card className="bg-card/35 border-border/30 card-glow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pickaxe className="h-4.5 w-4.5 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider">CPU Mining Sandbox</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Tweak thread loops and local mining difficulty targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-xs">
                <label htmlFor="difficulty-target" className="text-muted-foreground uppercase font-bold tracking-wider">Active difficulty mask (0-10)</label>
                <Input
                  id="difficulty-target"
                  type="number"
                  min="1"
                  max="10"
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="bg-black/30 border-border/20 font-mono"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label htmlFor="cpu-threads" className="text-muted-foreground uppercase font-bold tracking-wider">Allocated CPU mining threads</label>
                <Input
                  id="cpu-threads"
                  type="number"
                  min="1"
                  max="8"
                  value={cpuThreads}
                  onChange={(e) => setCpuThreads(Number(e.target.value))}
                  className="bg-black/30 border-border/20 font-mono"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage path */}
        <Card className="bg-card/35 border-border/30 card-glow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Storage Directories</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Local filesystem paths for blockchain databases and keypairs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-[10px] text-muted-foreground leading-relaxed">
            <div className="flex justify-between py-1 border-b border-border/5">
              <span>LEDGER DATABASE PATH:</span>
              <span className="text-foreground font-bold">~/LunarCoinData/chain.json</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/5">
              <span>SECURE WALLET PATH:</span>
              <span className="text-foreground font-bold">~/LunarCoinData/wallet.json</span>
            </div>
            <div className="flex justify-between py-1">
              <span>LUNARFS STORAGE PATH:</span>
              <span className="text-foreground font-bold">~/LunarCoinData/storage/</span>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex items-center justify-between">
          {saved && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold animate-pulse">
              <CheckCircle className="h-4 w-4" />
              Settings updated locally!
            </div>
          )}
          <Button type="submit" className="ml-auto bg-primary text-black font-bold text-xs h-9 px-6 flex items-center gap-1.5">
            <Save className="h-4 w-4" />
            Commit Configuration
          </Button>
        </div>
      </form>
    </div>
  )
}
