// One register() API. Orthogonal payloads. Composable.
//
// Every extension point the Exchange shell exposes — chains, markets,
// tokens, features, auth, i18n, DEX backend, regulated-provider gating,
// routes, widgets — flows through this single function.
//
// Payload key selects the extension point; each is idempotent (same key
// replaces) and callable any time before mount (or after, for hot reg).
//
// @luxfi/exchange keeps the 1.x version line — no 2.0.0 jump. The App +
// runtime ship as 1.1.0 when the SPA root moves into pkgs/exchange/src/
// web/App.tsx.

import type { ComponentType } from 'react'
import type { Chain } from 'viem'

// ─── Features ──────────────────────────────────────────────────────

/** Toggle top-level product surfaces on/off. */
export interface Features {
  swap?: boolean
  pool?: boolean
  portfolio?: boolean
  bridge?: boolean
  limit?: boolean
  send?: boolean
  buy?: boolean
  explore?: boolean
  activity?: boolean
  nft?: boolean
  /** Custom flags — pass through to useFeatureFlag(). */
  [custom: string]: boolean | undefined
}

// ─── Tokens ────────────────────────────────────────────────────────

/** A token reference resolvable on-chain. */
export interface TokenRef {
  chainId: number
  /** 'native' for the chain's gas token, else an ERC-20 address. */
  address: `0x${string}` | 'native'
  symbol?: string
  name?: string
  decimals?: number
  logoUrl?: string
  /** Optional brand color for landing cloud / icon chips. */
  color?: string
  /** Tag as 'regulated' to force routing through the provider gate. */
  regulated?: boolean
}

/** A curated token list — adds/extends the default list for a chain. */
export interface TokenList {
  chainId: number
  name: string
  tokens: TokenRef[]
}

// ─── Markets ──────────────────────────────────────────────────────

/** A tradable market (pair). Optional — most markets come from the DEX
 *  adapter's getPools(). Use this to pin markets to the landing page
 *  or force a pair even if the adapter doesn't report it yet. */
export interface Market {
  chainId: number
  tokenA: `0x${string}` | 'native'
  tokenB: `0x${string}` | 'native'
  /** Optional fee tier for V3-style pools (500/3000/10000). */
  fee?: number
  /** Pool / pair contract address (optional — looked up if not set). */
  address?: `0x${string}`
  /** Force display on the landing page. */
  featured?: boolean
}

// ─── Chains ────────────────────────────────────────────────────────

export interface ChainConfig extends Chain {
  /** Optional DEX backend override just for this chain. */
  dex?: DexSpec
  /** Optional gateway URL for cross-chain routing. */
  gatewayUrl?: string
  /** Regulated-provider config if this chain gates securities. */
  provider?: ProviderConfig
}

// ─── DEX backend ──────────────────────────────────────────────────

/** Five ways to resolve swaps + liquidity. Registered via { dex }. */
export type DexSpec =
  | { kind: 'precompile' }                                              // Lux DEX precompiles (LP-9010…LP-9040)
  | { kind: 'v3'; factory: `0x${string}`; router: `0x${string}`; quoter: `0x${string}` }
  | { kind: 'gateway'; url: string }                                    // lux/dex gateway
  | { kind: 'hybrid'; amm: DexSpec; clob: DexSpec }
  | DexAdapter                                                          // fully custom

/** Custom adapter interface. Implement and register — 7 methods. */
export interface DexAdapter {
  name: string
  quote(chainId: number, tokenIn: TokenRef, tokenOut: TokenRef, amount: bigint, exactIn: boolean): Promise<Quote>
  swap(intent: SwapIntent): Promise<{ to: `0x${string}`; data: `0x${string}`; value?: bigint }>
  pools(chainId: number): Promise<Market[]>
  positions(chainId: number, owner: `0x${string}`): Promise<Position[]>
  prices(chainId: number, tokens: (`0x${string}` | 'native')[]): Promise<Record<string, number>>
  tokens(chainId: number): Promise<TokenRef[]>
  health(): Promise<boolean>
}

export interface Quote {
  tokenIn: TokenRef
  tokenOut: TokenRef
  amountIn: bigint
  amountOut: bigint
  priceImpactBps: number
  route: Market[]
}

