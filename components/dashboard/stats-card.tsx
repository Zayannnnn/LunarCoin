import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  pulse?: boolean
  delay?: number
  compact?: boolean
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  pulse,
  delay = 0,
  compact,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'glass-card border-border/40 card-glow-hover animate-slide-up',
        compact ? 'py-0' : '',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className={cn('flex flex-row items-center justify-between', compact ? 'pb-1 pt-4 px-4' : 'pb-2')}>
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn('p-2 rounded-lg bg-primary/10 border border-primary/15', pulse && 'pulse-live')}>
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent className={cn(compact && 'pb-4 px-4 pt-0')}>
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div
              className={cn(
                'font-bold text-foreground tracking-tight tabular-nums truncate',
                compact ? 'text-lg' : 'text-2xl'
              )}
            >
              {value}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded shrink-0 tabular-nums',
                trend.isPositive
                  ? 'bg-success/10 text-success border border-success/20'
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              )}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
