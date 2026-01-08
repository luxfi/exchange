import type { Page } from 'playwright'
import { type EIP1193RequestFn, UserRejectedRequestError, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mock } from 'wagmi/connectors'

// The standard Anvil/Hardhat test private key
const TEST_WALLET_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

/**
 * A mock connector that can be programmatically told to reject transactions.
 * Set window.__WAGMI_REJECT_TRANSACTION__ = true to reject the next transaction.
 *
 * This connector also correctly handles chain switching by using the current chain's
 * RPC URL for transactions, unlike the default wagmi mock connector which always
 * uses the first chain in ORDERED_CHAINS.
 */
export function createRejectableMockConnector(config: Parameters<typeof mock>[0]) {
  return (createConnectorParams: Parameters<ReturnType<typeof mock>>[0]) => {
    const mockConnectorFactory = mock(config)
    const baseConnector = mockConnectorFactory(createConnectorParams)

    // Track the current chain ID - updated by switchChain
    let currentChainId: number | undefined

    return {
      ...baseConnector,
      async switchChain({ chainId }: { chainId: number }) {
        // Update our tracked chain ID
        currentChainId = chainId
        // Call the base implementation if available
        if (baseConnector.switchChain) {
          const result = await baseConnector.switchChain({ chainId })
          return result
        }
        // Fallback: find the chain from the chains list
        const chain = createConnectorParams.chains.find((c) => c.id === chainId)
        if (!chain) {
          throw new Error(`Chain ${chainId} not found in configured chains`)
        }
        return chain
      },
      async getChainId() {
        // Return the current chain ID if set, otherwise use base implementation
        if (currentChainId !== undefined) {
          return currentChainId
        }
        return baseConnector.getChainId()
      },
      async getProvider() {
        const provider = await baseConnector.getProvider()
        const originalRequest = provider.request.bind(provider)

        // Get the correct chain based on current state
        const getCurrentChain = () => {
          const chainId = currentChainId ?? createConnectorParams.chains[0]?.id
          return createConnectorParams.chains.find((c) => c.id === chainId) ?? createConnectorParams.chains[0]
        }

        const interceptor: EIP1193RequestFn = async (args) => {
          if (shouldRejectTransaction(args.method)) {
            throw new UserRejectedRequestError(new Error('User rejected the transaction'))
          }

          // For transaction methods, use the correct chain's RPC
          if (args.method === 'eth_sendTransaction') {
            const chain = getCurrentChain()
            if (chain) {
              // Get the RPC URL for the current chain
              const rpcUrl = chain.rpcUrls?.default?.http?.[0]
              if (rpcUrl) {
                // Create a wallet client with the correct chain
                const account = privateKeyToAccount(TEST_WALLET_PRIVATE_KEY)
                const walletClient = createWalletClient({
                  account,
                  chain,
                  transport: http(rpcUrl),
                })

                // Get the transaction params
                const [txParams] = args.params as [
                  {
                    from?: string
                    to?: string
                    data?: string
                    value?: string
                    gas?: string
                    gasPrice?: string
                    maxFeePerGas?: string
                    maxPriorityFeePerGas?: string
                  },
                ]

                // Build transaction parameters - use EIP-1559 OR legacy gas pricing, not both
                const isEip1559 = txParams.maxFeePerGas || txParams.maxPriorityFeePerGas
                const txOptions = {
                  to: txParams.to as `0x${string}`,
                  data: txParams.data as `0x${string}`,
                  value: txParams.value ? BigInt(txParams.value) : undefined,
                  gas: txParams.gas ? BigInt(txParams.gas) : undefined,
                  ...(isEip1559
                    ? {
                        maxFeePerGas: txParams.maxFeePerGas ? BigInt(txParams.maxFeePerGas) : undefined,
                        maxPriorityFeePerGas: txParams.maxPriorityFeePerGas
                          ? BigInt(txParams.maxPriorityFeePerGas)
                          : undefined,
                      }
                    : {
                        gasPrice: txParams.gasPrice ? BigInt(txParams.gasPrice) : undefined,
                      }),
                }

                // Send the transaction using the wallet client
                const hash = await walletClient.sendTransaction(txOptions as any)

                return hash as any
              }
            }
          }

          return originalRequest(args as any)
        }
        provider.request = interceptor

        return provider
      },
    }
  }
}

export async function rejectNextTransaction(page: Page) {
  await page.evaluate(() => {
    ;(window as any).__WAGMI_REJECT_TRANSACTION__ = true
  })
}

/**
 * Checks if the transaction should be rejected based on method and window flag
 */
function shouldRejectTransaction(method: string): boolean {
  const isTransactionMethod = method === 'eth_sendTransaction' || method === 'eth_sendRawTransaction'
  const hasRejectionFlag = (window as any).__WAGMI_REJECT_TRANSACTION__
  if (isTransactionMethod && hasRejectionFlag) {
    // Clear flag after first rejection
    delete (window as any).__WAGMI_REJECT_TRANSACTION__
    return true
  }
  return false
}
