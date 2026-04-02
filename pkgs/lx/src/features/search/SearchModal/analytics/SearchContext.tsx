import { OnchainItemSectionName } from 'lx/src/components/lists/OnchainItemList/types'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { SearchTab } from 'lx/src/features/search/SearchModal/types'

export type SearchFilterContext = {
  query?: string
  searchChainFilter: UniverseChainId | null
  searchTabFilter: SearchTab
}

export type SearchContext = {
  category?: OnchainItemSectionName
  query?: string
  position?: number // overall position of item in list (1-indexed)
  sectionPosition?: number // position of item in section (1-indexed)
  suggestionCount?: number
  isHistory?: boolean // history item click
} & Partial<SearchFilterContext>
