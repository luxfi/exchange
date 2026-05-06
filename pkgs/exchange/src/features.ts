/**
 * Feature flags — declarative tenant capabilities consumed by Exchange.
 *
 * Tenants pass `features={...}` to <Exchange />. Every conditional render in
 * the Exchange UI binds to a named feature, never a tenant identity. New
 * features are added here; tenants opt in.
 *
 * Default: all flags `false`. Tenants enable the surface they want to ship.
 */

export interface Features {
  // ─── Trading surfaces ─────────────────────────────────────────────
  /** Spot swap (V2/V3/V4). */
  swap: boolean
  /** Limit orders. */
  limit: boolean
  /** AMM pool LP-token mint/burn. */
  pool: boolean
  /** Cross-chain bridge (Teleport / Warp / Z-Chain). */
  bridge: boolean
  /** Send / receive (basic transfer). */
  send: boolean
  /** Buy via fiat on-ramp. */
  buy: boolean
  /** Activity / transaction history view. */
  activity: boolean
  /** Portfolio dashboard. */
  portfolio: boolean
  /** Explore / discover landing. */
  explore: boolean
  /** NFT surface. */
  nft: boolean

  // ─── Asset classes (which categories the tenant lists) ────────────
  /** Public listed stocks (regulated). */
  publicSecurities: boolean
  /** Private company secondary trading (regulated, Reg D / Reg CF). */
  privateSecurities: boolean
  /** Real estate offerings (regulated). */
  realEstate: boolean
  /** Venture capital fund tokens (regulated). */
  ventureCapital: boolean
  /** Growth equity fund tokens (regulated). */
  growthEquity: boolean
  /** Music royalty securities (regulated). */
  musicRoyalties: boolean
  /** Fractional thoroughbred horses (regulated). */
  fractionalHorses: boolean
  /** Government / corporate bonds (regulated). */
  bonds: boolean
  /** Commodities (mixed regulation). */
  commodities: boolean
  /** Forex pairs. */
  forex: boolean
  /** Crypto native tokens. */
  crypto: boolean
  /** Stablecoins. */
  stablecoins: boolean

  // ─── Regulatory flows ─────────────────────────────────────────────
  /** Reg CF flow enabled (non-accredited up to $5M). */
  regCfTrading: boolean
  /** Reg D 506(b) flow enabled (private placement, no general solicitation). */
  regD506bTrading: boolean
  /** Reg D 506(c) flow enabled (accredited only, general solicitation). */
  regD506cTrading: boolean
  /** Reg S flow enabled (non-US persons). */
  regSTrading: boolean
  /** Reg A+ flow enabled (Tier 1/Tier 2 mini-IPO). */
  regAPlusTrading: boolean
  /** Bilateral private secondary matching (counter-offer / RoFR / share-transfer flow). */
  bilateralPrivateMatching: boolean
  /** Primary issuance (subscription/allocation flows). */
  primaryIssuance: boolean
  /** DvP (Delivery vs Payment) atomic settlement. */
  dvpRequest: boolean
  /** Pre-IPO share verification flow (data room, NDA, RoFR). */
  preIpoVerification: boolean

  // ─── KYC / verification ────────────────────────────────────────────
  /** Accredited investor verification gate before regulated trades. */
  accreditedInvestorGate: boolean
  /** Short KYC verification window messaging (e.g. "24 hours" vs "2 business days"). */
  shortKycWindow: boolean

  // ─── UI / layout customization ────────────────────────────────────
  /** Show the private-securities details panel (Valuation, RR, Funding, CEO). */
  privSecDetailsPanel: boolean
  /** Show the pro-tier marketing banner. */
  proBanner: boolean
  /** Allow admins to switch between accounts (operator-only). */
  adminAccountSwitcher: boolean

  // ─── Localization conventions ──────────────────────────────────────
  /** Date format: true = US (MM/DD), false = ISO (DD/MM). */
  dateFormatUS: boolean

  // ─── Theme ──────────────────────────────────────────────────────────
  /**
   * Theme key — used as a CSS class prefix when a tenant ships its own scoped
   * theme bundle (e.g. `themeKey: 'foo'` → `foo_VariablePieChart`). Empty
   * string = use the default theme classes.
   */
  themeKey: string
}

/** Default features — everything off; tenant opts into what they ship. */
export const DEFAULT_FEATURES: Features = {
  swap: false,
  limit: false,
  pool: false,
  bridge: false,
  send: false,
  buy: false,
  activity: false,
  portfolio: false,
  explore: false,
  nft: false,

  publicSecurities: false,
  privateSecurities: false,
  realEstate: false,
  ventureCapital: false,
  growthEquity: false,
  musicRoyalties: false,
  fractionalHorses: false,
  bonds: false,
  commodities: false,
  forex: false,
  crypto: false,
  stablecoins: false,

  regCfTrading: false,
  regD506bTrading: false,
  regD506cTrading: false,
  regSTrading: false,
  regAPlusTrading: false,
  bilateralPrivateMatching: false,
  primaryIssuance: false,
  dvpRequest: false,
  preIpoVerification: false,

  accreditedInvestorGate: false,
  shortKycWindow: false,

  privSecDetailsPanel: false,
  proBanner: false,
  adminAccountSwitcher: false,

  dateFormatUS: true,

  themeKey: '',
}
