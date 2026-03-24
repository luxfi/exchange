/**
 * Brand configuration loaded entirely from environment variables.
 *
 * Every deployment (lux.exchange, zoo.exchange, pars.market, liquidity.io)
 * can be fully customized by setting NEXT_PUBLIC_BRAND_* env vars at build time.
 *
 * Defaults are for Lux Exchange — the canonical deployment.
 */
export const brand = {
  // Identity
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Lux Exchange',
  title: process.env.NEXT_PUBLIC_BRAND_TITLE || 'Lux Exchange',
  description: process.env.NEXT_PUBLIC_BRAND_DESCRIPTION || "Trade tokens on DeFi's leading exchange",
  url: process.env.NEXT_PUBLIC_BRAND_URL || 'https://lux.exchange',
  siteName: process.env.NEXT_PUBLIC_BRAND_SITE_NAME || 'Lux Exchange',

  // Network
  networkName: process.env.NEXT_PUBLIC_NETWORK_NAME || 'Lux Network',
  coinName: process.env.NEXT_PUBLIC_COIN_NAME || 'LUX',

  // Visual
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || '/tokens/lux.svg',
  faviconUrl: process.env.NEXT_PUBLIC_FAVICON_URL || '/favicon.ico',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#7C3AED',

  // Social
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@luxnetwork',

  // Short display name (shown in header next to logo)
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME || 'Lux',

  // Author / creator shown in metadata
  author: process.env.NEXT_PUBLIC_BRAND_AUTHOR || 'Lux Partners',

  // API endpoints
  apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://api.lux.network',
  graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '',
} as const

export type Brand = typeof brand
