import { expect, test } from '@playwright/test'

test('Investigate RPC calls on swap page', async ({ page }) => {
  const networkRequests: Array<{ url: string; method: string }> = []
  const consoleMessages: string[] = []

  // Capture network requests
  page.on('request', (request) => {
    const url = request.url()
    if (url.includes('9545') || url.includes('8545') || url.includes('rpc') || url.includes('lux')) {
      networkRequests.push({
        url,
        method: request.method(),
      })
      console.log(`Network Request: ${request.method()} ${url}`)
    }
  })

  // Capture console messages
  page.on('console', (msg) => {
    const text = msg.text()
    if (text.includes('error') || text.includes('failed') || text.includes('RPC') || text.includes('9545') || text.includes('8545')) {
      consoleMessages.push(text)
      console.log(`Console: [${msg.type()}] ${text}`)
    }
  })

  // Navigate to the swap page
  console.log('Navigating to swap page...')
  await page.goto('http://localhost:9000/swap?chain=lux-dev', { waitUntil: 'networkidle' })

  // Wait a bit to see network activity
  await page.waitForTimeout(3000)

  // Take a screenshot
  await page.screenshot({ path: '/tmp/rpc-investigation.png', fullPage: true })

  console.log('\n=== CAPTURED NETWORK REQUESTS ===')
  console.log(JSON.stringify(networkRequests, null, 2))

  console.log('\n=== CAPTURED CONSOLE MESSAGES ===')
  console.log(JSON.stringify(consoleMessages, null, 2))

  // Check for specific ports
  const has9545Requests = networkRequests.some((r) => r.url.includes('9545'))
  const has8545Requests = networkRequests.some((r) => r.url.includes('8545'))

  console.log(`\nRequests to 9545: ${has9545Requests}`)
  console.log(`Requests to 8545: ${has8545Requests}`)

  expect(has9545Requests || has8545Requests).toBe(true)
})
