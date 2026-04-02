import type { BlockaidScanJsonRpcRequest } from '@l.x/api'
import { useMemo } from 'react'
import type { UniverseChainId } from 'lx/src/features/chains/types'
import { isLXSwapRequest, LXSwapRequest } from '@luxfi/wallet/src/components/dappRequests/types/Permit2Types'
import { useBlockaidJsonRpcScan } from '@luxfi/wallet/src/features/dappRequests/hooks/useBlockaidJsonRpcScan'
import { useParseLXSwap } from '@luxfi/wallet/src/features/dappRequests/hooks/useParseLXSwap'
import type { ParsedTransactionData } from '@luxfi/wallet/src/features/dappRequests/types'
import { parseTransactionSections } from '@luxfi/wallet/src/features/dappRequests/utils/blockaidUtils'
import { buildBlockaidScanJsonRpcRequest } from '@luxfi/wallet/src/features/dappRequests/utils/buildBlockaidScanJsonRpcRequest'

interface UseTypedDataSectionsParams {
  parsedTypedData: unknown
  chainId: UniverseChainId
  account: string
  method: BlockaidScanJsonRpcRequest['data']['method']
  params: unknown[]
  dappUrl: string
}

interface UseTypedDataSectionsResult extends ParsedTransactionData {
  isLoading: boolean
}

/**
 * Hook that returns transaction sections for typed data requests.
 * Handles both LX swaps (with custom parsing) and regular typed data (via Blockaid scanning).
 * Risk level always comes from Blockaid.
 */
export function useTypedDataSections({
  parsedTypedData,
  chainId,
  account,
  method,
  params,
  dappUrl,
}: UseTypedDataSectionsParams): UseTypedDataSectionsResult {
  // Detect LX swap requests
  const isLxSwap = isLXSwapRequest(parsedTypedData)
  const lxSwapTypedData = isLxSwap ? (parsedTypedData as LXSwapRequest) : null

  // Build Blockaid scan request (always needed for risk level)
  const blockaidRequest = useMemo(
    () =>
      buildBlockaidScanJsonRpcRequest({
        chainId,
        account,
        method,
        params,
        dappUrl,
      }),
    [chainId, account, method, params, dappUrl],
  )

  // Scan with Blockaid (for risk level and fallback sections)
  const { scanResult, isLoading: isBlockaidLoading } = useBlockaidJsonRpcScan(blockaidRequest, Boolean(blockaidRequest))

  // Parse LX sections (returns empty when not LX)
  const { sections: lxSwapSections, isLoading: isLXLoading } = useParseLXSwap(lxSwapTypedData, chainId)

  // Parse Blockaid result for risk level and sections
  const { sections: blockaidSections, riskLevel } = useMemo(
    () => parseTransactionSections(scanResult ?? null, chainId),
    [scanResult, chainId],
  )

  // Use LX sections if available, otherwise fall back to Blockaid sections
  const sections = isLxSwap ? lxSwapSections : blockaidSections

  // Loading: wait for Blockaid (always), plus LX parsing if applicable
  const isLoading = isBlockaidLoading || (isLxSwap && isLXLoading)

  return {
    sections,
    riskLevel,
    isLoading,
  }
}
