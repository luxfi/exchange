import React, { useState, useEffect } from 'react'
import { dexWebSocket, MarketData } from '../../services/websocket'

interface Market {
  symbol: string
  baseAsset: string
  quoteAsset: string
  lastPrice: number
  change24h: number
  changePercent24h: number
  volume24h: number
  high24h: number
  low24h: number
  isFavorite?: boolean
}

interface MarketSelectorProps {
  selectedMarket: string
  onMarketChange: (market: string) => void
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({
  selectedMarket,
  onMarketChange,
}) => {
  const [markets, setMarkets] = useState<Market[]>([
    // Default markets
    { symbol: 'BTC-USDT', baseAsset: 'BTC', quoteAsset: 'USDT', lastPrice: 50000, change24h: 500, changePercent24h: 1.01, volume24h: 1000000000, high24h: 51000, low24h: 49000 },
    { symbol: 'ETH-USDT', baseAsset: 'ETH', quoteAsset: 'USDT', lastPrice: 3000, change24h: -30, changePercent24h: -0.99, volume24h: 500000000, high24h: 3100, low24h: 2900 },
    { symbol: 'LUX-USDT', baseAsset: 'LUX', quoteAsset: 'USDT', lastPrice: 100, change24h: 10, changePercent24h: 11.11, volume24h: 50000000, high24h: 110, low24h: 90 },
    { symbol: 'AVAX-USDT', baseAsset: 'AVAX', quoteAsset: 'USDT', lastPrice: 35, change24h: 2, changePercent24h: 6.06, volume24h: 100000000, high24h: 37, low24h: 33 },
    { symbol: 'SOL-USDT', baseAsset: 'SOL', quoteAsset: 'USDT', lastPrice: 100, change24h: -5, changePercent24h: -4.76, volume24h: 200000000, high24h: 110, low24h: 95 },
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState<'all' | 'spot' | 'futures' | 'favorites'>('all')
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('volume')

  useEffect(() => {
    // Subscribe to market tickers
    dexWebSocket.subscribe('ticker')

    const handleTicker = (data: MarketData) => {
      setMarkets(prev => {
        const index = prev.findIndex(m => m.symbol === data.symbol)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            lastPrice: data.lastPrice,
            change24h: data.change24h,
            changePercent24h: data.changePercent24h,
            volume24h: data.volume24h,
            high24h: data.high24h,
            low24h: data.low24h,
          }
          return updated
        }
        return prev
      })
    }

    dexWebSocket.on('ticker', handleTicker)

    return () => {
      dexWebSocket.off('ticker', handleTicker)
      dexWebSocket.unsubscribe('ticker')
    }
  }, [])

  const toggleFavorite = (symbol: string) => {
    setMarkets(prev => {
      const updated = [...prev]
      const market = updated.find(m => m.symbol === symbol)
      if (market) {
        market.isFavorite = !market.isFavorite
      }
      return updated
    })
  }

  const filteredMarkets = markets
    .filter(market => {
      if (searchTerm) {
        return market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
               market.baseAsset.toLowerCase().includes(searchTerm.toLowerCase())
      }
      if (category === 'favorites') {
        return market.isFavorite
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'symbol':
          return a.symbol.localeCompare(b.symbol)
        case 'price':
          return b.lastPrice - a.lastPrice
        case 'change':
          return b.changePercent24h - a.changePercent24h
        case 'volume':
          return b.volume24h - a.volume24h
        default:
          return 0
      }
    })

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`
    return `$${volume.toFixed(2)}`
  }

  const currentMarket = markets.find(m => m.symbol === selectedMarket)

  return (
    <div className="market-selector bg-gray-900 text-white">
      {/* Current Market Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h2 className="text-xl font-bold">{currentMarket?.symbol}</h2>
              <div className="text-xs text-gray-400">{currentMarket?.baseAsset} / {currentMarket?.quoteAsset}</div>
            </div>
            <div>
              <div className="text-2xl font-mono">
                ${currentMarket?.lastPrice.toLocaleString()}
              </div>
              <div className={`text-sm ${currentMarket && currentMarket.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {currentMarket && currentMarket.change24h >= 0 ? '+' : ''}{currentMarket?.change24h.toFixed(2)} ({currentMarket?.changePercent24h.toFixed(2)}%)
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-gray-400">24h High</div>
                <div>${currentMarket?.high24h.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400">24h Low</div>
                <div>${currentMarket?.low24h.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400">24h Volume</div>
                <div>{formatVolume(currentMarket?.volume24h || 0)}</div>
              </div>
            </div>
          </div>

          {/* Market List Toggle */}
          <button
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
            onClick={() => {
              const dropdown = document.getElementById('market-dropdown')
              if (dropdown) {
                dropdown.classList.toggle('hidden')
              }
            }}
          >
            Change Market
          </button>
        </div>
      </div>

      {/* Market Dropdown */}
      <div id="market-dropdown" className="hidden absolute z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl mt-2 w-96 max-h-96 overflow-hidden">
        {/* Search and Filters */}
        <div className="p-3 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
          />
          <div className="flex gap-2 mt-2">
            <button
              className={`px-3 py-1 text-xs rounded ${category === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setCategory('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${category === 'spot' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setCategory('spot')}
            >
              Spot
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${category === 'futures' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setCategory('futures')}
            >
              Futures
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${category === 'favorites' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setCategory('favorites')}
            >
              ⭐ Favorites
            </button>
          </div>
        </div>

        {/* Market List Header */}
        <div className="grid grid-cols-4 text-xs text-gray-400 px-3 py-2 border-b border-gray-700">
          <button onClick={() => setSortBy('symbol')} className="text-left hover:text-white">
            Market
          </button>
          <button onClick={() => setSortBy('price')} className="text-right hover:text-white">
            Price
          </button>
          <button onClick={() => setSortBy('change')} className="text-right hover:text-white">
            24h Change
          </button>
          <button onClick={() => setSortBy('volume')} className="text-right hover:text-white">
            Volume
          </button>
        </div>

        {/* Market List */}
        <div className="overflow-y-auto max-h-64">
          {filteredMarkets.map(market => (
            <div
              key={market.symbol}
              className={`grid grid-cols-4 px-3 py-2 hover:bg-gray-800 cursor-pointer text-sm ${
                market.symbol === selectedMarket ? 'bg-gray-800' : ''
              }`}
              onClick={() => {
                onMarketChange(market.symbol)
                document.getElementById('market-dropdown')?.classList.add('hidden')
              }}
            >
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(market.symbol)
                  }}
                  className="mr-2"
                >
                  {market.isFavorite ? '⭐' : '☆'}
                </button>
                <div>
                  <div className="font-semibold">{market.baseAsset}</div>
                  <div className="text-xs text-gray-400">{market.quoteAsset}</div>
                </div>
              </div>
              <div className="text-right">
                ${market.lastPrice.toLocaleString()}
              </div>
              <div className={`text-right ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {market.change24h >= 0 ? '+' : ''}{market.changePercent24h.toFixed(2)}%
              </div>
              <div className="text-right text-gray-400">
                {formatVolume(market.volume24h)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketSelector