import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'
import type { Transaction } from '@/lib/types/blockchain'

interface TransactionRowProps {
  transaction: Transaction
  className?: string
  highlightAddress?: string
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function truncateHash(hash?: string, chars: number = 6): string {
  const s = hash ?? ''
  return `${s.slice(0, chars + 2)}...${s.slice(-chars)}`
}

const statusColors = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  confirmed: 'bg-success/10 text-success border-success/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
}

export function TransactionRow({ transaction, className, highlightAddress }: TransactionRowProps) {
  const isIncoming = Boolean(highlightAddress && transaction.to && transaction.to.toLowerCase() === highlightAddress.toLowerCase())
  const isOutgoing = Boolean(highlightAddress && transaction.from && transaction.from.toLowerCase() === highlightAddress.toLowerCase())
  
  return (
    <Link
      href={`/dashboard/transactions?hash=${transaction.hash}`}
      className={cn(
        'flex items-center justify-between p-3 rounded-xl glass-card border-border/40 hover:border-primary/30 transition-all duration-300 gap-4',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn(
          'p-2 rounded-lg',
          isIncoming ? 'bg-success/10' : isOutgoing ? 'bg-destructive/10' : 'bg-primary/10'
        )}>
          {isIncoming ? (
            <ArrowDownLeft className="h-4 w-4 text-success" />
          ) : isOutgoing ? (
            <ArrowUpRight className="h-4 w-4 text-destructive" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-primary" />
          )}
        </div>
        
        <div className="min-w-0">
          <p className="text-sm font-mono text-foreground truncate">
            {truncateHash(transaction.hash)}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <span className="truncate">
              From: <span className="font-mono">{truncateHash(transaction.from, 4)}</span>
            </span>
            <span className="text-border">|</span>
            <span className="truncate">
              To: <span className="font-mono">{truncateHash(transaction.to, 4)}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">
            {(transaction.amount ?? 0).toFixed(4)} LUNAR
          </p>
          <p className="text-xs text-muted-foreground">
            Fee: {(transaction.fee ?? 0).toFixed(6)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className={cn(
            'text-xs px-2 py-0.5 rounded border',
            statusColors[transaction.status]
          )}>
            {transaction.status}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(transaction.timestamp)}
          </div>
        </div>
      </div>
    </Link>
  )
}
