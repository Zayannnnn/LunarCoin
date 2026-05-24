'use client'

import { AuthProvider } from '@/components/providers/auth-provider'
import { BlockchainProvider } from '@/components/providers/blockchain-provider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BlockchainProvider>{children}</BlockchainProvider>
    </AuthProvider>
  )
}

export { useAuth } from '@/components/providers/auth-provider'
export { useBlockchainRealtime } from '@/components/providers/blockchain-provider'
