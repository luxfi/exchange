#!/usr/bin/env node
/* eslint-env node */
/**
 * Static SEO page generator for the exchange SPA.
 *
 * Takes the built index.html and generates per-route HTML files with proper
 * <meta> tags baked in for each token, pool, and static route. This enables
 * Google/Twitter/Discord to index and preview every page from static hosting
 * (S3, CDN, Cloudflare Pages) without needing a server-side renderer.
 *
 * Usage:
 *   BRAND_DOMAIN=lux.exchange node scripts/generate-seo-pages.js
 *   BRAND_DOMAIN=zoo.exchange BRAND_NAME="Zoo Exchange" node scripts/generate-seo-pages.js
 *
 * Output: build/client/explore/tokens/<chain>/<addr>/index.html (etc.)
 */

const fs = require('fs')
const path = require('path')

// ── Brand config from env ────────────────────────────────────────────
const BRAND_DOMAIN = process.env.BRAND_DOMAIN || 'lux.exchange'
const BRAND_ORIGIN = `https://${BRAND_DOMAIN}`
const BRAND_NAME = process.env.BRAND_NAME || (BRAND_DOMAIN.includes('zoo') ? 'Zoo Exchange' : 'Lux Exchange')
const BRAND_SHORT = process.env.BRAND_SHORT || BRAND_NAME.replace(/\s*exchange\s*/i, '').trim().toUpperCase()
const BRAND_DESCRIPTION = process.env.BRAND_DESCRIPTION || `Multi-chain decentralized exchange. Swap crypto with zero app fees.`
const GRAPHQL_API = process.env.GRAPHQL_API || `https://gw.${BRAND_DOMAIN}/v1/graphql`
const EXPLORE_API = process.env.EXPLORE_API || `https://gw.${BRAND_DOMAIN}`

const BUILD_DIR = path.resolve(__dirname, '../build/client')
const SHELL_HTML = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8')

// ── Chains to index ──────────────────────────────────────────────────
const CHAINS = [
  'ethereum', 'arbitrum', 'optimism', 'polygon', 'base',
  'bnb', 'celo', 'avalanche', 'blast', 'zksync', 'zora',
]

// ── Static routes with SEO metadata ─────────────────────────────────
const STATIC_ROUTES = [
  { path: '/swap', title: `Swap Crypto | ${BRAND_NAME}`, description: `Buy, sell & trade Ethereum and other top tokens on ${BRAND_SHORT}. Zero app fees.` },
  { path: '/explore', title: `Explore Tokens & Pools | ${BRAND_NAME}`, description: `Explore top tokens, pools, and trading activity across multiple networks on ${BRAND_SHORT}.` },
  { path: '/explore/tokens', title: `Top Tokens | ${BRAND_NAME}`, description: `Browse and discover top tokens across all supported networks on ${BRAND_SHORT}.` },
  { path: '/explore/pools', title: `Liquidity Pools | ${BRAND_NAME}`, description: `Explore liquidity pools and trading pairs on ${BRAND_SHORT}.` },
  { path: '/explore/transactions', title: `Transactions | ${BRAND_NAME}`, description: `View recent swap and liquidity transactions on ${BRAND_SHORT}.` },
  { path: '/send', title: `Send Crypto | ${BRAND_NAME}`, description: `Send tokens across networks with ${BRAND_SHORT}.` },
  { path: '/pool', title: `Manage Liquidity | ${BRAND_NAME}`, description: `Provide liquidity and manage your positions on ${BRAND_SHORT}.` },
  { path: '/pools', title: `Liquidity Pools | ${BRAND_NAME}`, description: `Explore and manage liquidity pools on ${BRAND_SHORT}.` },
  { path: '/limit', title: `Limit Orders | ${BRAND_NAME}`, description: `Set limit orders for your trades on ${BRAND_SHORT}.` },
]

