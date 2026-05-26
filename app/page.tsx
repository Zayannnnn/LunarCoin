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
      icon: Blocks,
      title: 'Block Explorer',
      description: 'Browse all blocks with detailed information including transactions, miners, and rewards.',
    },
    {
      icon: ArrowLeftRight,
      title: 'Transaction Tracking',
      description: 'Track any transaction status, confirmations, and gas fees in real-time.',
    },
    {
      icon: Search,
      title: 'Address Lookup',
      description: 'View wallet balances, transaction history, and complete address analytics.',
    },
    {
      icon: Layers,
      title: 'Mempool Monitor',
      description: 'Monitor pending transactions and fee distribution in the memory pool.',
    },
    {
      icon: Zap,
      title: 'Mining Statistics',
      description: 'Track network hash rate, difficulty adjustments, and top mining pools.',
    },
    {
      icon: Wifi,
      title: 'Network Health',
      description: 'Monitor peer connections, latency distribution, and network status.',
    },
  ]

  const stats = [
    { label: 'Total Blocks', value: '1,000,000+' },
    { label: 'Transactions', value: '50M+' },
    { label: 'Active Peers', value: '10,000+' },
    { label: 'Network Uptime', value: '99.99%' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" 
              alt="LunarScan Logo" 
              width={40} 
              height={40} 
              className="rounded-full"
            />
            <span className="text-xl font-bold text-gradient-primary">LunarScan</span>
          </Link>
          <Button asChild>
            <Link href="/auth/login">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.15_195_/_0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.65_0.18_280_/_0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Trusted by thousands of users</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Explore the{' '}
              <span className="text-gradient-primary">Lunar Chain</span>
              {' '}Blockchain
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              The most comprehensive blockchain explorer for Lunar Coin. Track transactions, 
              analyze blocks, monitor network health, and discover mining statistics in real-time.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-base px-8">
                <Link href="/auth/login">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 border-border/50">
                <Link href="#features">
                  View Features
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need to{' '}
              <span className="text-gradient-primary">Explore</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and analytics to help you understand the Lunar Chain network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card/50 border-border/50 card-glow-hover">
                <CardHeader>
                  <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 max-w-3xl mx-auto">
            <CardContent className="text-center py-12 px-8">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to Explore?</h2>
              <p className="mt-4 text-muted-foreground">
                Sign in with Google to access the full LunarScan dashboard and start exploring the Lunar Chain.
              </p>
              <Button size="lg" asChild className="mt-8 text-base px-8">
                <Link href="/auth/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" 
                alt="LunarScan Logo" 
                width={28} 
                height={28} 
                className="rounded-full"
              />
              <span className="font-semibold text-gradient-primary">LunarScan</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LunarScan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
