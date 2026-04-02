import type { GasFeeResult } from '@luxexchange/api'
import type { UniverseChainId } from 'lx/src/features/chains/types'
import { AcrossRoutingInfo } from 'lx/src/features/transactions/swap/components/RoutingInfo/AcrossRoutingInfo'
import { PlanRoutingInfo } from 'lx/src/features/transactions/swap/components/RoutingInfo/ChainedRoutingInfo'
import { RoutingHopInfo } from 'lx/src/features/transactions/swap/components/RoutingInfo/RoutingHopInfo'
import { Trade } from 'lx/src/features/transactions/swap/types/trade'
import { isBridge, isChained } from 'lx/src/features/transactions/swap/utils/routing'

/**
 * Component that displays the routing information for a given trade for different routing types
 * as a row in the swap details. Component may also show tooltips or modals with more information.
 */
export function RoutingInfo({
  trade,
  chainId,
  gasFee,
}: {
  trade: Trade
  chainId: UniverseChainId
  gasFee: GasFeeResult
}): JSX.Element | null {
  if (isChained(trade)) {
    return <PlanRoutingInfo trade={trade} />
  }
  if (isBridge(trade)) {
    return <AcrossRoutingInfo />
  }

  return <RoutingHopInfo trade={trade} chainId={chainId} gasFee={gasFee} />
}
