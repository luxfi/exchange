import { SearchHistoryResult } from 'lx/src/features/search/SearchHistoryResult'
import { LXState } from 'lx/src/state/lxReducer'

export const selectSearchHistory = (state: LXState): SearchHistoryResult[] => {
  return state.searchHistory.results
}
