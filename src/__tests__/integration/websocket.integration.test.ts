import { dexWebSocket } from '../../services/websocket'
import { luxDEXClient } from '../../config/luxjs'

describe('WebSocket Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test WebSocket server
    await dexWebSocket.connect()
  })

  afterAll(() => {
    dexWebSocket.disconnect()
  })

  describe('Connection Management', () => {
    test('should connect to WebSocket server', async () => {
      expect(dexWebSocket.isConnected()).toBe(true)
    })

    test('should authenticate with valid credentials', async () => {
      const apiKey = 'test-api-key'
      const apiSecret = 'test-api-secret'
      
      await dexWebSocket.connect(apiKey, apiSecret)
      
      // Wait for authentication
      await new Promise(resolve => {
        dexWebSocket.once('authenticated', resolve)
      })
      
      expect(dexWebSocket.isAuthenticated()).toBe(true)
    })

    test('should handle reconnection after disconnect', async () => {
      dexWebSocket.disconnect()
      expect(dexWebSocket.isConnected()).toBe(false)
      
      await dexWebSocket.connect()
      expect(dexWebSocket.isConnected()).toBe(true)
    })
  })

  describe('Market Data Subscriptions', () => {
    test('should receive orderbook updates', (done) => {
      dexWebSocket.subscribe('orderbook', ['BTC-USDT'])
      
      dexWebSocket.once('orderbook', (data) => {
        expect(data).toHaveProperty('symbol', 'BTC-USDT')
        expect(data).toHaveProperty('bids')
        expect(data).toHaveProperty('asks')
        expect(data).toHaveProperty('timestamp')
        expect(data).toHaveProperty('sequence')
        done()
      })
    })

    test('should receive trade updates', (done) => {
      dexWebSocket.subscribe('trades', ['BTC-USDT'])
      
      dexWebSocket.once('trades', (trades) => {
        expect(Array.isArray(trades)).toBe(true)
        if (trades.length > 0) {
          const trade = trades[0]
          expect(trade).toHaveProperty('id')
          expect(trade).toHaveProperty('symbol')
          expect(trade).toHaveProperty('price')
          expect(trade).toHaveProperty('size')
          expect(trade).toHaveProperty('side')
          expect(trade).toHaveProperty('timestamp')
        }
        done()
      })
    })

    test('should receive ticker updates', (done) => {
      dexWebSocket.subscribe('ticker', ['BTC-USDT'])
      
      dexWebSocket.once('ticker', (ticker) => {
        expect(ticker).toHaveProperty('symbol', 'BTC-USDT')
        expect(ticker).toHaveProperty('lastPrice')
        expect(ticker).toHaveProperty('volume24h')
        expect(ticker).toHaveProperty('high24h')
        expect(ticker).toHaveProperty('low24h')
        expect(ticker).toHaveProperty('change24h')
        expect(ticker).toHaveProperty('changePercent24h')
        done()
      })
    })

    test('should unsubscribe from channels', () => {
      dexWebSocket.subscribe('orderbook', ['ETH-USDT'])
      dexWebSocket.unsubscribe('orderbook', ['ETH-USDT'])
      
      // Should not receive updates for unsubscribed channel
      const handler = jest.fn()
      dexWebSocket.on('orderbook', handler)
      
      setTimeout(() => {
        expect(handler).not.toHaveBeenCalledWith(
          expect.objectContaining({ symbol: 'ETH-USDT' })
        )
      }, 1000)
    })
  })

  describe('Order Management', () => {
    beforeEach(async () => {
      // Ensure authenticated
      if (!dexWebSocket.isAuthenticated()) {
        await dexWebSocket.connect('test-api-key', 'test-api-secret')
        await new Promise(resolve => {
          dexWebSocket.once('authenticated', resolve)
        })
      }
    })

    test('should place a limit order', async () => {
      const order = await dexWebSocket.placeOrder({
        symbol: 'BTC-USDT',
        side: 'buy',
        type: 'limit',
        price: 49000,
        size: 0.1,
      })

      expect(order).toHaveProperty('id')
      expect(order.status).toBe('open')
      expect(order.symbol).toBe('BTC-USDT')
      expect(order.side).toBe('buy')
      expect(order.type).toBe('limit')
      expect(order.price).toBe(49000)
      expect(order.size).toBe(0.1)
    })

    test('should place a market order', async () => {
      const order = await dexWebSocket.placeOrder({
        symbol: 'BTC-USDT',
        side: 'sell',
        type: 'market',
        size: 0.05,
      })

      expect(order).toHaveProperty('id')
      expect(order.type).toBe('market')
      expect(order.size).toBe(0.05)
    })

    test('should cancel an order', async () => {
      // First place an order
      const order = await dexWebSocket.placeOrder({
        symbol: 'BTC-USDT',
        side: 'buy',
        type: 'limit',
        price: 48000,
        size: 0.1,
      })

      // Then cancel it
      await expect(dexWebSocket.cancelOrder(order.id)).resolves.toBeUndefined()
    })

    test('should get open orders', async () => {
      const orders = await dexWebSocket.getOpenOrders('BTC-USDT')
      
      expect(Array.isArray(orders)).toBe(true)
      orders.forEach(order => {
        expect(order).toHaveProperty('id')
        expect(order).toHaveProperty('symbol')
        expect(order).toHaveProperty('status')
        expect(order.status).toBe('open')
      })
    })

    test('should handle order updates', (done) => {
      dexWebSocket.once('order_update', (order) => {
        expect(order).toHaveProperty('id')
        expect(order).toHaveProperty('status')
        done()
      })

      // Place an order to trigger update
      dexWebSocket.placeOrder({
        symbol: 'BTC-USDT',
        side: 'buy',
        type: 'limit',
        price: 49000,
        size: 0.1,
      })
    })
  })

  describe('Position Management', () => {
    beforeEach(async () => {
      // Ensure authenticated
      if (!dexWebSocket.isAuthenticated()) {
        await dexWebSocket.connect('test-api-key', 'test-api-secret')
        await new Promise(resolve => {
          dexWebSocket.once('authenticated', resolve)
        })
      }
    })

    test('should get positions', async () => {
      const positions = await dexWebSocket.getPositions('BTC-USDT')
      
      expect(Array.isArray(positions)).toBe(true)
      positions.forEach(position => {
        expect(position).toHaveProperty('symbol')
        expect(position).toHaveProperty('side')
        expect(position).toHaveProperty('size')
        expect(position).toHaveProperty('entryPrice')
        expect(position).toHaveProperty('markPrice')
        expect(position).toHaveProperty('pnl')
        expect(position).toHaveProperty('margin')
        expect(position).toHaveProperty('leverage')
      })
    })

    test('should handle position updates', (done) => {
      dexWebSocket.once('position_update', (position) => {
        expect(position).toHaveProperty('symbol')
        expect(position).toHaveProperty('pnl')
        expect(position).toHaveProperty('markPrice')
        done()
      })
    })
  })

  describe('Error Handling', () => {
    test('should handle connection errors', async () => {
      dexWebSocket.disconnect()
      
      await expect(
        dexWebSocket.placeOrder({
          symbol: 'BTC-USDT',
          side: 'buy',
          type: 'limit',
          price: 50000,
          size: 0.1,
        })
      ).rejects.toThrow('WebSocket not connected')
    })

    test('should handle authentication errors', async () => {
      await dexWebSocket.connect('invalid-key', 'invalid-secret')
      
      await new Promise(resolve => {
        dexWebSocket.once('auth_error', resolve)
      })
      
      expect(dexWebSocket.isAuthenticated()).toBe(false)
    })

    test('should handle order placement errors', async () => {
      await dexWebSocket.connect('test-api-key', 'test-api-secret')
      
      // Invalid order parameters
      await expect(
        dexWebSocket.placeOrder({
          symbol: 'INVALID-PAIR',
          side: 'buy',
          type: 'limit',
          price: -100, // Invalid price
          size: 0,
        })
      ).rejects.toThrow()
    })

    test('should handle timeout errors', async () => {
      // Mock slow response
      jest.setTimeout(10000)
      
      await expect(
        dexWebSocket.placeOrder({
          symbol: 'BTC-USDT',
          side: 'buy',
          type: 'limit',
          price: 50000,
          size: 999999, // Trigger timeout
        })
      ).rejects.toThrow('timeout')
    })
  })

  describe('Performance Metrics', () => {
    test('should measure order latency', async () => {
      const latencies: number[] = []
      
      for (let i = 0; i < 100; i++) {
        const start = performance.now()
        
        await dexWebSocket.placeOrder({
          symbol: 'BTC-USDT',
          side: i % 2 === 0 ? 'buy' : 'sell',
          type: 'market',
          size: 0.001,
        })
        
        const latency = performance.now() - start
        latencies.push(latency)
      }
      
      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length
      const minLatency = Math.min(...latencies)
      const maxLatency = Math.max(...latencies)
      
      console.log(`Average Latency: ${avgLatency.toFixed(2)}ms`)
      console.log(`Min Latency: ${minLatency.toFixed(2)}ms`)
      console.log(`Max Latency: ${maxLatency.toFixed(2)}ms`)
      
      // Should achieve low latency
      expect(avgLatency).toBeLessThan(10) // Less than 10ms average
      expect(minLatency).toBeLessThan(5)  // Min less than 5ms
    })

    test('should handle high throughput', async () => {
      const orders = []
      const numOrders = 1000
      
      const start = performance.now()
      
      for (let i = 0; i < numOrders; i++) {
        orders.push(
          dexWebSocket.placeOrder({
            symbol: 'BTC-USDT',
            side: i % 2 === 0 ? 'buy' : 'sell',
            type: 'market',
            size: 0.001,
          })
        )
      }
      
      await Promise.all(orders)
      
      const duration = (performance.now() - start) / 1000 // Seconds
      const throughput = numOrders / duration
      
      console.log(`Throughput: ${throughput.toFixed(0)} orders/sec`)
      
      // Should handle at least 100 orders/sec
      expect(throughput).toBeGreaterThan(100)
    })
  })
})

