# @l.x/provider — Regulated Provider SDK

Jurisdiction-neutral client for the `@lux/standard/provider` interface.
Vite-native: reads `import.meta.env` for configuration. Safe to import
even in pure-DeFi forks — every method short-circuits to "not handled"
when no provider is configured.

## Install

```
pnpm add @l.x/provider
```

## Three surfaces

```ts
import { RegulatedProviderClient, Side } from '@l.x/provider'        // core client
import { readProviderConfig, buildOnboardingUrl } from '@l.x/provider/config'
import { RegulatedSwapGate, useEligibility } from '@l.x/provider/react'
```

### Core client — contract reads/writes

```ts
import { createPublicClient, http } from 'viem'
const client = new RegulatedProviderClient(
  { adapter: '0xAdapter…', router: '0xRouter…' },
  createPublicClient({ transport: http(rpc) }),
)
if (await client.handles('IBIT/USDL')) {
  const { ok, reasonCode } = await client.isEligible(trader, 'IBIT/USDL')
}
```

### Config — Vite env-driven

```ts
// In a Vite app:
import { readProviderConfig } from '@l.x/provider/config'
const cfg = readProviderConfig(import.meta.env as any)
```

Env keys:

| Key                              | Meaning                               |
|----------------------------------|---------------------------------------|
| `VITE_LIQUIDITY_ADAPTER`         | adapter address (IRegulatedProvider)  |
| `VITE_LIQUIDITY_ROUTER`          | Lux ProviderRouter address            |
| `VITE_LIQUIDITY_NAME`            | human-readable provider name          |
| `VITE_LIQUIDITY_ONBOARDING_URL`  | URL to the provider's KYC flow        |
| `VITE_LIQUIDITY_VERIFY_URL`      | URL to the provider's verify page     |

> `LIQUIDITY_*` follows the generic finance term — a liquidity provider
> is any market maker or regulated venue that offers quotes. These keys
> are not tied to any specific brand.

### React — drop-in gate

```tsx
<RegulatedSwapGate config={cfg} client={client} symbol="IBIT/USDL" trader={address} onConnect={connect}>
  <SwapButton />
</RegulatedSwapGate>
```

If the symbol is unregulated: `SwapButton` renders as-is.
If regulated + eligible: `SwapButton` renders as-is.
If regulated + not eligible: gate renders a CTA:

- `Get verified with {provider.name}` → opens `onboardingUrl?return={current_url}&address={addr}`
- `Already verified? Re-check` → re-queries `isEligible` on chain
- `Connect wallet` → calls `onConnect` if no wallet

## White-label forks

```env
VITE_LIQUIDITY_ADAPTER=0x…
VITE_LIQUIDITY_ROUTER=0x…
VITE_LIQUIDITY_NAME=Your Provider
VITE_LIQUIDITY_ONBOARDING_URL=https://onboard.provider.tld
```

If the env vars are unset, `client.enabled() === false` and every gate
is a transparent pass-through. Pure DeFi mode, zero code changes.

## Flow

```
user clicks Swap
  │
  ▼
RegulatedGate.useEligibility(symbol, trader)
  ├─ provider disabled       → render children (pure DeFi)
  ├─ symbol not handled      → render children (native pool)
  ├─ eligible                → render children (regulated, approved)
  └─ not eligible
        ├─ no wallet         → [Connect wallet]
        ├─ [Get verified]    → opens provider onboarding URL
        └─ [Already verified? Re-check]
              └─ refetch IRegulatedProvider.isEligible
```
