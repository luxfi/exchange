// Gate the swap CTA by regulated-asset eligibility. If the swap pair is
// open (no provider or provider doesn't handle the symbol), the gate
// renders children untouched — zero cost on the hot path for pure DeFi.
//
// Drop-in usage inside the existing swap flow:
//
//   <RegulatedGate symbol={pairSymbol} trader={account.address} onConnect={openWalletModal}>
//     <SwapButton ... />
//   </RegulatedGate>

import { RegulatedSwapGate } from '@l.x/provider/react'
import { providerClient, providerConfig } from 'src/lib/provider'
import type { Address } from 'viem'

export function RegulatedGate({
  symbol,
  trader,
  onConnect,
  children,
}: {
  symbol: string
  trader: Address | undefined
  onConnect?: () => void
  children: React.ReactNode
}): React.ReactElement {
  return (
    <RegulatedSwapGate
      config={providerConfig}
      client={providerClient}
      symbol={symbol}
      trader={trader}
      onConnect={onConnect}
    >
      {children}
    </RegulatedSwapGate>
  )
}
