import { PLAYWRIGHT_CONNECT_ADDRESS } from 'components/Web3Provider/constants'
import { createRejectableMockConnector } from 'components/Web3Provider/rejectableConnector'
import { wagmiConfig } from 'components/Web3Provider/wagmiConfig'
import { ORDERED_EVM_CHAINS } from 'lx/src/features/chains/chainInfo'
import { isPlaywrightEnv } from 'utilities/src/environment/env'
import { isAddress } from 'viem'
import { connect, switchChain } from 'wagmi/actions'

// Parse chainId from URL query parameters:
// - ?chainId=1337 (direct chainId)
// - ?chain=lux-dev (interfaceName lookup)
function getChainIdFromUrl(): number | undefined {
  const url = new URL(window.location.href)

  // First check direct chainId parameter
  const chainIdParam = url.searchParams.get('chainId')
  if (chainIdParam) {
    const parsed = parseInt(chainIdParam, 10)
    if (!isNaN(parsed)) {
      return parsed
    }
  }

  // Then check chain parameter (interfaceName) - used by e2e tests
  const chainParam = url.searchParams.get('chain')
  if (chainParam) {
    const chainInfo = ORDERED_EVM_CHAINS.find((c) => c.interfaceName === chainParam)
    if (chainInfo) {
      return chainInfo.id
    }
  }

  return undefined
}

export function setupWagmiAutoConnect() {
  const isEagerlyConnect = !window.location.search.includes('eagerlyConnect=false')
  const eagerlyConnectAddress = window.location.search.includes('eagerlyConnectAddress=')
    ? window.location.search.split('eagerlyConnectAddress=')[1]
    : undefined

  // Automatically connect if running under Playwright (used by E2E tests)
  if (isPlaywrightEnv() && isEagerlyConnect) {
    // setTimeout avoids immediate disconnection caused by race condition in wagmi mock connector
    setTimeout(async () => {
      const chainId = getChainIdFromUrl()
      await connect(wagmiConfig, {
        connector: createRejectableMockConnector({
          features: {},
          accounts: [
            eagerlyConnectAddress && isAddress(eagerlyConnectAddress)
              ? eagerlyConnectAddress
              : PLAYWRIGHT_CONNECT_ADDRESS,
          ],
        }),
        // Connect to specific chain if passed via URL (e.g., for luxd dev mode)
        ...(chainId ? { chainId } : {}),
      })
      // Explicitly switch chain after connecting - mock connector doesn't auto-switch
      // This is needed because wagmi defaults to the first chain in ORDERED_CHAINS
      if (chainId) {
        try {
          await switchChain(wagmiConfig, { chainId })
        } catch (e) {
          // Ignore switch errors - chain might already be selected
          console.debug('[wagmiAutoConnect] Chain switch attempted:', chainId, e)
        }
      }
    }, 1)
  }
}