// ── Meta tag injection ──────────────────────────────────────────────
function encode(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function generateMetaTags({ title, description, image, url }) {
  let tags = ''
  const add = (attr, content) => { tags += `    <meta ${attr} content="${encode(content)}" data-seo="true">\n` }

  add('name="description"', description)
  add('property="og:title"', title)
  add('property="og:description"', description)
  add('property="og:type"', 'website')
  add('property="og:url"', url)
  add('property="twitter:card"', 'summary_large_image')
  add('property="twitter:title"', title)

  if (image) {
    add('property="og:image"', image)
    add('property="og:image:width"', '1200')
    add('property="og:image:height"', '630')
    add('property="og:image:alt"', title)
    add('property="twitter:image"', image)
    add('property="twitter:image:alt"', title)
  }

  return tags
}

function injectIntoHtml({ title, description, image, url, canonical }) {
  let html = SHELL_HTML

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${encode(title)}</title>`)

  // Inject meta tags + canonical before </head>
  const metaTags = generateMetaTags({ title, description, image, url })
  const canonicalTag = canonical ? `    <link rel="canonical" href="${encode(canonical)}" />\n` : ''
  html = html.replace('</head>', `${metaTags}${canonicalTag}  </head>`)

  return html
}

function writeHtmlPage(routePath, html) {
  const dir = path.join(BUILD_DIR, routePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
}

// ── Fetch token data ────────────────────────────────────────────────
async function fetchTopTokens() {
  try {
    const resp = await fetch(
      `${EXPLORE_API}/v2/lux.explore.v1.ExploreStatsService/TokenRankings?connect=v1&encoding=json&message=` +
        encodeURIComponent(JSON.stringify({ chainId: 'ALL_NETWORKS' })),
      {
        method: 'GET',
        headers: { accept: '*/*', origin: BRAND_ORIGIN, 'content-type': 'application/json' },
      },
    )
    const json = await resp.json()
    const tokens = json.tokenRankings?.TRENDING?.tokens || []
    return tokens.map((t) => ({
      chain: t.chain?.toLowerCase() || 'ethereum',
      address: t.address ? t.address.toLowerCase() : 'native',
      symbol: t.symbol || 'Unknown',
      name: t.name || 'Token',
    }))
  } catch (e) {
    console.error('Failed to fetch tokens:', e.message)
    return []
  }
}

// ── Fetch token details via GraphQL ─────────────────────────────────
async function fetchTokenDetails(chain, address) {
  try {
    const query = `query TokenWeb($chain: Chain!, $address: String) {
      token(chain: $chain, address: $address) {
        symbol
        name
        project { logoUrl }
      }
    }`
    const resp = await fetch(GRAPHQL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: BRAND_ORIGIN },
      body: JSON.stringify({
        query,
        variables: { chain: chain.toUpperCase(), address: address === 'native' ? undefined : address },
      }),
    })
    const json = await resp.json()
    return json.data?.token
  } catch {
    return null
  }
}

// ── Fetch top pools via GraphQL ─────────────────────────────────────
async function fetchTopPools(chain) {
  try {
    const query = `query {
      topV3Pools(first: 50, chain: ${chain.toUpperCase()}) {
        address
        token0 { symbol name }
        token1 { symbol name }
        feeTier
      }
      topV2Pairs(first: 50, chain: ETHEREUM) {
        address
        token0 { symbol name }
        token1 { symbol name }
      }
    }`
    const resp = await fetch(GRAPHQL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: BRAND_ORIGIN },
      body: JSON.stringify({ query }),
    })
    const json = await resp.json()
    const v3 = (json.data?.topV3Pools || []).map((p) => ({ ...p, chain, version: 'v3' }))
    const v2 = chain === 'ethereum' ? (json.data?.topV2Pairs || []).map((p) => ({ ...p, chain, version: 'v2' })) : []
    return [...v3, ...v2]
  } catch {
    return []
  }
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const defaultImage = `${BRAND_ORIGIN}/images/1200x630_Rich_Link_Preview_Image.png`
  let pageCount = 0

  // 1. Static routes
  console.log('Generating static route pages...')
  for (const route of STATIC_ROUTES) {
    const html = injectIntoHtml({
      title: route.title,
      description: route.description,
      image: defaultImage,
      url: `${BRAND_ORIGIN}${route.path}`,
      canonical: `${BRAND_ORIGIN}${route.path}`,
    })
    writeHtmlPage(route.path, html)
    pageCount++
  }
  console.log(`  ${STATIC_ROUTES.length} static pages`)

  // 2. Token pages
  console.log('Fetching top tokens...')
  const tokens = await fetchTopTokens()
  console.log(`  Found ${tokens.length} tokens`)

  let tokenCount = 0
  // Process in batches of 10 to avoid overwhelming the API
  for (let i = 0; i < tokens.length; i += 10) {
    const batch = tokens.slice(i, i + 10)
    const details = await Promise.all(
      batch.map((t) => fetchTokenDetails(t.chain, t.address)),
    )

    for (let j = 0; j < batch.length; j++) {
      const token = batch[j]
      const detail = details[j]
      const symbol = detail?.symbol || token.symbol
      const name = detail?.name || token.name
      const routePath = `/explore/tokens/${token.chain}/${token.address}`
      const pageUrl = `${BRAND_ORIGIN}${routePath}`
      const imageUrl = `${BRAND_ORIGIN}/api/image/tokens/${token.chain}/${token.address}`

      const title = symbol
        ? `Get ${symbol} on ${BRAND_SHORT} | ${name}`
        : `View Token on ${BRAND_SHORT}`
      const description = `Trade ${name} (${symbol}) on ${BRAND_SHORT}. Real-time prices, charts, and liquidity data.`

      const html = injectIntoHtml({
        title,
        description,
        image: imageUrl,
        url: pageUrl,
        canonical: pageUrl,
      })
      writeHtmlPage(routePath, html)
      tokenCount++
    }
    process.stdout.write(`  ${tokenCount}/${tokens.length} token pages\r`)
  }
  console.log(`  ${tokenCount} token pages generated`)
  pageCount += tokenCount

  // 3. Pool pages
  console.log('Fetching top pools per chain...')
  let poolCount = 0
  for (const chain of CHAINS) {
    const pools = await fetchTopPools(chain)

    for (const pool of pools) {
      if (!pool.address) continue
      const addr = pool.address.toLowerCase()
      const t0 = pool.token0?.symbol || '???'
      const t1 = pool.token1?.symbol || '???'
      const pairName = `${t0}/${t1}`
      const feeTier = pool.feeTier ? ` ${pool.feeTier / 10000}%` : ''
      const routePath = `/explore/pools/${chain}/${addr}`
      const pageUrl = `${BRAND_ORIGIN}${routePath}`
      const imageUrl = `${BRAND_ORIGIN}/api/image/pools/${chain}/${addr}`

      const title = `${pairName}${feeTier} Pool on ${BRAND_SHORT}`
      const description = `${pairName} liquidity pool on ${BRAND_SHORT}. View TVL, volume, fees, and provide liquidity.`

      const html = injectIntoHtml({
        title,
        description,
        image: imageUrl,
        url: pageUrl,
        canonical: pageUrl,
      })
      writeHtmlPage(routePath, html)
      poolCount++
    }
    process.stdout.write(`  ${chain}: ${poolCount} pool pages total\r`)
  }
  console.log(`  ${poolCount} pool pages generated`)
  pageCount += poolCount

  // 4. Per-chain explore pages
  console.log('Generating per-chain explore pages...')
  for (const chain of CHAINS) {
    const chainName = chain.charAt(0).toUpperCase() + chain.slice(1)
    for (const section of ['tokens', 'pools']) {
      const routePath = `/explore/${section}/${chain}`
      const html = injectIntoHtml({
        title: `${chainName} ${section === 'tokens' ? 'Tokens' : 'Pools'} | ${BRAND_NAME}`,
        description: `Explore top ${section} on ${chainName} network via ${BRAND_SHORT}.`,
        image: defaultImage,
        url: `${BRAND_ORIGIN}${routePath}`,
        canonical: `${BRAND_ORIGIN}${routePath}`,
      })
      writeHtmlPage(routePath, html)
      pageCount++
    }
  }

  console.log(`\nDone! Generated ${pageCount} SEO pages in ${BUILD_DIR}`)
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
