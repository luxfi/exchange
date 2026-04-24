// One component. One config object. Zero imperative API.
//
//   import Exchange from '@luxfi/exchange'
//   import brand from '@zooai/brand'          // brand package IS the config
//
//   <Exchange {...brand} />
//
// Override any field locally:
//
//   <Exchange {...brand} features={{ nft: false }} routes={[...myRoutes]} />
//
// Everything composable via object spread — no register() calls, no
// ordering, no global mutation. React props = React idioms.

import type { ComponentType } from 'react'
import type { Chain } from 'viem'

// ─── Features ─────────────────────────────────────────────────────
export interface Features {
  swap?:      boolean
  pool?:      boolean
  portfolio?: boolean
  bridge?:    boolean
  limit?:     boolean
  send?:      boolean
  buy?:       boolean
  explore?:   boolean
  activity?:  boolean
  nft?:       boolean
  [custom: string]: boolean | undefined
}

// ─── Tokens + Markets ─────────────────────────────────────────────
export interface TokenRef {
  chainId:   number
  address:   `0x${string}` | 'native'
  symbol?:   string
  name?:     string
  decimals?: number
  logoUrl?:  string
  color?:    string
  regulated?: boolean
}

export interface TokenList {
  chainId: number
  name:    string
  tokens:  TokenRef[]
}

export interface Market {
  chainId:   number
  tokenA:    `0x${string}` | 'native'
  tokenB:    `0x${string}` | 'native'
  fee?:      number
  address?:  `0x${string}`
  featured?: boolean
}

// ─── Chain (extends viem Chain with optional per-chain overrides) ──
export interface ChainConfig extends Chain {
  dex?:        DexSpec
  gatewayUrl?: string
  provider?:   ProviderConfig
}

// ─── DEX backend ───────────────────────────────────────────────────
export type DexSpec =
  | { kind: 'precompile' }
  | { kind: 'v3'; factory: `0x${string}`; router: `0x${string}`; quoter: `0x${string}` }
  | { kind: 'gateway'; url: string }
  | { kind: 'hybrid'; amm: DexSpec; clob: DexSpec }
  | DexAdapter

export interface DexAdapter {
  name:      string
  quote     (chainId: number, tokenIn: TokenRef, tokenOut: TokenRef, amount: bigint, exactIn: boolean): Promise<Quote>
  swap      (intent: SwapIntent): Promise<{ to: `0x${string}`; data: `0x${string}`; value?: bigint }>
  pools     (chainId: number): Promise<Market[]>
  positions (chainId: number, owner: `0x${string}`): Promise<Position[]>
  prices    (chainId: number, tokens: (`0x${string}` | 'native')[]): Promise<Record<string, number>>
  tokens    (chainId: number): Promise<TokenRef[]>
  health    (): Promise<boolean>
}

export interface Quote {
  tokenIn:        TokenRef
  tokenOut:       TokenRef
  amountIn:       bigint
  amountOut:      bigint
  priceImpactBps: number
  route:          Market[]
}

export interface SwapIntent {
  chainId:      number
  tokenIn:      TokenRef
  tokenOut:     TokenRef
  amountIn:     bigint
  amountOutMin: bigint
  recipient:    `0x${string}`
  slippageBps:  number
  deadline:     number
  value?:       bigint
}

export interface Position {
  chainId:    number
  market:     Market
  liquidity:  bigint
  tickLower?: number
  tickUpper?: number
  fees0:      bigint
  fees1:      bigint
}

// ─── Regulated provider ────────────────────────────────────────────
export interface ProviderConfig {
  name:               string
  adapter:            `0x${string}`
  router:             `0x${string}`
  onboardingUrl:      string
  regulatedAssets?:   `0x${string}`[]
}

// ─── Auth ──────────────────────────────────────────────────────────
export interface AuthConfig {
  provider:      'iam' | 'none'
  issuer?:       string
  clientId?:     string
  redirectUri?:  string
  idHost?:       string
  scopes?:       string[]
}

// ─── Brand (visual identity) ──────────────────────────────────────
export interface Brand {
  name:            string
  title:           string
  description?:    string
  shortName?:      string
  logoUrl:         string
  faviconUrl:      string
  primaryColor?:   string
  theme?: {
    light?: Record<string, string>
    dark?:  Record<string, string>
  }
  [meta: string]:  unknown
}

// ─── Routes + Widgets ─────────────────────────────────────────────
export interface RouteDef {
  path:         string
  component:    ComponentType<Record<string, unknown>>
  hidden?:      boolean
  requireAuth?: boolean
}

export type WidgetSlot =
  | 'landing.hero' | 'landing.below-hero' | 'landing.features' | 'landing.footer-cta'
  | 'nav.left'     | 'nav.right'          | 'nav.footer'
  | 'swap.above'   | 'swap.below'         | 'swap.footer'
  | 'pool.header'  | 'pool.cta'
  | 'portfolio.hero' | 'portfolio.aside'  | 'portfolio.footer'
  | 'activity.item-extra'
  | 'settings.section'
  | 'footer.left'  | 'footer.right'

export interface WidgetDef {
  slot:      WidgetSlot
  component: ComponentType<Record<string, unknown>>
}

// ─── THE ENTIRE CONFIG ────────────────────────────────────────────
//
// `@zooai/brand` / `@luxfi/brand` / `@liquidityio/brand` ship a JSON
// with these fields. Import + spread:
//
//   <Exchange {...brand} />
//
// Override any slice locally:
//
//   <Exchange {...brand} features={{ nft: false }} routes={[...]} />

export interface ExchangeConfig extends Brand {
  // Topology
  chains?:        ChainConfig[]
  defaultChain?:  ChainConfig
  dex?:           DexSpec

  // Catalog
  tokens?:        TokenRef[]
  tokenLists?:    TokenList[]
  featured?:      TokenRef[]
  markets?:       Market[]

  // Access control
  provider?:      ProviderConfig
  auth?:          AuthConfig

  // Product
  features?:      Features
  i18n?:          Record<string, Record<string, string>>

  // Composition
  routes?:        RouteDef[]
  widgets?:       WidgetDef[]
}

/**
 * The Exchange — one component, one config.
 *
 * Runtime `/config.json` (K8s ConfigMap) overrides via deep-merge on
 * top of props. Brand → build-time override → runtime override.
 */
export type Exchange = ComponentType<ExchangeConfig>
