# Lux Exchange

Composable DEX stack. One canonical source, infinite white-labels.

[**lux.exchange**](https://lux.exchange) runs on it. So does
[zoo.exchange](https://zoo.exchange), [pars.market](https://pars.market),
and any Lux-network, L1, L2, or EVM-based team that wants a
production-grade exchange interface in 15 lines of code.

## What you get

- **Full SPA** — swap, pool, portfolio, limit, send, bridge, activity,
  explore, NFT — every surface Uniswap's frontend has, reimplemented on
  Lux primitives with Tamagui via `@hanzo/gui`.
- **Native DEX backend** — Lux DEX precompiles (LP-9010…LP-9040)
  for sub-microsecond matching on chains that enable them; standard
  V2/V3 AMM contracts everywhere else.
- **Regulated-provider gate** — plug in any US-compliant adapter
  (Alpaca / OmniSub / FalconX / in-house) without modifying the SPA.
- **Identity via Hanzo IAM** — OIDC, social login, phone/OTP, passkeys,
  KYC handoff. Zero auth code on your side.
- **One register API** — features, chains, tokens, auth, i18n, routes,
  widgets — composable and orthogonal.

## Spin up a white-label exchange

```tsx
// apps/web/src/main.tsx — 10 lines, the whole app.
import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@acme/brand'

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
```

Brand comes from an npm package of your own — colors, logos, fonts,
`brand.json`. That's it to mount.

Customize further through one API:

```ts
import Exchange, { luxMainnet } from '@luxfi/exchange'

Exchange.register({ features: { bridge: false, nft: false } })
Exchange.register({ chains: [luxMainnet, acmeL2] })
Exchange.register({ defaultChain: acmeL2 })
Exchange.register({ featured: [ACME, WETH, USDC] })
Exchange.register({ provider: { name, adapter, router, onboardingUrl } })
Exchange.register({ auth:     { provider: 'iam', issuer, clientId, idHost } })
Exchange.register({ i18n:     { 'en-US': { 'swap.title': 'Trade on Acme' } } })
Exchange.register({ route:    { path: '/stake', component: AcmeStakePage } })
Exchange.register({ widget:   { slot: 'landing.hero', component: AcmeHero } })
```

See [`pkgs/exchange/README.md`](pkgs/exchange/README.md) for the full
slot/route/payload catalog.

## Backend — use ours, or your own

The exchange talks to a **DEX backend** through a single interface.
Five drop-in modes:

| Mode | When | What to set |
| --- | --- | --- |
| **Lux DEX precompiles** (native) | You run on a Lux chain with `LP-9xxx` precompiles enabled | default — works out of the box |
| **Standard V2/V3 AMM** (any EVM) | You deploy the Lux `standard` AMM contracts | set `dex: { kind: 'v3', factory, router, quoter }` |
| **Your own DEX** | You run your own orderbook / AMM | implement the `DexAdapter` interface, `Exchange.register({ dex: myAdapter })` |
| **Lux Gateway** | You want cross-chain routing via [`~/work/lux/dex`](https://github.com/luxfi/dex) | set `gatewayUrl: 'https://dex.acme.network'` |
| **Hybrid** | CLOB for limits + AMM for swaps | both adapters registered; router picks |

`DexAdapter` is 7 methods (quote, swap, pools, positions, prices, tokens, health). Type definitions at
[`pkgs/exchange/src/dex/adapter.ts`](pkgs/exchange/src/dex/adapter.ts).

## Chain — ours, yours, whatever

- **Lux C-Chain** (96369 / 96368) — `luxMainnet`, `luxTestnet`
- **Lux L1 subnets** — Hanzo (36963), Zoo (200200), Pars (494949), SPC (36911), and any subnet you deploy: register the `Chain` config, supply RPC + explorer, done
- **Your own L2** — rollup on top of Lux C-Chain or any EVM; register like any chain
- **Your own L1** — fully independent EVM; register with RPC + wagmi config + contract addresses
- **Any external EVM** — Ethereum, Base, Arbitrum, etc. — already supported

All chain config is runtime — see **Config & secrets** below. One
image, any chain.

## Config & secrets

Canonical source: **[luxfi/kms](https://github.com/luxfi/kms)**. Every
deployment mounts a KMS instance and pulls config + secrets at pod
startup. `ghcr.io/hanzoai/spa:1.2.0` templates `/config.json` from
`SPA_*` env vars injected by the KMS client — the SPA itself stays
untouched.

```
KMS (native ZAP client)  →  SPA_* env  →  /config.json  →  loadBrandConfig()
                                                             │
                                                             └─ wagmi chain, RPC,
                                                                gateway URL,
                                                                IAM issuer,
                                                                featureFlags, …
```

Each brand runs its **own white-label KMS**:

| deployment | KMS endpoint | scope |
| --- | --- | --- |
| lux.exchange | `kms.lux.network` | Lux secrets |
| zoo.exchange | `kms.zoo.network` | Zoo secrets (WL of luxfi/kms) |
| pars.market | `kms.pars.network` | Pars secrets |

Not runtime-sensitive values (static chain IDs, public token lists,
IAM issuer URLs) can also be set via plain `SPA_*` env vars — no KMS
roundtrip. Actual secrets (WalletConnect project IDs, private RPC
URLs, Insights API keys, gateway signing keys) always go through KMS.

### Run your own KMS

```bash
git clone git@github.com:luxfi/kms.git
# deploy via hanzoai/platform or your own K8s
# expose at kms.<your-domain>
# create a machine identity for the exchange pod
# populate secrets via the KMS CLI or UI
```

The exchange pod consumes it via native ZAP (binary protocol,
sub-millisecond fetches — the spa image ships the client). Set
`KMS_URL=https://kms.acme.network` and the machine-identity
credentials; the SPA image hydrates `/config.json` on startup.

**Or** skip KMS and set `SPA_*` env vars directly in the Deployment /
Secret — supported for simple setups and local dev. Mix freely: KMS
for secrets, env for non-sensitive config.

## White-label approach

Two shapes, both one source of truth:

**1 — Fork this repo** (zero code, your customizations):

```bash
git clone git@github.com:luxfi/exchange.git acme-exchange
cd acme-exchange
# edit apps/web/src/main.tsx — register chains, auth, i18n, brand
# publish @acme/brand to npm (colors, logo, fonts)
# push → CI builds ghcr.io/acme/exchange:<semver>
```

**2 — Build your own FE from scratch against our SDK**:

```bash
pnpm create vite my-exchange --template react-ts
cd my-exchange
pnpm add @luxfi/exchange @acme/brand
# write main.tsx — 10 lines — import Exchange, register, mount
```

Either way you get the full Lux Exchange feature set + whatever you
register on top. No upstream changes needed. Ever.

## Same backend, different frontends

Every frontend can point at the **same DEX backend + same regulated
provider**. That's the whole point.

- Lux Exchange FE → `gatewayUrl: https://dex.lux.network` + Alpaca provider
- Zoo Exchange FE → same gateway, different brand, Zoo tokens featured
- Pars Exchange FE → same gateway, Pars brand, Pars chain default
- Third-party Zoo fork → same gateway, same provider, their own FE

Regulated users onboarded once at the provider can trade from any
frontend pointing at the same backend. Your customers, your brand,
shared compliance rails.

## SDK primitives

```ts
import { chains, tokens, contracts, hooks, stores, dex, bridge } from '@luxfi/exchange'
// or for tree-shaking:
import { chains } from '@luxfi/exchange/sdk'
```

Same package. No second SDK, no duplicate tarball. Default export is
the App; named exports are primitives.

## Apps in this repo

| App | Path | What |
| --- | --- | --- |
| **Web** | [`apps/web`](apps/web) | Vite SPA at `lux.exchange` |
| **Mobile** | [`apps/mobile`](apps/mobile) | Expo iOS + Android |

## Packages in this repo

Canonical home for everything published under `@l.x/*` and `@luxfi/*`:

| published npm package | source |
| --- | --- |
| [`@luxfi/exchange`](https://www.npmjs.com/package/@luxfi/exchange) | [`pkgs/exchange`](pkgs/exchange) — App + SDK |
| [`@luxfi/wallet`](https://www.npmjs.com/package/@luxfi/wallet) | [`pkgs/wallet`](pkgs/wallet) — wallet core |
| [`@luxfi/dex`](https://www.npmjs.com/package/@luxfi/dex), [`@luxfi/biome-config`](https://www.npmjs.com/package/@luxfi/biome-config), [`@luxfi/eslint-config`](https://www.npmjs.com/package/@luxfi/eslint-config) | [`pkgs/{dex,biome-config,eslint-config}`](pkgs) |
| [`@l.x/lx`](https://www.npmjs.com/package/@l.x/lx), [`@l.x/ui`](https://www.npmjs.com/package/@l.x/ui), [`@l.x/api`](https://www.npmjs.com/package/@l.x/api), [`@l.x/utils`](https://www.npmjs.com/package/@l.x/utils), [`@l.x/config`](https://www.npmjs.com/package/@l.x/config), [`@l.x/gating`](https://www.npmjs.com/package/@l.x/gating), [`@l.x/sessions`](https://www.npmjs.com/package/@l.x/sessions), [`@l.x/notifications`](https://www.npmjs.com/package/@l.x/notifications), [`@l.x/prices`](https://www.npmjs.com/package/@l.x/prices), [`@l.x/websocket`](https://www.npmjs.com/package/@l.x/websocket), [`@l.x/provider`](https://www.npmjs.com/package/@l.x/provider), [`@l.x/analytics`](https://www.npmjs.com/package/@l.x/analytics), [`@l.x/mycelium`](https://www.npmjs.com/package/@l.x/mycelium), [`@l.x/options`](https://www.npmjs.com/package/@l.x/options), [`@l.x/privacy`](https://www.npmjs.com/package/@l.x/privacy), [`@l.x/react-query`](https://www.npmjs.com/package/@l.x/react-query), [`@l.x/trpc`](https://www.npmjs.com/package/@l.x/trpc), [`@l.x/logger`](https://www.npmjs.com/package/@l.x/logger), [`@l.x/hashcash-native`](https://www.npmjs.com/package/@l.x/hashcash-native) | [`pkgs/*`](pkgs) |
| [`@l.x/jest-preset`](https://www.npmjs.com/package/@l.x/jest-preset), [`@l.x/jest-ui-mocks`](https://www.npmjs.com/package/@l.x/jest-ui-mocks), [`@l.x/vitest-preset`](https://www.npmjs.com/package/@l.x/vitest-preset), [`@l.x/tsconfig`](https://www.npmjs.com/package/@l.x/tsconfig) | [`config/*`](config) |

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

- Web: `ghcr.io/luxfi/exchange:<semver>` — multi-arch, built on Hanzo
  ARC runners. Served via `ghcr.io/hanzoai/spa:1.2.0` (tiny static
  server + runtime `/config.json` templating + reverse-proxy).
- K8s: DOKS clusters — `lux-k8s` (mainnet), `lux-test-k8s`
  (testnet), `lux-dev-k8s` (devnet).
- White-labels: `ghcr.io/<org>/exchange:<semver>` — CI builds your own
  image off the same base.

## Links

- **Lux Network** — [lux.network](https://lux.network)
- **Lux DEX backend** — [github.com/luxfi/dex](https://github.com/luxfi/dex)
- **Lux Standard AMM** — [github.com/luxfi/standard](https://github.com/luxfi/standard)
- **Docs** — [docs.lux.network](https://docs.lux.network)
- **Contact** — [contact@lux.network](mailto:contact@lux.network) ·
  [X: @luxdefi](https://x.com/luxdefi) ·
  [Discord](https://discord.gg/luxnetwork)

## License

GPL-3.0-or-later — see [LICENSE](LICENSE).
