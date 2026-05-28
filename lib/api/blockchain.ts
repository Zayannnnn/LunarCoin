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

	async getWalletAddressInfo() {
		if (env.api.useMock) return mockBlockchainApi.getWalletAddressInfo()
		return realBlockchainApi.getWalletAddressInfo()
	},

	async getWalletHistory() {
		if (env.api.useMock) return mockBlockchainApi.getWalletHistory()
		return realBlockchainApi.getWalletHistory()
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

	async connectPeer(address: string) {
		if (env.api.useMock) return mockBlockchainApi.connectPeer(address)
		return realBlockchainApi.connectPeer(address)
	},

	async sendTransaction(recipient: string, amount: number) {
		if (env.api.useMock) return mockBlockchainApi.sendTransaction(recipient, amount)
		return realBlockchainApi.sendTransaction(recipient, amount)
	},

	async getNetworkHealth() {
		if (env.api.useMock) return mockBlockchainApi.getNetworkHealth()
		return realBlockchainApi.getNetworkHealth()
	},

	async getNodeReputation() {
		if (env.api.useMock) return mockBlockchainApi.getNodeReputation()
		return realBlockchainApi.getNodeReputation()
	},

	async getFederatedStats() {
		if (env.api.useMock) return mockBlockchainApi.getFederatedStats()
		return realBlockchainApi.getFederatedStats()
	},

	async deployContract(code: any[], gasLimit: number) {
		if (env.api.useMock) return mockBlockchainApi.deployContract(code, gasLimit)
		return realBlockchainApi.deployContract(code, gasLimit)
	},

	async executeContract(address: string, gasLimit: number) {
		if (env.api.useMock) return mockBlockchainApi.executeContract(address, gasLimit)
		return realBlockchainApi.executeContract(address, gasLimit)
	},

	async getContracts() {
		if (env.api.useMock) return mockBlockchainApi.getContracts()
		return realBlockchainApi.getContracts()
	},

	async getContractDetail(address: string) {
		if (env.api.useMock) return mockBlockchainApi.getContractDetail(address)
		return realBlockchainApi.getContractDetail(address)
	},

	async getVmStats() {
		if (env.api.useMock) return mockBlockchainApi.getVmStats()
		return realBlockchainApi.getVmStats()
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

	async createProposal(title: string, description: string, proposal_type: string, param_key: string, param_value: any, deadline_hours: number) {
		if (env.api.useMock) return mockBlockchainApi.createProposal(title, description, proposal_type, param_key, param_value, deadline_hours)
		return realBlockchainApi.createProposal(title, description, proposal_type, param_key, param_value, deadline_hours)
	},

	async voteProposal(proposal_id: string, vote: 'yes' | 'no' | 'abstain') {
		if (env.api.useMock) return mockBlockchainApi.voteProposal(proposal_id, vote)
		return realBlockchainApi.voteProposal(proposal_id, vote)
	},

	async getProposals() {
		if (env.api.useMock) return mockBlockchainApi.getProposals()
		return realBlockchainApi.getProposals()
	},

	async getProposal(id: string) {
		if (env.api.useMock) return mockBlockchainApi.getProposal(id)
		return realBlockchainApi.getProposal(id)
	},

	async executeProposal(proposal_id: string) {
		if (env.api.useMock) return mockBlockchainApi.executeProposal(proposal_id)
		return realBlockchainApi.executeProposal(proposal_id)
	},

	async getTreasuryStats() {
		if (env.api.useMock) return mockBlockchainApi.getTreasuryStats()
		return realBlockchainApi.getTreasuryStats()
	},

	async getStakingStats() {
		if (env.api.useMock) return mockBlockchainApi.getStakingStats()
		return realBlockchainApi.getStakingStats()
	},

	async stakeCoins(amount: number) {
		if (env.api.useMock) return mockBlockchainApi.stakeCoins(amount)
		return realBlockchainApi.stakeCoins(amount)
	},

	async unstakeCoins(amount: number) {
		if (env.api.useMock) return mockBlockchainApi.unstakeCoins(amount)
		return realBlockchainApi.unstakeCoins(amount)
	},

	async uploadFile(formData: FormData) {
		if (env.api.useMock) return mockBlockchainApi.uploadFile(formData)
		return realBlockchainApi.uploadFile(formData)
	},

	async mintNFT(name: string, description: string, content_hash: string, properties?: any) {
		if (env.api.useMock) return mockBlockchainApi.mintNFT(name, description, content_hash, properties)
		return realBlockchainApi.mintNFT(name, description, content_hash, properties)
	},

	async getNFTs() {
		if (env.api.useMock) return mockBlockchainApi.getNFTs()
		return realBlockchainApi.getNFTs()
	},

	async getNFT(id: string) {
		if (env.api.useMock) return mockBlockchainApi.getNFT(id)
		return realBlockchainApi.getNFT(id)
	},

	async getFiles() {
		if (env.api.useMock) return mockBlockchainApi.getFiles()
		return realBlockchainApi.getFiles()
	},

	async pinFile(hash: string) {
		if (env.api.useMock) return mockBlockchainApi.pinFile(hash)
		return realBlockchainApi.pinFile(hash)
	},

	async unpinFile(hash: string) {
		if (env.api.useMock) return mockBlockchainApi.unpinFile(hash)
		return realBlockchainApi.unpinFile(hash)
	},
}

export type { BlockchainApi }
