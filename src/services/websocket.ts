import { io, Socket } from 'socket.io-client'
import { EventEmitter } from 'events'

export interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop'
  price: number
  size: number
  filled: number
  status: 'pending' | 'open' | 'filled' | 'cancelled'
  timestamp: number
}

export interface Trade {
  id: string
  symbol: string
  price: number
  size: number
  side: 'buy' | 'sell'
  timestamp: number
  maker: string
  taker: string
}

export interface OrderBookLevel {
  price: number
  size: number
  orders: number
}

export interface OrderBook {
  symbol: string
  bids: OrderBookLevel[]
  asks: OrderBookLevel[]
  timestamp: number
  sequence: number
}

export interface MarketData {
  symbol: string
  lastPrice: number
  volume24h: number
  high24h: number
  low24h: number
  change24h: number
  changePercent24h: number
  bid: number
  ask: number
  timestamp: number
}

export interface Position {
  symbol: string
  side: 'long' | 'short'
  size: number
  entryPrice: number
  markPrice: number
  pnl: number
  pnlPercent: number
  margin: number
  leverage: number
  liquidationPrice: number
}

class DEXWebSocketService extends EventEmitter {
  private socket: Socket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private subscriptions = new Set<string>()
  private authenticated = false
  private apiKey?: string
  private apiSecret?: string

  constructor(url: string = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081') {
    super()
    this.url = url
  }

  // Connect to WebSocket server
  connect(apiKey?: string, apiSecret?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve()
        return
      }

      this.apiKey = apiKey
      this.apiSecret = apiSecret

