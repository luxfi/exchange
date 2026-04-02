/**
 * Custom Network Service
 * Handles adding, removing, and validating custom EVM networks
 * Implements wallet_addEthereumChain RPC method support
 */

import {
  AddEthereumChainParameter,
  CustomNetwork,
  isBuiltInChain,
  isValidChainId,
  normalizeChainId,
} from './types'

const STORAGE_KEY = 'lux_custom_networks'

class CustomNetworkService {
  private networks: Map<string, CustomNetwork> = new Map()
  private initialized = false

  async init(): Promise<void> {
    if (this.initialized) return

    try {
      const stored = await chrome.storage.local.get(STORAGE_KEY)
      if (stored[STORAGE_KEY]) {
        const networks = JSON.parse(stored[STORAGE_KEY]) as Record<string, CustomNetwork>
        Object.entries(networks).forEach(([chainId, network]) => {
          this.networks.set(chainId, network)
        })
      }
      this.initialized = true
    } catch (error) {
      console.error('Failed to load custom networks:', error)
      this.initialized = true
    }
  }

  private async persist(): Promise<void> {
    const networksObj: Record<string, CustomNetwork> = {}
    this.networks.forEach((network, chainId) => {
      networksObj[chainId] = network
    })
    await chrome.storage.local.set({ [STORAGE_KEY]: JSON.stringify(networksObj) })
  }

  async addNetwork(params: AddEthereumChainParameter): Promise<CustomNetwork> {
    await this.init()

    // Validate chain ID
    if (!isValidChainId(params.chainId)) {
      throw new Error(`Invalid chain ID: ${params.chainId}`)
    }

    const normalizedChainId = normalizeChainId(params.chainId)

    // Validate RPC URLs
    if (!params.rpcUrls || params.rpcUrls.length === 0) {
      throw new Error('At least one RPC URL is required')
    }

    for (const url of params.rpcUrls) {
      try {
        new URL(url)
      } catch {
        throw new Error(`Invalid RPC URL: ${url}`)
      }
    }

    // Validate native currency
    if (!params.nativeCurrency) {
      throw new Error('Native currency is required')
    }
    if (!params.nativeCurrency.symbol || params.nativeCurrency.symbol.length > 6) {
      throw new Error('Native currency symbol must be 1-6 characters')
    }
    if (params.nativeCurrency.decimals !== 18) {
      console.warn('Non-standard decimals for native currency:', params.nativeCurrency.decimals)
    }

    // Validate block explorer URLs if provided
    if (params.blockExplorerUrls) {
      for (const url of params.blockExplorerUrls) {
        try {
          new URL(url)
        } catch {
          throw new Error(`Invalid block explorer URL: ${url}`)
        }
      }
    }

    // Verify the RPC is reachable and returns correct chain ID
    const verifiedChainId = await this.verifyRPC(params.rpcUrls[0], normalizedChainId)
    if (verifiedChainId !== normalizedChainId) {
      throw new Error(
        `Chain ID mismatch: expected ${normalizedChainId}, got ${verifiedChainId}`
      )
    }

    const network: CustomNetwork = {
      chainId: normalizedChainId,
      chainName: params.chainName,
      nativeCurrency: params.nativeCurrency,
      rpcUrls: params.rpcUrls,
      blockExplorerUrls: params.blockExplorerUrls,
      iconUrls: params.iconUrls,
      isTestnet: this.detectTestnet(params.chainName),
      addedAt: Date.now(),
    }

    this.networks.set(normalizedChainId, network)
    await this.persist()

    return network
  }

  async removeNetwork(chainId: string): Promise<boolean> {
    await this.init()

    const normalizedChainId = normalizeChainId(chainId)

    if (isBuiltInChain(normalizedChainId)) {
      throw new Error('Cannot remove built-in network')
    }

    if (!this.networks.has(normalizedChainId)) {
      return false
    }

    this.networks.delete(normalizedChainId)
    await this.persist()
    return true
  }

  async getNetwork(chainId: string): Promise<CustomNetwork | undefined> {
    await this.init()
    return this.networks.get(normalizeChainId(chainId))
  }

  async getAllNetworks(): Promise<CustomNetwork[]> {
    await this.init()
    return Array.from(this.networks.values())
  }

  async hasNetwork(chainId: string): Promise<boolean> {
    await this.init()
    return this.networks.has(normalizeChainId(chainId))
  }

  async updateNetwork(
    chainId: string,
    updates: Partial<Omit<CustomNetwork, 'chainId' | 'addedAt'>>
  ): Promise<CustomNetwork | undefined> {
    await this.init()

    const normalizedChainId = normalizeChainId(chainId)
    const existing = this.networks.get(normalizedChainId)

    if (!existing) {
      return undefined
    }

    const updated: CustomNetwork = {
      ...existing,
      ...updates,
    }

    this.networks.set(normalizedChainId, updated)
    await this.persist()

    return updated
  }

  private async verifyRPC(rpcUrl: string, expectedChainId: string): Promise<string> {
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || 'RPC error')
      }

      return normalizeChainId(data.result)
    } catch (error) {
      throw new Error(`Failed to verify RPC: ${(error as Error).message}`)
    }
  }

  private detectTestnet(chainName: string): boolean {
    const testnetKeywords = ['testnet', 'test', 'sepolia', 'goerli', 'mumbai', 'fuji', 'dev']
    const lowerName = chainName.toLowerCase()
    return testnetKeywords.some((keyword) => lowerName.includes(keyword))
  }
}

export const customNetworkService = new CustomNetworkService()
