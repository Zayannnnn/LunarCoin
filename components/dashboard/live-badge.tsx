import { cn } from '@/lib/utils'

interface LiveBadgeProps {
  label?: string
  className?: string
}

export function LiveBadge({ label = 'Live', className }: LiveBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        'bg-primary/10 text-primary border border-primary/20',
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      {label}
    </span>
  )
}
