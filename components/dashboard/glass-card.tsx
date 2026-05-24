import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface GlassCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
  noPadding?: boolean
}

export function GlassCard({
  title,
  description,
  children,
  className,
  headerAction,
  noPadding,
}: GlassCardProps) {
  return (
    <Card
      className={cn(
        'glass-card border-border/40 card-glow-hover overflow-hidden',
        className
      )}
    >
      {title && (
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm mt-0.5">{description}</CardDescription>
            )}
          </div>
          {headerAction}
        </CardHeader>
      )}
      <CardContent className={cn(noPadding ? 'p-0' : title ? undefined : 'pt-0')}>
        {children}
      </CardContent>
    </Card>
  )
}
