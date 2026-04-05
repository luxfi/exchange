<<<<<<< HEAD
/* eslint-env node */

=======
>>>>>>> upstream/main
const fs = require('fs')
const { parseStringPromise, Builder } = require('xml2js')

// Inline version of normalizeTokenAddressForCache to avoid PNG import issues
<<<<<<< HEAD
// Copied from lux/src/data/cache.ts
=======
// Copied from uniswap/src/data/cache.ts
>>>>>>> upstream/main
function normalizeTokenAddressForCache(address) {
  if (address === 'NATIVE' || address === 'native') {
    return 'native'
  }

  // Simple EVM address validation and normalization
  if (address && typeof address === 'string' && address.startsWith('0x') && address.length === 42) {
    return address.toLowerCase()
  }

  // For non-EVM addresses (like Solana), return as-is
  return address
}

const weekMs = 7 * 24 * 60 * 60 * 1000
const nowISO = new Date().toISOString()

const getTopPoolsQuery = (v3Chain) => `
  query {
    topV3Pools(first: 50, chain: ${v3Chain}) {
      id
      address
    }
    topV2Pairs(first: 50, chain: ETHEREUM) {
      address
    }
  }
`

<<<<<<< HEAD
// Brand domain — reads from BRAND_DOMAIN env or defaults to lux.exchange
const BRAND_DOMAIN = process.env.BRAND_DOMAIN || 'lux.exchange'
const BRAND_ORIGIN = `https://${BRAND_DOMAIN}`

// Token ranking API — reads from EXPLORE_API env or defaults
const EXPLORE_API = process.env.EXPLORE_API || `https://gw.${BRAND_DOMAIN}`
const GRAPHQL_API = process.env.GRAPHQL_API || `https://gw.${BRAND_DOMAIN}/v1/graphql`

=======
>>>>>>> upstream/main
const chains = [
  'ETHEREUM',
  'ARBITRUM',
  'OPTIMISM',
  'POLYGON',
  'BASE',
  'BNB',
  'CELO',
<<<<<<< HEAD
=======
  'UNICHAIN',
>>>>>>> upstream/main
  'AVALANCHE',
  'BLAST',
  'SONEIUM',
  'WORLDCHAIN',
  'ZKSYNC',
  'ZORA',
]

fs.readFile('./public/tokens-sitemap.xml', 'utf8', async (_err, data) => {
  const tokenURLs = {}
  try {
    const sitemap = await parseStringPromise(data)
    if (sitemap.urlset.url) {
      sitemap.urlset.url.forEach((url) => {
        const lastMod = new Date(url.lastmod).getTime()
        if (lastMod < Date.now() - weekMs) {
          url.lastmod = nowISO
        }
        tokenURLs[url.loc] = true
      })
    }

    const tokensResponse = await fetch(
<<<<<<< HEAD
      `${EXPLORE_API}/v2/lux.explore.v1.ExploreStatsService/TokenRankings?connect=v1&encoding=json&message=` +
=======
      'https://interface.gateway.uniswap.org/v2/uniswap.explore.v1.ExploreStatsService/TokenRankings?connect=v1&encoding=json&message=' +
>>>>>>> upstream/main
        encodeURIComponent(JSON.stringify({ chainId: 'ALL_NETWORKS' })),
      {
        method: 'GET',
        headers: {
          accept: '*/*',
<<<<<<< HEAD
          origin: BRAND_ORIGIN,
=======
          origin: 'https://app.uniswap.org',
>>>>>>> upstream/main
          'content-type': 'application/json',
        },
      },
    )

    const tokensJSON = await tokensResponse.json()
    const tokenAddresses = tokensJSON.tokenRankings.TRENDING.tokens.map((token) => {
      return { chainName: token.chain.toLowerCase(), address: token.address ? token.address : 'NATIVE' }
    })

    tokenAddresses.forEach(({ chainName, address }) => {
<<<<<<< HEAD
      const tokenURL = `${BRAND_ORIGIN}/explore/tokens/${chainName}/${normalizeTokenAddressForCache(address)}`
=======
      const tokenURL = `https://app.uniswap.org/explore/tokens/${chainName}/${normalizeTokenAddressForCache(address)}`
>>>>>>> upstream/main
      if (!(tokenURL in tokenURLs)) {
        sitemap.urlset.url.push({
          loc: [tokenURL],
          lastmod: [nowISO],
          priority: [0.8],
        })
      }
    })

    const builder = new Builder()
    const xml = builder.buildObject(sitemap)
    const path = './public/tokens-sitemap.xml'
    fs.writeFile(path, xml, (error) => {
      if (error) {
        throw error
      }
      const stats = fs.statSync(path)
      const fileSizeBytes = stats.size
      const fileSizeMegabytes = fileSizeBytes / (1024 * 1024)

      if (fileSizeMegabytes > 50) {
        throw new Error('Generated tokens-sitemap.xml file size exceeds 50MB')
      }
      console.log('Tokens sitemap updated')
    })
  } catch (e) {
    console.error(e)
  }
})

