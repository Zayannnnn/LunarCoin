'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { blockchainApi } from '@/lib/api/blockchain'
import type { Address, Transaction } from '@/lib/types/blockchain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionRow } from '@/components/dashboard/transaction-row'
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toLocaleString()
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AddressDetailPage() {
  const params = useParams()
  const address = params.address as string
  
  const [addressData, setAddressData] = useState<Address | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [page, setPage] = useState(1)
  const [totalTxns, setTotalTxns] = useState(0)
  const limit = 10

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [addrData, txData] = await Promise.all([
          blockchainApi.getAddress(address),
          blockchainApi.getAddressTransactions(address, page, limit),
        ])
        setAddressData(addrData || null)
        setTransactions(txData?.transactions || [])
        setTotalTxns(txData?.total ?? 0)
      } catch (err) {
        console.error('Failed to fetch address data:', err)
        setAddressData(null)
        setTransactions([])
        setTotalTxns(0)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [address, page])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalPages = Math.ceil(totalTxns / limit)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="w-fit">
          <Link href="/dashboard/address">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Address
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-mono text-sm text-muted-foreground truncate">
              {address}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-success" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {addressData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{addressData.balance.toFixed(4)}</div>
              <p className="text-xs text-muted-foreground">LUNAR</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Received
              </CardTitle>
              <ArrowDownLeft className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {addressData.totalReceived.toFixed(4)}
              </div>
              <p className="text-xs text-muted-foreground">LUNAR</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sent
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {addressData.totalSent.toFixed(4)}
              </div>
              <p className="text-xs text-muted-foreground">LUNAR</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transactions
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(addressData.transactionCount)}</div>
              <p className="text-xs text-muted-foreground">
                First seen: {formatDate(addressData.firstSeen)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction History */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[72px]" />
            ))
          ) : transactions.length > 0 ? (
            transactions.map((tx) => (
              <TransactionRow
                key={tx.hash}
                transaction={tx}
                highlightAddress={address}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No transactions found for this address.
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-border/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-border/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
