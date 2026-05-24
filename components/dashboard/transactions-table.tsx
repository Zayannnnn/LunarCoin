'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/lib/types/blockchain'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GlassCard } from '@/components/dashboard/glass-card'

interface TransactionsTableProps {
  transactions: Transaction[]
  className?: string
}

function truncateHash(hash: string, chars = 6): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

const statusStyles = {
  pending: 'text-warning bg-warning/10 border-warning/20',
  confirmed: 'text-success bg-success/10 border-success/20',
  failed: 'text-destructive bg-destructive/10 border-destructive/20',
}

export function TransactionsTable({ transactions, className }: TransactionsTableProps) {
  return (
    <GlassCard className={cn('overflow-hidden', className)} noPadding>
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                Txn Hash
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                From / To
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">
                Amount
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right hidden md:table-cell">
                Fee
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow
                key={tx.hash}
                className="border-border/30 hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <TableCell className="py-3">
                  <Link
                    href={`/dashboard/transactions?hash=${tx.hash}`}
                    className="font-mono text-sm text-primary hover:underline"
                  >
                    {truncateHash(tx.hash)}
                  </Link>
                  <p className="text-[10px] text-muted-foreground mt-0.5 sm:hidden font-mono">
                    {truncateHash(tx.from, 4)} → {truncateHash(tx.to, 4)}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="text-xs font-mono text-muted-foreground space-y-0.5">
                    <p>{truncateHash(tx.from, 4)}</p>
                    <p className="text-foreground/70">→ {truncateHash(tx.to, 4)}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-sm">
                  {tx.amount.toFixed(4)}
                  <span className="text-[10px] text-muted-foreground ml-1">LUNAR</span>
                </TableCell>
                <TableCell className="text-right hidden md:table-cell text-xs text-muted-foreground font-mono tabular-nums">
                  {tx.fee.toFixed(6)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded border uppercase tracking-wide font-medium',
                        statusStyles[tx.status]
                      )}
                    >
                      {tx.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTimeAgo(tx.timestamp)} ago
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GlassCard>
  )
}
