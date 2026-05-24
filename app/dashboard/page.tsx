import { OverviewContent } from './overview-content'
import { LiveBadge } from '@/components/dashboard/live-badge'

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient-primary neon-text">
              Network Overview
            </h1>
            <LiveBadge />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            Real-time statistics and activity on Lunar Chain mainnet
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-success/20 w-fit">
          <div className="h-2 w-2 rounded-full bg-success pulse-live" />
          <span className="text-xs text-success font-medium">Mainnet Online</span>
        </div>
      </div>

      <OverviewContent />
    </div>
  )
}
