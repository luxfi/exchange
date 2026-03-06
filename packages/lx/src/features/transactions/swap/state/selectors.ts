import type { SwapSettingsState } from 'lx/src/features/transactions/swap/state/slice'
import type { LuxRootState } from 'lx/src/state'

export const selectFilteredChainIds = (state: LuxRootState): SwapSettingsState['filteredChainIds'] =>
  state.swapSettings.filteredChainIds
