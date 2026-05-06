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
 * Multiple providers can be registered at runtime; the Exchange selects by
 * chain id from `endpoints`. Implementations: any KYC + ATS + custody stack
 * that exposes the on-chain adapter + off-chain onboarding URL.
 *
 * Example:
 *
 *   <Exchange
 *     provider={{
 *       name: 'Provider',
 *       endpoints: {
 *         [REGULATED_MAINNET]: {
 *           adapter: '0x...IRegulatedProvider',
 *           router:  '0x...ProviderRouter',
 *           onboardingUrl: 'https://id.example.com/onboarding',
 *         },
 *       },
 *     }}
 *   />
 *
 * Then a regulated featured token routes through the provider automatically:
 *
 *   featured={[
 *     { chainId: REGULATED_MAINNET, address: '0x...', symbol: 'PRIV-A',
 *       class: AssetClass.VENTURE_CAPITAL, offering: 'reg_cf' },
 *   ]}
 */

import type { Address } from 'viem'

/** Per-chain regulated-asset endpoints supplied by a RegulatedProvider. */
export interface RegulatedEndpoint {
  /** On-chain ERC-3643 IRegulatedProvider adapter (asset transfer gate). */
  adapter: Address
  /** ProviderRouter — multi-provider router on this chain. */
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
  /** Branding for the provider redirect screen (overrides default provider logo). */
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
