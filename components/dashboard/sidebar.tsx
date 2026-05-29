'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Blocks,
  ArrowLeftRight,
  Wallet,
  Send,
  Layers,
  TrendingUp,
  Pickaxe,
  Wifi,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Cpu,
  Boxes,
  Vote,
  Image,
  Bot,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navGroups = [
  {
    title: 'Primary Section',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/mining', label: 'Mining', icon: Pickaxe },
      { href: '/dashboard/blocks', label: 'Blocks', icon: Blocks },
      { href: '/dashboard/fees', label: 'Analytics', icon: TrendingUp },
      { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
      { href: '/dashboard/address', label: 'Wallet', icon: Wallet },
      { href: '/dashboard/send', label: 'Send Coins', icon: Send },
    ],
  },
  {
    title: 'Advanced Features',
    items: [
      { href: '/dashboard/contracts', label: 'Smart Contracts', icon: Cpu },
      { href: '/dashboard/governance', label: 'Governance', icon: Vote },
      { href: '/dashboard/agents', label: 'AI Agents', icon: Bot },
      { href: '/dashboard/nfts', label: 'LunarFS', icon: Layers },
      { href: '/dashboard/nfts', label: 'NFTs', icon: Image },
      { href: '/dashboard/dapps', label: 'DApps', icon: Boxes },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      { href: '/dashboard/network', label: 'P2P Network', icon: Wifi },
      { href: '/dashboard/reputation', label: 'Node Reputation', icon: ShieldAlert },
    ],
  }
]

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card/65 backdrop-blur-md border-r border-border/30 transition-all duration-300 select-none',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border/20">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <NextImage 
            src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" 
            alt="LunarScan Logo" 
            width={32} 
            height={32} 
            className="rounded-full shrink-0"
          />
          {!collapsed && (
            <span className="text-lg font-bold font-mono tracking-wider text-primary whitespace-nowrap">
              LunarScan
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            {!collapsed && (
              <span className="px-3 text-[9px] font-bold tracking-widest text-muted-foreground/50 uppercase block font-mono">
                {group.title}
              </span>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 group font-mono text-xs border border-transparent',
                      isActive
                        ? 'bg-primary/5 text-primary border-primary/10 shadow-[0_0_15px_rgba(0,240,255,0.02)]'
                        : 'text-muted-foreground/75 hover:bg-white/5 hover:text-foreground'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate font-medium">{item.label}</span>
                    )}
                    {isActive && !collapsed && (
                      <div className="ml-auto h-1 w-1 rounded-full bg-primary" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-border/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground font-mono"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

