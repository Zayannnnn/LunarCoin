'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { blockchainApi } from '@/lib/api/blockchain'
import { normalizeHex } from '@/lib/api/mappers'
import { ApiError, toApiError } from '@/lib/api/errors'

export function useBlockchainSearch() {
  const router = useRouter()
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const search = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim()
      if (!query) return

      setSearching(true)
      setError(null)

      try {
        if (query.startsWith('0x') && query.length === 66) {
          const hash = normalizeHex(query)
          const tx = await blockchainApi.getTransaction(hash)
          if (tx) {
            router.push(`/dashboard/transactions?hash=${hash}`)
            return
          }
          const block = await blockchainApi.getBlock(hash)
          if (block) {
            router.push(`/dashboard/blocks?height=${block.height}`)
            return
          }
          router.push(`/dashboard/transactions?hash=${hash}`)
          return
        }

        if (query.startsWith('0x') && query.length === 42) {
          router.push(`/dashboard/address/${normalizeHex(query)}`)
          return
        }

        if (/^\d+$/.test(query)) {
          const block = await blockchainApi.getBlock(Number(query))
          if (block) {
            router.push(`/dashboard/blocks?height=${block.height}`)
          } else {
            router.push(`/dashboard/blocks?height=${query}`)
          }
          return
        }

        router.push(`/dashboard/search?q=${encodeURIComponent(query)}`)
      } catch (err) {
        setError(toApiError(err))
      } finally {
        setSearching(false)
      }
    },
    [router]
  )

  return { search, searching, error }
}
