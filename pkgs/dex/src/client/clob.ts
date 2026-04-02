/**
 * CLOB Client
 * WebSocket client for lux/dex order book
 */
import type {
  ICLOBClient,
  OrderRequest,
  Order,
  OrderBook,
  Trade,
  Position,
  Balance
} from './types'

interface CLOBClientOptions {
  url: string
  debug?: boolean
  reconnect?: boolean
  reconnectInterval?: number
}

type MessageHandler = (data: any) => void

/**
 * Central Limit Order Book client
 * Connects to lux/dex WebSocket server
 */
export class CLOBClient implements ICLOBClient {
  private ws: WebSocket | null = null
  private url: string
  private debug: boolean
  private reconnect: boolean
  private reconnectInterval: number
  private connected: boolean = false
  private authenticated: boolean = false
  private requestId: number = 0
  private pendingRequests: Map<number, { resolve: Function; reject: Function }> = new Map()
  private subscriptions: Map<string, Set<MessageHandler>> = new Map()

  constructor(options: CLOBClientOptions) {
    this.url = options.url
    this.debug = options.debug ?? false
    this.reconnect = options.reconnect ?? true
    this.reconnectInterval = options.reconnectInterval ?? 5000
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log('[CLOBClient]', ...args)
    }
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          this.connected = true
          this.log('Connected to', this.url)
          resolve()
        }

        this.ws.onclose = () => {
          this.connected = false
          this.authenticated = false
          this.log('Disconnected')

          if (this.reconnect) {
            setTimeout(() => this.connect(), this.reconnectInterval)
          }
        }

        this.ws.onerror = (error) => {
          this.log('Error:', error)
          reject(error)
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async disconnect(): Promise<void> {
    this.reconnect = false
    this.ws?.close()
    this.ws = null
    this.connected = false
    this.authenticated = false
  }

  isConnected(): boolean {
    return this.connected
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data)
      this.log('Received:', message)

      // Handle response to request
      if (message.id && this.pendingRequests.has(message.id)) {
        const { resolve, reject } = this.pendingRequests.get(message.id)!
        this.pendingRequests.delete(message.id)

        if (message.error) {
          reject(new Error(message.error))
        } else {
          resolve(message.result || message)
        }
        return
      }

      // Handle subscription updates
      const type = message.type || message.channel
      if (type && this.subscriptions.has(type)) {
        this.subscriptions.get(type)!.forEach(handler => handler(message))
      }
    } catch (error) {
      this.log('Parse error:', error)
    }
  }

  private async request<T>(method: string, params?: any): Promise<T> {
    if (!this.connected) {
      throw new Error('Not connected')
    }

    const id = ++this.requestId
    const message = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    }

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject })
      this.ws!.send(JSON.stringify(message))
      this.log('Sent:', message)

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id)
          reject(new Error('Request timeout'))
        }
      }, 30000)
    })
  }

  async authenticate(apiKey: string, apiSecret: string): Promise<void> {
    await this.request('authenticate', { apiKey, apiSecret })
    this.authenticated = true
  }

  async placeOrder(order: OrderRequest): Promise<Order> {
    return this.request('placeOrder', order)
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.request('cancelOrder', { orderId })
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.request('getOrder', { orderId })
  }

  async getOrders(symbol?: string): Promise<Order[]> {
    return this.request('getOrders', { symbol })
  }

  async getOrderBook(symbol: string, depth: number = 20): Promise<OrderBook> {
    return this.request('getOrderBook', { symbol, depth })
  }

  async getTrades(symbol: string, limit: number = 100): Promise<Trade[]> {
    return this.request('getTrades', { symbol, limit })
  }

  async getPositions(): Promise<Position[]> {
    return this.request('getPositions', {})
  }

  async getBalances(): Promise<Balance[]> {
    return this.request('getBalances', {})
  }

  subscribeOrderBook(symbol: string, callback: (book: OrderBook) => void): () => void {
    const channel = `orderbook:${symbol}`

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set())
      this.request('subscribe', { channel: 'orderbook', symbol }).catch(console.error)
    }

    this.subscriptions.get(channel)!.add(callback)

    return () => {
      this.subscriptions.get(channel)?.delete(callback)
      if (this.subscriptions.get(channel)?.size === 0) {
        this.subscriptions.delete(channel)
        this.request('unsubscribe', { channel: 'orderbook', symbol }).catch(console.error)
      }
    }
  }

  subscribeTrades(symbol: string, callback: (trade: Trade) => void): () => void {
    const channel = `trades:${symbol}`

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set())
      this.request('subscribe', { channel: 'trades', symbol }).catch(console.error)
    }

    this.subscriptions.get(channel)!.add(callback)

    return () => {
      this.subscriptions.get(channel)?.delete(callback)
      if (this.subscriptions.get(channel)?.size === 0) {
        this.subscriptions.delete(channel)
        this.request('unsubscribe', { channel: 'trades', symbol }).catch(console.error)
      }
    }
  }

  subscribeOrders(callback: (order: Order) => void): () => void {
    const channel = 'orders'

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set())
      this.request('subscribe', { channel: 'orders' }).catch(console.error)
    }

    this.subscriptions.get(channel)!.add(callback)

    return () => {
      this.subscriptions.get(channel)?.delete(callback)
      if (this.subscriptions.get(channel)?.size === 0) {
        this.subscriptions.delete(channel)
        this.request('unsubscribe', { channel: 'orders' }).catch(console.error)
      }
    }
  }
}

/**
 * Create a CLOB client
 */
export function createCLOBClient(url: string, debug: boolean = false): ICLOBClient {
  return new CLOBClient({ url, debug })
}
