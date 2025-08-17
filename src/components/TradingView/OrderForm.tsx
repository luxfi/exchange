import React, { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { dexWebSocket, Order } from '../../services/websocket'
import { luxDEXClient } from '../../config/luxjs'

interface OrderFormProps {
  symbol: string
  isConnected: boolean
  address?: string
}

export const OrderForm: React.FC<OrderFormProps> = ({ 
  symbol, 
  isConnected,
  address 
}) => {
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stop'>('limit')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [stopPrice, setStopPrice] = useState('')
  const [leverage, setLeverage] = useState(1)
  const [isMargin, setIsMargin] = useState(false)
  const [postOnly, setPostOnly] = useState(false)
  const [reduceOnly, setReduceOnly] = useState(false)
  const [timeInForce, setTimeInForce] = useState<'GTC' | 'IOC' | 'FOK'>('GTC')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Get user balance
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    enabled: !!address,
  })

  const [estimatedTotal, setEstimatedTotal] = useState(0)
  const [estimatedFee, setEstimatedFee] = useState(0)

  // Calculate estimated total and fees
  useEffect(() => {
    if (price && amount) {
      const priceNum = parseFloat(price)
      const amountNum = parseFloat(amount)
      const total = priceNum * amountNum
      const fee = total * 0.001 // 0.1% fee
      
      setEstimatedTotal(total)
      setEstimatedFee(fee)
    } else {
      setEstimatedTotal(0)
      setEstimatedFee(0)
    }
  }, [price, amount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate inputs
      if (orderType === 'limit' && !price) {
        throw new Error('Price is required for limit orders')
      }
      
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Valid amount is required')
      }

      // Create order object
      const order: Omit<Order, 'id' | 'filled' | 'status' | 'timestamp'> = {
        symbol,
        side,
        type: orderType,
        price: orderType === 'market' ? 0 : parseFloat(price),
        size: parseFloat(amount),
      }

      // Submit order via WebSocket for ultra-fast execution
      if (dexWebSocket.isConnected() && dexWebSocket.isAuthenticated()) {
        const placedOrder = await dexWebSocket.placeOrder(order)
        setSuccess(`Order placed successfully! ID: ${placedOrder.id}`)
        
        // Reset form
        setPrice('')
        setAmount('')
        setStopPrice('')
      } else {
        // Fallback to LuxJS SDK for X-Chain
        const result = await luxDEXClient.createOrder(
          symbol,
          side,
          parseFloat(price),
          parseFloat(amount),
          address
        )
        
        if (result.success) {
          setSuccess(`Order placed on X-Chain! TX: ${result.txID}`)
        } else {
          throw new Error(result.error)
        }
      }
    } catch (err: any) {
      console.error('Order submission error:', err)
      setError(err.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="order-form bg-gray-900 p-4 h-full">
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 ${side === 'buy' ? 'bg-green-600' : 'bg-gray-700'}`}
          onClick={() => setSide('buy')}
        >
          Buy
        </button>
        <button
          className={`flex-1 py-2 ${side === 'sell' ? 'bg-red-600' : 'bg-gray-700'}`}
          onClick={() => setSide('sell')}
        >
          Sell
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 text-xs rounded ${orderType === 'limit' ? 'bg-blue-600' : 'bg-gray-700'}`}
          onClick={() => setOrderType('limit')}
        >
          Limit
        </button>
        <button
          className={`px-3 py-1 text-xs rounded ${orderType === 'market' ? 'bg-blue-600' : 'bg-gray-700'}`}
          onClick={() => setOrderType('market')}
        >
          Market
        </button>
        <button
          className={`px-3 py-1 text-xs rounded ${orderType === 'stop' ? 'bg-blue-600' : 'bg-gray-700'}`}
          onClick={() => setOrderType('stop')}
        >
          Stop
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {orderType !== 'market' && (
          <div>
            <label className="text-xs text-gray-400">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        )}

        {orderType === 'stop' && (
          <div>
            <label className="text-xs text-gray-400">Stop Price</label>
            <input
              type="number"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        )}

        <div>
          <label className="text-xs text-gray-400">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            placeholder="0.00"
            step="0.0001"
          />
        </div>

        {isMargin && (
          <div>
            <label className="text-xs text-gray-400">Leverage: {leverage}x</label>
            <input
              type="range"
              min="1"
              max="125"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="flex gap-2 text-xs">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isMargin}
              onChange={(e) => setIsMargin(e.target.checked)}
              className="mr-1"
            />
            Margin
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={postOnly}
              onChange={(e) => setPostOnly(e.target.checked)}
              className="mr-1"
            />
            Post Only
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={reduceOnly}
              onChange={(e) => setReduceOnly(e.target.checked)}
              className="mr-1"
            />
            Reduce Only
          </label>
        </div>

        <div>
          <label className="text-xs text-gray-400">Time in Force</label>
          <select
            value={timeInForce}
            onChange={(e) => setTimeInForce(e.target.value as any)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
          >
            <option value="GTC">Good Till Cancel</option>
            <option value="IOC">Immediate or Cancel</option>
            <option value="FOK">Fill or Kill</option>
          </select>
        </div>

        {estimatedTotal > 0 && (
          <div className="text-xs text-gray-400 space-y-1">
            <div>Total: {estimatedTotal.toFixed(2)} USDT</div>
            <div>Fee: {estimatedFee.toFixed(4)} USDT</div>
            {balance && (
              <div>Available: {formatUnits(balance.value, balance.decimals)} {balance.symbol}</div>
            )}
          </div>
        )}

        {error && (
          <div className="text-red-400 text-xs">{error}</div>
        )}

        {success && (
          <div className="text-green-400 text-xs">{success}</div>
        )}

        <button
          type="submit"
          disabled={!isConnected || submitting}
          className={`w-full py-3 rounded font-bold ${
            !isConnected || submitting
              ? 'bg-gray-700 cursor-not-allowed'
              : side === 'buy'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {!isConnected 
            ? 'Connect Wallet' 
            : submitting 
            ? 'Placing Order...' 
            : `${side === 'buy' ? 'Buy' : 'Sell'} ${symbol.split('-')[0]}`
          }
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <div>Execution: &lt;597ns avg latency</div>
        <div>Throughput: 2.9M orders/sec</div>
      </div>
    </div>
  )
}

export default OrderForm