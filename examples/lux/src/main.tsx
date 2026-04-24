// Lux Exchange — the canonical Lux DEX frontend.
// All Lux-ecosystem chains + regulated securities + cross-chain swaps.

import { createRoot } from 'react-dom/client'
import Exchange, {
  luxMainnet,    // 96369 — primary
  luxTestnet,    // 96368
  zooMainnet,    // 200200 — Zoo Network
  zooTestnet,    // 200201
  hanzoMainnet,  // 36963 — AI chain
  parsMainnet,   // 494949 — Pars Market
  spcMainnet,    // 36911 — SPC
  liquidMainnet, // 8675309 — regulated securities via Liquidity
} from '@luxfi/exchange'
import brand from '@luxfi/brand'
import Logo  from '@luxfi/logo'
import en from '@luxfi/brand/translations/en-US.json'

createRoot(document.getElementById('root')!).render(
  <Exchange
    {...brand}
    logo={Logo}

    // All Lux-ecosystem chains + bridged assets + regulated securities —
    // native swaps on each chain, cross-chain via Warp/Teleport + gateway.
    chains={[
      luxMainnet, luxTestnet,
      zooMainnet, zooTestnet,
      hanzoMainnet,
      parsMainnet,
      spcMainnet,
      liquidMainnet,
    ]}
    defaultChain={luxMainnet}

    // Lux DEX precompiles on Lux C-chain; V3 AMM fallback on subnets.
    dex={{ kind: 'precompile' }}

    // Gateway routes cross-chain swaps (Zoo → Hanzo → Lux → etc.)
    gatewayUrl="https://dex.lux.network"

    // Regulated-asset gate (Liquidity) for securities + private markets
    provider={{
      name:          'Liquidity',
      adapter:       '0x0000000000000000000000000000000000000000',
      router:        '0x0000000000000000000000000000000000000000',
      onboardingUrl: 'https://lux.id/onboarding',
    }}

    auth={{
      provider: 'iam',
      issuer:   'https://iam.lux.network',
      clientId: 'lux-exchange',
      idHost:   'https://lux.id',
    }}

    kms={{ url: 'https://kms.lux.network' }}

    i18n={{ 'en-US': en }}

    features={{
      swap: true, pool: true, portfolio: true, limit: true,
      send: true, buy: true, bridge: true, explore: true,
      activity: true, nft: true,
    }}
  />,
)