export interface SwapIntent {
  chainId: number
  tokenIn: TokenRef
  tokenOut: TokenRef
  amountIn: bigint
  amountOutMin: bigint
  recipient: `0x${string}`
  slippageBps: number
  deadline: number
  value?: bigint
}

export interface Position {
  chainId: number
  market: Market
  liquidity: bigint
  tickLower?: number
  tickUpper?: number
  fees0: bigint
  fees1: bigint
}

// ─── Regulated provider ────────────────────────────────────────

export interface ProviderConfig {
  name: string
  /** IRegulatedProvider adapter contract (KYC / accreditation / offerings). */
  adapter: `0x${string}`
  /** Lux ProviderRouter contract. */
  router: `0x${string}`
  onboardingUrl: string
  /** Assets that require the gate. All other swaps bypass. */
  regulatedAssets?: `0x${string}`[]
}

// ─── Auth (IAM / OIDC) ────────────────────────────────────────

export interface AuthConfig {
  /** 'iam' = Hanzo IAM (OIDC), 'none' = wallet-only. */
  provider: 'iam' | 'none'
  issuer?: string
  clientId?: string
  redirectUri?: string
  /** User-facing host for login / KYC / account. */
  idHost?: string
  scopes?: string[]
}

// ─── i18n overrides ─────────────────────────────────────────

/** Locale → { key → override } — merged onto base translations. */
export type I18nOverrides = Record<string, Record<string, string>>

// ─── Routes ────────────────────────────────────────────────

export interface RouteDef {
  path: string
  component: ComponentType<Record<string, unknown>>
  /** Hide from nav — useful for /xyz/confirm-style standalone screens. */
  hidden?: boolean
  /** Require wallet connection to render. */
  requireAuth?: boolean
}

// ─── Widgets ───────────────────────────────────────────────

/** Named mount points the shell exposes. */
export type WidgetSlot =
  | 'landing.hero'
  | 'landing.below-hero'
  | 'landing.features'
  | 'landing.footer-cta'
  | 'nav.left'
  | 'nav.right'
  | 'nav.footer'
  | 'swap.above'
  | 'swap.below'
  | 'swap.footer'
  | 'pool.header'
  | 'pool.cta'
  | 'portfolio.hero'
  | 'portfolio.aside'
  | 'portfolio.footer'
  | 'activity.item-extra'
  | 'settings.section'
  | 'footer.left'
  | 'footer.right'

export interface WidgetDef {
  slot: WidgetSlot
  component: ComponentType<Record<string, unknown>>
}

// ─── One entrypoint ────────────────────────────────────────

/**
 * Discriminated union — payload key selects the extension point.
 *
 * @example
 *   Exchange.register({ features:     { bridge: false, nft: false } })
 *   Exchange.register({ chains:       [zooMainnet, zooTestnet] })
 *   Exchange.register({ defaultChain: zooMainnet })
 *   Exchange.register({ tokens:       [{ chainId, address, symbol, logoUrl }] })
 *   Exchange.register({ tokenList:    { chainId, name, tokens: [...] } })
 *   Exchange.register({ featured:     [ZOO, WZOO, AAPL] })
 *   Exchange.register({ markets:      [{ chainId, tokenA, tokenB, fee, featured: true }] })
 *   Exchange.register({ dex:          { kind: 'precompile' } })
 *   Exchange.register({ provider:     { name, adapter, router, onboardingUrl } })
 *   Exchange.register({ auth:         { provider: 'iam', clientId, issuer, idHost } })
 *   Exchange.register({ i18n:         { 'en-US': { 'swap.title': 'Trade on Zoo' } } })
 *   Exchange.register({ route:        { path: '/stake', component: ZooStake } })
 *   Exchange.register({ widget:       { slot: 'landing.hero', component: ZooHero } })
 */
export type RegisterPayload =
  | { features:     Features }
  | { chains:       ChainConfig[] }
  | { defaultChain: ChainConfig }
  | { tokens:       TokenRef[] }
  | { tokenList:    TokenList }
  | { featured:     TokenRef[] }
  | { markets:      Market[] }
  | { dex:          DexSpec }
  | { provider:     ProviderConfig }
  | { auth:         AuthConfig }
  | { i18n:         I18nOverrides }
  | { route:        RouteDef }
  | { widget:       WidgetDef }

export type RegisterFn = (payload: RegisterPayload) => void
