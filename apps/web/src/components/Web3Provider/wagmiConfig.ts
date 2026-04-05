import { getWagmiConnectorV2 } from '@binance/w3w-wagmi-connector-v2'
import { porto } from 'porto/wagmi'
<<<<<<< HEAD
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
=======
import { UNISWAP_LOGO } from 'ui/src/assets'
import { UNISWAP_WEB_URL } from 'uniswap/src/constants/urls'
import { CONNECTION_PROVIDER_IDS } from 'uniswap/src/constants/web3'
import type { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { ORDERED_EVM_CHAINS } from 'uniswap/src/features/chains/chainInfo'
import { isTestnetChain } from 'uniswap/src/features/chains/utils'
import { createObservableTransport } from 'uniswap/src/features/providers/observability/createObservableTransport'
import { getRpcObserver } from 'uniswap/src/features/providers/observability/rpcObserver'
import { isPlaywrightEnv, isTestEnv } from 'utilities/src/environment/env'
import { logger } from 'utilities/src/logger/logger'
import { getNonEmptyArrayOrThrow } from 'utilities/src/primitives/array'
>>>>>>> upstream/main
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
<<<<<<< HEAD
  const isBinanceDetected =
    typeof window !== 'undefined' && (window.BinanceChain || (window.binancew3w && window.binancew3w.ethereum))
  const isTrustWalletExtensionInstalled = typeof window !== 'undefined' && window.BinanceChain?.isTrustWallet
  const isBinanceExtensionInstalled = isBinanceDetected && !isTrustWalletExtensionInstalled

=======
  // Check if Binance extension is installed
  const isBinanceDetected =
    typeof window !== 'undefined' && (window.BinanceChain || (window.binancew3w && window.binancew3w.ethereum))

  // Check if TrustWallet extension is installed
  const isTrustWalletExtensionInstalled = typeof window !== 'undefined' && window.BinanceChain?.isTrustWallet

  const isBinanceExtensionInstalled = isBinanceDetected && !isTrustWalletExtensionInstalled

  // If extension is installed, use the injected connector directly
  // This avoids issues with the Binance connector's detection logic
>>>>>>> upstream/main
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

<<<<<<< HEAD
  const BinanceConnector = getWagmiConnectorV2()
  return BinanceConnector({ showQrCodeModal: true })
=======
  // Otherwise, use the Binance connector with QR modal for mobile connection
  const BinanceConnector = getWagmiConnectorV2()
  return BinanceConnector({
    showQrCodeModal: true,
  })
>>>>>>> upstream/main
}

export const orderedTransportUrls = (chain: ReturnType<typeof getChainInfo>): string[] => {
  const orderedRpcUrls = [
<<<<<<< HEAD
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ...(chain.rpcUrls.interface?.http ?? []),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
=======
    // oxlint-disable-next-line typescript/no-unnecessary-condition
    ...(chain.rpcUrls.interface?.http ?? []),
    // oxlint-disable-next-line typescript/no-unnecessary-condition
>>>>>>> upstream/main
    ...(chain.rpcUrls.default?.http ?? []),
    ...(chain.rpcUrls.public?.http ?? []),
    ...(chain.rpcUrls.fallback?.http ?? []),
  ]
<<<<<<< HEAD
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
=======

  return Array.from(new Set(orderedRpcUrls.filter(Boolean)))
}

function createWagmiConnectors(params: {
  /** If `true`, appends the wagmi `mock` connector. Used in Playwright. */
  includeMockConnector: boolean
}): any[] {
  const { includeMockConnector } = params

  const baseConnectors = [
    porto(),
    // Binance connector - uses injected for extension, QR code for mobile
    getBinanceConnector(),
    // There are no unit tests that expect WalletConnect to be included here,
    // so we can disable it to reduce log noise.
    ...(isTestEnv() && !isPlaywrightEnv() ? [] : [walletConnect(WC_PARAMS)]),
    embeddedWallet(),
    coinbaseWallet({
      appName: 'Uniswap',
      // CB SDK doesn't pass the parent origin context to their passkey site
      // Flagged to CB team and can remove UNISWAP_WEB_URL once fixed
      appLogoUrl: `${UNISWAP_WEB_URL}${UNISWAP_LOGO}`,
>>>>>>> upstream/main
      reloadOnDisconnect: false,
    }),
    safe(),
  ]
<<<<<<< HEAD
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
=======

  return includeMockConnector
    ? [
        ...baseConnectors,
        createRejectableMockConnector({
          features: {},
          accounts: [PLAYWRIGHT_CONNECT_ADDRESS],
        }),
      ]
    : baseConnectors
}

function createWagmiConfig(params: {
  /** The connector list to use. */
  connectors: any[]
  /** Optional custom `onFetchResponse` handler – defaults to `defaultOnFetchResponse`. */
  // oxlint-disable-next-line max-params -- biome-parity: oxlint is stricter here
  onFetchResponse?: (response: Response, chain: Chain, url: string) => void
}): Config<typeof ORDERED_EVM_CHAINS> {
  const { connectors, onFetchResponse = defaultOnFetchResponse } = params

  return createConfig({
    chains: getNonEmptyArrayOrThrow(ORDERED_EVM_CHAINS),
>>>>>>> upstream/main
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

<<<<<<< HEAD
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
=======
// oxlint-disable-next-line max-params
const defaultOnFetchResponse = (response: Response, chain: Chain, url: string) => {
  if (response.status !== 200) {
    const message = `RPC provider returned non-200 status: ${response.status}`

    // only warn for testnet chains
    if (isTestnetChain(chain.id)) {
      logger.warn('wagmiConfig.ts', 'client', message, {
        extra: {
          chainId: chain.id,
          url,
        },
      })
    } else {
      // log errors for mainnet chains so we can fix them
      logger.error(new Error(message), {
        extra: {
          chainId: chain.id,
          url,
        },
        tags: {
          file: 'wagmiConfig.ts',
          function: 'client',
        },
      })
    }
  }
}

const defaultConnectors = createWagmiConnectors({
  includeMockConnector: isPlaywrightEnv(),
})

export const wagmiConfig = createWagmiConfig({ connectors: defaultConnectors })

declare module 'wagmi' {
  interface Register {
    // oxlint-disable-next-line typescript/consistent-type-imports
>>>>>>> upstream/main
    config: typeof wagmiConfig
  }
}
