import { chromium } from 'playwright'

async function investigateRPC() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const networkLog = []
  const consoleLog = []

  // Listen to all network requests and responses
  page.on('request', (request) => {
    const url = request.url()
    const method = request.method()

    // Log ALL requests initially
    networkLog.push({
      url,
      method,
      type: 'request',
    })
  })

  // Capture request failures
  page.on('requestfailed', (request) => {
    const url = request.url()
    networkLog.push({
      url,
      method: request.method(),
      type: 'request_failed',
      failure: request.failure()?.errorText || 'Unknown',
    })
  })

  // Listen to console messages
  page.on('console', (msg) => {
    const text = msg.text()
    consoleLog.push({
      type: msg.type(),
      text,
      location: msg.location(),
    })
  })

  // Capture all page errors
  page.on('pageerror', (error) => {
    consoleLog.push({
      type: 'page_error',
      text: error.toString(),
      stack: error.stack,
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
  await page.waitForTimeout(3000)

  // Take a screenshot
  await page.screenshot({ path: '/tmp/rpc-detailed-screenshot.png', fullPage: true })
  console.log('Screenshot saved')

  // Filter for RPC-related requests (port-based and endpoint-based)
  const rpcRequests = networkLog.filter((r) => {
    const url = r.url.toLowerCase()
    return (
      url.includes(':9545') ||
      url.includes(':8545') ||
      url.includes(':9650') ||
      url.includes('rpc') ||
      url.includes('json-rpc') ||
      url.includes('eth_') ||
      url.includes('web3_') ||
      url.includes('/ext/bc/') ||
      url.includes('127.0.0.1') ||
      url.includes('localhost:') && !url.includes('localhost:9000')
    )
  })

  // Filter for console messages that contain errors or RPC info
  const relevantConsoleMessages = consoleLog.filter((m) => {
    const text = m.text.toLowerCase()
    return (
      text.includes('error') ||
      text.includes('warn') ||
      text.includes('rpc') ||
      text.includes('9545') ||
      text.includes('8545') ||
      text.includes('fetch') ||
      text.includes('failed') ||
      text.includes('connection') ||
      m.type !== 'log'
    )
  })

  console.log('\n========================================')
  console.log('RPC-RELATED NETWORK REQUESTS')
  console.log('========================================')
  if (rpcRequests.length === 0) {
    console.log('No RPC-specific requests found')
  } else {
    rpcRequests.forEach((req) => {
      console.log(`[${req.type}] ${req.method} ${req.url}`)
      if (req.failure) {
        console.log(`  ERROR: ${req.failure}`)
      }
    })
  }

  console.log('\n========================================')
  console.log('RELEVANT CONSOLE MESSAGES & ERRORS')
  console.log('========================================')
  if (relevantConsoleMessages.length === 0) {
    console.log('No errors or warnings found')
  } else {
    relevantConsoleMessages.forEach((msg) => {
      console.log(`[${msg.type}] ${msg.text}`)
      if (msg.location && typeof msg.location === 'object') {
        console.log(`  at ${msg.location.url}:${msg.location.lineNumber}`)
      }
    })
  }

  console.log('\n========================================')
  console.log('ALL NETWORK REQUESTS INVOLVING LOCAL PORTS')
  console.log('========================================')
  const localRequests = networkLog.filter((r) => r.url.includes('localhost:') || r.url.includes('127.0.0.1:'))
  if (localRequests.length === 0) {
    console.log('No local port requests found')
  } else {
    localRequests.slice(0, 30).forEach((req) => {
      console.log(`${req.method} ${req.url}`)
    })
    if (localRequests.length > 30) {
      console.log(`... and ${localRequests.length - 30} more`)
    }
  }

  console.log('\n========================================')
  console.log('SUMMARY')
  console.log('========================================')
  console.log(`Total network requests: ${networkLog.length}`)
  console.log(`RPC-related requests: ${rpcRequests.length}`)
  console.log(`Console messages: ${consoleLog.length}`)
  console.log(`Errors/warnings: ${relevantConsoleMessages.length}`)

  await browser.close()
}

investigateRPC().catch(console.error)
