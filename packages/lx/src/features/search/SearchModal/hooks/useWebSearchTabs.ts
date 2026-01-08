import { FeatureFlags, useFeatureFlag } from '@luxfi/gating'
import { SearchTab, WEB_SEARCH_TABS, WEB_SEARCH_TABS_WITH_WALLETS } from 'lx/src/features/search/SearchModal/types'

export function useWebSearchTabs(): SearchTab[] {
  const walletSearchEnabled = useFeatureFlag(FeatureFlags.ViewExternalWalletsOnWeb)
  return walletSearchEnabled ? WEB_SEARCH_TABS_WITH_WALLETS : WEB_SEARCH_TABS
}
