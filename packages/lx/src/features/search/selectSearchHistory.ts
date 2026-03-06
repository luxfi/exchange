import { SearchHistoryResult } from 'lx/src/features/search/SearchHistoryResult'
import { LuxState } from 'lx/src/state/luxReducer'

export const selectSearchHistory = (state: LuxState): SearchHistoryResult[] => {
  return state.searchHistory.results
}
