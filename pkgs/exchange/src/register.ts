// One register() API. Orthogonal payloads. Composable.
//
// Every extension point the Exchange shell exposes — features, chains,
// featured tokens, regulated-provider gating, IAM auth, i18n overrides,
// routes, widgets — flows through this single function.
//
// The payload shape selects the extension point; each is idempotent
// (same key replaces) and can be called any time before mount (or after,
// for hot registration).

import type { ComponentType } from 'react'
import type { Chain } from 'viem'

// ─── Feature flags ──────────────────────────────────────────────────

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
}

// ─── Token references ──────────────────────────────────────────────

/** A token reference the SDK can resolve from the installed chain. */
export interface TokenRef {
  chainId: number
  address: `0x${string}` | 'native'
  /** Optional override symbol/logo for landing-page featured slots. */
  symbol?: string
  logoUrl?: string
}

// ─── Securities (regulated-provider) ──────────────────────────────

/** Adapter that gates regulated assets behind KYC/accredited checks. */
export interface ProviderConfig {
  name: string
  adapter: `0x${string}`
  router: `0x${string}`
  onboardingUrl: string
  /** Optional list of regulated asset addresses this provider covers. */
  regulatedAssets?: `0x${string}`[]
}

// ─── Auth (IAM / OIDC) ────────────────────────────────────────────

/** Identity provider for user login. IAM-based OIDC by default. */
export interface AuthConfig {
  /** 'iam' = Hanzo IAM (hanzo.id / id.<brand-domain>), 'none' = wallet-only. */
  provider: 'iam' | 'none'
  issuer?: string
  clientId?: string
  redirectUri?: string
  /** Optional host for user-facing flows (KYC, account, onboarding). */
  idHost?: string
  scopes?: string[]
}

// ─── i18n overrides ────────────────────────────────────────────────

/** Locale → { translation-key → override } — merged onto base translations. */
export type I18nOverrides = Record<string, Record<string, string>>

// ─── Routes ────────────────────────────────────────────────────────

export interface RouteDef {
  path: string
  component: ComponentType<Record<string, unknown>>
  /** Hide from nav — useful for standalone screens (e.g. /stake/confirm). */
  hidden?: boolean
  /** Require wallet connection. */
  requireAuth?: boolean
}

// ─── Widgets ───────────────────────────────────────────────────────

/**
 * Mount points the shell exposes. Each slot accepts a single component;
 * register more than once to push. Payload shapes are slot-specific.
 */
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

// ─── One entrypoint ────────────────────────────────────────────────

/**
 * Discriminated union — the payload key selects the extension point.
 *
 * @example
 *   Exchange.register({ features: { bridge: false, nft: false } })
 *   Exchange.register({ chains:   [zooMainnet, zooTestnet] })
 *   Exchange.register({ defaultChain: zooMainnet })
 *   Exchange.register({ featured: [ZOO, LBTC, LETH] })
 *   Exchange.register({ provider: { adapter, router, onboardingUrl, name: 'Alpaca' } })
 *   Exchange.register({ auth:     { provider: 'iam', clientId: 'app-zoo-exchange' } })
 *   Exchange.register({ i18n:     { 'en-US': { 'swap.title': 'Trade on Zoo' } } })
 *   Exchange.register({ route:    { path: '/stake', component: ZooStakePage } })
 *   Exchange.register({ widget:   { slot: 'landing.hero', component: ZooHero } })
 */
export type RegisterPayload =
  | { features: Features }
  | { chains: Chain[] }
  | { defaultChain: Chain }
  | { featured: TokenRef[] }
  | { provider: ProviderConfig }
  | { auth: AuthConfig }
  | { i18n: I18nOverrides }
  | { route: RouteDef }
  | { widget: WidgetDef }

export type RegisterFn = (payload: RegisterPayload) => void
