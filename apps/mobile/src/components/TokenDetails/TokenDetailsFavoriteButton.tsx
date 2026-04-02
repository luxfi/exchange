import React from 'react'
import { useSelector } from 'react-redux'
import { Favorite } from 'src/components/icons/Favorite'
import { TouchableArea } from '@luxfi/ui/src'
import { iconSizes } from '@luxfi/ui/src/theme'
import { selectFavoriteTokens } from '@luxexchange/lx/src/features/favorites/selectors'
import { useToggleFavoriteCallback } from '@luxexchange/lx/src/features/favorites/useToggleFavoriteCallback'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'

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
