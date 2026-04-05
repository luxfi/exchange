<<<<<<< HEAD
import { brand } from '@l.x/config'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { lazy, type PropsWithChildren, ReactNode, Suspense, useMemo } from 'react'
import { matchPath, Navigate, Route, Routes, useLocation } from 'react-router'
import { WRAPPED_PATH } from '@l.x/lx/src/components/banners/shared/utils'
import { CHROME_EXTENSION_UNINSTALL_URL_PATH } from '@l.x/lx/src/constants/urls'
import { WRAPPED_SOL_ADDRESS_SOLANA } from '@l.x/lx/src/features/chains/svm/defaults'
import { EXTENSION_PASSKEY_AUTH_PATH } from '@l.x/lx/src/features/passkey/constants'
import { SwapTransactionSettingsStoreContextProvider } from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/SwapTransactionSettingsStoreContextProvider'
import { SwapFormStoreContextProvider } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/SwapFormStoreContextProvider'
import i18n from '@l.x/lx/src/i18n'
=======
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { lazy, ReactNode, Suspense, useMemo } from 'react'
import { matchPath, Navigate, Route, Routes, useLocation } from 'react-router'
import { WRAPPED_PATH } from 'uniswap/src/components/banners/shared/utils'
import { CHROME_EXTENSION_UNINSTALL_URL_PATH } from 'uniswap/src/constants/urls'
import { WRAPPED_SOL_ADDRESS_SOLANA } from 'uniswap/src/features/chains/svm/defaults'
import { EXTENSION_PASSKEY_AUTH_PATH } from 'uniswap/src/features/passkey/constants'
import i18n from 'uniswap/src/i18n'
>>>>>>> upstream/main
import { getExploreDescription, getExploreTitle } from '~/pages/getExploreTitle'
import { getPortfolioDescription, getPortfolioTitle } from '~/pages/getPortfolioTitle'
import {
  getAddLiquidityPageTitle,
  getPositionPageDescription,
  getPositionPageTitle,
} from '~/pages/getPositionPageTitle'
// High-traffic pages (index and /swap) should not be lazy-loaded.
import Landing from '~/pages/Landing'
import Swap from '~/pages/Swap'
import { isBrowserRouterEnabled } from '~/utils/env'

const CreatePosition = lazy(() => import('~/pages/CreatePosition/CreatePosition'))
const AddLiquidityV3WithTokenRedirects = lazy(() => import('~/pages/AddLiquidityV3/redirects'))
const AddLiquidityV2WithTokenRedirects = lazy(() => import('~/pages/AddLiquidityV2/redirects'))
const RedirectExplore = lazy(() => import('~/pages/Explore/redirects'))
const MigrateV3 = lazy(() => import('~/pages/Migrate'))
const NotFound = lazy(() => import('~/pages/NotFound'))
const Pool = lazy(() => import('~/pages/Positions'))
const LegacyPoolRedirects = lazy(() =>
  import('~/pages/LegacyPool/redirects').then((module) => ({ default: module.LegacyPoolRedirects })),
)
const PoolFinderRedirects = lazy(() =>
  import('~/pages/LegacyPool/redirects').then((module) => ({ default: module.PoolFinderRedirects })),
)
const LegacyPositionPageRedirects = lazy(() =>
  import('~/pages/LegacyPool/redirects').then((module) => ({ default: module.LegacyPositionPageRedirects })),
)
const RemoveLiquidityV2WithTokenRedirects = lazy(() =>
  import('~/pages/LegacyPool/redirects').then((module) => ({ default: module.RemoveLiquidityV2WithTokenRedirects })),
)
const PositionPage = lazy(() => import('~/pages/Positions/PositionPage'))
const V2PositionPage = lazy(() => import('~/pages/Positions/V2PositionPage'))
const PoolDetails = lazy(() => import('~/pages/PoolDetails'))
const TokenDetails = lazy(() => import('~/pages/TokenDetails/TokenDetailsPage'))
const ExtensionPasskeyAuthPopUp = lazy(() => import('~/pages/ExtensionPasskeyAuthPopUp'))
const PasskeyManagement = lazy(() => import('~/pages/PasskeyManagement'))
const ExtensionUninstall = lazy(() => import('~/pages/ExtensionUninstall/ExtensionUninstall'))
const Portfolio = lazy(() => import('~/pages/Portfolio/Portfolio'))
const ToucanToken = lazy(() => import('~/pages/Explore/ToucanToken'))
const CreateAuction = lazy(() => import('~/pages/Liquidity/CreateAuction/CreateAuction'))
const XOAuthCallbackPage = lazy(() => import('~/pages/Liquidity/CreateAuction/XOAuthCallbackPage'))
const BetaPage = lazy(() => import('~/pages/Beta'))
const Wrapped = lazy(() => import('~/pages/Wrapped'))
<<<<<<< HEAD
const TradePage = lazy(() => import('~/pages/Trade'))
const Options = lazy(() => import('~/pages/Options'))
const Bridge = lazy(() => import('~/pages/Bridge'))
const TermsOfService = lazy(() => import('~/pages/Legal/TermsOfService'))
const PrivacyPolicyPage = lazy(() => import('~/pages/Legal/PrivacyPolicy'))

