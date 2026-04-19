import { getWagmiConnectorV2 } from '@binance/w3w-wagmi-connector-v2'
import { porto } from 'porto/wagmi'
import { brand } from '@l.x/config'
import { LUX_LOGO } from '@l.x/ui/src/assets'
import { LX_WEB_URL } from '@l.x/lx/src/constants/urls'
import { CONNECTION_PROVIDER_IDS } from '@l.x/lx/src/constants/web3'
import type { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
import { ORDERED_EVM_CHAINS } from '@l.x/lx/src/features/chains/chainInfo'
import { isTestnetChain } from '@l.x/lx/src/features/chains/utils'
import { createObservableTransport } from '@l.x/lx/src/features/providers/observability/createObservableTransport'
import { getRpcObserver } from '@l.x/lx/src/features/providers/observability/rpcObserver'
import { isPlaywrightEnv, isTestEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'
import { getNonEmptyArrayOrThrow } from '@l.x/utils/src/primitives/array'
import type { Chain } from 'viem'
import { createClient } from 'viem'
import type { Config } from 'wagmi'
import { createConfig, fallback, http } from 'wagmi'
import { coinbaseWallet, injected, safe, walletConnect } from 'wagmi/connectors'
import { PLAYWRIGHT_CONNECT_ADDRESS } from '~/components/Web3Provider/constants'
import { createRejectableMockConnector } from '~/components/Web3Provider/rejectableConnector'
import { WC_PARAMS } from '~/components/Web3Provider/walletConnect'
import { embeddedWallet } from '~/connection/EmbeddedWalletConnector'

// Get the appropriate Binance connector based on the environment
const getBinanceConnector = () => {
  const isBinanceDetected =
    typeof window !== 'undefined' && (window.BinanceChain || (window.binancew3w && window.binancew3w.ethereum))
  const isTrustWalletExtensionInstalled = typeof window !== 'undefined' && window.BinanceChain?.isTrustWallet
  const isBinanceExtensionInstalled = isBinanceDetected && !isTrustWalletExtensionInstalled

  if (isBinanceExtensionInstalled) {
    return injected({
      target: {
        id: CONNECTION_PROVIDER_IDS.BINANCE_WALLET_CONNECTOR_ID,
        name: 'Binance Wallet',
        // @ts-expect-error - window.BinanceChain and window.binancew3w.ethereum are typed to the best of our ability
        provider: () => window.BinanceChain || window.binancew3w?.ethereum,
      },
    })
  }

  const BinanceConnector = getWagmiConnectorV2()
  return BinanceConnector({ showQrCodeModal: true })
}

export const orderedTransportUrls = (chain: ReturnType<typeof getChainInfo>): string[] => {
  const orderedRpcUrls = [
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ...(chain.rpcUrls.interface?.http ?? []),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ...(chain.rpcUrls.default?.http ?? []),
    ...(chain.rpcUrls.public?.http ?? []),
    ...(chain.rpcUrls.fallback?.http ?? []),
  ]
  return Array.from(new Set(orderedRpcUrls.filter(Boolean)))
}

function createWagmiConnectors(params: { includeMockConnector: boolean }): any[] {
  const { includeMockConnector } = params
  const baseConnectors = [
    porto(),
    getBinanceConnector(),
    ...(isTestEnv() && !isPlaywrightEnv() ? [] : [walletConnect(WC_PARAMS)]),
    embeddedWallet(),
    coinbaseWallet({
      appName: brand.shortName || 'Exchange',
      appLogoUrl: `${LX_WEB_URL}${LUX_LOGO}`,
      reloadOnDisconnect: false,
    }),
    safe(),
  ]
  return includeMockConnector
    ? [...baseConnectors, createRejectableMockConnector({ features: {}, accounts: [PLAYWRIGHT_CONNECT_ADDRESS] })]
    : baseConnectors
}

/**
 * Returns EVM chains ordered with the given default chain first.
 * wagmi uses chains[0] as the default for unconnected state.
 */
function getOrderedChainsWithDefault(defaultChainId?: number) {
  if (!defaultChainId) return ORDERED_EVM_CHAINS
  const idx = ORDERED_EVM_CHAINS.findIndex((c) => c.id === defaultChainId)
  if (idx <= 0) return ORDERED_EVM_CHAINS
  return [ORDERED_EVM_CHAINS[idx], ...ORDERED_EVM_CHAINS.slice(0, idx), ...ORDERED_EVM_CHAINS.slice(idx + 1)]
}

// eslint-disable-next-line max-params
const defaultOnFetchResponse = (response: Response, chain: Chain, url: string) => {
  if (response.status !== 200) {
    const message = `RPC provider returned non-200 status: ${response.status}`
    if (isTestnetChain(chain.id)) {
      logger.warn('wagmiConfig.ts', 'client', message, { extra: { chainId: chain.id, url } })
    } else {
      logger.error(new Error(message), {
        extra: { chainId: chain.id, url },
        tags: { file: 'wagmiConfig.ts', function: 'client' },
      })
    }
  }
}

function createWagmiConfigInternal(params: {
  connectors: any[]
  defaultChainId?: number
  onFetchResponse?: (response: Response, chain: Chain, url: string) => void
}): Config<typeof ORDERED_EVM_CHAINS> {
  const { connectors, defaultChainId, onFetchResponse = defaultOnFetchResponse } = params
  const orderedChains = getOrderedChainsWithDefault(defaultChainId)

  return createConfig({
    chains: getNonEmptyArrayOrThrow(orderedChains),
    connectors,
    client({ chain }) {
      return createClient({
        chain,
        batch: { multicall: true },
        pollingInterval: 12_000,
        transport: fallback(
          orderedTransportUrls(chain).map((url) =>
            createObservableTransport({
              baseTransportFactory: http(url, {
                onFetchResponse: (response) => onFetchResponse(response, chain, url),
              }),
              observer: getRpcObserver(),
              meta: { chainId: chain.id, url },
            }),
          ),
        ),
      })
    },
  })
}

const defaultConnectors = createWagmiConnectors({ includeMockConnector: isPlaywrightEnv() })

// ─── Late-initialized singleton ──────────────────────────────────────
// wagmiConfig is NOT created at module load time. It's initialized by
// initWagmiConfig() after loadBrandConfig() resolves, ensuring the
// brand's defaultChainId is used as wagmi's chains[0].
//
// Other modules import { wagmiConfig } and use it inside hooks/functions
// (never at module top level), so by the time they access it, it's set.
let _wagmiConfig: Config<typeof ORDERED_EVM_CHAINS> | null = null

/**
 * Initialize the wagmi config with the brand's default chain.
 * Must be called once after loadBrandConfig() and before React renders.
 * If a fallback config was created by early access, this replaces it and
 * clears any stale state from localStorage.
 */
export function initWagmiConfig(defaultChainId?: number): Config<typeof ORDERED_EVM_CHAINS> {
  // If a fallback config already exists, clear its stale localStorage state
  // so the new config initializes fresh with the correct default chain.
  if (_wagmiConfig) {
    try { localStorage.removeItem('wagmi.store') } catch { /* SSR-safe */ }
  }
  _wagmiConfig = createWagmiConfigInternal({ connectors: defaultConnectors, defaultChainId })
  return _wagmiConfig
}

/**
 * The wagmi config singleton. If accessed before initWagmiConfig(), creates a
 * temporary config with default chain ordering. initWagmiConfig() replaces it
 * with the brand-aware config before React renders.
 */
function ensureConfig(): Config<typeof ORDERED_EVM_CHAINS> {
  if (!_wagmiConfig) {
    // Fallback: create config with default ordering. This handles edge cases
    // where module-level code or side effects access wagmiConfig before brand loads.
    _wagmiConfig = createWagmiConfigInternal({ connectors: defaultConnectors })
  }
  return _wagmiConfig
}

export const wagmiConfig: Config<typeof ORDERED_EVM_CHAINS> = new Proxy({} as any, {
  get(_target, prop, receiver) {
    return Reflect.get(ensureConfig(), prop, receiver)
  },
  has(_target, prop) {
    return Reflect.has(ensureConfig(), prop)
  },
  ownKeys() {
    return Reflect.ownKeys(ensureConfig())
  },
  getOwnPropertyDescriptor(_target, prop) {
    return Reflect.getOwnPropertyDescriptor(ensureConfig(), prop)
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
