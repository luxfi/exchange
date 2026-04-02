/**
 * Shared legal content for all Lux ecosystem apps.
 *
 * Every app (lux.exchange, zoo.exchange, pars.market, bridge.lux.network,
 * explore.lux.network, etc.) serves /terms and /privacy using this content.
 *
 * The brand name is injected from the runtime brand config.
 * The content is the same across all white-label deployments.
 */

export const LEGAL_UPDATED = '2026-03-25'

export const LEGAL_URLS = {
  terms: '/terms',
  privacy: '/privacy',
  regulatory: 'https://lps.lux.network/legal/regulatory-status',
  compliance: 'mailto:compliance@lux.exchange',
  legal: 'mailto:legal@lux.network',
  privacyEmail: 'mailto:privacy@lux.network',
  security: 'mailto:security@lux.network',
  lp3103: 'https://lps.lux.network/docs/lp-3103-us-regulatory-classification',
  lp3104: 'https://lps.lux.network/docs/lp-3104-genius-act-stablecoin-compliance',
}

/** Short disclaimer text for footers */
export const FOOTER_DISCLAIMER =
  'Experimental research software. Not legal, tax, or financial advice. Non-custodial — we never have access to your keys or funds. Use at your own risk.'

/** Regulatory notice for inline display (brand-agnostic) */
export const REGULATORY_NOTICE =
  'Native protocol tokens are classified as digital commodities under the SEC/CFTC joint interpretive release of March 17, 2026. ' +
  'Protocol staking, liquidity provision, and no-consideration airdrops are administrative activities outside the Howey test. ' +
  'This interface is experimental research software provided "as is" without warranty.'

/** Cookie/analytics notice text */
export const COOKIE_NOTICE =
  'This interface uses minimal cookies for functionality (theme, preferences) and privacy-respecting analytics. ' +
  'No tracking cookies. No behavioral profiling. No data sold to third parties.'

/** Non-custodial notice text */
export const NON_CUSTODIAL_NOTICE =
  'This protocol is fully non-custodial. We never have access to, custody of, or control over your private keys, ' +
  'seed phrases, passwords, or funds. All transactions are executed directly by you on the blockchain and are irreversible. ' +
  'Your keys, your assets, your responsibility.'

/**
 * Generate brand-specific legal URLs
 */
export function getLegalUrls(appDomain: string) {
  return {
    terms: `https://${appDomain}/terms`,
    privacy: `https://${appDomain}/privacy`,
    regulatory: LEGAL_URLS.regulatory,
  }
}
