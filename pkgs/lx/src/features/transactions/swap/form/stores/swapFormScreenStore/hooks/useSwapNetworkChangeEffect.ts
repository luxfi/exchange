import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import type { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import type { SwapChains } from '@l.x/lx/src/features/transactions/swap/form/stores/swapFormScreenStore/hooks/useChainIdsChangeEffect'
import { useChainIdsChangeEffect } from '@l.x/lx/src/features/transactions/swap/form/stores/swapFormScreenStore/hooks/useChainIdsChangeEffect'
import { isMobileApp } from '@l.x/utils/src/platform'
import { useEvent } from '@l.x/utils/src/react/hooks'

export function useSwapNetworkChangeEffect({
  inputChainId,
  outputChainId,
}: {
  inputChainId?: UniverseChainId
  outputChainId?: UniverseChainId
}): void {
  const { onSwapChainsChanged } = useLuxContext()

  const onChainIdsChanged = useEvent(
    ({
      currentChains,
      prevChains,
    }: {
      currentChains: SwapChains
      prevChains: SwapChains
      hasInputChanged: boolean
      hasOutputChanged: boolean
    }) => {
      const { inputChainId: currentInputChainId, outputChainId: currentOutputChainId } = currentChains
      const { inputChainId: lastInputChainId, outputChainId: lastOutputChainId } = prevChains
      const prevChainId = lastInputChainId ?? lastOutputChainId

      // Determine notification type and trigger
      if (currentInputChainId && currentOutputChainId && currentInputChainId !== currentOutputChainId) {
        onSwapChainsChanged({ chainId: currentInputChainId, outputChainId: currentOutputChainId }) // Bridging notification
      } else if (currentInputChainId || (currentOutputChainId && prevChainId)) {
        const chainId = currentInputChainId ?? currentOutputChainId
        // User is swapping on the same chain, don't show notification
        if (!chainId || chainId === prevChainId) {
          return
        }
        onSwapChainsChanged({ chainId, prevChainId }) // Non-bridging notification
      }
    },
  )

  const skipInitialCallback = (!!inputChainId && !!outputChainId && inputChainId === outputChainId) || isMobileApp

  useChainIdsChangeEffect({
    inputChainId,
    outputChainId,
    onChainIdsChanged,
    skipInitialCallback,
  })
}
