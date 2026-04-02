import type { SwapSettingsState } from 'lx/src/features/transactions/swap/state/slice'
import type { LxRootState } from 'lx/src/state'

export const selectFilteredChainIds = (state: LxRootState): SwapSettingsState['filteredChainIds'] =>
  state.swapSettings.filteredChainIds
