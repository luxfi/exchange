import { expect, getTest } from 'playwright/fixtures'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const test = getTest({ withAnvil: true })

test('debug graphql requests for token selector', async ({ page }) => {
  const graphqlRequests: Array<{ url: string; operationName: string; variables: unknown }> = []

  // Log all network requests to understand what's happening
  page.on('request', async (request) => {
    const url = request.url()
    if (
      url.includes('graphql') ||
      url.includes('gateway.uniswap.org') ||
      url.includes('interface.gateway') ||
      url.includes('/api')
    ) {
      const postData = request.postData()
      if (postData) {
        try {
          const data = JSON.parse(postData)
          graphqlRequests.push({
            url,
            operationName: data.operationName || 'unknown',
            variables: data.variables || {},
          })
          console.log(`GraphQL Request: ${data.operationName} to ${url}`)
        } catch {
          console.log(`Request to ${url} (not JSON)`)
        }
      } else {
        console.log(`Request to ${url} (no body)`)
      }
    }
  })

  page.on('response', async (response) => {
    const url = response.url()
    if (
      url.includes('graphql') ||
      url.includes('gateway.uniswap.org') ||
      url.includes('interface.gateway') ||
      url.includes('/api')
    ) {
      const status = response.status()
      console.log(`Response: ${status} from ${url}`)
      if (status >= 400) {
        try {
          const text = await response.text()
          console.log(`Error response body: ${text.substring(0, 500)}`)
        } catch {
          // Ignore
        }
      }
    }
  })

  // Navigate to swap page
  await page.goto('/swap?chain=mainnet')
  await page.waitForLoadState('networkidle')

  // Check localStorage for chain state
  const localStorage = await page.evaluate(() => {
    const result: Record<string, string> = {}
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key && (key.includes('appkit') || key.includes('chain') || key.includes('wagmi'))) {
        result[key] = window.localStorage.getItem(key) || ''
      }
    }
    return result
  })
  console.log('localStorage state:', JSON.stringify(localStorage, null, 2))

  // Click to open token selector
  await page.getByTestId(TestID.ChooseOutputToken).click()
  await page.waitForTimeout(3000)

  // Log all GraphQL requests made
  console.log('Total GraphQL requests made:', graphqlRequests.length)
  for (const req of graphqlRequests) {
    console.log(`  - ${req.operationName}: ${req.url.substring(0, 80)}...`)
  }

  // Check for TokenProjects request specifically
  const tokenProjectsReqs = graphqlRequests.filter((r) => r.operationName === 'TokenProjects')
  console.log('TokenProjects requests:', tokenProjectsReqs.length)

  // Find any token options
  const tokenOptions = await page.locator('[data-testid^="token-option-"]').all()
  console.log('Found token options:', tokenOptions.length)

  if (tokenOptions.length > 0) {
    const testIds = await Promise.all(
      tokenOptions.slice(0, 10).map(async (el) => {
        return await el.getAttribute('data-testid')
      }),
    )
    console.log('Token testIds:', testIds)
  }

  // Check for loading or error states
  const loadingText = await page.locator('text=Loading').count()
  const errorText = await page.locator('text=Error').count()
  console.log(`Loading elements: ${loadingText}, Error elements: ${errorText}`)

  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-results/debug-graphql-tokens.png', fullPage: true })

  expect(tokenOptions.length).toBeGreaterThan(0)
})
