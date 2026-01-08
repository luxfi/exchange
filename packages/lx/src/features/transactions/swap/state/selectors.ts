import type { SwapSettingsState } from 'lx/src/features/transactions/swap/state/slice'
import type { UniswapRootState } from 'lx/src/state'

export const selectFilteredChainIds = (state: UniswapRootState): SwapSettingsState['filteredChainIds'] =>
  state.swapSettings.filteredChainIds
