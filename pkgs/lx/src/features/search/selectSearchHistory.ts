import { SearchHistoryResult } from 'lx/src/features/search/SearchHistoryResult'
import { LxState } from 'lx/src/state/lxReducer'

export const selectSearchHistory = (state: LxState): SearchHistoryResult[] => {
  return state.searchHistory.results
}
