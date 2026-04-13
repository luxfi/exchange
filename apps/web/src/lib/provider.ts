// Provider wiring for the Vite SPA. White-label operators configure this
// via VITE_* env vars (build-time or runtime). The rest of the UI
// consumes `providerClient` / `providerConfig` through `@l.x/provider/react`.
//
// If the env is empty, `client.enabled()` returns false and
// `RegulatedSwapGate` becomes a transparent pass-through (pure DeFi).

import { createPublicClient, http } from 'viem'
import { RegulatedProviderClient } from '@l.x/provider'
import { readProviderConfig } from '@l.x/provider/config'

// Vite exposes env vars prefixed with VITE_ via import.meta.env. Cast to a
// plain record so the SDK does not depend on Vite's types.
const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}

export const providerConfig = readProviderConfig(env)

const rpc = env.VITE_RPC_URL ?? 'http://127.0.0.1:8545'

export const providerClient = new RegulatedProviderClient(
  { adapter: providerConfig.adapter, router: providerConfig.router ?? '0x0000000000000000000000000000000000000000' as `0x${string}` },
  createPublicClient({ transport: http(rpc) }),
)
