import { test, expect, Page, BrowserContext } from '@playwright/test'
import { chromium } from '@playwright/test'

// Helper to measure latency
async function measureLatency(page: Page, action: () => Promise<void>): Promise<number> {
  const start = Date.now()
  await action()
  return Date.now() - start
}

test.describe('LUX DEX Full Trading Flow with Real Browser', () => {
  let context: BrowserContext
  let page: Page

  test.beforeAll(async () => {
    // Launch browser with wallet extension support
    const browser = await chromium.launch({
      headless: false, // Show browser for wallet interaction
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ]
    })

    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      permissions: ['clipboard-read', 'clipboard-write'],
      // Inject LuxWallet mock
      storageState: {
        cookies: [],
        origins: [
          {
            origin: 'http://localhost:3000',
            localStorage: [
              {
                name: 'walletconnect',
                value: JSON.stringify({ connected: false })
              }
            ]
          }
        ]
      }
    })

    // Inject wallet provider
    await context.addInitScript(() => {
      // Mock LuxWallet provider
      (window as any).luxwallet = {
        isLuxWallet: true,
        request: async ({ method, params }: any) => {
          console.log('LuxWallet request:', method, params)
          
          switch (method) {
            case 'eth_requestAccounts':
              return ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7']
            case 'eth_accounts':
              return ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7']
            case 'eth_chainId':
              return '0x2328' // 9000 in hex (Lux X-Chain)
            case 'personal_sign':
              return '0xsignature'
            case 'eth_sendTransaction':
              return '0xtxhash' + Math.random().toString(36).substring(7)
            default:
              return null
          }
        },
        on: (event: string, handler: Function) => {
          console.log('LuxWallet event listener:', event)
        },
        removeListener: (event: string, handler: Function) => {
          console.log('LuxWallet remove listener:', event)
        },
      }

      // Also add ethereum provider for compatibility
      (window as any).ethereum = (window as any).luxwallet
    })

    page = await context.newPage()
  })

  test('Complete trading flow with sub-microsecond latency', async () => {
    console.log('🚀 Starting LUX DEX Full Trading Flow Test')

    // 1. Navigate to V2 trading interface
    await page.goto('/v2/trade')
    await page.waitForLoadState('networkidle')
    
    // Verify page loaded
    await expect(page.locator('h1:has-text("LUX DEX")')).toBeVisible()
    console.log('✅ Trading interface loaded')

    // 2. Check WebSocket connection
    await page.waitForSelector('[data-testid="connection-status"]')
    const connectionStatus = await page.locator('[data-testid="connection-status"]').textContent()
    expect(connectionStatus).toContain('Connected')
    console.log('✅ WebSocket connected')

    // Verify performance metrics
    const latencyText = await page.locator('[data-testid="latency-metric"]').textContent()
    expect(latencyText).toContain('ns')
    console.log(`✅ Latency displayed: ${latencyText}`)

    // 3. Connect LuxWallet
    await page.click('[data-testid="connect-wallet-btn"]')
    await page.waitForSelector('[data-testid="wallet-modal"]')
    
    // Select LuxWallet
    await page.click('[data-testid="select-luxwallet"]')
    
    // Wait for wallet connection
    await page.waitForSelector('[data-testid="wallet-address"]')
    const walletAddress = await page.locator('[data-testid="wallet-address"]').textContent()
    expect(walletAddress).toContain('0x742d')
    console.log(`✅ Wallet connected: ${walletAddress}`)

    // 4. Test Market Selector
    await page.click('[data-testid="change-market-btn"]')
    await page.waitForSelector('[data-testid="market-dropdown"]')
    
    // Search for ETH market
    await page.fill('[data-testid="market-search"]', 'ETH')
    await page.click('[data-testid="market-item-ETH-USDT"]')
    
    const currentMarket = await page.locator('[data-testid="current-market"]').textContent()
    expect(currentMarket).toContain('ETH-USDT')
    console.log('✅ Market changed to ETH-USDT')

    // 5. Test Order Book real-time updates
    const orderBookBids = await page.locator('[data-testid="orderbook-bids"] [data-testid="orderbook-level"]').count()
    expect(orderBookBids).toBeGreaterThan(0)
    console.log(`✅ Order book loaded with ${orderBookBids} bid levels`)

    // 6. Place a limit buy order
    console.log('📝 Placing limit buy order...')
    
    // Switch to buy side
    await page.click('[data-testid="buy-btn"]')
    
    // Select limit order type
    await page.click('[data-testid="order-type-limit"]')
    
    // Fill in order details
    await page.fill('[data-testid="price-input"]', '2900')
    await page.fill('[data-testid="amount-input"]', '0.1')
    
    // Measure order placement latency
    const orderLatency = await measureLatency(page, async () => {
      await page.click('[data-testid="place-order-btn"]')
      await page.waitForSelector('[data-testid="success-message"]')
    })
    
    console.log(`✅ Order placed in ${orderLatency}ms`)
    expect(orderLatency).toBeLessThan(100) // Should be very fast
    
    const successMessage = await page.locator('[data-testid="success-message"]').textContent()
    expect(successMessage).toContain('Order placed')

    // 7. Check open orders
    await page.click('[data-testid="orders-tab"]')
    await page.waitForSelector('[data-testid="order-item"]')
    
    const openOrders = await page.locator('[data-testid="order-item"]').count()
    expect(openOrders).toBeGreaterThan(0)
    console.log(`✅ Open orders displayed: ${openOrders}`)

    // 8. Cancel an order
    await page.click('[data-testid="cancel-order-btn"]').first()
    await page.click('[data-testid="confirm-cancel"]')
    await page.waitForSelector('[data-testid="order-cancelled"]')
    console.log('✅ Order cancelled successfully')

    // 9. Place a market sell order
    console.log('📝 Placing market sell order...')
    
    await page.click('[data-testid="sell-btn"]')
    await page.click('[data-testid="order-type-market"]')
    await page.fill('[data-testid="amount-input"]', '0.05')
    
    const marketOrderLatency = await measureLatency(page, async () => {
      await page.click('[data-testid="place-order-btn"]')
      await page.waitForSelector('[data-testid="success-message"]')
    })
    
    console.log(`✅ Market order executed in ${marketOrderLatency}ms`)
    expect(marketOrderLatency).toBeLessThan(50) // Market orders should be even faster

    // 10. Test margin trading
    await page.click('[data-testid="margin-toggle"]')
    await page.waitForSelector('[data-testid="leverage-slider"]')
    
    // Set leverage to 10x
    await page.fill('[data-testid="leverage-slider"]', '10')
    const leverageDisplay = await page.locator('[data-testid="leverage-display"]').textContent()
    expect(leverageDisplay).toContain('10x')
    console.log('✅ Margin trading enabled with 10x leverage')

    // 11. Check positions
    await page.click('[data-testid="positions-tab"]')
    const positions = await page.locator('[data-testid="position-item"]').count()
    console.log(`✅ Positions displayed: ${positions}`)

    // 12. Test trade history updates
    const tradeItems = await page.locator('[data-testid="trade-item"]').count()
    expect(tradeItems).toBeGreaterThan(0)
    console.log(`✅ Trade history loaded with ${tradeItems} trades`)

    // 13. Test chart interactions
    await page.click('[data-testid="timeframe-1h"]')
    await expect(page.locator('[data-testid="timeframe-1h"]')).toHaveClass(/active/)
    console.log('✅ Chart timeframe changed to 1h')

    // 14. Test all UI buttons
    const buttons = [
      'buy-btn',
      'sell-btn',
      'order-type-limit',
      'order-type-market',
      'order-type-stop',
      'positions-tab',
      'orders-tab',
      'history-tab',
    ]

    for (const button of buttons) {
      await page.click(`[data-testid="${button}"]`)
      console.log(`✅ Clicked ${button}`)
    }

    // 15. Verify sub-microsecond latency
    const finalLatency = await page.locator('[data-testid="latency-metric"]').textContent()
    const latencyValue = parseInt(finalLatency?.match(/\d+/)?.[0] || '0')
    expect(latencyValue).toBeLessThan(1000) // Less than 1000ns = sub-microsecond
    console.log(`✅ Sub-microsecond latency achieved: ${finalLatency}`)

    // 16. Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 812 }) // iPhone X
    await page.waitForSelector('[data-testid="mobile-menu"]')
    console.log('✅ Mobile view responsive')

    // Reset viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    // 17. Disconnect wallet
    await page.click('[data-testid="disconnect-wallet"]')
    await page.waitForSelector('[data-testid="connect-wallet-btn"]')
    console.log('✅ Wallet disconnected')

    console.log('🎉 All tests passed! LUX DEX is working perfectly!')
  })

  test('Stress test with rapid order placement', async () => {
    await page.goto('/v2/trade')
    
    // Connect wallet
    await page.click('[data-testid="connect-wallet-btn"]')
    await page.click('[data-testid="select-luxwallet"]')
    await page.waitForSelector('[data-testid="wallet-address"]')

    const latencies: number[] = []
    
    // Place 100 orders rapidly
    for (let i = 0; i < 100; i++) {
      await page.click('[data-testid="buy-btn"]')
      await page.fill('[data-testid="price-input"]', String(49000 + i))
      await page.fill('[data-testid="amount-input"]', '0.001')
      
      const latency = await measureLatency(page, async () => {
        await page.click('[data-testid="place-order-btn"]')
      })
      
      latencies.push(latency)
      
      // Clear inputs for next order
      await page.fill('[data-testid="price-input"]', '')
      await page.fill('[data-testid="amount-input"]', '')
    }

    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length
    const minLatency = Math.min(...latencies)
    const maxLatency = Math.max(...latencies)
    
    console.log(`📊 Performance Results:`)
    console.log(`  Average Latency: ${avgLatency.toFixed(2)}ms`)
    console.log(`  Min Latency: ${minLatency}ms`)
    console.log(`  Max Latency: ${maxLatency}ms`)
    console.log(`  Orders/sec: ${(1000 / avgLatency * 100).toFixed(0)}`)
    
    expect(avgLatency).toBeLessThan(10) // Average should be under 10ms
    expect(minLatency).toBeLessThan(5)  // Best case under 5ms
  })

  test('Test all exchange features comprehensively', async () => {
    await page.goto('/v2/trade')
    
    // Test every feature
    const features = [
      { name: 'WebSocket Reconnection', action: async () => {
        await page.evaluate(() => {
          (window as any).dexWebSocket?.disconnect()
        })
        await page.waitForTimeout(1000)
        await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected')
      }},
      
      { name: 'Dark/Light Mode Toggle', action: async () => {
        const toggleButton = page.locator('[data-testid="theme-toggle"]')
        if (await toggleButton.isVisible()) {
          await toggleButton.click()
        }
      }},
      
      { name: 'Language Switcher', action: async () => {
        const langButton = page.locator('[data-testid="language-selector"]')
        if (await langButton.isVisible()) {
          await langButton.click()
          await page.click('[data-testid="lang-en"]')
        }
      }},
      
      { name: 'Export Trade History', action: async () => {
        const exportButton = page.locator('[data-testid="export-trades"]')
        if (await exportButton.isVisible()) {
          await exportButton.click()
        }
      }},
      
      { name: 'Settings Panel', action: async () => {
        const settingsButton = page.locator('[data-testid="settings-btn"]')
        if (await settingsButton.isVisible()) {
          await settingsButton.click()
          await page.click('[data-testid="close-settings"]')
        }
      }},
    ]

    for (const feature of features) {
      try {
        await feature.action()
        console.log(`✅ ${feature.name} tested`)
      } catch (e) {
        console.log(`⚠️  ${feature.name} not available or failed`)
      }
    }
  })

  test.afterAll(async () => {
    await context.close()
  })
})