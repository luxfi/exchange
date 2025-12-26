import { useState } from 'react'
import './App.css'

const TOKENS = [
  { symbol: 'LUX', name: 'Lux' },
  { symbol: 'LETH', name: 'Lux ETH' },
  { symbol: 'LBTC', name: 'Lux BTC' },
  { symbol: 'LUSD', name: 'Lux USD' },
]

export default function App() {
  const [inputAmount, setInputAmount] = useState('')
  const [inputToken, setInputToken] = useState(TOKENS[0])
  const [outputToken, setOutputToken] = useState(TOKENS[1])
  const [isConnected, setIsConnected] = useState(false)

  const switchTokens = () => {
    const temp = inputToken
    setInputToken(outputToken)
    setOutputToken(temp)
  }

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Lux Exchange</span>
        </div>
        <button className="settings-btn">⚙</button>
      </header>

      <main className="swap-container">
        <div className="input-card">
          <div className="input-header">
            <span className="label">You pay</span>
            <span className="balance">Balance: 0.00</span>
          </div>
          <div className="input-row">
            <input
              type="text"
              className="amount-input"
              placeholder="0"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
            />
            <button className="token-btn">
              <span className="token-icon">{inputToken.symbol[0]}</span>
              <span className="token-symbol">{inputToken.symbol}</span>
              <span className="dropdown-arrow">▾</span>
            </button>
          </div>
        </div>

        <button className="switch-btn" onClick={switchTokens}>
          ↓
        </button>

        <div className="input-card">
          <div className="input-header">
            <span className="label">You receive</span>
            <span className="balance">Balance: 0.00</span>
          </div>
          <div className="input-row">
            <input
              type="text"
              className="amount-input"
              placeholder="0"
              readOnly
            />
            <button className="token-btn">
              <span className="token-icon">{outputToken.symbol[0]}</span>
              <span className="token-symbol">{outputToken.symbol}</span>
              <span className="dropdown-arrow">▾</span>
            </button>
          </div>
        </div>

        <button className="action-btn">
          {isConnected ? 'Swap' : 'Connect Wallet'}
        </button>
      </main>

      <footer className="footer">
        <a href="https://exchange.lux.network" target="_blank" rel="noopener">
          Open Full App →
        </a>
      </footer>
    </div>
  )
}
