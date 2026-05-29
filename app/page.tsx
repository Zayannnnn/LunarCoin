import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config/env'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { 
  Blocks, 
  ArrowLeftRight, 
  Zap, 
  Search, 
  Wifi,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Database,
  Code2,
  Network,
  Brain,
  Download,
  BookOpen,
  Terminal,
  CheckCircle2,
  HardDrive,
  Activity,
  FolderOpen
} from 'lucide-react'

export default async function LandingPage() {
  const supabase = isSupabaseConfigured() ? await createClient() : null
  const { data: { user } } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } }

  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  const features = [
    {
      icon: Cpu,
      title: 'CPU PoW Mining',
      description: 'Mines blocks entirely on local CPU threads using SHA256 hashes. Dynamic difficulty adjustments scale target zero-masks to maintain a stable 10s target block time.',
    },
    {
      icon: HardDrive,
      title: 'Decentralized Storage',
      description: 'Educational LunarFS layer chunks, hashes, pins, and synchronizes files recursively using SHA256 content addressing with duplicate storage prevention.',
    },
    {
      icon: Code2,
      title: 'Smart Contracts & LunarVM',
      description: 'Complete stack bytecode VM with transaction-based stack parameters, gas measurement registers, and transparent, deterministic on-chain execution states.',
    },
    {
      icon: Network,
      title: 'P2P Node Synchronization',
      description: 'Local peer discovery, socket heartbeats, incremental mempool propagation, and consensus longest-chain replacement rules with rollback protection.',
    },
    {
      icon: Brain,
      title: 'AI Governance Delegates',
      description: 'Autonomous LunarAgents that analyze treasury allocations, vote on proposals, audit deployed contracts, and simulate market actions.',
    },
    {
      icon: Database,
      title: 'Local-First Persistence',
      description: '100% self-contained blockchain architecture writing block ledger registers, wallet history keys, and system states directly to the user folder.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 dashboard-mesh scrollbar-thin">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/55 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gradient-primary">LunarCoin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#architecture" className="hover:text-foreground transition-colors">Architecture</Link>
            <Link href="#proof-of-work" className="hover:text-foreground transition-colors">PoW Engine</Link>
            <Link href="#local-storage" className="hover:text-foreground transition-colors">Local Storage</Link>
            <Link href="#download" className="hover:text-foreground transition-colors">Download</Link>
          </nav>
          <Button asChild className="shadow-lg shadow-primary/10">
            <Link href="/dashboard">
              Launch Explorer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.15_195_/_0.06),transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Educational Blockchain Mining Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]">
              Demystifying Blockchain Through{' '}
              <span className="text-gradient-primary">Real-Time CPU Mining</span>
            </h1>
            
            <p className="mt-6 text-base md:text-lg text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
              LunarCoin is a locally running educational blockchain ecosystem. Mine blocks strictly on your hardware,
              audit dynamic proof-of-work hashes, deploy smart contracts in LunarVM, and observe peer-to-peer 
              synchronization mechanics in real-time.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-sm px-8 shadow-lg shadow-primary/15 h-12">
                <Link href="/dashboard">
                  Launch Explorer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-sm px-8 border-border/60 hover:bg-muted/40 h-12">
                <Link href="#download">
                  <Download className="mr-2 h-4 w-4" />
                  Download Desktop Miner
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="text-sm px-6 text-muted-foreground hover:text-foreground h-12">
                <Link href="#proof-of-work">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Mechanics
                </Link>
              </Button>
            </div>
          </div>

          {/* Educational HUD Schematic Widget */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="glass-card rounded-xl border border-border/40 p-1 stagger-1">
              <div className="bg-background/40 rounded-lg p-5 border border-border/30">
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-border/40 pb-4 mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-success pulse-live" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">LOCAL NODE SCHEMATIC [ACTIVE]</span>
                  </div>
                  <div className="flex items-center gap-6 font-mono text-[10px] text-muted-foreground">
                    <div>ENGINE: <span className="text-primary font-bold">SHA-256</span></div>
                    <div>VM STATE: <span className="text-primary font-bold">READY</span></div>
                    <div>STORAGE: <span className="text-primary font-bold">LunarFS</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                  <div className="p-4 rounded-lg bg-card/45 border border-border/25">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Target Block Time</div>
                    <div className="text-lg font-bold text-gradient-primary mt-1 font-mono">10.00 Seconds</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Dynamic recalculation frequency: 10 blocks</div>
                  </div>

                  <div className="p-4 rounded-lg bg-card/45 border border-border/25">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Difficulty Target</div>
                    <div className="text-lg font-bold text-gradient-primary mt-1 font-mono">1 - 8 Zero-Mask</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Adjusts recursively on mining load</div>
                  </div>

                  <div className="p-4 rounded-lg bg-card/45 border border-border/25">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Ledger Integrity</div>
                    <div className="text-lg font-bold text-gradient-primary mt-1 font-mono">100% Offline</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Zero cloud dependencies. Local file sync</div>
                  </div>

                  <div className="p-4 rounded-lg bg-card/45 border border-border/25">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Active System state</div>
                    <div className="text-lg font-bold text-gradient-primary mt-1 font-mono">ECDSA Secp256k1</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Cryptographic transaction signature</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Features */}
      <section id="features" className="py-20 border-t border-border/30 bg-card/10 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              A Complete <span className="text-gradient-primary">Engine-Level</span> Audit
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every system inside LunarCoin is fully simulated locally, exposing underlying operations for educational deep dives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={feature.title} className="bg-card/40 border-border/40 card-glow-hover stagger-1">
                <CardHeader className="pb-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Mining Architecture */}
      <section id="architecture" className="py-20 border-t border-border/30 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Block Production <span className="text-gradient-primary">Pipeline</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Understand the life cycle of transactions and block verification inside a local node.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative pl-6 md:pl-0 border-l border-border/30 md:border-l-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Connector line for large screens */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-border/30 hidden md:block" />

              {/* Step 1 */}
              <div className="md:text-right md:pr-12 relative flex flex-col md:items-end justify-center">
                <div className="absolute -left-9 md:left-auto md:-right-[26px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-background z-10" />
                <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-1">01. Transaction Broadcast</span>
                <h3 className="text-lg font-bold mb-2">Cryptographic Verification</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md md:text-right">
                  Users sign transfer payloads with private keys. The node verifies the ECDSA signature against the sender's public key PEM string before pooling it in the mempool.
                </p>
              </div>
              <div className="hidden md:block" />

              {/* Step 2 */}
              <div className="hidden md:block" />
              <div className="md:pl-12 relative flex flex-col justify-center">
                <div className="absolute -left-9 md:-left-[26px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-background z-10" />
                <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-1">02. Merkle Packing</span>
                <h3 className="text-lg font-bold mb-2">Block Template Assembly</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  Transactions are polled from the mempool, bytecode contracts are prepared inside LunarVM, and a new candidate block header is constructed referencing the previous block's hash.
                </p>
              </div>

              {/* Step 3 */}
              <div className="md:text-right md:pr-12 relative flex flex-col md:items-end justify-center">
                <div className="absolute -left-9 md:left-auto md:-right-[26px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-background z-10" />
                <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-1">03. SHA256 PoW Hashing</span>
                <h3 className="text-lg font-bold mb-2">Target Zero-Mask Resolution</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md md:text-right">
                  A high-speed CPU thread cycles the nonce counter inside the block structure. Each block is hashed using SHA256 until the output hash starts with the required number of leading zeroes.
                </p>
              </div>
              <div className="hidden md:block" />

              {/* Step 4 */}
              <div className="hidden md:block" />
              <div className="md:pl-12 relative flex flex-col justify-center">
                <div className="absolute -left-9 md:-left-[26px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-background z-10" />
                <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-1">04. Ledger Consensus</span>
                <h3 className="text-lg font-bold mb-2">Local Database & Sync</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  The valid block is saved to `chain.json`. The node broadcasts the new block to peers. If the peer chain is longer and valid, it replaces the local database recursively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: SHA256 Proof-of-Work */}
      <section id="proof-of-work" className="py-20 border-t border-border/30 bg-card/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              SHA256 <span className="text-gradient-primary">Proof-of-Work</span> Mechanics
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              PoW makes the ledger tamper-proof by requiring computational energy to secure blocks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="flex flex-col justify-center">
              <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-2">Under The Hood</span>
              <h3 className="text-2xl font-bold mb-4">How Difficulty Adjustment Works</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                To prevent miners from producing blocks too quickly, the blockchain measures the time elapsed between blocks.
                Every **10 blocks**, the network calculates the average block time:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Target Block Interval:</strong> Calibrated strictly to 10 seconds.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Scale Up:</strong> If the 10-block average falls below 10 seconds, difficulty is increased by 1.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Scale Down:</strong> If the 10-block average exceeds 10 seconds, difficulty is decreased by 1.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Constraints:</strong> Restricts difficulty limits to <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono font-semibold">[1 - 8]</code> leading hex zeroes.</span>
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-xl border border-border/40 p-1">
              <div className="bg-background/40 rounded-lg p-5 border border-border/20 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-border/40 pb-3 mb-4">
                  <span className="font-bold text-primary">POW_HASHER_SIMULATOR</span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px]">DIFFICULTY: 4</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1.5">Block Template Data</div>
                    <pre className="p-3 rounded-lg bg-black/30 border border-border/20 overflow-x-auto text-pretty font-semibold leading-relaxed">
                      {`{
  "index": 274,
  "previous_hash": "0000a4ffb06fda36f3f4e...",
  "transactions_merkle": "e3b0c44298f...",
  "difficulty": 4
}`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Mining Cycle Outputs</div>
                    
                    <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 text-destructive flex justify-between gap-4">
                      <span>Nonce: 18274</span>
                      <span className="font-bold">c94e82df43a9b1c7a42... [INVALID]</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 text-destructive flex justify-between gap-4">
                      <span>Nonce: 18275</span>
                      <span className="font-bold">3a19b882dfa23401fa9... [INVALID]</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-success/15 border border-success/30 text-success flex justify-between gap-4 pulse-live">
                      <span>Nonce: 18276</span>
                      <span className="font-bold">0000f6dac79a9adf819... [ACCEPTED ✓]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Local Storage */}
      <section id="local-storage" className="py-20 border-t border-border/30 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Self-Contained <span className="text-gradient-primary">Local Storage</span> Architecture
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              No cloud databases, no tracking. LunarCoin keeps all parameters in your local environment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="glass-card rounded-xl border border-border/40 p-1 lg:order-last">
              <div className="bg-background/40 rounded-lg p-6 border border-border/20 font-mono text-xs">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3 mb-4">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  <span className="font-bold text-primary">~/LunarCoinData</span>
                </div>

                <div className="space-y-3 leading-relaxed text-[11px]">
                  <div className="flex justify-between items-center py-1.5 border-b border-border/10">
                    <span className="text-foreground font-semibold">📁 storage/</span>
                    <span className="text-muted-foreground">LunarFS decentralized content storage</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/10 pl-4">
                    <span className="text-muted-foreground">├── Chunk_A93FD...</span>
                    <span className="text-muted-foreground">Content-addressable file block</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/10">
                    <span className="text-foreground font-semibold">📄 chain.json</span>
                    <span className="text-primary font-bold">Persistent Block Ledger Register</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/10">
                    <span className="text-foreground font-semibold">📄 wallet.json</span>
                    <span className="text-muted-foreground">ECDSA public/private PEM keys & balances</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/10">
                    <span className="text-foreground font-semibold">📄 wallet_history.json</span>
                    <span className="text-muted-foreground">Transaction hashes & mining reward logs</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/10">
                    <span className="text-foreground font-semibold">📄 peers.json</span>
                    <span className="text-muted-foreground">Discovered LAN peers & reputation metrics</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-2">Folder Layout</span>
              <h3 className="text-2xl font-bold mb-4">Autonomous File Operations</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                All ledger databases, public/private keys, and content-addressed storage chunks are formatted as standard human-readable JSON files, located in your system's home directory.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you quit LunarCoin, all background processes terminate instantly. When you launch LunarCoin again, the local database reloads immediately, rebuilding the state transition engine recursively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Screenshots Placeholder / Preview */}
      <section className="py-20 border-t border-border/30 bg-card/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              High-Fidelity <span className="text-gradient-primary">Explorer Preview</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore blocks, evaluate VM bytecode variables, and run decentralized storage directly in our React dashboard.
            </p>
          </div>

          <div className="max-w-5xl mx-auto glass-card rounded-xl border border-border/40 p-2 shadow-2xl">
            <div className="bg-background/80 rounded-lg border border-border/30 overflow-hidden relative aspect-[16/9] flex flex-col">
              {/* Fake Chrome / Window Header */}
              <div className="bg-muted/40 h-8 border-b border-border/40 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">LunarScan Block Explorer - Local Dashboard</span>
                <span className="w-10" />
              </div>

              {/* Mock Explorer Content Layout */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-40 border-r border-border/40 p-3 space-y-2 hidden sm:block bg-card/30">
                  <div className="h-6 rounded bg-primary/10 border border-primary/20" />
                  <div className="h-6 rounded bg-muted/30" />
                  <div className="h-6 rounded bg-muted/30" />
                  <div className="h-6 rounded bg-muted/30" />
                  <div className="h-6 rounded bg-muted/30" />
                </div>

                {/* Dashboard Grid */}
                <div className="flex-1 p-4 space-y-4 overflow-hidden">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg border border-border/30 bg-card/20 space-y-1">
                      <div className="text-[8px] font-mono text-muted-foreground">CURRENT HASHRATE</div>
                      <div className="text-sm font-bold font-mono">148.24 H/s</div>
                    </div>
                    <div className="p-3 rounded-lg border border-border/30 bg-card/20 space-y-1">
                      <div className="text-[8px] font-mono text-muted-foreground">BLOCKS MINED</div>
                      <div className="text-sm font-bold font-mono">274 Blocks</div>
                    </div>
                    <div className="p-3 rounded-lg border border-border/30 bg-card/20 space-y-1">
                      <div className="text-[8px] font-mono text-muted-foreground">ACTIVE DIFFICULTY</div>
                      <div className="text-sm font-bold font-mono">0000 Target</div>
                    </div>
                  </div>

                  <div className="flex-1 h-36 rounded-lg border border-border/30 bg-card/20 p-3 space-y-2">
                    <div className="text-[8px] font-mono text-muted-foreground uppercase">Live Blockchain Ledger</div>
                    <div className="space-y-1.5 font-mono text-[9px] text-muted-foreground">
                      <div className="flex justify-between border-b border-border/10 pb-1">
                        <span className="text-primary font-bold">#274</span>
                        <span>0000e3e92816879e15bb5085...</span>
                        <span>1 min ago</span>
                      </div>
                      <div className="flex justify-between border-b border-border/10 pb-1">
                        <span className="text-primary font-bold">#273</span>
                        <span>00001c21d135c223c34a847e...</span>
                        <span>3 mins ago</span>
                      </div>
                      <div className="flex justify-between border-b border-border/10 pb-1">
                        <span className="text-primary font-bold">#272</span>
                        <span>0000bae5cc2c97df57e16f33...</span>
                        <span>5 mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Download & CLI */}
      <section id="download" className="py-20 border-t border-border/30 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-2">Get Started</span>
                <h2 className="text-3xl font-extrabold tracking-tight mb-4">
                  Run LunarCoin Locally
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Set up the offline python engine, launch peer communication threads, and hook the web dashboard up on your own computer.
                </p>

                <div className="space-y-3">
                  <Button size="lg" asChild className="w-full text-sm px-6 h-12 shadow-lg shadow-primary/10">
                    <Link href="https://github.com/Zayannnnn/lunar-miner" target="_blank">
                      <Terminal className="mr-2 h-4 w-4" />
                      View LunarMiner Source
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full text-sm px-6 h-12 border-border/60 hover:bg-muted/40">
                    <Link href="https://github.com/zayannnnn/lunar-coin-blockchain-explorer" target="_blank">
                      <Blocks className="mr-2 h-4 w-4" />
                      View Explorer Source
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Terminal code snippet */}
              <div className="glass-card rounded-xl border border-border/40 p-1">
                <div className="bg-background/40 rounded-lg p-5 border border-border/20 font-mono text-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-border" />
                      <span className="h-2 w-2 rounded-full bg-border" />
                      <span className="h-2 w-2 rounded-full bg-border" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">terminal - setup</span>
                  </div>

                  <div className="space-y-3 leading-relaxed text-muted-foreground">
                    <div>
                      <div className="text-primary"># 1. Clone the Backend Miner</div>
                      <code className="text-foreground block bg-black/30 p-2 rounded border border-border/10 mt-1 font-semibold">
                        git clone https://github.com/Zayannnnn/lunar-miner.git
                      </code>
                    </div>

                    <div>
                      <div className="text-primary"># 2. Run local API server</div>
                      <code className="text-foreground block bg-black/30 p-2 rounded border border-border/10 mt-1 font-semibold">
                        python3 api.py
                      </code>
                    </div>

                    <div>
                      <div className="text-primary"># 3. Start Next.js/Electron Explorer</div>
                      <code className="text-foreground block bg-black/30 p-2 rounded border border-border/10 mt-1 font-semibold">
                        npm run dev
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 bg-card/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Cpu className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-gradient-primary">LunarCoin</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} LunarCoin Educational Project. Open source under MIT License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
