import React, { useEffect, useState } from 'react'
import { dexWebSocket, Trade } from '../../services/websocket'
import { formatDistanceToNow } from 'date-fns'

interface TradeHistoryProps {
  symbol: string
  limit?: number
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ 
  symbol, 
  limit = 50 
}) => {
  const [trades, setTrades] = useState<Trade[]>([])
  const [lastPrice, setLastPrice] = useState<number>(0)
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral')

  useEffect(() => {
    // Subscribe to trades
    dexWebSocket.subscribe('trades', [symbol])

    const handleTrades = (newTrades: Trade[]) => {
      setTrades(prev => {
        // Filter trades for this symbol
        const symbolTrades = newTrades.filter(t => t.symbol === symbol)
        
        if (symbolTrades.length === 0) return prev
        
        // Update price direction
        const latestTrade = symbolTrades[0]
        if (latestTrade.price > lastPrice) {
          setPriceDirection('up')
        } else if (latestTrade.price < lastPrice) {
          setPriceDirection('down')
        } else {
          setPriceDirection('neutral')
        }
        
        setLastPrice(latestTrade.price)
        
        // Prepend new trades and limit to max
        const updated = [...symbolTrades, ...prev]
        return updated.slice(0, limit)
      })
    }

    dexWebSocket.on('trades', handleTrades)

    return () => {
      dexWebSocket.off('trades', handleTrades)
      dexWebSocket.unsubscribe('trades', [symbol])
    }
  }, [symbol, limit, lastPrice])

  const getPriceColor = (trade: Trade) => {
    if (trade.side === 'buy') return 'text-green-400'
    return 'text-red-400'
  }

  const formatSize = (size: number) => {
    if (size >= 1000000) return `${(size / 1000000).toFixed(2)}M`
    if (size >= 1000) return `${(size / 1000).toFixed(2)}K`
    return size.toFixed(4)
  }

  return (
    <div className="trade-history bg-gray-900 text-white rounded-lg p-4">
      <div className="header mb-4">
        <h3 className="text-lg font-bold">Recent Trades</h3>
        <div className="last-price text-2xl font-mono mt-2">
          <span className={priceDirection === 'up' ? 'text-green-400' : priceDirection === 'down' ? 'text-red-400' : 'text-white'}>
            {lastPrice > 0 ? lastPrice.toFixed(2) : '--'}
          </span>
          {priceDirection === 'up' && <span className="text-green-400 text-sm ml-2">▲</span>}
          {priceDirection === 'down' && <span className="text-red-400 text-sm ml-2">▼</span>}
        </div>
      </div>

      <div className="trades-header grid grid-cols-3 text-xs text-gray-500 mb-2">
        <div>Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Time</div>
      </div>

      <div className="trades-list">
        {trades.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No recent trades
          </div>
        ) : (
          trades.map((trade, index) => (
            <div
              key={`${trade.id}-${index}`}
              className="trade-item grid grid-cols-3 py-1 hover:bg-gray-800 text-sm"
            >
              <div className={getPriceColor(trade)}>
                {trade.price.toFixed(2)}
              </div>
              <div className="text-right">
                {formatSize(trade.size)}
              </div>
              <div className="text-right text-gray-500 text-xs">
                {new Date(trade.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="summary mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">24h Volume:</span>
            <span className="ml-2 font-mono">
              {trades.reduce((sum, t) => sum + t.size * t.price, 0).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Trades:</span>
            <span className="ml-2 font-mono">{trades.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TradeHistory