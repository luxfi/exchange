import { SearchHistoryResult } from '@l.x/lx/src/features/search/SearchHistoryResult'
import { LXState } from '@l.x/lx/src/state/lxReducer'

export const selectSearchHistory = (state: LXState): SearchHistoryResult[] => {
  return state.searchHistory.results
}
