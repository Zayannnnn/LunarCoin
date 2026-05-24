'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api/errors'
import { cn } from '@/lib/utils'

interface ApiErrorBannerProps {
  error: ApiError | null
  onRetry?: () => void
  className?: string
}

export function ApiErrorBanner({ error, onRetry, className }: ApiErrorBannerProps) {
  if (!error) return null

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl',
        'glass-card border-destructive/30 bg-destructive/5',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-destructive">Failed to load blockchain data</p>
          <p className="text-xs text-muted-foreground mt-0.5">{error.message}</p>
          {error.isNetworkError && (
            <p className="text-xs text-muted-foreground mt-1">
              Ensure the Python API is running at {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}
            </p>
          )}
        </div>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0 border-destructive/30">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Retry
        </Button>
      )}
    </div>
  )
}
