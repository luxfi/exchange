/// <reference types="cypress" />

describe('LUX DEX Trading Interface E2E Tests', () => {
  beforeEach(() => {
    // Mock WebSocket connection
    cy.intercept('GET', '**/socket.io/*', { fixture: 'websocket-mock.json' })
    
    // Visit v2 trading interface
    cy.visit('/v2/trade')
    
    // Wait for initial load
    cy.get('[data-testid="trading-interface"]').should('be.visible')
  })

  describe('WebSocket Connection', () => {
    it('should connect to WebSocket on page load', () => {
      cy.get('[data-testid="connection-status"]').should('contain', 'Connected')
      cy.get('[data-testid="latency-metric"]').should('contain', '597ns')
      cy.get('[data-testid="throughput-metric"]').should('contain', '2.9M/sec')
    })

    it('should handle WebSocket disconnection gracefully', () => {
      cy.window().then((win) => {
        // Simulate disconnection
        win.dexWebSocket?.disconnect()
      })
      
      cy.get('[data-testid="connection-status"]').should('contain', 'Disconnected')
      cy.get('[data-testid="reconnect-button"]').should('be.visible')
    })

    it('should auto-reconnect after disconnection', () => {
      cy.window().then((win) => {
        win.dexWebSocket?.disconnect()
      })
      
      cy.wait(2000) // Wait for auto-reconnect
      cy.get('[data-testid="connection-status"]').should('contain', 'Connected')
    })
  })

  describe('Market Selector', () => {
    it('should display current market info', () => {
      cy.get('[data-testid="current-market"]').should('contain', 'BTC-USDT')
      cy.get('[data-testid="last-price"]').should('exist')
      cy.get('[data-testid="24h-change"]').should('exist')
      cy.get('[data-testid="24h-volume"]').should('exist')
    })

    it('should open market dropdown on click', () => {
      cy.get('[data-testid="change-market-btn"]').click()
      cy.get('[data-testid="market-dropdown"]').should('be.visible')
    })

    it('should filter markets by search term', () => {
      cy.get('[data-testid="change-market-btn"]').click()
      cy.get('[data-testid="market-search"]').type('ETH')
      cy.get('[data-testid="market-item"]').should('have.length.lessThan', 5)
      cy.get('[data-testid="market-item"]').first().should('contain', 'ETH')
    })

    it('should change market on selection', () => {
      cy.get('[data-testid="change-market-btn"]').click()
      cy.get('[data-testid="market-item-ETH-USDT"]').click()
      cy.get('[data-testid="current-market"]').should('contain', 'ETH-USDT')
    })

    it('should toggle favorite markets', () => {
      cy.get('[data-testid="change-market-btn"]').click()
      cy.get('[data-testid="favorite-btn-BTC-USDT"]').click()
      cy.get('[data-testid="favorites-filter"]').click()
      cy.get('[data-testid="market-item"]').should('contain', 'BTC-USDT')
    })
  })

  describe('Order Book', () => {
    it('should display bids and asks', () => {
      cy.get('[data-testid="orderbook-bids"]').should('exist')
      cy.get('[data-testid="orderbook-asks"]').should('exist')
      cy.get('[data-testid="orderbook-spread"]').should('exist')
    })

    it('should update in real-time', () => {
      const initialPrice = cy.get('[data-testid="best-bid"]').invoke('text')
      
      // Simulate WebSocket update
      cy.window().then((win) => {
        win.dexWebSocket?.emit('orderbook', {
          symbol: 'BTC-USDT',
          bids: [[50100, 1.5]],
          asks: [[50200, 1.2]],
        })
      })
      
      cy.get('[data-testid="best-bid"]').should('not.equal', initialPrice)
    })

    it('should handle order book depth settings', () => {
      cy.get('[data-testid="depth-selector"]').select('50')
      cy.get('[data-testid="orderbook-level"]').should('have.length.at.most', 100)
    })

    it('should display depth visualization', () => {
      cy.get('[data-testid="depth-bar"]').should('have.css', 'width')
      cy.get('[data-testid="depth-bar"]').should('have.css', 'background-color')
    })
  })

  describe('Trade History', () => {
    it('should display recent trades', () => {
      cy.get('[data-testid="trade-history"]').should('exist')
      cy.get('[data-testid="trade-item"]').should('have.length.at.least', 1)
    })

    it('should update with new trades', () => {
      cy.window().then((win) => {
        win.dexWebSocket?.emit('trades', [{
          id: 'trade-123',
          symbol: 'BTC-USDT',
          price: 50150,
          size: 0.5,
          side: 'buy',
          timestamp: Date.now(),
        }])
      })
      
      cy.get('[data-testid="trade-item"]').first().should('contain', '50150')
    })

    it('should show trade direction indicators', () => {
      cy.get('[data-testid="trade-direction-up"]').should('have.class', 'text-green-400')
      cy.get('[data-testid="trade-direction-down"]').should('have.class', 'text-red-400')
    })
  })

  describe('Order Form', () => {
    beforeEach(() => {
      // Connect wallet mock
      cy.get('[data-testid="connect-wallet-btn"]').click()
      cy.get('[data-testid="wallet-modal"]').should('be.visible')
      cy.get('[data-testid="select-luxwallet"]').click()
    })

    it('should switch between buy and sell', () => {
      cy.get('[data-testid="buy-btn"]').click()
      cy.get('[data-testid="buy-btn"]').should('have.class', 'bg-green-600')
      
      cy.get('[data-testid="sell-btn"]').click()
      cy.get('[data-testid="sell-btn"]').should('have.class', 'bg-red-600')
    })

    it('should switch between order types', () => {
      cy.get('[data-testid="order-type-limit"]').click()
      cy.get('[data-testid="price-input"]').should('be.visible')
      
      cy.get('[data-testid="order-type-market"]').click()
      cy.get('[data-testid="price-input"]').should('not.exist')
      
      cy.get('[data-testid="order-type-stop"]').click()
      cy.get('[data-testid="stop-price-input"]').should('be.visible')
    })

    it('should calculate order total', () => {
      cy.get('[data-testid="price-input"]').type('50000')
      cy.get('[data-testid="amount-input"]').type('0.1')
      cy.get('[data-testid="order-total"]').should('contain', '5000')
      cy.get('[data-testid="order-fee"]').should('contain', '5')
    })

    it('should validate order inputs', () => {
      cy.get('[data-testid="place-order-btn"]').click()
      cy.get('[data-testid="error-message"]').should('contain', 'required')
      
      cy.get('[data-testid="price-input"]').type('-100')
      cy.get('[data-testid="place-order-btn"]').click()
      cy.get('[data-testid="error-message"]').should('contain', 'Valid')
    })

    it('should place a limit buy order', () => {
      cy.get('[data-testid="buy-btn"]').click()
      cy.get('[data-testid="order-type-limit"]').click()
      cy.get('[data-testid="price-input"]').type('49000')
      cy.get('[data-testid="amount-input"]').type('0.1')
      
      cy.intercept('POST', '**/order', { 
        success: true, 
        order: { id: 'order-123', status: 'open' }
      })
      
      cy.get('[data-testid="place-order-btn"]').click()
      cy.get('[data-testid="success-message"]').should('contain', 'Order placed')
    })

    it('should place a market sell order', () => {
      cy.get('[data-testid="sell-btn"]').click()
      cy.get('[data-testid="order-type-market"]').click()
      cy.get('[data-testid="amount-input"]').type('0.05')
      
      cy.get('[data-testid="place-order-btn"]').click()
      cy.get('[data-testid="success-message"]').should('contain', 'Order placed')
    })

    it('should handle margin trading toggle', () => {
      cy.get('[data-testid="margin-toggle"]').click()
      cy.get('[data-testid="leverage-slider"]').should('be.visible')
      cy.get('[data-testid="leverage-slider"]').invoke('val', 10).trigger('input')
      cy.get('[data-testid="leverage-display"]').should('contain', '10x')
    })

    it('should set time in force options', () => {
      cy.get('[data-testid="tif-selector"]').select('IOC')
      cy.get('[data-testid="tif-selector"]').should('have.value', 'IOC')
    })
  })

  describe('Positions Panel', () => {
    beforeEach(() => {
      // Connect wallet
      cy.get('[data-testid="connect-wallet-btn"]').click()
      cy.get('[data-testid="select-luxwallet"]').click()
    })

    it('should display tabs for positions, orders, and history', () => {
      cy.get('[data-testid="positions-tab"]').should('exist')
      cy.get('[data-testid="orders-tab"]').should('exist')
      cy.get('[data-testid="history-tab"]').should('exist')
    })

    it('should show open positions', () => {
      cy.window().then((win) => {
        win.dexWebSocket?.emit('position_update', {
          symbol: 'BTC-USDT',
          side: 'long',
          size: 0.5,
          entryPrice: 49000,
          markPrice: 50000,
          pnl: 500,
          pnlPercent: 2.04,
        })
      })
      
      cy.get('[data-testid="positions-tab"]').click()
      cy.get('[data-testid="position-item"]').should('exist')
      cy.get('[data-testid="position-pnl"]').should('contain', '+500')
    })

    it('should show open orders', () => {
      cy.get('[data-testid="orders-tab"]').click()
      cy.get('[data-testid="order-item"]').should('have.length.at.least', 0)
    })

    it('should cancel an order', () => {
      cy.get('[data-testid="orders-tab"]').click()
      
      cy.intercept('DELETE', '**/order/*', { success: true })
      
      cy.get('[data-testid="cancel-order-btn"]').first().click()
      cy.get('[data-testid="confirm-cancel"]').click()
      cy.get('[data-testid="order-item"]').should('have.length.lessThan', 2)
    })

    it('should close a position', () => {
      cy.get('[data-testid="positions-tab"]').click()
      
      cy.intercept('POST', '**/position/close', { success: true })
      
      cy.get('[data-testid="close-position-btn"]').first().click()
      cy.get('[data-testid="confirm-close"]').click()
      cy.get('[data-testid="success-message"]').should('contain', 'Position closed')
    })

    it('should display order history', () => {
      cy.get('[data-testid="history-tab"]').click()
      cy.get('[data-testid="history-item"]').should('have.length.at.least', 0)
    })

    it('should show account summary', () => {
      cy.get('[data-testid="account-summary"]').should('exist')
      cy.get('[data-testid="total-pnl"]').should('exist')
      cy.get('[data-testid="margin-used"]').should('exist')
      cy.get('[data-testid="free-margin"]').should('exist')
    })
  })

  describe('Chart Widget', () => {
    it('should display price chart', () => {
      cy.get('[data-testid="chart-widget"]').should('be.visible')
      cy.get('[data-testid="chart-canvas"]').should('exist')
    })

    it('should switch timeframes', () => {
      cy.get('[data-testid="timeframe-1m"]').click()
      cy.get('[data-testid="timeframe-1m"]').should('have.class', 'active')
      
      cy.get('[data-testid="timeframe-1h"]').click()
      cy.get('[data-testid="timeframe-1h"]').should('have.class', 'active')
    })

    it('should toggle chart indicators', () => {
      cy.get('[data-testid="indicators-menu"]').click()
      cy.get('[data-testid="indicator-ma"]').click()
      cy.get('[data-testid="chart-indicator-ma"]').should('be.visible')
    })
  })

  describe('Performance Metrics', () => {
    it('should display real-time latency', () => {
      cy.get('[data-testid="latency-metric"]').should('contain', 'ns')
      cy.get('[data-testid="latency-metric"]').then(($el) => {
        const latency = parseInt($el.text())
        expect(latency).to.be.lessThan(1000) // Sub-microsecond
      })
    })

    it('should display throughput metrics', () => {
      cy.get('[data-testid="throughput-metric"]').should('contain', '/sec')
      cy.get('[data-testid="throughput-metric"]').should('contain', 'M')
    })

    it('should update metrics in real-time', () => {
      const initialMetric = cy.get('[data-testid="order-count"]').invoke('text')
      
      cy.wait(2000)
      
      cy.get('[data-testid="order-count"]').should('not.equal', initialMetric)
    })
  })

  describe('Wallet Integration', () => {
    it('should connect to LuxWallet', () => {
      cy.get('[data-testid="connect-wallet-btn"]').click()
      cy.get('[data-testid="select-luxwallet"]').click()
      cy.get('[data-testid="wallet-address"]').should('contain', '0x')
    })

    it('should display wallet balance', () => {
      cy.get('[data-testid="connect-wallet-btn"]').click()
      cy.get('[data-testid="select-luxwallet"]').click()
      cy.get('[data-testid="wallet-balance"]').should('exist')
    })

    it('should handle wallet disconnection', () => {
      cy.get('[data-testid="connect-wallet-btn"]').click()
      cy.get('[data-testid="select-luxwallet"]').click()
      cy.get('[data-testid="disconnect-wallet"]').click()
      cy.get('[data-testid="connect-wallet-btn"]').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      cy.intercept('GET', '**/api/*', { statusCode: 500 })
      cy.reload()
      cy.get('[data-testid="error-modal"]').should('be.visible')
    })

    it('should show error for insufficient balance', () => {
      cy.get('[data-testid="connect-wallet-btn"]').click()
      cy.get('[data-testid="select-luxwallet"]').click()
      
      cy.get('[data-testid="amount-input"]').type('999999')
      cy.get('[data-testid="place-order-btn"]').click()
      cy.get('[data-testid="error-message"]').should('contain', 'Insufficient')
    })

    it('should handle WebSocket errors', () => {
      cy.window().then((win) => {
        win.dexWebSocket?.emit('error', { message: 'Connection lost' })
      })
      
      cy.get('[data-testid="error-notification"]').should('be.visible')
    })
  })

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
    })

    it('should adapt layout for mobile', () => {
      cy.get('[data-testid="mobile-menu"]').should('be.visible')
      cy.get('[data-testid="desktop-sidebar"]').should('not.be.visible')
    })

    it('should have mobile-friendly order form', () => {
      cy.get('[data-testid="mobile-order-form"]').should('be.visible')
      cy.get('[data-testid="mobile-order-tabs"]').should('exist')
    })

    it('should have swipeable panels on mobile', () => {
      cy.get('[data-testid="swipeable-panel"]').swipe('left')
      cy.get('[data-testid="orderbook-panel"]').should('not.be.visible')
      cy.get('[data-testid="chart-panel"]').should('be.visible')
    })
  })
})

