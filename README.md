# Lux Exchange

Composable Lux-ecosystem DEX stack. One canonical source, infinite
white-labels — fork or build your own frontend against the published
SDK in under 20 lines of TypeScript.

[**lux.exchange**](https://lux.exchange) runs on it. So does
[zoo.exchange](https://zoo.exchange), [pars.market](https://pars.market),
[swap.dev.satschel.com](https://swap.dev.satschel.com) (Liquid DEX), and
any Lux-network / L1 / L2 / external-EVM team that wants a
production-grade exchange interface with regulated-securities support.

## The declarative SDK (recommended approach)

**One React component. One config object. Everything composable.**

```tsx
import { createRoot } from 'react-dom/client'
import Exchange, { canonicalChains, zooMainnet } from '@luxfi/exchange'
import brand from '@acme/brand'
import Logo  from '@acme/logo'
import en from '@acme/brand/translations/en-US.json'

createRoot(document.getElementById('root')!).render(
  <Exchange
    {...brand}                                  // visual identity
    logo={Logo}                                 // logo marks (React component)
    chains={canonicalChains}                    // lux + hanzo + zoo + liquid (×3 envs)
    defaultChain={zooMainnet}                   // primary
    dex={{ kind: 'precompile' }}                // Lux DEX precompiles
    provider={{                                 // regulated-asset gate
      name: 'Liquidity', adapter, router, onboardingUrl: 'https://id.acme.com',
    }}
    auth={{                                     // OIDC via Hanzo IAM
      provider: 'iam', issuer, clientId, idHost,
    }}
    kms={{ url: 'https://kms.acme.network' }}
    i18n={{ 'en-US': en }}
    features={{ nft: true, bridge: true }}
    featured={[ /* TokenRef[] */ ]}
    routes={[ /* custom pages */ ]}
    widgets={[ /* slot components */ ]}
  />,
)
```

No `register()` calls, no state machines, no global mutation, no ordering.
React props = React idioms. Order-free, composable via object spread,
testable. See [`pkgs/exchange/src/register.ts`](pkgs/exchange/src/register.ts)
for the full `ExchangeConfig` type.

## Canonical chains (out of the box)

Four natively-integrated chains × 3 envs each = **12 chains**. Enabled
by default via `canonicalChains` from `@luxfi/exchange`.

| chain | native | mainnet | testnet | devnet |
|---|---|---|---|---|
| **Lux** | LUX | 96369 | 96368 | 96370 |
| **Hanzo** | AI (AI chain) | 36963 | 36964 | 36965 |
| **Zoo** | ZOO | 200200 | 200201 | 200202 |
| **Liquid EVM** (regulated securities) | LQDTY | 8675309 | 8675310 | 8675311 |

Pars (494949/7071/7072) + `localDev` (31337, anvil-compat) available via
explicit import; not in `canonicalChains` default. External EVMs
(Ethereum / Base / Arbitrum / Optimism / Polygon / Sepolia) re-exported
from wagmi.

## Fork it → your own exchange in ~10 minutes

The canonical white-label example is **[zooai/exchange](https://github.com/zooai/exchange)**.
Fork it, swap the brand imports, you're done.

```bash
gh repo fork zooai/exchange acmeai/exchange --clone
cd exchange

# 1. Point at your brand + logo npm packages
sed -i '' 's|@zooai/brand|@acmeai/brand|g; s|@zooai/logo|@acmeai/logo|g' apps/web/src/main.tsx

# 2. Register your npm scope (or just publish @acmeai/brand + @acmeai/logo)
# 3. Update Dockerfile to point at your registry
# 4. CI builds, tags, deploys — ghcr.io/acmeai/exchange:v1.x.x
```

That's it. Upstream `@luxfi/exchange` updates flow in automatically —
you only maintain the ~20 lines in `apps/web/src/main.tsx` + your brand
package.

## Five DEX backend modes

Registered via the `dex` prop:

```ts
{ kind: 'precompile' }                                              // Lux DEX native (LP-9010…LP-9040)
{ kind: 'v3', factory, router, quoter }                             // V2/V3 AMM on any EVM
{ kind: 'gateway', url: 'https://dex.acme.network' }                // Lux gateway — cross-chain routing
{ kind: 'hybrid', amm: {...}, clob: {...} }                         // mix — router picks per order type
myDexAdapter                                                         // custom — implement DexAdapter (7 methods)
```

`DexAdapter` interface at [`pkgs/exchange/src/register.ts`](pkgs/exchange/src/register.ts#L90-L100):
`quote`, `swap`, `pools`, `positions`, `prices`, `tokens`, `health`.

See [`examples/custom-dex/`](examples/custom-dex) for a complete
adapter implementation.

## White-label brand packages

Each brand ships a `@<org>/brand` + `@<org>/logo` pair on npm. These are
the **only** files a white-label deployment maintains:

| brand | `@<org>/brand` | `@<org>/logo` |
|---|---|---|
| Lux | [`@luxfi/brand`](https://www.npmjs.com/package/@luxfi/brand) | [`@luxfi/logo`](https://www.npmjs.com/package/@luxfi/logo) |
| Hanzo | [`@hanzo/brand`](https://www.npmjs.com/package/@hanzo/brand) | [`@hanzo/logo`](https://www.npmjs.com/package/@hanzo/logo) |
| Zoo | [`@zooai/brand`](https://www.npmjs.com/package/@zooai/brand) | [`@zooai/logo`](https://www.npmjs.com/package/@zooai/logo) |
| Liquidity | [`@liquidityio/brand`](https://www.npmjs.com/package/@liquidityio/brand) | `@liquidityio/logo` (pending) |
| Pars | `@parsdao/brand` (pending) | `@pars/logo` (pending) |

Each brand package ships:
- `brand.json` — colors, fonts, emails, socials, legal, domains (pure visual/content)
- `translations/{locale}.json` — per-locale text packs
- `assets/` — static images, icons
- `fonts/` — brand fonts

Chain, auth, KMS, DEX, provider config **live in the exchange app's
`main.tsx` props** — not in the brand package. Separation of concerns.

## Config & secrets via KMS

Every deployment runs its own [`luxfi/kms`](https://github.com/luxfi/kms)
instance. The exchange pod pulls secrets + runtime config via the
native ZAP binary client on pod startup; `ghcr.io/hanzoai/spa:1.2.0`
templates `/config.json` from `SPA_*` env vars injected by KMS.

| brand | KMS endpoint |
|---|---|
| lux.exchange | `kms.lux.network` |
| zoo.exchange | `kms.zoo.network` |
| pars.market | `kms.pars.network` |
| swap.\*.satschel.com | `kms.\*.satschel.com` |

Simple setups can set `SPA_*` env vars directly in K8s Secret / Deployment
instead of KMS. Mix freely.

## Identity via Hanzo IAM

Every brand runs its own white-label IAM:
- `iam.lux.network` / `id.lux.network`
- `iam.zoo.network` / `zoolabs.id`
- `iam.satschel.com` / `id.satschel.com`

OIDC + PKCE + social login + phone/OTP + passkeys + KYC — all out of box.

## Examples

Five copy-paste starters in [`examples/`](examples):

| directory | what | chain | DEX | auth |
|---|---|---|---|---|
| [`examples/minimal/`](examples/minimal) | smoke test — `<Exchange />` with defaults | lux mainnet | gateway | wallet only |
| [`examples/zoo/`](examples/zoo) | Zoo Network (same as `zooai/exchange`) | zoo mainnet | precompile | Hanzo IAM @ zoolabs.id |
| [`examples/lux/`](examples/lux) | full Lux Exchange | lux mainnet | precompile | Hanzo IAM @ lux.id |
| [`examples/liquidity/`](examples/liquidity) | regulated securities | Liquid EVM | gateway | Hanzo IAM @ id.satschel.com |
| [`examples/custom-dex/`](examples/custom-dex) | bring your own DEX adapter | any EVM | custom `DexAdapter` | wallet only |
| [`examples/custom-l1/`](examples/custom-l1) | brand new L1 | yours | your gateway | your IAM |

## This repo

```
luxfi/exchange/
├── apps/
│   ├── web/                    # Vite SPA — the App that @luxfi/exchange wraps
│   └── mobile/                 # Expo iOS + Android
├── pkgs/
│   ├── exchange/               # @luxfi/exchange — App + SDK (chains, tokens, contracts, hooks, stores, DEX, register types)
│   ├── wallet/                 # @luxfi/wallet — cross-chain wallet core
│   ├── dex/                    # @luxfi/dex
│   ├── lx/                     # @l.x/lx — business logic
│   ├── ui/                     # @l.x/ui — Tamagui UI on @hanzo/gui
│   ├── api/                    # @l.x/api — data fetching (REST + GraphQL)
│   ├── config/                 # @l.x/config — runtime brand/chain loader
│   ├── gating/                 # @l.x/gating — Statsig feature flags
│   ├── sessions/               # @l.x/sessions — hashcash + PoW sessions
│   ├── prices/                 # @l.x/prices — price feed client
│   ├── notifications/          # @l.x/notifications — toast + push
│   ├── websocket/              # @l.x/websocket — reconnecting client
│   ├── utilities/              # @l.x/utils
│   ├── mycelium/               # @l.x/mycelium — connection pool
│   ├── provider/               # @l.x/provider — regulated-asset SDK
│   ├── analytics, logger, privacy, react-query, trpc, options, hashcash-native
│   ├── biome-config, eslint-config  # @luxfi/biome-config, @luxfi/eslint-config
├── config/
│   ├── jest-presets/           # @l.x/jest-preset
│   ├── jest-ui-mocks/          # @l.x/jest-ui-mocks
│   ├── vitest-presets/         # @l.x/vitest-preset
│   └── tsconfig/               # @l.x/tsconfig
└── examples/
    ├── minimal/
    ├── zoo/
    ├── lux/
    ├── liquidity/
    ├── custom-dex/
    └── custom-l1/
```

## Dev

```bash
git clone git@github.com:luxfi/exchange.git
cd exchange
pnpm install
pnpm dev      # Vite SPA on :3000
pnpm test     # Vitest unit + Playwright e2e
pnpm build    # production bundle for ghcr.io/luxfi/exchange
```

Mobile: `pnpm --dir apps/mobile ios|android|start`.

## Deploy

- **Web**: `ghcr.io/luxfi/exchange:<semver>` — multi-arch on Hanzo ARC
  runners. Runtime: `ghcr.io/hanzoai/spa:1.2.0`.
- **K8s**: DOKS clusters `lux-k8s` / `lux-test-k8s` / `lux-dev-k8s`.
- **White-labels**: `ghcr.io/<org>/exchange:<semver>` — CI forks the
  same base.

## Version policy

- `@luxfi/exchange` — stays on **1.x**. App runtime lands as `1.0.9` /
  `1.1.0`. No `2.0.0` jump.
- `@l.x/*` and `@luxfi/*` sub-packages — semver per-package, minor bump
  for non-breaking.
- Brand packages — minor bump per content change (translations, logo
  iteration, social link update).

## Links

- **Lux Network** — [lux.network](https://lux.network)
- **Lux DEX backend** — [github.com/luxfi/dex](https://github.com/luxfi/dex) (lives at `dex.lux.network`)
- **Lux Standard AMM** — [github.com/luxfi/standard](https://github.com/luxfi/standard)
- **Lux Bridge + Teleport** — [github.com/luxfi/bridge](https://github.com/luxfi/bridge)
- **Lux KMS** — [github.com/luxfi/kms](https://github.com/luxfi/kms)
- **Docs** — [docs.lux.network](https://docs.lux.network)
- **Contact** — [contact@lux.network](mailto:contact@lux.network) · [X: @luxdefi](https://x.com/luxdefi) · [Discord](https://discord.gg/luxnetwork)

## License

GPL-3.0-or-later.
