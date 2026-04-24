import type { SwapSettingsState } from '@l.x/lx/src/features/transactions/swap/state/slice'
import type { LXRootState } from '@l.x/lx/src/state'

export const selectFilteredChainIds = (state: LXRootState): SwapSettingsState['filteredChainIds'] =>
  state.swapSettings.filteredChainIds
