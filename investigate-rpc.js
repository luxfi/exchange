import { chromium } from 'playwright'

async function investigateRPC() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const networkLog = []
  const consoleLog = []

  // Listen to all network requests
  page.on('request', (request) => {
    const url = request.url()
    const method = request.method()
    networkLog.push({ url, method })
  })

  // Listen to console messages
  page.on('console', (msg) => {
    consoleLog.push({
      type: msg.type(),
      text: msg.text(),
    })
  })

  // Navigate to the swap page
  console.log('Navigating to http://localhost:9000/swap?chain=lux-dev')
  try {
    await page.goto('http://localhost:9000/swap?chain=lux-dev', { waitUntil: 'networkidle' })
  } catch (error) {
    console.log('Navigation error (expected):', error.message)
  }

  // Wait for network activity
  await page.waitForTimeout(2000)

  // Take a screenshot
  await page.screenshot({ path: '/tmp/rpc-investigation-screenshot.png', fullPage: true })
  console.log('Screenshot saved to /tmp/rpc-investigation-screenshot.png')

  // Filter for RPC-related requests
  const rpcRequests = networkLog.filter(
    (r) =>
      r.url.includes('9545') ||
      r.url.includes('8545') ||
      r.url.includes('rpc') ||
      r.url.includes('http://127.0.0.1') ||
      r.url.includes('http://localhost:'),
  )

  // Filter for error-related console messages
  const errorMessages = consoleLog.filter((m) =>
    ['error', 'failed', 'RPC', '9545', '8545'].some((keyword) => m.text.toLowerCase().includes(keyword.toLowerCase())),
  )

  console.log('\n=== RPC-RELATED NETWORK REQUESTS ===')
  rpcRequests.forEach((req) => {
    console.log(`${req.method} ${req.url}`)
  })

  console.log('\n=== ERROR/RPC-RELATED CONSOLE MESSAGES ===')
  errorMessages.forEach((msg) => {
    console.log(`[${msg.type}] ${msg.text}`)
  })

  console.log('\n=== ALL NETWORK REQUESTS (first 20) ===')
  networkLog.slice(0, 20).forEach((req) => {
    console.log(`${req.method} ${req.url}`)
  })

  await browser.close()
}

investigateRPC().catch(console.error)