/**
 * Wrapper that provides SwapFormStoreContextProvider for routes that use
 * shared components (CurrencyInputPanel, TokenRate, etc.) which depend on
 * the swap form store context. Without this, those components throw
 * "useSwapFormStore must be used within SwapFormStoreContextProvider".
 */
function WithSwapFormStore({ children }: PropsWithChildren): JSX.Element {
  return (
    <SwapTransactionSettingsStoreContextProvider>
      <SwapFormStoreContextProvider>{children}</SwapFormStoreContextProvider>
    </SwapTransactionSettingsStoreContextProvider>
  )
}
=======
>>>>>>> upstream/main

interface RouterConfig {
  browserRouterEnabled?: boolean
  hash?: string
  isEmbeddedWalletEnabled?: boolean
  isWrappedEnabled?: boolean
  isToucanLaunchAuctionEnabled?: boolean
}

/**
 * Convenience hook which organizes the router configuration into a single object.
 */
export function useRouterConfig(): RouterConfig {
  const browserRouterEnabled = isBrowserRouterEnabled()
  const { hash } = useLocation()
  const isEmbeddedWalletEnabled = useFeatureFlag(FeatureFlags.EmbeddedWallet)
<<<<<<< HEAD
  const isWrappedEnabled = useFeatureFlag(FeatureFlags.LuxWrapped2025)
=======
  const isWrappedEnabled = useFeatureFlag(FeatureFlags.UniswapWrapped2025)
>>>>>>> upstream/main
  const isToucanLaunchAuctionEnabled = useFeatureFlag(FeatureFlags.ToucanLaunchAuction)

  return useMemo(
    () => ({
      browserRouterEnabled,
      hash,
      isEmbeddedWalletEnabled,
      isWrappedEnabled,
      isToucanLaunchAuctionEnabled,
    }),
    [browserRouterEnabled, hash, isEmbeddedWalletEnabled, isWrappedEnabled, isToucanLaunchAuctionEnabled],
  )
}

