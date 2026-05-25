'use client'

import { blockchainApi } from '@/lib/api/blockchain'
import type { MempoolData } from '@/lib/types/blockchain'
import { useApiQuery } from '@/hooks/use-api-query'
import { ApiErrorBanner } from '@/components/dashboard/api-error-banner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartCard } from '@/components/dashboard/chart-card'
import { TransactionRow } from '@/components/dashboard/transaction-row'
import { Skeleton } from '@/components/ui/skeleton'
import { Layers, Database, Clock, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB'
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB'
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB'
  return bytes + ' B'
}

export default function MempoolPage() {
  const { data: mempool, loading, error, refetch } = useApiQuery<MempoolData>(
    'mempool',
    () => blockchainApi.getMempool(),
    { pollInterval: 10000 }
  )

  const barColors = [
    'oklch(0.72 0.19 155)',  // green - lowest fee
    'oklch(0.75 0.15 195)',  // cyan
    'oklch(0.65 0.18 280)',  // purple
    'oklch(0.8 0.18 85)',    // amber
    'oklch(0.65 0.2 25)',    // red - highest fee
  ]

  if (loading && !mempool) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mempool</h1>
          <p className="text-muted-foreground mt-1">Pending transactions waiting for confirmation</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ApiErrorBanner error={error} onRetry={refetch} />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mempool</h1>
        <p className="text-muted-foreground mt-1">
          Pending transactions waiting for confirmation
        </p>
      </div>

      {/* Stats */}
      {mempool && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Txns
              </CardTitle>
              <Layers className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mempool.transactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mempool Size
              </CardTitle>
              <Database className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(mempool.size)}</div>
              <p className="text-xs text-muted-foreground">Total data size</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Wait Time
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">~2.5 min</div>
              <p className="text-xs text-muted-foreground">Estimated</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Min Fee Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.0001</div>
              <p className="text-xs text-muted-foreground">LUNAR/tx</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fee Distribution Chart */}
      {mempool && (
        <ChartCard 
          title="Fee Distribution" 
          description="Transaction count by fee range (LUNAR)"
        >
              <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mempool.feeDistribution || []}>
                <XAxis 
                  dataKey="range" 
                  stroke="oklch(0.5 0.01 265)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="oklch(0.5 0.01 265)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.14 0.015 265)',
                    border: '1px solid oklch(0.25 0.02 265)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'oklch(0.65 0.01 265)' }}
                  cursor={{ fill: 'oklch(0.75 0.15 195 / 0.1)' }}
                />
                <Bar dataKey="count" name="Transactions" radius={[4, 4, 0, 0]}>
                  {(mempool.feeDistribution || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {/* Pending Transactions */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Pending Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(mempool?.pendingTransactions || []).slice(0, 10).map((tx) => (
            <TransactionRow key={tx.hash} transaction={tx} />
          ))}

          {(mempool?.pendingTransactions || []).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No pending transactions in the mempool.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
