import { createRoot } from 'react-dom/client'
import Exchange, { zooMainnet, zooTestnet } from '@luxfi/exchange'
import brand from '@zooai/brand'

// Native Zoo Network deployment — 50% ZOO-native assets, 25% public stocks,
// 25% private securities. Trading routes through the Lux gateway; regulated
// assets gate through the Alpaca provider; login via Hanzo IAM at zoolabs.id.

Exchange.register({ chains: [zooMainnet, zooTestnet] })
Exchange.register({ defaultChain: zooMainnet })

Exchange.register({ features: {
  swap: true, pool: true, portfolio: true, limit: true, send: true,
  buy: true, explore: true, activity: true,
  bridge: true,   // cross-chain via lux gateway
  nft: false,
}})

Exchange.register({ featured: [
  { chainId: 200200, address: 'native', symbol: 'ZOO' },
  { chainId: 200200, address: '0x0bbb4269a4b00e13Ed48e0f3a73a03AF1AeaDC72', symbol: 'WZOO' },
  // stocks + private securities layered in by overlaying
  // apps/web/src/pages/Landing/assets/approvedTokens.ts — see
  // zoo/exchange/featured-tokens.ts for the full 14/7/7 list.
]})

Exchange.register({ auth: {
  provider: 'iam',
  issuer:   'https://iam.zoo.network',
  clientId: 'zoo-exchange',
  idHost:   'https://zoolabs.id',
}})

Exchange.register({ i18n: {
  'en-US': {
    'landing.hero.title': 'Trade ZOO and every token on Zoo Network',
    'swap.cta':           'Swap on Zoo',
  },
}})

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