// SEO titles and descriptions sourced from https://docs.google.com/spreadsheets/d/1_6vSxGgmsx6QGEZ4mdHppv1VkuiJEro3Y_IopxUHGB4/edit#gid=0
// getTitle and getDescription are used as static metatags for SEO. Dynamic metatags should be set in the page component itself
<<<<<<< HEAD
// Lazy getters so i18n.t() runs at render time (after brand config injects defaultVariables)
const StaticTitlesAndDescriptions = {
  get LuxTitle() { return i18n.t('title.lxTradeCrypto') },
  get SwapTitle() { return i18n.t('title.buySellTradeEthereum') },
  get SwapDescription() { return i18n.t('title.swappingMadeSimple') },
  get DetailsPageBaseTitle() { return i18n.t('common.buyAndSell') },
  get TDPDescription() { return i18n.t('title.realTime') },
  get PDPDescription() { return i18n.t('title.tradeTokens') },
  get MigrateTitle() { return i18n.t('title.migratev2') },
  get MigrateTitleV3() { return i18n.t('title.migratev3') },
  get MigrateDescription() { return i18n.t('title.easilyRemove') },
  get MigrateDescriptionV4() { return i18n.t('title.easilyRemoveV4') },
  get AddLiquidityDescription() { return i18n.t('title.earnFees') },
  get PasskeyManagementTitle() { return i18n.t('title.managePasskeys') },
  get ToucanDescription() { return i18n.t('title.toucanDescription') },
=======
const StaticTitlesAndDescriptions = {
  UniswapTitle: i18n.t('title.uniswapTradeCrypto'),
  SwapTitle: i18n.t('title.buySellTradeEthereum'),
  SwapDescription: i18n.t('title.swappingMadeSimple'),
  DetailsPageBaseTitle: i18n.t('common.buyAndSell'),
  TDPDescription: i18n.t('title.realTime'),
  PDPDescription: i18n.t('title.tradeTokens'),
  MigrateTitle: i18n.t('title.migratev2'),
  MigrateTitleV3: i18n.t('title.migratev3'),
  MigrateDescription: i18n.t('title.easilyRemove'),
  MigrateDescriptionV4: i18n.t('title.easilyRemoveV4'),
  AddLiquidityDescription: i18n.t('title.earnFees'),
  PasskeyManagementTitle: i18n.t('title.managePasskeys'),
  // TODO(LP-295): Update after launch
  ToucanPlaceholderDescription: 'Placeholder description for Toucan page',
>>>>>>> upstream/main
}

export interface RouteDefinition {
  path: string
  nestedPaths: string[]
  getTitle: (path?: string) => string
  getDescription: (path?: string) => string
  enabled: (args: RouterConfig) => boolean
  getElement: (args: RouterConfig) => ReactNode
}

// Assigns the defaults to the route definition.
function createRouteDefinition(route: Partial<RouteDefinition>): RouteDefinition {
  return {
    getElement: () => null,
<<<<<<< HEAD
    getTitle: () => StaticTitlesAndDescriptions.LuxTitle,
=======
    getTitle: () => StaticTitlesAndDescriptions.UniswapTitle,
>>>>>>> upstream/main
    getDescription: () => StaticTitlesAndDescriptions.SwapDescription,
    enabled: () => true,
    path: '/',
    nestedPaths: [],
    // overwrite the defaults
    ...route,
  }
}

export const routes: RouteDefinition[] = [
  createRouteDefinition({
    path: '/',
<<<<<<< HEAD
    getTitle: () => StaticTitlesAndDescriptions.LuxTitle,
=======
    getTitle: () => StaticTitlesAndDescriptions.UniswapTitle,
>>>>>>> upstream/main
    getDescription: () => StaticTitlesAndDescriptions.SwapDescription,
    getElement: (args) => {
      return args.browserRouterEnabled && args.hash ? <Navigate to={args.hash.replace('#', '')} replace /> : <Landing />
    },
  }),
  createRouteDefinition({
    path: '/explore',
    getTitle: getExploreTitle,
    getDescription: getExploreDescription,
    nestedPaths: [':tab', ':chainName', ':tab/:chainName'],
    getElement: () => <RedirectExplore />,
  }),
  // Special case: redirect WSOL to SOL TDP, as directly trading WSOL is not supported currently.
  createRouteDefinition({
    path: `/explore/tokens/solana/${WRAPPED_SOL_ADDRESS_SOLANA}`,
    getTitle: () => i18n.t('common.buyAndSell'),
    getDescription: () => StaticTitlesAndDescriptions.TDPDescription,
    getElement: () => <Navigate to="/explore/tokens/solana/NATIVE" replace />,
  }),
  createRouteDefinition({
    path: '/explore/tokens/:chainName/:tokenAddress',
    getTitle: () => i18n.t('common.buyAndSell'),
    getDescription: () => StaticTitlesAndDescriptions.TDPDescription,
    getElement: () => (
      <Suspense fallback={null}>
        <TokenDetails />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/tokens',
    getTitle: getExploreTitle,
    getDescription: getExploreDescription,
    getElement: () => <Navigate to="/explore/tokens" replace />,
  }),
  createRouteDefinition({
    path: '/tokens/:chainName',
    getTitle: getExploreTitle,
    getDescription: getExploreDescription,
    getElement: () => <RedirectExplore />,
  }),
  createRouteDefinition({
    path: '/tokens/:chainName/:tokenAddress',
    getTitle: () => StaticTitlesAndDescriptions.DetailsPageBaseTitle,
    getDescription: () => StaticTitlesAndDescriptions.TDPDescription,
    getElement: () => <RedirectExplore />,
  }),
  createRouteDefinition({
    path: '/explore/pools/:chainName/:poolAddress',
    getTitle: () => StaticTitlesAndDescriptions.DetailsPageBaseTitle,
    getDescription: () => StaticTitlesAndDescriptions.PDPDescription,
    getElement: () => (
      <Suspense fallback={null}>
        <PoolDetails />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/explore/auctions/:chainName/:auctionAddress',
    getTitle: () => StaticTitlesAndDescriptions.DetailsPageBaseTitle,
<<<<<<< HEAD
    getDescription: () => StaticTitlesAndDescriptions.ToucanDescription,
=======
    getDescription: () => StaticTitlesAndDescriptions.ToucanPlaceholderDescription,
>>>>>>> upstream/main
    getElement: () => (
      <Suspense fallback={null}>
        <ToucanToken />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/liquidity/launch-auction',
    getTitle: () => i18n.t('toucan.createAuction.title'),
<<<<<<< HEAD
    getDescription: () => StaticTitlesAndDescriptions.ToucanDescription,
=======
    getDescription: () => StaticTitlesAndDescriptions.ToucanPlaceholderDescription,
>>>>>>> upstream/main
    enabled: (args) => args.isToucanLaunchAuctionEnabled ?? false,
    getElement: () => (
      <Suspense fallback={null}>
        <CreateAuction />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/liquidity/launch-auction/x/callback',
    getTitle: () => 'X Verification',
    getDescription: () => StaticTitlesAndDescriptions.ToucanPlaceholderDescription,
    getElement: () => (
      <Suspense fallback={null}>
        <XOAuthCallbackPage />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/vote/*',
    getTitle: () => i18n.t('title.voteOnGov'),
<<<<<<< HEAD
    getDescription: () => i18n.t('title.luxToken'),
=======
    getDescription: () => i18n.t('title.uniToken'),
>>>>>>> upstream/main
    getElement: () => {
      return (
        <Routes>
          <Route
            path="*"
            Component={() => {
<<<<<<< HEAD
              window.location.href = 'https://vote.luxfoundation.org'
              return null
            }}
=======
              window.location.href = 'https://vote.uniswapfoundation.org'
              return null
            }}
            // oxlint-disable-next-line react/self-closing-comp -- biome-parity: oxlint is stricter here
>>>>>>> upstream/main
          ></Route>
        </Routes>
      )
    },
  }),
  createRouteDefinition({
    path: '/create-proposal',
    getTitle: () => i18n.t('title.createGovernanceOn'),
    getDescription: () => i18n.t('title.createGovernanceTo'),
    getElement: () => <Navigate to="/vote/create-proposal" replace />,
  }),
  createRouteDefinition({
    path: '/buy',
<<<<<<< HEAD
    getElement: () => <WithSwapFormStore><Swap /></WithSwapFormStore>,
=======
    getElement: () => <Swap />,
>>>>>>> upstream/main
    getTitle: () => StaticTitlesAndDescriptions.SwapTitle,
  }),
  createRouteDefinition({
    path: '/sell',
<<<<<<< HEAD
    getElement: () => <WithSwapFormStore><Swap /></WithSwapFormStore>,
=======
    getElement: () => <Swap />,
>>>>>>> upstream/main
    getTitle: () => StaticTitlesAndDescriptions.SwapTitle,
  }),
  createRouteDefinition({
    path: '/send',
<<<<<<< HEAD
    getElement: () => <WithSwapFormStore><Swap /></WithSwapFormStore>,
=======
    getElement: () => <Swap />,
>>>>>>> upstream/main
    getTitle: () => i18n.t('title.sendTokens'),
  }),
  createRouteDefinition({
    path: '/limits',
    getElement: () => <Navigate to="/limit" replace />,
    getTitle: () => i18n.t('title.placeLimit'),
  }),
  createRouteDefinition({
    path: '/limit',
<<<<<<< HEAD
    getElement: () => <WithSwapFormStore><Swap /></WithSwapFormStore>,
    getTitle: () => i18n.t('title.placeLimit'),
  }),
  createRouteDefinition({
    path: '/swap',
    getElement: () => <WithSwapFormStore><Swap /></WithSwapFormStore>,
=======
    getElement: () => <Swap />,
    getTitle: () => i18n.t('title.placeLimit'),
  }),
  createRouteDefinition({
    path: '/buy',
    getElement: () => <Swap />,
    getTitle: () => StaticTitlesAndDescriptions.SwapTitle,
  }),
  createRouteDefinition({
    path: '/swap',
    getElement: () => <Swap />,
>>>>>>> upstream/main
    getTitle: () => StaticTitlesAndDescriptions.SwapTitle,
  }),
  // Refreshed pool routes
  createRouteDefinition({
    path: '/positions/create',
<<<<<<< HEAD
    getElement: () => <WithSwapFormStore><CreatePosition /></WithSwapFormStore>,
=======
    getElement: () => <CreatePosition />,
>>>>>>> upstream/main
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
    nestedPaths: [':protocolVersion'],
  }),
  createRouteDefinition({
    path: '/positions',
    getElement: () => <Pool />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/positions/v2/:chainName/:pairAddress',
    getElement: () => <V2PositionPage />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/positions/v3/:chainName/:tokenId',
    getElement: () => <PositionPage />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/positions/v4/:chainName/:tokenId',
    getElement: () => <PositionPage />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/migrate/v2/:chainName/:pairAddress',
    getElement: () => <MigrateV3 />,
    getTitle: () => StaticTitlesAndDescriptions.MigrateTitle,
    getDescription: () => StaticTitlesAndDescriptions.MigrateDescription,
  }),
  createRouteDefinition({
    path: '/migrate/v3/:chainName/:tokenId',
    getElement: () => <MigrateV3 />,
    getTitle: () => StaticTitlesAndDescriptions.MigrateTitleV3,
    getDescription: () => StaticTitlesAndDescriptions.MigrateDescriptionV4,
  }),
  // Legacy pool routes
  createRouteDefinition({
    path: '/pool',
    getElement: () => <LegacyPoolRedirects />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/pool/v2/find',
    getElement: () => <PoolFinderRedirects />,
    getTitle: getPositionPageDescription,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/pool/v2',
    getElement: () => <LegacyPositionPageRedirects />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/pool/:tokenId',
    getElement: () => <LegacyPositionPageRedirects />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/pools/v2/find',
    getElement: () => <PoolFinderRedirects />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/pools',
    getElement: () => <LegacyPoolRedirects />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/pools/:tokenId',
    getElement: () => <LegacyPositionPageRedirects />,
    getTitle: getPositionPageTitle,
    getDescription: getPositionPageDescription,
  }),
  createRouteDefinition({
    path: '/add/v2',
    nestedPaths: [':currencyIdA', ':currencyIdA/:currencyIdB'],
<<<<<<< HEAD
    getElement: () => <WithSwapFormStore><AddLiquidityV2WithTokenRedirects /></WithSwapFormStore>,
=======
    getElement: () => <AddLiquidityV2WithTokenRedirects />,
>>>>>>> upstream/main
    getTitle: getAddLiquidityPageTitle,
    getDescription: () => StaticTitlesAndDescriptions.AddLiquidityDescription,
  }),
  createRouteDefinition({
    path: '/add',
    nestedPaths: [
      ':currencyIdA',
      ':currencyIdA/:currencyIdB',
      ':currencyIdA/:currencyIdB/:feeAmount',
      ':currencyIdA/:currencyIdB/:feeAmount/:tokenId',
    ],
<<<<<<< HEAD
    getElement: () => <WithSwapFormStore><AddLiquidityV3WithTokenRedirects /></WithSwapFormStore>,
=======
    getElement: () => <AddLiquidityV3WithTokenRedirects />,
>>>>>>> upstream/main
    getTitle: getAddLiquidityPageTitle,
    getDescription: () => StaticTitlesAndDescriptions.AddLiquidityDescription,
  }),
  createRouteDefinition({
    path: '/remove/v2/:currencyIdA/:currencyIdB',
    getElement: () => <RemoveLiquidityV2WithTokenRedirects />,
    getTitle: () => i18n.t('title.removeLiquidityv2'),
    getDescription: () => i18n.t('title.removeTokensv2'),
  }),
  createRouteDefinition({
    path: '/remove/:tokenId',
    getElement: () => <LegacyPositionPageRedirects />,
    getTitle: () => i18n.t('title.removePoolLiquidity'),
    getDescription: () => i18n.t('title.removev3Liquidity'),
  }),
  createRouteDefinition({
    path: EXTENSION_PASSKEY_AUTH_PATH,
    getElement: () => <ExtensionPasskeyAuthPopUp />,
    getTitle: () => i18n.t('title.extensionPasskeyLogIn'),
  }),
  createRouteDefinition({
    path: '/manage/passkey/:walletAddress',
    getElement: () => <PasskeyManagement />,
    getTitle: () => StaticTitlesAndDescriptions.PasskeyManagementTitle,
    enabled: (args) => args.isEmbeddedWalletEnabled ?? false,
  }),
  // Portfolio Pages
  createRouteDefinition({
    path: '/portfolio',
    getElement: () => <Portfolio />,
    getTitle: getPortfolioTitle,
    getDescription: getPortfolioDescription,
    nestedPaths: [
      'tokens',
      'defi',
      'nfts',
      'activity',
      ':walletAddress',
      ':walletAddress/tokens',
      ':walletAddress/defi',
      ':walletAddress/nfts',
      ':walletAddress/activity',
    ],
  }),
<<<<<<< HEAD
  // Lux Extension Uninstall Page
=======
  // Uniswap Extension Uninstall Page
>>>>>>> upstream/main
  createRouteDefinition({
    path: CHROME_EXTENSION_UNINSTALL_URL_PATH,
    getElement: () => <ExtensionUninstall />,
    getTitle: () => i18n.t('title.extension.uninstall'),
  }),
<<<<<<< HEAD
  // Lux Wrapped
  createRouteDefinition({
    path: WRAPPED_PATH,
    getElement: () => <Wrapped />,
    getTitle: () => `${brand.shortName || 'LX'} Wrapped`,
    enabled: (args) => args.isWrappedEnabled ?? false,
  }),
  createRouteDefinition({
    path: '/options',
    getTitle: () => 'Options | Derivatives Trading',
    getDescription: () => 'Trade on-chain options, futures, and multi-leg strategies',
    getElement: () => (
      <Suspense fallback={null}>
        <Options />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/bridge',
    getTitle: () => 'Bridge | Cross-Chain Transfer',
    getDescription: () => 'Transfer tokens across chains with one click',
    getElement: () => (
      <Suspense fallback={null}>
        <Bridge />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/preview',
    getTitle: () => `${brand.shortName || 'LX'} Preview`,
=======
  // Uniswap Wrapped
  createRouteDefinition({
    path: WRAPPED_PATH,
    getElement: () => <Wrapped />,
    getTitle: () => 'Uniswap Wrapped',
    enabled: (args) => args.isWrappedEnabled ?? false,
  }),
  createRouteDefinition({
    path: '/preview',
    getTitle: () => 'Uniswap Preview',
>>>>>>> upstream/main
    getElement: () => (
      <Suspense fallback={null}>
        <BetaPage />
      </Suspense>
    ),
  }),
<<<<<<< HEAD
  createRouteDefinition({
    path: '/terms',
    getTitle: () => 'Terms of Service',
    getDescription: () => 'Terms of Service for Lux Network protocol interfaces',
    getElement: () => (
      <Suspense fallback={null}>
        <TermsOfService />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/privacy',
    getTitle: () => 'Privacy Policy',
    getDescription: () => 'Privacy Policy for Lux Network protocol interfaces',
    getElement: () => (
      <Suspense fallback={null}>
        <PrivacyPolicyPage />
      </Suspense>
    ),
  }),
  createRouteDefinition({
    path: '/advanced',
    getTitle: () => 'Advanced Trading',
    getDescription: () => 'Advanced trading terminal with charts, trades, and pools',
    getElement: () => (
      <Suspense fallback={null}>
        <TradePage />
      </Suspense>
    ),
  }),
=======
>>>>>>> upstream/main
  createRouteDefinition({ path: '*', getElement: () => <Navigate to="/not-found" replace /> }),
  createRouteDefinition({ path: '/not-found', getElement: () => <NotFound /> }),
]

export const findRouteByPath = (pathname: string) => {
  for (const route of routes) {
    const match = matchPath(route.path, pathname)
    if (match) {
      return route
    }
    const subPaths = route.nestedPaths.map((nestedPath) => `${route.path}/${nestedPath}`)
    for (const subPath of subPaths) {
      const match = matchPath(subPath, pathname)
      if (match) {
        return route
      }
    }
  }
  return undefined
}