describe('LuxJS Integration Tests', () => {
  describe('X-Chain DEX Operations', () => {
    test('should create order on X-Chain', async () => {
      const result = await luxDEXClient.createOrder(
        'BTC-USDT',
        'buy',
        50000,
        0.1,
        'X-lux1testaddress'
      )

      expect(result.success).toBe(true)
      expect(result.txID).toBeDefined()
      expect(result.order).toBeDefined()
    })

    test('should cancel order on X-Chain', async () => {
      const result = await luxDEXClient.cancelOrder(
        'order-123',
        'X-lux1testaddress'
      )

      expect(result.success).toBe(true)
      expect(result.txID).toBeDefined()
    })

    test('should get trading balances', async () => {
      const result = await luxDEXClient.getTradingBalances(
        'X-lux1testaddress'
      )

      expect(result.success).toBe(true)
      expect(result.balances).toBeDefined()
    })
  })

  describe('Cross-Chain Bridge', () => {
    test('should bridge assets from C-Chain to X-Chain', async () => {
      const result = await luxDEXClient.bridgeToXChain(
        'USDT',
        { toString: () => '1000000000' } as any, // 1000 USDT
        'C-0xtestaddress',
        'X-lux1testaddress'
      )

      expect(result.success).toBe(true)
      expect(result.exportTxID).toBeDefined()
      expect(result.importTxID).toBeDefined()
    })

    test('should bridge assets from X-Chain to C-Chain', async () => {
      const result = await luxDEXClient.bridgeToCChain(
        'USDT',
        { toString: () => '1000000000' } as any,
        'X-lux1testaddress',
        'C-0xtestaddress'
      )

      expect(result.success).toBe(true)
      expect(result.exportTxID).toBeDefined()
      expect(result.importTxID).toBeDefined()
    })
  })
})