fs.readFile('./public/pools-sitemap.xml', 'utf8', async (_err, data) => {
  const poolURLs = {}
  try {
    const sitemap = await parseStringPromise(data)
    if (sitemap.urlset.url) {
      sitemap.urlset.url.forEach((url) => {
        const lastMod = new Date(url.lastmod).getTime()
        if (lastMod < Date.now() - weekMs) {
          url.lastmod = nowISO
        }
        poolURLs[url.loc] = true
      })
    }

    for (const chainName of chains) {
<<<<<<< HEAD
      const poolsResponse = await fetch(GRAPHQL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: BRAND_ORIGIN,
=======
      const poolsResponse = await fetch('https://api.uniswap.org/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://app.uniswap.org',
>>>>>>> upstream/main
        },
        body: JSON.stringify({ query: getTopPoolsQuery(chainName) }),
      })
      const poolsJSON = await poolsResponse.json()
      const v3PoolAddresses = poolsJSON.data.topV3Pools?.map((pool) => pool.address) ?? []
      const v2PoolAddresses = poolsJSON.data.topV2Pairs?.map((pool) => pool.address) ?? []
      const poolAddresses = v3PoolAddresses.concat(v2PoolAddresses)

      poolAddresses.forEach((address) => {
<<<<<<< HEAD
        const poolUrl = `${BRAND_ORIGIN}/explore/pools/${chainName.toLowerCase()}/${normalizeTokenAddressForCache(address)}`
=======
        const poolUrl = `https://app.uniswap.org/explore/pools/${chainName.toLowerCase()}/${normalizeTokenAddressForCache(address)}`
>>>>>>> upstream/main
        if (!(poolUrl in poolURLs)) {
          sitemap.urlset.url.push({
            loc: [poolUrl],
            lastmod: [nowISO],
            priority: [0.8],
          })
        }
      })
    }

    const builder = new Builder()
    const xml = builder.buildObject(sitemap)
    const path = './public/pools-sitemap.xml'
    fs.writeFile(path, xml, (error) => {
      if (error) {
        throw error
      }
      const stats = fs.statSync(path)
      const fileSizeBytes = stats.size
      const fileSizeMegabytes = fileSizeBytes / (1024 * 1024)

      if (fileSizeMegabytes > 50) {
        throw new Error('Generated pools-sitemap.xml file size exceeds 50MB')
      }
      console.log('Pools sitemap updated')
    })
  } catch (e) {
    console.error(e)
  }
})
<<<<<<< HEAD

// Stamp brand domain into static sitemap templates
// __BRAND_ORIGIN__ placeholders in sitemap.xml and app-sitemap.xml get replaced
function stampSitemaps() {
  const files = ['./public/sitemap.xml', './public/app-sitemap.xml']
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      const stamped = content.replace(/__BRAND_ORIGIN__/g, BRAND_ORIGIN)
      fs.writeFileSync(file, stamped, 'utf8')
      console.log(`Stamped ${file} with ${BRAND_ORIGIN}`)
    } catch (e) {
      console.error(`Failed to stamp ${file}:`, e.message)
    }
  }
}
stampSitemaps()
=======
>>>>>>> upstream/main
