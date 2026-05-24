'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ArrowLeft, Blocks, ArrowLeftRight, Wallet, Loader2 } from 'lucide-react'
import { blockchainApi } from '@/lib/api/blockchain'
import { ApiErrorBanner } from '@/components/dashboard/api-error-banner'
import { toApiError, type ApiError } from '@/lib/api/errors'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [result, setResult] = useState<{
    type: 'block' | 'transaction' | 'address'
    href: string
    label: string
  } | null>(null)

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    async function lookup() {
      setLoading(true)
      setError(null)
      setResult(null)

      try {
        if (query.startsWith('0x') && query.length === 66) {
          const tx = await blockchainApi.getTransaction(query)
          if (tx) {
            setResult({
              type: 'transaction',
              href: `/dashboard/transactions?hash=${tx.hash}`,
              label: tx.hash,
            })
            return
          }
          const block = await blockchainApi.getBlock(query)
          if (block) {
            setResult({
              type: 'block',
              href: `/dashboard/blocks?height=${block.height}`,
              label: `#${block.height}`,
            })
            return
          }
        }

        if (query.startsWith('0x') && query.length === 42) {
          const addr = await blockchainApi.getAddress(query)
          if (addr) {
            setResult({
              type: 'address',
              href: `/dashboard/address/${addr.address}`,
              label: addr.address,
            })
            return
          }
        }

        if (/^\d+$/.test(query)) {
          const block = await blockchainApi.getBlock(Number(query))
          if (block) {
            setResult({
              type: 'block',
              href: `/dashboard/blocks?height=${block.height}`,
              label: `#${block.height}`,
            })
            return
          }
        }
      } catch (err) {
        setError(toApiError(err))
      } finally {
        setLoading(false)
      }
    }

    lookup()
  }, [query])

  const suggestions = [
    {
      type: 'Block Height',
      description: 'Search by block number',
      example: '1000000',
      icon: Blocks,
      href: '/dashboard/blocks',
    },
    {
      type: 'Transaction Hash',
      description: 'Search by transaction hash',
      example: '0x1234...abcd',
      icon: ArrowLeftRight,
      href: '/dashboard/transactions',
    },
    {
      type: 'Address',
      description: 'Search by wallet address',
      example: '0x742d...5f2B',
      icon: Wallet,
      href: '/dashboard/address',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Search Results</h1>
          <p className="text-muted-foreground mt-1">
            Showing results for: <span className="font-mono text-foreground">{query}</span>
          </p>
        </div>
      </div>

      <ApiErrorBanner error={error} />

      {loading ? (
        <Card className="glass-card border-border/40">
          <CardContent className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Searching blockchain...</span>
          </CardContent>
        </Card>
      ) : result ? (
        <Card className="glass-card border-primary/30 card-glow-hover">
          <CardContent className="py-8 flex flex-col items-center text-center gap-4">
            <p className="text-sm text-muted-foreground">Found {result.type}</p>
            <p className="font-mono text-sm text-foreground break-all max-w-lg">{result.label}</p>
            <Button asChild>
              <Link href={result.href}>View Details</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No Results Found</h2>
            <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
              We couldn&apos;t find any blocks, transactions, or addresses matching your search.
            </p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Search Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.type} className="glass-card border-border/40 card-glow-hover">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <suggestion.icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">{suggestion.type}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Example: <span className="font-mono text-foreground">{suggestion.example}</span>
                </p>
                <Button variant="link" size="sm" asChild className="mt-2 p-0 h-auto">
                  <Link href={suggestion.href}>Try searching</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults />
    </Suspense>
  )
}
