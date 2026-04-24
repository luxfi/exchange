# Examples

Five starting points. Copy any directory to your own repo, swap the
`@acme/brand` import, and ship.

| directory | what | chain | DEX backend | auth |
| --- | --- | --- | --- | --- |
| [`minimal/`](minimal) | The smallest possible exchange — just mount `<Exchange>` | defaults (lux mainnet) | lux gateway | wallet only |
| [`zoo/`](zoo) | Zoo Network white-label | Zoo EVM (200200) | lux gateway via DEX precompiles | Hanzo IAM (iam.zoo.network) |
| [`liquidity/`](liquidity) | Regulated securities exchange | Liquid EVM (8675311/8675310/8675309) | dex.lux.network + Liquidity provider | Hanzo IAM (iam.dev.satschel.com) |
| [`custom-dex/`](custom-dex) | Bring your own DEX / AMM | any EVM | custom `DexAdapter` | wallet only |
| [`custom-l1/`](custom-l1) | Brand new L1 — not Lux-based | your chain | your DEX or gateway | your IAM or wallet only |

Every example is ≤20 lines of substance. Providers, router, swap/pool/
portfolio/limit/bridge, wagmi, Tamagui via `@hanzo/gui`, IAM wiring,
i18n, Insights telemetry — all upstream in `@luxfi/exchange`.

## Quick start

```bash
cp -r examples/minimal ~/work/acme/exchange
cd ~/work/acme/exchange
# edit src/main.tsx — import your @acme/brand, register what you need
pnpm install && pnpm dev
```

## Assembly guide

See [pkgs/exchange/README.md](../pkgs/exchange/README.md) for the full
`register()` payload catalog.

**Four extension points** cover every customization:

| register payload | use for |
| --- | --- |
| `{ brand }`      | passed as `<Exchange brand={…} />` prop — logo, colors, fonts, default chain |
| `{ features }`   | toggle top-level surfaces (swap, pool, portfolio, bridge, limit, nft) |
| `{ chains, defaultChain }` | add chains, pick default |
| `{ featured }`   | landing-page token cloud |
| `{ provider }`   | regulated-asset gate (Liquidity / in-house KYC adapter) |
| `{ auth }`       | OIDC issuer + clientId + idHost (Hanzo IAM or your own) |
| `{ i18n }`       | text overrides per locale |
| `{ route }`      | custom pages |
| `{ widget }`     | custom components in named slots |
| `{ dex }`        | swap the DEX backend (precompiles / V3 AMM / gateway / custom) |

## DEX backend modes

`<Exchange>` talks to a **DEX backend** through a single `DexAdapter`
interface. Five drop-in choices (see [`custom-dex/`](custom-dex) for the
full adapter implementation):

```ts
// 1. Lux DEX precompiles (default — native LP-9010…LP-9040)
Exchange.register({ dex: { kind: 'precompile' } })

// 2. V2/V3 AMM on any EVM
Exchange.register({ dex: { kind: 'v3', factory, router, quoter } })

// 3. Lux Gateway (cross-chain routing)
Exchange.register({ dex: { kind: 'gateway', url: 'https://dex.lux.network' } })

// 4. Your own DEX — implement the 7 adapter methods
Exchange.register({ dex: myDexAdapter })

// 5. Hybrid — both adapters, router picks per order type
Exchange.register({ dex: { kind: 'hybrid', amm, clob } })
```
