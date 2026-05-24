import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LiveBadge } from '@/components/dashboard/live-badge'

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
  live?: boolean
  delay?: number
}

export function ChartCard({
  title,
  description,
  children,
  className,
  action,
  live,
  delay = 0,
}: ChartCardProps) {
  return (
    <Card
      className={cn('glass-card border-border/40 card-glow-hover animate-slide-up', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
            {live && <LiveBadge />}
          </div>
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
