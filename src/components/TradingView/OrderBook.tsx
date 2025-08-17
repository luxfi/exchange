import React, { useEffect, useState, useMemo } from 'react'
import { formatUnits } from 'viem'
import { dexWebSocket, OrderBook as OrderBookType, OrderBookLevel } from '../../services/websocket'

interface OrderBookProps {
  symbol: string
  depth?: number
  grouping?: number
}

export const OrderBook: React.FC<OrderBookProps> = ({ 
  symbol, 
  depth = 20,
  grouping = 0.01
}) => {
  const [orderBook, setOrderBook] = useState<OrderBookType | null>(null)
  const [spread, setSpread] = useState<number>(0)
  const [spreadPercent, setSpreadPercent] = useState<number>(0)

  useEffect(() => {
    // Subscribe to orderbook updates
    dexWebSocket.subscribe('orderbook', [symbol])

    // Handle full orderbook snapshots
    const handleOrderBook = (data: OrderBookType) => {
      if (data.symbol === symbol) {
        setOrderBook(data)
        
        // Calculate spread
        if (data.bids.length > 0 && data.asks.length > 0) {
          const bestBid = data.bids[0].price
          const bestAsk = data.asks[0].price
          const spreadValue = bestAsk - bestBid
          setSpread(spreadValue)
          setSpreadPercent((spreadValue / bestAsk) * 100)
        }
      }
    }

    // Handle incremental updates
    const handleOrderBookUpdate = (data: Partial<OrderBookType>) => {
      if (data.symbol === symbol) {
        setOrderBook(prev => {
          if (!prev) return null
          
          return {
            ...prev,
            ...data,
            bids: data.bids || prev.bids,
            asks: data.asks || prev.asks,
          }
        })
      }
    }

    dexWebSocket.on('orderbook', handleOrderBook)
    dexWebSocket.on('orderbook_update', handleOrderBookUpdate)

    return () => {
      dexWebSocket.off('orderbook', handleOrderBook)
      dexWebSocket.off('orderbook_update', handleOrderBookUpdate)
      dexWebSocket.unsubscribe('orderbook', [symbol])
    }
  }, [symbol])

  // Group orderbook levels by price
  const groupedOrderBook = useMemo(() => {
    if (!orderBook || grouping === 0) return orderBook

    const groupPrice = (price: number) => {
      return Math.floor(price / grouping) * grouping
    }

    const groupLevels = (levels: OrderBookLevel[]) => {
      const grouped = new Map<number, OrderBookLevel>()
      
      levels.forEach(level => {
        const price = groupPrice(level.price)
        const existing = grouped.get(price)
        
        if (existing) {
          existing.size += level.size
          existing.orders += level.orders
        } else {
          grouped.set(price, { ...level, price })
        }
      })
      
      return Array.from(grouped.values())
    }

    return {
      ...orderBook,
      bids: groupLevels(orderBook.bids).sort((a, b) => b.price - a.price),
      asks: groupLevels(orderBook.asks).sort((a, b) => a.price - b.price),
    }
  }, [orderBook, grouping])

  // Calculate max size for depth visualization
  const maxSize = useMemo(() => {
    if (!groupedOrderBook) return 0
    
    const allSizes = [
      ...groupedOrderBook.bids.slice(0, depth).map(b => b.size),
      ...groupedOrderBook.asks.slice(0, depth).map(a => a.size),
    ]
    
    return Math.max(...allSizes)
  }, [groupedOrderBook, depth])

  if (!groupedOrderBook) {
    return (
      <div className="order-book loading">
        <div className="text-center py-8">Loading order book...</div>
      </div>
    )
  }

  return (
    <div className="order-book bg-gray-900 text-white rounded-lg p-4">
      <div className="header mb-4">
        <h3 className="text-lg font-bold">{symbol} Order Book</h3>
        <div className="spread-info text-sm text-gray-400">
          Spread: {spread.toFixed(2)} ({spreadPercent.toFixed(3)}%)
        </div>
      </div>

      <div className="order-book-header grid grid-cols-3 text-xs text-gray-500 mb-2">
        <div>Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>

      <div className="asks mb-2">
        {groupedOrderBook.asks.slice(0, depth).reverse().map((ask, index) => {
          const total = groupedOrderBook.asks
            .slice(0, groupedOrderBook.asks.length - index)
            .reduce((sum, a) => sum + a.size, 0)
          
          const depthPercent = (ask.size / maxSize) * 100

          return (
            <div
              key={`ask-${ask.price}`}
              className="order-level ask grid grid-cols-3 py-1 relative hover:bg-gray-800"
            >
              <div
                className="depth-bar absolute inset-0 bg-red-900 opacity-20"
                style={{ width: `${depthPercent}%` }}
              />
              <div className="price text-red-400 z-10">
                {ask.price.toFixed(2)}
              </div>
              <div className="size text-right z-10">
                {ask.size.toFixed(4)}
              </div>
              <div className="total text-right text-gray-500 z-10">
                {total.toFixed(4)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="spread-section py-2 border-t border-b border-gray-700">
        <div className="text-center text-lg font-mono">
          {orderBook.asks[0]?.price.toFixed(2) || '--'}
          <span className="text-xs text-gray-500 mx-2">↕</span>
          {orderBook.bids[0]?.price.toFixed(2) || '--'}
        </div>
      </div>

      <div className="bids mt-2">
        {groupedOrderBook.bids.slice(0, depth).map((bid, index) => {
          const total = groupedOrderBook.bids
            .slice(0, index + 1)
            .reduce((sum, b) => sum + b.size, 0)
          
          const depthPercent = (bid.size / maxSize) * 100

          return (
            <div
              key={`bid-${bid.price}`}
              className="order-level bid grid grid-cols-3 py-1 relative hover:bg-gray-800"
            >
              <div
                className="depth-bar absolute inset-0 bg-green-900 opacity-20"
                style={{ width: `${depthPercent}%` }}
              />
              <div className="price text-green-400 z-10">
                {bid.price.toFixed(2)}
              </div>
              <div className="size text-right z-10">
                {bid.size.toFixed(4)}
              </div>
              <div className="total text-right text-gray-500 z-10">
                {total.toFixed(4)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="footer mt-4 text-xs text-gray-500">
        <div>Last Update: {new Date(groupedOrderBook.timestamp).toLocaleTimeString()}</div>
        <div>Sequence: {groupedOrderBook.sequence}</div>
      </div>
    </div>
  )
}

export default OrderBook