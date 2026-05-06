/**
 * @luxfi/exchange — Core SDK for LX and any whitelabel that consumes it.
 *
 * Provides:
 * - Chain + token definitions
 * - AMM V2/V3/V4 contract interfaces + DEX precompile integration
 * - Swap/pool hooks + Zustand stores
 * - Cross-chain bridge (Teleport + Z-Chain privacy layer)
 * - Asset-class extension API (stocks, bonds, private securities, ...)
 * - Regulated-provider hook (KYC/AML redirect for regulated assets)
 * - Featured-tokens type + Features feature-flag interface
 *
 * Tenant whitelabels consume this package via npm and configure declaratively
 * by passing `<Exchange brand={...} features={...} provider={...} />`. NO
 * tenant-identity branching anywhere in the SDK.
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

// Asset-class extension API — declarative asset categorization shared by all
// consumers. NEW asset classes added in `./asset-class.ts`; downstream UIs
// render by class id, never by tenant identity.
export * from './asset-class'

// Regulated-provider hook — gate regulated-asset trades through a configured
// provider. Trades for regulated assets redirect to
// `provider.endpoints[chainId].onboardingUrl` for KYC/AML, then settle through
// the provider's on-chain adapter (ERC-3643 IRegulatedProvider).
export * from './regulated-provider'

// Featured tokens — declarative landing-page list with regulatory metadata.
export * from './featured'

// Feature flags — declarative tenant capabilities (drive every conditional
// render in the Exchange UI). Bind to named features instead of tenant
// identity.
export * from './features'
