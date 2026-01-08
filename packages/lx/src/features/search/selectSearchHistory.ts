import { SearchHistoryResult } from 'lx/src/features/search/SearchHistoryResult'
import { UniswapState } from 'lx/src/state/uniswapReducer'

export const selectSearchHistory = (state: UniswapState): SearchHistoryResult[] => {
  return state.searchHistory.results
}
