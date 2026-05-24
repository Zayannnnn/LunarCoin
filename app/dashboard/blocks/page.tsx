'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Block } from '@/lib/types/blockchain'
import { useApiQuery } from '@/hooks/use-api-query'
import { blockchainApi } from '@/lib/api/blockchain'
import { ApiErrorBanner } from '@/components/dashboard/api-error-banner'
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
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Blocks as BlocksIcon, Clock, Database, Zap } from 'lucide-react'

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

export default function BlocksPage() {
  const searchParams = useSearchParams()
  const highlightHeight = searchParams.get('height')
  
  const [page, setPage] = useState(1)
  const limit = 15

  const { data, loading, error, refetch } = useApiQuery(
    `blocks-${page}`,
    () => blockchainApi.getBlocks(page, limit),
    { enabled: true }
  )

  const blocks: Block[] = data?.blocks ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <ApiErrorBanner error={error} onRetry={refetch} />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Blocks</h1>
        <p className="text-muted-foreground mt-1">
          Browse all blocks on Lunar Chain
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Latest Block
            </CardTitle>
            <BlocksIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              #{blocks[0]?.height.toLocaleString() || '-'}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Block Time
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.2s</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Block Size
            </CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5 KB</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Block Reward
            </CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.25 LUNAR</div>
          </CardContent>
        </Card>
      </div>

      {/* Blocks Table */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Height</TableHead>
                  <TableHead className="text-muted-foreground">Hash</TableHead>
                  <TableHead className="text-muted-foreground">Age</TableHead>
                  <TableHead className="text-muted-foreground">Txns</TableHead>
                  <TableHead className="text-muted-foreground">Miner</TableHead>
                  <TableHead className="text-muted-foreground">Size</TableHead>
                  <TableHead className="text-muted-foreground text-right">Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(10)].map((_, i) => (
                    <TableRow key={i} className="border-border/50">
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  blocks.map((block) => (
                    <TableRow 
                      key={block.height} 
                      className={`border-border/50 hover:bg-accent/50 transition-colors ${
                        highlightHeight === String(block.height) ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                      }`}
                    >
                      <TableCell className="font-semibold text-primary">
                        #{block.height.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {truncateHash(block.hash)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatTimeAgo(block.timestamp)}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                          {block.transactions}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {truncateHash(block.miner, 6)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {(block.size / 1000).toFixed(1)} KB
                      </TableCell>
                      <TableCell className="text-right font-medium text-success">
                        +{block.reward} LUNAR
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total.toLocaleString()} blocks
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
