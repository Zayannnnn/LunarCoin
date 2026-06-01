'use client'

import { useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { Address } from '@/lib/types/blockchain'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, Coins, Copy, Gift, Wallet } from 'lucide-react'

function truncateAddress(address: string): string {
  if (!address) return '-'
  if (address.length <= 24) return address
  return `${address.slice(0, 12)}...${address.slice(-10)}`
}

export default function AddressSearchPage() {
  const [wallet, setWallet] = useState<Address | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchWallet() {
      try {
        setLoading(true)
        const data = await blockchainApi.getWallet()
        setWallet(data || null)
        setOffline(false)
      } catch (err) {
        console.error('Failed to fetch wallet:', err)
        setWallet(null)
        setOffline(true)
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  const handleCopy = async () => {
    if (!wallet?.address) return
    await navigator.clipboard.writeText(wallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
        <p className="text-muted-foreground mt-1">
          Local LunarMiner wallet balance and rewards
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[150px] lg:col-span-3" />
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      ) : offline ? (
        <Card className="bg-card/50 border-border/50 max-w-2xl">
          <CardContent className="py-12 text-center">
            <Wallet className="h-10 w-10 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-destructive">Backend unavailable</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Ensure the LunarMiner API is running at http://127.0.0.1:5000
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-card/50 border-border/50 card-glow max-w-4xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Wallet Address</CardTitle>
                  <CardDescription>Returned by the local miner backend</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-sm text-muted-foreground break-all">
                  {wallet?.address || '-'}
                </p>
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!wallet?.address}>
                  {copied ? <Check className="h-4 w-4 mr-2 text-success" /> : <Copy className="h-4 w-4 mr-2" />}
                  {truncateAddress(wallet?.address ?? '')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
                <Coins className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(wallet?.balance ?? 0).toFixed(4)}</div>
                <p className="text-xs text-muted-foreground">LUNAR</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Mined Rewards</CardTitle>
                <Gift className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{(wallet?.minedRewards ?? wallet?.totalReceived ?? 0).toFixed(4)}</div>
                <p className="text-xs text-muted-foreground">LUNAR</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
