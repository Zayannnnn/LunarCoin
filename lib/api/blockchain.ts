/**
 * Blockchain API facade — provides a single surface for pages to import.
 * Points directly and exclusively to the real LunarMiner Flask backend endpoints.
 */

import { realBlockchainApi } from '@/lib/api/blockchain-service'
import { ApiError, toApiError } from '@/lib/api/errors'
import type { BlockchainApi, TransactionFilter } from '@/lib/api/blockchain-service'

export { ApiError, toApiError }
export type { BlockchainApi, TransactionFilter }

// Direct routing proxy - completely deactivates mock data layers globally
export const blockchainApi: BlockchainApi = realBlockchainApi
