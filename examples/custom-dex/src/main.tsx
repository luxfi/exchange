import { createRoot } from 'react-dom/client'
import Exchange, { type DexAdapter, type Quote, type SwapIntent } from '@luxfi/exchange'
import brand from '@acme/brand'

// Bring your own DEX backend. Implement the 7-method DexAdapter interface
// and register it. The Exchange routes every swap/quote/pool/position/price
// call through your adapter.

const acmeDex: DexAdapter = {
  name: 'ACME DEX',

  async quote(chainId, tokenIn, tokenOut, amount, exactIn) {
    const res = await fetch(`https://api.acme.dex/v1/quote`, {
      method: 'POST',
      body: JSON.stringify({ chainId, tokenIn, tokenOut, amount, exactIn }),
    })
    return (await res.json()) as Quote
  },

  async swap(intent: SwapIntent) {
    const res = await fetch(`https://api.acme.dex/v1/swap`, {
      method: 'POST',
      body: JSON.stringify(intent),
    })
    return { to: res.headers.get('X-Router')!, data: await res.text(), value: intent.value }
  },

  async pools(chainId) { return (await fetch(`https://api.acme.dex/v1/pools?chain=${chainId}`)).json() },
  async positions(chainId, owner) { return (await fetch(`https://api.acme.dex/v1/positions?chain=${chainId}&owner=${owner}`)).json() },
  async prices(chainId, tokens)    { return (await fetch(`https://api.acme.dex/v1/prices?chain=${chainId}&tokens=${tokens.join(',')}`)).json() },
  async tokens(chainId)              { return (await fetch(`https://api.acme.dex/v1/tokens?chain=${chainId}`)).json() },
  async health()                     { return (await fetch(`https://api.acme.dex/health`)).ok },
}

Exchange.register({ dex: acmeDex })

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
