import React, { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { OrderBook } from '../../components/TradingView/OrderBook'
import { TradeHistory } from '../../components/TradingView/TradeHistory'
import { OrderForm } from '../../components/TradingView/OrderForm'
import { PositionsPanel } from '../../components/TradingView/PositionsPanel'
import { MarketSelector } from '../../components/TradingView/MarketSelector'
import { ChartWidget } from '../../components/TradingView/ChartWidget'
import { dexWebSocket } from '../../services/websocket'
import { luxDEXClient } from '../../config/luxjs'

const TradingPage: React.FC = () => {
  const { address, isConnected } = useAccount()
  const [selectedMarket, setSelectedMarket] = useState('BTC-USDT')
  const [wsConnected, setWsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Performance metrics
  const [metrics, setMetrics] = useState({
    latency: '597ns',
    throughput: '2.9M/sec',
    orderCount: 0,
    connectionStatus: 'connecting',
  })

  useEffect(() => {
    // Connect to WebSocket
    const connectWebSocket = async () => {
      try {
        await dexWebSocket.connect()
        setWsConnected(true)
        setMetrics(prev => ({ ...prev, connectionStatus: 'connected' }))
        
        // Subscribe to system metrics
        dexWebSocket.on('metrics', (data: any) => {
          setMetrics(prev => ({
            ...prev,
            latency: data.latency || prev.latency,
            throughput: data.throughput || prev.throughput,
            orderCount: data.orderCount || prev.orderCount,
          }))
        })
      } catch (err) {
        console.error('WebSocket connection failed:', err)
        setError('Failed to connect to trading engine')
        setMetrics(prev => ({ ...prev, connectionStatus: 'error' }))
      } finally {
        setLoading(false)
      }
    }

    connectWebSocket()

    return () => {
      dexWebSocket.disconnect()
    }
  }, [])

  // Authenticate when wallet connects
  useEffect(() => {
    if (isConnected && address && wsConnected) {
      // In production, get API keys from secure storage
      const apiKey = localStorage.getItem('dex_api_key')
      const apiSecret = localStorage.getItem('dex_api_secret')
      
      if (apiKey && apiSecret) {
        dexWebSocket.connect(apiKey, apiSecret)
      }
    }
  }, [isConnected, address, wsConnected])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold mb-4">LUX DEX</div>
          <div className="text-xl mb-2">Ultra-Fast Trading Interface</div>
          <div className="text-sm text-gray-400">Connecting to trading engine...</div>
          <div className="mt-8 animate-pulse">
            <div className="text-2xl font-mono text-green-400">
              Latency: {metrics.latency} | Throughput: {metrics.throughput}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold">LUX DEX</h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span>{wsConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="text-gray-400">
                Latency: <span className="text-green-400 font-mono">{metrics.latency}</span>
              </div>
              <div className="text-gray-400">
                Throughput: <span className="text-blue-400 font-mono">{metrics.throughput}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Market Selector */}
      <div className="border-b border-gray-800">
        <MarketSelector 
          selectedMarket={selectedMarket}
          onMarketChange={setSelectedMarket}
        />
      </div>

      {/* Main Trading Interface */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Order Book & Trades */}
        <div className="w-1/4 border-r border-gray-800 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <OrderBook symbol={selectedMarket} />
          </div>
          <div className="flex-1 border-t border-gray-800 overflow-hidden">
            <TradeHistory symbol={selectedMarket} />
          </div>
        </div>

        {/* Center Panel - Chart & Order Form */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <ChartWidget symbol={selectedMarket} />
          </div>
          <div className="h-64 border-t border-gray-800">
            <OrderForm 
              symbol={selectedMarket}
              isConnected={isConnected}
              address={address}
            />
          </div>
        </div>

        {/* Right Panel - Positions & Orders */}
        <div className="w-1/4 border-l border-gray-800">
          <PositionsPanel 
            symbol={selectedMarket}
            isConnected={isConnected}
          />
        </div>
      </div>

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4 text-red-400">Connection Error</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                window.location.reload()
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TradingPage