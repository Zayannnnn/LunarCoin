'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Wallet } from 'lucide-react'

export default function AddressSearchPage() {
  const router = useRouter()
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmed = address.trim()
    if (!trimmed) {
      setError('Please enter an address')
      return
    }
    
    // Basic validation - should start with 0x and be 42 chars
    if (!trimmed.startsWith('0x') || trimmed.length !== 42) {
      setError('Invalid address format. Address should start with 0x and be 42 characters.')
      return
    }
    
    router.push(`/dashboard/address/${trimmed}`)
  }

  // Example addresses for quick testing
  const exampleAddresses = [
    '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD87',
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdef1234567890abcdef1234567890abcdef12',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Address Lookup</h1>
        <p className="text-muted-foreground mt-1">
          Search for any address on Lunar Chain
        </p>
      </div>

      {/* Search Card */}
      <Card className="bg-card/50 border-border/50 max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Address Search</CardTitle>
              <CardDescription>Enter a wallet address to view its balance and transaction history</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="0x..."
                value={address}
                onChange={(e) => { setAddress(e.target.value); setError(''); }}
                className="bg-input/50 border-border/50 font-mono"
              />
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>
            <Button type="submit" className="shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-3">Try an example address:</p>
            <div className="flex flex-wrap gap-2">
              {exampleAddresses.map((addr) => (
                <Button
                  key={addr}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs border-border/50 hover:border-primary/50"
                  onClick={() => setAddress(addr)}
                >
                  {addr.slice(0, 6)}...{addr.slice(-4)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