      this.socket = io(this.url, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      })

      this.setupEventHandlers()

      this.socket.on('connect', () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.emit('connected')
        
        if (this.apiKey && this.apiSecret) {
          this.authenticate()
        }
        
        // Resubscribe to previous subscriptions
        this.subscriptions.forEach(channel => {
          this.socket?.emit('subscribe', { channel })
        })
        
        resolve()
      })

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error)
        this.reconnectAttempts++
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Failed to connect to WebSocket'))
        }
      })
    })
  }

  // Authenticate for private channels
  private authenticate(): void {
    if (!this.socket || !this.apiKey || !this.apiSecret) return

    const timestamp = Date.now()
    const signature = this.generateSignature(timestamp)

    this.socket.emit('auth', {
      apiKey: this.apiKey,
      signature,
      timestamp,
    })

    this.socket.once('auth_success', () => {
      this.authenticated = true
      this.emit('authenticated')
      console.log('WebSocket authenticated')
    })

    this.socket.once('auth_error', (error) => {
      console.error('WebSocket authentication failed:', error)
      this.emit('auth_error', error)
    })
  }

  // Generate authentication signature
  private generateSignature(timestamp: number): string {
    // In production, use proper HMAC signing
    // This is a placeholder
    return `${this.apiSecret}_${timestamp}`
  }

  // Setup WebSocket event handlers
  private setupEventHandlers(): void {
    if (!this.socket) return

    // Market data events
    this.socket.on('orderbook', (data: OrderBook) => {
      this.emit('orderbook', data)
    })

    this.socket.on('orderbook_update', (data: Partial<OrderBook>) => {
      this.emit('orderbook_update', data)
    })

    this.socket.on('trades', (data: Trade[]) => {
      this.emit('trades', data)
    })

    this.socket.on('ticker', (data: MarketData) => {
      this.emit('ticker', data)
    })

    this.socket.on('candles', (data: any) => {
      this.emit('candles', data)
    })

    // Private events (requires authentication)
    this.socket.on('order_update', (data: Order) => {
      this.emit('order_update', data)
    })

    this.socket.on('position_update', (data: Position) => {
      this.emit('position_update', data)
    })

    this.socket.on('balance_update', (data: any) => {
      this.emit('balance_update', data)
    })

    this.socket.on('fill', (data: Trade) => {
      this.emit('fill', data)
    })

    // Error handling
    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error)
      this.emit('error', error)
    })

    this.socket.on('disconnect', (reason: string) => {
      console.log('WebSocket disconnected:', reason)
      this.authenticated = false
      this.emit('disconnected', reason)
    })
  }

  // Subscribe to market data channels
  subscribe(channel: string, symbols?: string[]): void {
    if (!this.socket?.connected) {
      console.error('WebSocket not connected')
      return
    }

    const subscription = {
      channel,
      symbols: symbols || [],
    }

    this.socket.emit('subscribe', subscription)
    this.subscriptions.add(JSON.stringify(subscription))
  }

  // Unsubscribe from channels
  unsubscribe(channel: string, symbols?: string[]): void {
    if (!this.socket?.connected) return

    const subscription = {
      channel,
      symbols: symbols || [],
    }

    this.socket.emit('unsubscribe', subscription)
    this.subscriptions.delete(JSON.stringify(subscription))
  }

  // Place an order
  placeOrder(order: Omit<Order, 'id' | 'filled' | 'status' | 'timestamp'>): Promise<Order> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('WebSocket not connected'))
        return
      }

      if (!this.authenticated) {
        reject(new Error('Not authenticated'))
        return
      }

      const requestId = `order_${Date.now()}`
      
      this.socket.emit('place_order', {
        ...order,
        request_id: requestId,
      })

      this.socket.once(`order_response_${requestId}`, (response: any) => {
        if (response.success) {
          resolve(response.order)
        } else {
          reject(new Error(response.error || 'Order placement failed'))
        }
      })

      // Timeout after 5 seconds
      setTimeout(() => {
        this.socket?.off(`order_response_${requestId}`)
        reject(new Error('Order placement timeout'))
      }, 5000)
    })
  }

  // Cancel an order
  cancelOrder(orderId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('WebSocket not connected'))
        return
      }

      if (!this.authenticated) {
        reject(new Error('Not authenticated'))
        return
      }

      const requestId = `cancel_${Date.now()}`
      
      this.socket.emit('cancel_order', {
        order_id: orderId,
        request_id: requestId,
      })

      this.socket.once(`cancel_response_${requestId}`, (response: any) => {
        if (response.success) {
          resolve()
        } else {
          reject(new Error(response.error || 'Order cancellation failed'))
        }
      })

      // Timeout after 5 seconds
      setTimeout(() => {
        this.socket?.off(`cancel_response_${requestId}`)
        reject(new Error('Order cancellation timeout'))
      }, 5000)
    })
  }

  // Get open orders
  getOpenOrders(symbol?: string): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('WebSocket not connected'))
        return
      }

      if (!this.authenticated) {
        reject(new Error('Not authenticated'))
        return
      }

      const requestId = `orders_${Date.now()}`
      
      this.socket.emit('get_orders', {
        symbol,
        status: 'open',
        request_id: requestId,
      })

      this.socket.once(`orders_response_${requestId}`, (response: any) => {
        if (response.success) {
          resolve(response.orders)
        } else {
          reject(new Error(response.error || 'Failed to get orders'))
        }
      })

      // Timeout after 5 seconds
      setTimeout(() => {
        this.socket?.off(`orders_response_${requestId}`)
        reject(new Error('Get orders timeout'))
      }, 5000)
    })
  }

  // Get positions
  getPositions(symbol?: string): Promise<Position[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('WebSocket not connected'))
        return
      }

      if (!this.authenticated) {
        reject(new Error('Not authenticated'))
        return
      }

      const requestId = `positions_${Date.now()}`
      
      this.socket.emit('get_positions', {
        symbol,
        request_id: requestId,
      })

      this.socket.once(`positions_response_${requestId}`, (response: any) => {
        if (response.success) {
          resolve(response.positions)
        } else {
          reject(new Error(response.error || 'Failed to get positions'))
        }
      })

      // Timeout after 5 seconds
      setTimeout(() => {
        this.socket?.off(`positions_response_${requestId}`)
        reject(new Error('Get positions timeout'))
      }, 5000)
    })
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.socket) {
      this.subscriptions.clear()
      this.authenticated = false
      this.socket.disconnect()
      this.socket = null
      this.emit('disconnected', 'manual')
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.authenticated
  }
}

// Export singleton instance
export const dexWebSocket = new DEXWebSocketService()

// Export types
export type { DEXWebSocketService }