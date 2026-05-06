/**
 * Featured tokens — declarative landing-page list.
 *
 * Each featured token carries enough metadata for the Exchange UI to:
 *   1. Render the card (name, symbol, color, logo).
 *   2. Decide whether to gate via the `RegulatedProvider` (`regulated: true`).
 *   3. Route the trade to the right backend (DEX vs ATS via provider).
 *
 * Tenants compose their own `featured` array in main.tsx; nothing is hardcoded
 * in the Exchange component.
 *
 * Example:
 *
 *   featured={[
 *     // Public stocks — Liquidity-gated KYC redirect
 *     { chainId: 8675309, address: '0x...', symbol: 'AAPL', name: 'Apple',
 *       class: AssetClass.STOCK, offering: 'public', regulated: true,
 *       color: '#000000' },
 *
 *     // Private secondary — VCC-VCF, Reg CF
 *     { chainId: 8675309, address: '0x...', symbol: 'VCC-VCF',
 *       name: 'Venture Cross Capital Fund', class: AssetClass.VENTURE_CAPITAL,
 *       offering: 'reg_cf', regulated: true, color: '#1f78ff' },
 *
 *     // Native crypto — no gate
 *     { chainId: 96369, address: 'native', symbol: 'LUX', name: 'LUX',
 *       class: AssetClass.CRYPTO, offering: 'unregulated', color: '#000000' },
 *   ]}
 */

import type { Address } from 'viem'
import type { AssetClassId, Offering } from './asset-class'

export interface FeaturedToken {
  chainId: number
  /** ERC-20 address, or `'native'` for the chain's native token. */
  address: Address | 'native'
  symbol: string
  name: string
  /** Asset class — used for filtering, search, badge rendering. */
  class: AssetClassId
  /** Regulatory framework — used to decide KYC/AML redirect path. */
  offering: Offering
  /** Whether trading requires the configured `RegulatedProvider`. */
  regulated?: boolean
  /** Brand color for card accent. */
  color?: string
  /** Logo URL override (defaults to `tokenLogo({chainId, address})`). */
  logoUrl?: string
  /** Display priority. Higher = earlier in featured list. */
  priority?: number
}
