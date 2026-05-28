import { blockchainApi } from '@/lib/api/blockchain'
import type { DeployedContract, VmStats, Address } from '@/lib/types/blockchain'

export class LunarSDK {
  private static walletAddress: string | null = null

  /**
   * Connects the local wallet cryptographically by fetching address info from the backend.
   */
  static async connectWallet(): Promise<string> {
    try {
      const addressInfo = await blockchainApi.getWalletAddressInfo()
      if (!addressInfo || !addressInfo.address) {
        throw new Error("No wallet address returned by blockchain network.")
      }
      this.walletAddress = addressInfo.address
      return this.walletAddress
    } catch (err: any) {
      console.error("[LunarSDK] Connect wallet failed:", err)
      throw new Error(err.message || "Failed to establish secure connection to local wallet.")
    }
  }

  /**
   * Returns currently connected wallet address or null.
   */
  static getConnectedWallet(): string | null {
    return this.walletAddress
  }

  /**
   * Disconnects active wallet session.
   */
  static disconnectWallet(): void {
    this.walletAddress = null
  }

  /**
   * Deploys a new LunarVM smart contract program bytecode to the mempool.
   */
  static async deployContract(code: any[], gasLimit: number = 2000): Promise<{
    status: string
    message: string
    transaction: any
    contract_address: string
  }> {
    if (!this.walletAddress) {
      throw new Error("Local wallet must be connected before deploying contracts.")
    }
    return await blockchainApi.deployContract(code, gasLimit)
  }

  /**
   * Calls/executes an active smart contract method with stack parameters.
   */
  static async executeContract(contractAddress: string, gasLimit: number = 2000): Promise<{
    status: string
    message: string
    transaction: any
    contract_address: string
    preview?: any
  }> {
    if (!this.walletAddress) {
      throw new Error("Local wallet must be connected before executing contract methods.")
    }
    return await blockchainApi.executeContract(contractAddress, gasLimit)
  }

  /**
   * Queries and returns the active storage slots of a contract address.
   */
  static async queryContractState(contractAddress: string): Promise<Record<string, any>> {
    try {
      const detail = await blockchainApi.getContractDetail(contractAddress)
      if (!detail) {
        throw new Error(`Contract address ${contractAddress} not found on-chain.`)
      }
      return detail.state || {}
    } catch (err: any) {
      console.error("[LunarSDK] Query contract state failed:", err)
      throw err
    }
  }

  /**
   * Periodic subscription observer fetching smart contract VM logs and telemetries.
   */
  static subscribeToTelemetry(callback: (stats: VmStats) => void): () => void {
    const interval = setInterval(async () => {
      try {
        const stats = await blockchainApi.getVmStats()
        if (stats) {
          callback(stats)
        }
      } catch (err) {
        // Silent catch during connectivity offline transitions
      }
    }, 4000)

    // Unsubscribe helper
    return () => clearInterval(interval)
  }

  /**
   * Scans block ledger transaction histories.
   */
  static async fetchTransactions(page = 1, limit = 10): Promise<any> {
    return await blockchainApi.getTransactions(page, limit)
  }

  /**
   * Scans blockchain height histories.
   */
  static async fetchBlocks(page = 1, limit = 10): Promise<any> {
    return await blockchainApi.getBlocks(page, limit)
  }
}
export default LunarSDK
