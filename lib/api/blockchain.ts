/**
 * Blockchain API facade — provides a single surface for pages to import.
 * When `NEXT_PUBLIC_USE_MOCK_API=true` the module forwards calls to the
 * `mockBlockchainApi`, otherwise it uses the real backend-backed service.
 */

import { env } from '@/lib/config/env'
import { mockBlockchainApi } from '@/lib/api/mock/blockchain-mock'
import { realBlockchainApi } from '@/lib/api/blockchain-service'
import { ApiError, toApiError } from '@/lib/api/errors'
import type { BlockchainApi, TransactionFilter } from '@/lib/api/blockchain-service'

export { ApiError, toApiError }

export const blockchainApi: BlockchainApi = {
	async getNetworkStats() {
		if (env.api.useMock) return mockBlockchainApi.getNetworkStats()
		return realBlockchainApi.getNetworkStats()
	},

	async getWallet() {
		if (env.api.useMock) return mockBlockchainApi.getAddress('mock-wallet')
		return realBlockchainApi.getWallet()
	},

	async getBlocks(page?: number, limit?: number) {
		if (env.api.useMock) return mockBlockchainApi.getBlocks(page, limit)
		return realBlockchainApi.getBlocks(page, limit)
	},

	async getBlock(hashOrHeight: string | number) {
		if (env.api.useMock) return mockBlockchainApi.getBlock(hashOrHeight)
		return realBlockchainApi.getBlock(hashOrHeight)
	},

	async getTransactions(page?: number, limit?: number, filter?: TransactionFilter) {
		if (env.api.useMock) return mockBlockchainApi.getTransactions(page, limit, filter)
		return realBlockchainApi.getTransactions(page, limit, filter)
	},

	async getTransaction(hash: string) {
		if (env.api.useMock) return mockBlockchainApi.getTransaction(hash)
		return realBlockchainApi.getTransaction(hash)
	},

	async getAddress(address: string) {
		if (env.api.useMock) return mockBlockchainApi.getAddress(address)
		return realBlockchainApi.getAddress(address)
	},

	async getAddressTransactions(address: string, page?: number, limit?: number) {
		if (env.api.useMock) return mockBlockchainApi.getAddressTransactions(address, page, limit)
		return realBlockchainApi.getAddressTransactions(address, page, limit)
	},

	async getMempool() {
		if (env.api.useMock) return mockBlockchainApi.getMempool()
		return realBlockchainApi.getMempool()
	},

	async getFeeEstimates() {
		if (env.api.useMock) return mockBlockchainApi.getFeeEstimates()
		return realBlockchainApi.getFeeEstimates()
	},

	async getMiningStats() {
		if (env.api.useMock) return mockBlockchainApi.getMiningStats()
		return realBlockchainApi.getMiningStats()
	},

	async getLiveMiningStats() {
		if (env.api.useMock) return mockBlockchainApi.getLiveMiningStats()
		return realBlockchainApi.getLiveMiningStats()
	},

	async getMiningLogs() {
		if (env.api.useMock) return mockBlockchainApi.getMiningLogs()
		return realBlockchainApi.getMiningLogs()
	},

	async startMining() {
		if (env.api.useMock) return
		return realBlockchainApi.startMining()
	},

	async stopMining() {
		if (env.api.useMock) return
		return realBlockchainApi.stopMining()
	},

	async getTopMiners(limit?: number) {
		if (env.api.useMock) return mockBlockchainApi.getTopMiners(limit)
		return realBlockchainApi.getTopMiners(limit)
	},

	async getPeers(limit?: number) {
		if (env.api.useMock) return mockBlockchainApi.getPeers(limit)
		return realBlockchainApi.getPeers(limit)
	},

	async getHashRateHistory(hours?: number) {
		if (env.api.useMock) return mockBlockchainApi.getHashRateHistory(hours)
		return realBlockchainApi.getHashRateHistory(hours)
	},

	async getDifficultyHistory(hours?: number) {
		if (env.api.useMock) return mockBlockchainApi.getDifficultyHistory(hours)
		return realBlockchainApi.getDifficultyHistory(hours)
	},

	async getFeeHistory(hours?: number) {
		if (env.api.useMock) return mockBlockchainApi.getFeeHistory(hours)
		return realBlockchainApi.getFeeHistory(hours)
	},

	async getTpsHistory(hours?: number) {
		if (env.api.useMock) return mockBlockchainApi.getTpsHistory(hours)
		return realBlockchainApi.getTpsHistory(hours)
	},
}

export type { BlockchainApi }
