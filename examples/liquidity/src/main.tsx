import { createRoot } from 'react-dom/client'
import Exchange, { liquidMainnet, liquidTestnet, liquidDevnet } from '@luxfi/exchange'
import brand from '@liquidityio/brand'

// Regulated digital securities exchange on Liquid EVM. Every security
// token trade routes through the regulated provider (Liquidity) —
// KYC, accreditation, and offering-type gating enforced.

Exchange.register({ chains: [liquidMainnet, liquidTestnet, liquidDevnet] })
Exchange.register({ defaultChain: liquidDevnet })   // staging

Exchange.register({ features: {
  swap: true, pool: true, portfolio: true, limit: true,
  bridge: false,   // US-only, no cross-chain
  nft: false,
}})

// Regulated-asset gate — Liquidity SecurityToken adapter + LQDTY router.
Exchange.register({ provider: {
  name: 'Liquidity',
  adapter: '0x...',  // IRegulatedProvider adapter deployed on Liquid EVM
  router:  '0x...',  // Lux ProviderRouter
  onboardingUrl: 'https://id.dev.satschel.com/onboarding',
}})

Exchange.register({ auth: {
  provider: 'iam',
  issuer:   'https://iam.dev.satschel.com',
  clientId: 'liquidity-exchange-client-id',
  idHost:   'https://id.dev.satschel.com',
}})

// Featured: 14 stocks (AAPL/MSFT/GOOGL/…), 7 crypto (BTC/ETH/SOL/USDC/…),
// 7 private securities (OpenAI/SpaceX/Anthropic/…). See
// liquidity/swap/featured-tokens.ts for the full list.
Exchange.register({ featured: [
  { chainId: 8675311, address: '0xDc384E006BAec602b0b2B2fe6f2712646EFb1e9D', symbol: 'AAPL' },
  { chainId: 8675311, address: '0xdE5280a9306da7829A4Ba1fBf87B58e1bB4F4A53', symbol: 'BTC'  },
  { chainId: 8675311, address: '0x9378b62fC172d2A4f715d7ecF49DE0362f1BB702', symbol: 'USDL' },
]})

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
