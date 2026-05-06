/**
 * @luxfi/exchange - Core SDK for Lux Exchange + tenant whitelabels.
 *
 * Provides:
 * - Chain + token definitions
 * - AMM V2/V3 contract interfaces + DEX precompile integration
 * - Swap/liquidity hooks + Zustand stores
 * - Cross-chain bridge (Teleport + Z-Chain privacy layer)
 * - Asset-class extension API (stocks, bonds, private securities, ...)
 * - Regulated-provider hook (KYC/AML redirect to Liquidity for regulated assets)
 * - Featured-tokens type + Features feature-flag interface
 *
 * Consumers: lux.exchange, zoo.exchange, liquidity.exchange (which adds ATS
 * compliance on top), vccross.exchange, mlc.exchange — all consume this
 * package via npm and configure declaratively.
 */

// Chains
export * from './chains'

// Tokens
export * from './tokens'

// Contracts & ABIs
export * from './contracts'

// DEX types
export * from './dex'

// Hooks
export * from './hooks'

// Stores
export * from './stores'

// Bridge (cross-chain + Z-Chain privacy layer)
export * from './bridge'

// Asset class extension API — declarative asset categorization shared by all
// consumers. NEW asset classes added in `./asset-class.ts`; downstream UIs
// render by class id, never by tenant identity.
export * from './asset-class'

// Regulated-provider hook — gate regulated-asset trades through a configured
// provider (Liquidity for the Liquidity EVM chain). Trades for regulated
// assets redirect to `provider.endpoints[chainId].onboardingUrl` for KYC/AML.
export * from './regulated-provider'

// Featured tokens — declarative landing-page list with regulatory metadata.
export * from './featured'

// Feature flags — declarative tenant capabilities (drive every conditional
// render in the Exchange UI). NO `isVcCross`/`isMLC` booleans in upstream;
// bind to named features instead.
export * from './features'
