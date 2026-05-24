'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { blockchainApi } from '@/lib/api/blockchain'
import type { Transaction } from '@/lib/types/blockchain'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react'

function truncateHash(hash: string, chars: number = 8): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Loader2,
    className: 'bg-warning/10 text-warning border-warning/20',
    iconClassName: 'animate-spin',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    className: 'bg-success/10 text-success border-success/20',
    iconClassName: '',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    iconClassName: '',
  },
}

export default function TransactionsPage() {
  const searchParams = useSearchParams()
  const highlightHash = searchParams.get('hash')
  
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'failed'>('all')
  const limit = 15

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)
      const data = await blockchainApi.getTransactions(page, limit, filter)
      setTransactions(data.transactions)
      setTotal(data.total)
      setLoading(false)
    }
    fetchTransactions()
  }, [page, filter])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            Browse all transactions on Lunar Chain
          </p>
        </div>
        
        <Select value={filter} onValueChange={(v) => { setFilter(v as typeof filter); setPage(1); }}>
          <SelectTrigger className="w-[180px] bg-input/50 border-border/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Confirmation
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~45s</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Fee
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.00025 LUNAR</div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Txn Hash</TableHead>
                  <TableHead className="text-muted-foreground">Block</TableHead>
                  <TableHead className="text-muted-foreground">Age</TableHead>
                  <TableHead className="text-muted-foreground">From</TableHead>
                  <TableHead className="text-muted-foreground">To</TableHead>
                  <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                  <TableHead className="text-muted-foreground text-right">Fee</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(10)].map((_, i) => (
                    <TableRow key={i} className="border-border/50">
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  transactions.map((tx) => {
                    const status = statusConfig[tx.status]
                    const StatusIcon = status.icon
                    
                    return (
                      <TableRow 
                        key={tx.hash} 
                        className={cn(
                          'border-border/50 hover:bg-accent/50 transition-colors',
                          highlightHash === tx.hash && 'bg-primary/5 border-l-2 border-l-primary'
                        )}
                      >
                        <TableCell className="font-mono text-sm text-primary">
                          {truncateHash(tx.hash)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {tx.blockHeight ? `#${tx.blockHeight.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatTimeAgo(tx.timestamp)}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {truncateHash(tx.from, 4)}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {truncateHash(tx.to, 4)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {tx.amount.toFixed(4)} LUNAR
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {tx.fee.toFixed(6)}
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium',
                            status.className
                          )}>
                            <StatusIcon className={cn('h-3 w-3', status.iconClassName)} />
                            {status.label}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total.toLocaleString()} transactions
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
              <span className="text-sm text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
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
        </CardContent>
      </Card>
    </div>
  )
}
