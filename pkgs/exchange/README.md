# @luxfi/exchange

The Exchange — mountable SPA + SDK primitives. One package, one surface.

## Install

```bash
pnpm add @luxfi/exchange
```

## Mount

```tsx
import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@zooai/brand'   // or '@luxfi/brand', '@parsai/brand', …

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
```

That's the whole app. Providers, router, wagmi, Tamagui bones,
`@l.x/config` runtime loader, Insights telemetry, i18n, swap/pool/
portfolio/limit/send/bridge/activity — everything.

## Extend

One API. Discriminated-union payloads. Call any number of times before
mount:

```ts
import Exchange from '@luxfi/exchange'
import { zooMainnet, zooTestnet } from '@luxfi/exchange'
import ZooStakePage from './ZooStakePage'
import ZooHero from './ZooHero'

// Features — toggle top-level surfaces
Exchange.register({ features: { bridge: false, nft: false, limit: true } })

// Chains — replace or add
Exchange.register({ chains: [zooMainnet, zooTestnet] })
Exchange.register({ defaultChain: zooMainnet })

// Featured tokens on the landing page
Exchange.register({ featured: [
  { chainId: 200200, address: 'native', symbol: 'ZOO' },
  { chainId: 200200, address: '0xAA3AE95...', symbol: 'LETH' },
]})

// Regulated-provider gate (Liquidity)
Exchange.register({ provider: {
  name: 'Liquidity',
  adapter: '0x...',
  router:  '0x...',
  onboardingUrl: 'https://kyc.zoo.ngo',
}})

// Auth via Hanzo IAM (OIDC)
Exchange.register({ auth: {
  provider: 'iam',
  issuer:   'https://hanzo.id',
  clientId: 'app-zoo-exchange',
  idHost:   'https://id.zoo.ngo',
}})

// i18n overrides
Exchange.register({ i18n: {
  'en-US': { 'swap.title': 'Trade on Zoo', 'pool.cta': 'Earn ZOO' },
  'es-ES': { 'swap.title': 'Intercambia en Zoo' },
}})

// Custom routes
Exchange.register({ route: { path: '/stake', component: ZooStakePage } })

// Custom widgets
Exchange.register({ widget: { slot: 'landing.hero',  component: ZooHero } })
Exchange.register({ widget: { slot: 'swap.footer',   component: ZooPromo } })
```

## SDK primitives (no React, bundler-friendly)

```ts
import { chains, tokens, contracts, hooks, stores, dex, bridge } from '@luxfi/exchange'
// or tree-shake:
import { chains } from '@luxfi/exchange/sdk'
```

Same package, same source, no duplication. Default export = the App;
named exports = SDK primitives; `./sdk` subpath = primitives only.

## Runtime vs build-time

Anything that varies per deployment (chain defaults, RPC hosts, KMS
secrets, gateway URLs) comes from `/config.json` — a K8s ConfigMap
templated by `ghcr.io/hanzoai/spa` at pod startup. One image, any env.

Everything in code is universal. Per-brand props (colors, logo, default
chain, supported chains, `featured` lists) come from the `brand` prop.

## Widget slots

| slot | where it mounts |
| --- | --- |
| `landing.hero` | landing page hero, above the fold |
| `landing.below-hero` | directly under hero |
| `landing.features` | features section |
| `landing.footer-cta` | bottom CTA band |
| `nav.left` / `nav.right` / `nav.footer` | header + footer nav |
| `swap.above` / `swap.below` / `swap.footer` | around the swap form |
| `pool.header` / `pool.cta` | pool list |
| `portfolio.hero` / `portfolio.aside` / `portfolio.footer` | portfolio page |
| `activity.item-extra` | per-row extra slot on activity feed |
| `settings.section` | settings sidebar section |
| `footer.left` / `footer.right` | app footer |

## Custom IAM auth

The Auth flow uses Hanzo IAM by default (OIDC). Set `clientId`, `issuer`,
`idHost` in `Exchange.register({ auth: ... })` (or equivalent keys in
`/config.json` via K8s ConfigMap — runtime > register-time).

Social login and phone/OTP flows are provided by IAM natively — no code.
