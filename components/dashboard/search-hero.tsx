'use client'

import { useState } from 'react'
import { Search, Wallet, Blocks, Hash, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBlockchainSearch } from '@/hooks/use-blockchain-search'

interface SearchHeroProps {
  className?: string
}

export function SearchHero({ className }: SearchHeroProps) {
  const [query, setQuery] = useState('')
  const { search, searching, error } = useBlockchainSearch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await search(query)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="glass-input rounded-xl flex items-center gap-2 p-1.5 pl-4">
        <Search className="h-5 w-5 text-primary shrink-0" />
        <Input
          type="text"
          placeholder="Search wallet address, transaction hash, or block number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-11 text-sm placeholder:text-muted-foreground/70"
          disabled={searching}
        />
        <Button type="submit" size="sm" className="shrink-0 px-5 h-9" disabled={searching}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive mt-2">{error.message}</p>
      )}
      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5 text-primary/70" />
          0x...42 chars
        </span>
        <span className="flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5 text-primary/70" />
          0x...66 chars
        </span>
        <span className="flex items-center gap-1.5">
          <Blocks className="h-3.5 w-3.5 text-primary/70" />
          Block height
        </span>
      </div>
    </form>
  )
}
