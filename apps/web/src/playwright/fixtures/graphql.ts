// biome-ignore lint/style/noRestrictedImports: GraphQL fixtures need direct Playwright imports
import { test as base } from '@playwright/test'
import path from 'path'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { Mocks } from 'playwright/mocks/mocks'

type GraphqlFixture = {
  graphql: {
    /**
     * Intercepts a GraphQL operation and responds with a mock response.
     *
     * @param {string} operationName - The name of the GraphQL operation to intercept.
     * @param {string} mockPath - The path to the mock response file.
     * @param {Record<string, unknown>} [variables] - Optional variables to match against the request.
     *
     * If no variables are provided, all operations with the specified operationName will match and return the mock response.
     * If variables are provided, the request will only match if all variables match (case insensitive).
     */
    intercept: (operationName: string, mockPath: string, variables?: Record<string, unknown>) => Promise<void>
    waitForResponse: (operationName: string) => Promise<void>
  }
  interceptLongRunning: void
}

type InterceptConfig = {
  mockPath: string
  variables?: Record<string, unknown>
}

const interceptConfigs = new Map<string, InterceptConfig>()

// Generate empty/null response for unmocked GraphQL operations
// This prevents network errors from breaking E2E tests
function generateEmptyResponse(operationName: string): any {
  // Handle specific operations that need minimal valid responses
  switch (operationName) {
    case 'Token':
      return { data: { token: null } }
    case 'Convert':
      return { data: { convert: { value: 1.0, currency: 'USD' } } }
    case 'TrendingTokens':
    case 'TokenRankings':
      return { data: { tokenRankings: { trending: { tokens: [] } } } }
    case 'SearchTokens':
      return { data: { searchTokens: [] } }
    case 'TopTokens':
      return { data: { topTokens: [] } }
    case 'Activity':
    case 'AssetActivity':
      return { data: { portfolios: [] } }
    case 'Nfts':
      return { data: { nfts: null } }
    default:
      // Return generic empty data response
      return { data: null }
  }
}

export const test = base.extend<GraphqlFixture>({
  async graphql({ page }, use) {
    interceptConfigs.clear()

    // eslint-disable-next-line max-params
    const intercept = async (operationName: string, mockPath: string, variables?: Record<string, unknown>) => {
      interceptConfigs.set(operationName, { mockPath, variables })
    }

    // Regex to match GraphQL URLs:
    // 1. Uniswap hosted: [prefix.]interface.gateway.uniswap.org/v1/graphql or beta.gateway.uniswap.org/v1/graphql
    // 2. Relative path: /api (used in Cloudflare deployments when proxying GraphQL)
    const graphqlUrlPattern = /(?:(?:\w+\.)?(?:interface|beta)\.(gateway|api)\.uniswap\.org\/v1\/graphql|\/api$)/

    const waitForResponse = async (operationName: string) => {
      try {
        await page.waitForResponse((response) => {
          const url = response.request().url()
          if (!graphqlUrlPattern.test(url)) {
            return false
          }

          const postDataBuffer = response.request().postDataBuffer()
          if (!postDataBuffer) {
            return false
          }
          const postData = postDataBuffer.toString('utf-8')
          const data = JSON.parse(postData)
          return data.operationName === operationName
        })
      } catch (error) {
        console.warn('GraphQL waitForResponse error:', error)
      }
    }

    await page.route(graphqlUrlPattern, async (route) => {
      const request = route.request()
      const postData = request.postData()
      if (!postData) {
        return route.continue()
      }

      try {
        const { operationName, variables } = JSON.parse(postData)
        const config = interceptConfigs.get(operationName)

        console.log(`[GraphQL Intercept] operationName=${operationName}, hasConfig=${!!config}, configKeys=${Array.from(interceptConfigs.keys()).join(',')}`)

        if (config?.variables) {
          const matches = Object.keys(config.variables).every(
            (key) => variables[key]?.toString().toLowerCase() === config.variables?.[key]?.toString().toLowerCase(),
          )
          if (matches) {
            console.log(`[GraphQL Intercept] Fulfilling ${operationName} with mock: ${config.mockPath}`)
            return route.fulfill({ path: path.resolve(__dirname, config.mockPath) })
          }
        } else if (config) {
          console.log(`[GraphQL Intercept] Fulfilling ${operationName} with mock: ${config.mockPath}`)
          return route.fulfill({ path: path.resolve(__dirname, config.mockPath) })
        }

        // For E2E tests, return empty/null data for unmocked operations instead of hitting real server
        // This prevents network errors from breaking tests
        console.log(`[GraphQL Intercept] Returning empty mock for ${operationName}`)
        const emptyResponse = generateEmptyResponse(operationName)
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(emptyResponse),
        })
      } catch (error) {
        console.warn('GraphQL intercept error:', error)
        return route.continue()
      }
    })

    await use({ intercept, waitForResponse })
  },
  // Intercept long running graphql requests here:
  interceptLongRunning: [
    // eslint-disable-next-line no-empty-pattern
    async ({ graphql }, use) => {
      graphql.intercept('PortfolioBalances', Mocks.PortfolioBalances.test_wallet)
      // Intercept TokenProjects for common base tokens
      // Use LuxDev tokens (LUX, WLUX, LUSD, LETH) when in luxd mode,
      // otherwise use mainnet tokens (ETH, WETH, USDT, etc.)
      const tokenProjectsMock = isLuxdMode()
        ? Mocks.TokenProjects.common_bases_lux
        : Mocks.TokenProjects.common_bases
      graphql.intercept('TokenProjects', tokenProjectsMock)
      await use(undefined)
    },
    { auto: true },
  ],
})