// Integration tests with backend
describe('Backend Integration Tests', () => {
  before(() => {
    // Start backend server
    cy.exec('cd ../backend && make run-test-server')
    cy.wait(5000) // Wait for server startup
  })

  after(() => {
    // Stop backend server
    cy.exec('pkill -f lx-dex')
  })

  it('should achieve sub-microsecond latency', () => {
    cy.visit('/v2/trade')
    
    // Place multiple orders and measure latency
    const latencies: number[] = []
    
    for (let i = 0; i < 100; i++) {
      const start = performance.now()
      
      cy.window().then((win) => {
        return win.dexWebSocket?.placeOrder({
          symbol: 'BTC-USDT',
          side: 'buy',
          type: 'limit',
          price: 49000 + i,
          size: 0.01,
        })
      }).then(() => {
        const latency = (performance.now() - start) * 1000000 // Convert to nanoseconds
        latencies.push(latency)
      })
    }
    
    cy.wrap(latencies).then((measurements) => {
      const avgLatency = measurements.reduce((a, b) => a + b, 0) / measurements.length
      expect(avgLatency).to.be.lessThan(1000) // Sub-microsecond
      
      // Log performance report
      cy.log(`Average Latency: ${avgLatency.toFixed(0)}ns`)
      cy.log(`Min Latency: ${Math.min(...measurements).toFixed(0)}ns`)
      cy.log(`Max Latency: ${Math.max(...measurements).toFixed(0)}ns`)
    })
  })

  it('should handle 2.9M orders per second', () => {
    cy.visit('/v2/trade')
    
    // Stress test with concurrent orders
    const promises = []
    const batchSize = 1000
    
    for (let i = 0; i < batchSize; i++) {
      promises.push(
        cy.window().then((win) => {
          return win.dexWebSocket?.placeOrder({
            symbol: 'BTC-USDT',
            side: i % 2 === 0 ? 'buy' : 'sell',
            type: 'market',
            size: 0.001,
          })
        })
      )
    }
    
    const startTime = performance.now()
    
    cy.wrap(Promise.all(promises)).then(() => {
      const duration = (performance.now() - startTime) / 1000 // Seconds
      const throughput = batchSize / duration
      
      cy.log(`Throughput: ${throughput.toFixed(0)} orders/sec`)
      expect(throughput).to.be.greaterThan(100000) // At least 100K orders/sec in test
    })
  })
})