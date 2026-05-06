/**
 * Regulated provider — the seam where regulated-asset trades are gated.
 *
 * Every consumer of @luxfi/exchange that wants to list regulated assets
 * (stocks, bonds, private companies, real estate, ...) configures a
 * `RegulatedProvider` at mount time. When a user attempts to trade a
 * regulated asset, the Exchange UI:
 *
 *   1. Checks the user's KYC + accreditation state (cached in store).
 *   2. If unverified, redirects to `provider.endpoints[chainId].onboardingUrl`
 *      with a return-to URL so the user lands back on the trade screen.
 *   3. After verification, the trade routes through the provider's adapter
 *      contract (`adapter` address) which enforces transfer restrictions
 *      on-chain (ERC-3643 / IRegulatedProvider interface).
 *
 * Liquidity is the canonical regulated provider for the Liquidity EVM chain.
 * Other providers (Anchorage, Anchorage Digital, BitGo for institutional
 * custody, OmniSub for Alpaca-routed equity) plug in via the same interface.
 *
 * Example (zoo.exchange consumes Liquidity):
 *
 *   <Exchange
 *     provider={{
 *       name: 'Liquidity',
 *       endpoints: {
 *         [LIQUID_MAINNET]: {
 *           adapter: '0xLiquidityAdapter...',
 *           router: '0xLuxProviderRouter...',
 *           onboardingUrl: 'https://id.liquidity.io/onboarding',
 *         },
 *         [LIQUID_TESTNET]: { ... },
 *         [LIQUID_DEVNET]: { ... },
 *       },
 *     }}
 *   />
 *
 * Then a regulated featured token routes through Liquidity automatically:
 *
 *   featured={[
 *     { chainId: LIQUID_MAINNET, address: '0xVCC-VCF...', symbol: 'VCC-VCF',
 *       name: 'Venture Cross Capital Fund', class: AssetClass.VENTURE_CAPITAL,
 *       offering: 'reg_cf' },
 *   ]}
 */

import type { Address } from 'viem'

/** Per-chain regulated-asset endpoints supplied by a RegulatedProvider. */
export interface RegulatedEndpoint {
  /** On-chain ERC-3643 IRegulatedProvider adapter (asset transfer gate). */
  adapter: Address
  /** Lux ProviderRouter (multi-provider router). */
  router: Address
  /** Off-chain KYC/AML onboarding URL the UI redirects unverified users to. */
  onboardingUrl: string
  /** Optional: per-chain override for the verification status API. */
  verificationStatusUrl?: string
}

/** A regulated-asset provider config. */
export interface RegulatedProvider {
  /** Display name (used in onboarding redirect prompts: "Continue to {name}"). */
  name: string
  /** Per-chain endpoints. Trades on a chain not in this map fall back to public DEX. */
  endpoints: Record<number, RegulatedEndpoint>
  /** Branding for the provider redirect screen (overrides default "Liquidity Logo"). */
  brandLogoUrl?: string
}

/** Result of a verification status check. */
export interface VerificationStatus {
  kyc: 'unstarted' | 'pending' | 'approved' | 'rejected'
  accredited: 'unstarted' | 'pending' | 'approved' | 'rejected' | 'expired'
  /** Sanctions-screening pass/fail. */
  sanctions: 'pass' | 'fail' | 'unknown'
  /** Per-asset-class trading enabled by the provider. */
  enabledClasses: string[]
}

/** Whether a user can trade a given asset right now. */
export function canTrade(
  status: VerificationStatus,
  assetClass: string,
  offering: string,
): { ok: boolean; reason?: string } {
  if (status.sanctions === 'fail') return { ok: false, reason: 'sanctions' }
  if (status.kyc !== 'approved') return { ok: false, reason: 'kyc' }
  if (offering === 'reg_d_506c' && status.accredited !== 'approved') {
    return { ok: false, reason: 'accreditation' }
  }
  if (!status.enabledClasses.includes(assetClass)) {
    return { ok: false, reason: 'class_not_enabled' }
  }
  return { ok: true }
}
