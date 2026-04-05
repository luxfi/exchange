import type { ScrollView } from 'react-native'
import type { FlatList } from 'react-native-gesture-handler'
import type { AnimatedRef } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { FavoriteTokensGrid } from 'src/components/explore/FavoriteTokensGrid'
import { FavoriteWalletsGrid } from 'src/components/explore/FavoriteWalletsGrid'
<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
import { selectHasFavoriteTokens, selectHasWatchedWallets } from '@l.x/lx/src/features/favorites/selectors'
=======
import { Flex } from 'ui/src'
import { selectHasFavoriteTokens, selectHasWatchedWallets } from 'uniswap/src/features/favorites/selectors'
>>>>>>> upstream/main

type FavoritesSectionProps = {
  showLoading: boolean
  listRef: AnimatedRef<FlatList> | AnimatedRef<ScrollView>
}

export function FavoritesSection(props: FavoritesSectionProps): JSX.Element | null {
  const hasFavoritedTokens = useSelector(selectHasFavoriteTokens)
  const hasFavoritedWallets = useSelector(selectHasWatchedWallets)

  if (!hasFavoritedTokens && !hasFavoritedWallets) {
    return null
  }

  return (
    <Flex gap="$spacing12" pb="$spacing12" px="$spacing12" zIndex={1}>
      {hasFavoritedTokens && <FavoriteTokensGrid {...props} />}
      {hasFavoritedWallets && <FavoriteWalletsGrid {...props} />}
    </Flex>
  )
}
