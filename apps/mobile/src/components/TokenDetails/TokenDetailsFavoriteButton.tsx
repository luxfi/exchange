import React from 'react'
import { useSelector } from 'react-redux'
import { Favorite } from 'src/components/icons/Favorite'
<<<<<<< HEAD
import { TouchableArea } from '@l.x/ui/src'
import { iconSizes } from '@l.x/ui/src/theme'
import { selectFavoriteTokens } from '@l.x/lx/src/features/favorites/selectors'
import { useToggleFavoriteCallback } from '@l.x/lx/src/features/favorites/useToggleFavoriteCallback'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
=======
import { TouchableArea } from 'ui/src'
import { iconSizes } from 'ui/src/theme'
import { selectFavoriteTokens } from 'uniswap/src/features/favorites/selectors'
import { useToggleFavoriteCallback } from 'uniswap/src/features/favorites/useToggleFavoriteCallback'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
>>>>>>> upstream/main

export function TokenDetailsFavoriteButton({
  currencyId,
  tokenName,
}: {
  currencyId: string
  tokenName?: string
}): JSX.Element {
  const id = currencyId.toLowerCase()
  const isFavoriteToken = useSelector(selectFavoriteTokens).indexOf(id) !== -1
  const onFavoritePress = useToggleFavoriteCallback({ id, tokenName, isFavoriteToken })
  return (
    <TouchableArea
      hitSlop={{ right: 20, left: 5, top: 20, bottom: 20 }}
      testID={TestID.TokenDetailsFavoriteButton}
      onPress={onFavoritePress}
    >
      <Favorite isFavorited={isFavoriteToken} size={iconSizes.icon24} />
    </TouchableArea>
  )
}
