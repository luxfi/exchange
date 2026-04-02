import type { SwapSettingsState } from 'lx/src/features/transactions/swap/state/slice'
import type { LXRootState } from 'lx/src/state'

export const selectFilteredChainIds = (state: LXRootState): SwapSettingsState['filteredChainIds'] =>
  state.swapSettings.filteredChainIds
