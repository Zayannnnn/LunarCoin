import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Blocks, Clock, ArrowRight } from 'lucide-react'
import type { Block } from '@/lib/types/blockchain'

interface BlockCardProps {
  block: Block
  className?: string
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function truncateHash(hash?: string, chars: number = 8): string {
  const s = hash ?? ''
  return `${s.slice(0, chars + 2)}...${s.slice(-chars)}`
}

export function BlockCard({ block, className }: BlockCardProps) {
  return (
    <Link
      href={`/dashboard/blocks?height=${block.height}`}
      className={cn(
        'block p-4 rounded-xl glass-card border-border/40 hover:border-primary/30 transition-all duration-300 card-glow-hover group',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Blocks className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                #{(block.height ?? 0).toLocaleString()}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success">
                +{block.reward ?? 0} LUNAR
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {truncateHash(block.hash)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(block.timestamp)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {block.transactions} txns
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Size: {(block.size / 1000).toFixed(1)} KB</span>
          <span>Gas: {((block.gasUsed / block.gasLimit) * 100).toFixed(1)}%</span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  )
}
