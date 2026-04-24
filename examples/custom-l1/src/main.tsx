import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@acme/brand'
import { defineChain } from 'viem'

// Brand new L1 — not Lux-based. Register your chain + DEX backend.
// Exchange UI, wallet flows, routing all work without any Lux dependency.

const acmeL1 = defineChain({
  id: 1729,
  name: 'ACME Chain',
  nativeCurrency: { name: 'ACME', symbol: 'ACME', decimals: 18 },
  rpcUrls:      { default: { http: ['https://rpc.acme.network'] } },
  blockExplorers: { default: { name: 'ACME Explorer', url: 'https://explorer.acme.network' } },
})

Exchange.register({ chains: [acmeL1] })
Exchange.register({ defaultChain: acmeL1 })

// Point the DEX at your own gateway / AMM / CLOB.
Exchange.register({ dex: { kind: 'gateway', url: 'https://dex.acme.network' } })

// Optional: your own IAM / auth provider
Exchange.register({ auth: {
  provider: 'iam',
  issuer:   'https://auth.acme.network',
  clientId: 'acme-exchange',
  idHost:   'https://id.acme.network',
}})

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
