import React, { useEffect, useState } from 'react'
import { dexWebSocket, Order, Position } from '../../services/websocket'
import { formatDistanceToNow } from 'date-fns'

interface PositionsPanelProps {
  symbol?: string
  isConnected: boolean
}

export const PositionsPanel: React.FC<PositionsPanelProps> = ({ 
  symbol,
  isConnected 
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions')
  const [positions, setPositions] = useState<Position[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [orderHistory, setOrderHistory] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isConnected || !dexWebSocket.isAuthenticated()) {
      return
    }

    const loadData = async () => {
      setLoading(true)
      try {
        // Load positions
        const userPositions = await dexWebSocket.getPositions(symbol)
        setPositions(userPositions)

        // Load open orders
        const openOrders = await dexWebSocket.getOpenOrders(symbol)
        setOrders(openOrders)
      } catch (error) {
        console.error('Failed to load positions/orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Subscribe to updates
    const handleOrderUpdate = (order: Order) => {
      if (!symbol || order.symbol === symbol) {
        setOrders(prev => {
          const index = prev.findIndex(o => o.id === order.id)
          if (index >= 0) {
            if (order.status === 'filled' || order.status === 'cancelled') {
              // Move to history
              setOrderHistory(hist => [order, ...hist].slice(0, 100))
              return prev.filter(o => o.id !== order.id)
            }
            // Update existing order
            const updated = [...prev]
            updated[index] = order
            return updated
          }
          // New order
          if (order.status === 'open' || order.status === 'pending') {
            return [order, ...prev]
          }
          return prev
        })
      }
    }

    const handlePositionUpdate = (position: Position) => {
      if (!symbol || position.symbol === symbol) {
        setPositions(prev => {
          const index = prev.findIndex(p => p.symbol === position.symbol)
          if (index >= 0) {
            const updated = [...prev]
            updated[index] = position
            return updated
          }
          return [...prev, position]
        })
      }
    }

    dexWebSocket.on('order_update', handleOrderUpdate)
    dexWebSocket.on('position_update', handlePositionUpdate)

    return () => {
      dexWebSocket.off('order_update', handleOrderUpdate)
      dexWebSocket.off('position_update', handlePositionUpdate)
    }
  }, [symbol, isConnected])

  const handleCancelOrder = async (orderId: string) => {
    try {
      await dexWebSocket.cancelOrder(orderId)
    } catch (error) {
      console.error('Failed to cancel order:', error)
    }
  }

  const formatPnL = (pnl: number, percent: number) => {
    const color = pnl >= 0 ? 'text-green-400' : 'text-red-400'
    const sign = pnl >= 0 ? '+' : ''
    return (
      <span className={color}>
        {sign}{pnl.toFixed(2)} ({sign}{percent.toFixed(2)}%)
      </span>
    )
  }

  if (!isConnected) {
    return (
      <div className="positions-panel bg-gray-900 p-4 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="mb-2">Connect wallet to view positions</div>
        </div>
      </div>
    )
  }

  return (
    <div className="positions-panel bg-gray-900 h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-2 px-4 text-sm ${
            activeTab === 'positions' ? 'bg-gray-800 text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('positions')}
        >
          Positions ({positions.length})
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm ${
            activeTab === 'orders' ? 'bg-gray-800 text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm ${
            activeTab === 'history' ? 'bg-gray-800 text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {/* Positions Tab */}
            {activeTab === 'positions' && (
              <div className="space-y-3">
                {positions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No open positions
                  </div>
                ) : (
                  positions.map(position => (
                    <div key={position.symbol} className="bg-gray-800 rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold">{position.symbol}</div>
                          <div className="text-xs text-gray-400">
                            {position.side === 'long' ? 'Long' : 'Short'} {position.leverage}x
                          </div>
                        </div>
                        <div className="text-right">
                          {formatPnL(position.pnl, position.pnlPercent)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-1">{position.size.toFixed(4)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Entry:</span>
                          <span className="ml-1">{position.entryPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Mark:</span>
                          <span className="ml-1">{position.markPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Liq:</span>
                          <span className="ml-1 text-orange-400">
                            {position.liquidationPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-1 rounded text-xs">
                          Add Margin
                        </button>
                        <button className="flex-1 bg-red-700 hover:bg-red-600 py-1 rounded text-xs">
                          Close
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-2">
                {orders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No open orders
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-gray-800 rounded p-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-semibold">{order.symbol}</div>
                          <div className="text-xs text-gray-400">
                            {order.side === 'buy' ? 'Buy' : 'Sell'} {order.type}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="mt-1 text-xs grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="ml-1">{order.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-1">{order.size.toFixed(4)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Filled:</span>
                          <span className="ml-1">
                            {((order.filled / order.size) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className={`ml-1 ${
                            order.status === 'open' ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-2">
                {orderHistory.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No order history
                  </div>
                ) : (
                  orderHistory.map(order => (
                    <div key={`${order.id}-hist`} className="bg-gray-800 rounded p-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm">{order.symbol}</div>
                          <div className="text-xs text-gray-400">
                            {order.side === 'buy' ? 'Buy' : 'Sell'} {order.type}
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className={
                            order.status === 'filled' ? 'text-green-400' : 'text-gray-400'
                          }>
                            {order.status}
                          </div>
                          <div className="text-gray-500">
                            {formatDistanceToNow(order.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {order.size.toFixed(4)} @ {order.price.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Account Summary */}
      <div className="border-t border-gray-700 p-4">
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Total PnL:</span>
            <span className={positions.reduce((sum, p) => sum + p.pnl, 0) >= 0 ? 'text-green-400' : 'text-red-400'}>
              ${positions.reduce((sum, p) => sum + p.pnl, 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Margin Used:</span>
            <span>{positions.reduce((sum, p) => sum + p.margin, 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Free Margin:</span>
            <span>$10,000.00</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PositionsPanel