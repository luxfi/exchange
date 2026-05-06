/**
 * Asset class extension — declarative asset categorization for LX.
 *
 * `AssetClass` is the single enum every consumer (LX and any
 * whitelabel that consumes this SDK) shares. New asset classes are added
 * here; downstream UIs render by class id, never by tenant identity.
 *
 * Regulated asset classes (REG_CF, REG_D_506B, REG_D_506C, REG_S, RULE_144A,
 * STOCK, BOND) require a `RegulatedProvider` configured at mount time. Trades
 * for those assets route through the provider's `onboardingUrl` for KYC/AML
 * before settlement, then settle through the provider's on-chain adapter
 * (ERC-3643 IRegulatedProvider).
 *
 * Unregulated classes (CRYPTO, STABLECOIN, FRACTIONAL_HORSE_RACE_POOL — the
 * latter being a chain-native fractional pool with no securities wrapper) trade
 * directly via the configured DEX (`gateway`, V4, V3, V2).
 */

/** Top-level asset categories. Extend by adding here. */
export const AssetClass = {
  /** Public listed equities (NYSE, NASDAQ, ...). Regulated. */
  STOCK: 'stock',
  /** Government / corporate bonds. Regulated. */
  BOND: 'bond',
  /** Pre-IPO private companies. Regulated (Reg D / Reg CF). */
  PRIVATE_COMPANY: 'private_company',
  /** Real estate offerings. Regulated (Reg D / Reg A+). */
  REAL_ESTATE: 'real_estate',
  /** Venture capital fund tokens. Regulated. */
  VENTURE_CAPITAL: 'venture_capital',
  /** Growth equity fund tokens. Regulated. */
  GROWTH_EQUITY: 'growth_equity',
  /** Music royalty securities. Regulated. */
  MUSIC_ROYALTY: 'music_royalty',
  /** Fractional thoroughbred horse pools. Regulated (Reg CF / Reg D 506(c)). */
  FRACTIONAL_HORSE: 'fractional_horse',
  /** Commodity futures / spot. Mixed regulation. */
  COMMODITY: 'commodity',
  /** Forex pairs. Unregulated for retail under most jurisdictions. */
  FOREX: 'forex',
  /** Native crypto (LUX, ETH, BTC, ...). Unregulated. */
  CRYPTO: 'crypto',
  /** Stablecoins. Generally unregulated; some are issuer-securitized. */
  STABLECOIN: 'stablecoin',
  /** Generic tokenized real-world asset that doesn't fit a specific class. */
  TOKENIZED_RWA: 'tokenized_rwa',
} as const

export type AssetClassId = (typeof AssetClass)[keyof typeof AssetClass]

/** Regulatory framework for a tradable security. */
export type Offering =
  | 'public'         // SEC-registered, exchange-listed
  | 'reg_cf'         // Regulation Crowdfunding
  | 'reg_d_506b'     // Reg D 506(b) — non-accredited up to 35
  | 'reg_d_506c'     // Reg D 506(c) — accredited only, general solicitation
  | 'reg_s'          // Regulation S — non-US persons only
  | 'rule_144a'      // QIB resale
  | 'reg_a_plus'     // Reg A+ — Tier 1/Tier 2
  | 'private'        // bilateral / private placement (no specific framework)
  | 'unregulated'    // crypto, etc.

/** Whether an asset class is generally regulated and requires KYC/AML. */
export const REGULATED_CLASSES: ReadonlySet<AssetClassId> = new Set<AssetClassId>([
  AssetClass.STOCK,
  AssetClass.BOND,
  AssetClass.PRIVATE_COMPANY,
  AssetClass.REAL_ESTATE,
  AssetClass.VENTURE_CAPITAL,
  AssetClass.GROWTH_EQUITY,
  AssetClass.MUSIC_ROYALTY,
  AssetClass.FRACTIONAL_HORSE,
])

export function isRegulatedClass(cls: AssetClassId): boolean {
  return REGULATED_CLASSES.has(cls)
}
