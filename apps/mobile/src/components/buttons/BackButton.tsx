import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { BackButtonView } from 'src/components/layout/BackButtonView'
<<<<<<< HEAD
import { ColorTokens, TouchableArea, TouchableAreaProps } from '@l.x/ui/src'
import { IconSizeTokens } from '@l.x/ui/src/theme'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
=======
import { ColorTokens, TouchableArea, TouchableAreaProps } from 'ui/src'
import { IconSizeTokens } from 'ui/src/theme'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
>>>>>>> upstream/main

type Props = {
  size?: IconSizeTokens
  color?: ColorTokens
  showButtonLabel?: boolean
  onPressBack?: () => void
} & TouchableAreaProps

export function BackButton({ onPressBack, size, color, showButtonLabel, ...rest }: Props): JSX.Element {
  const navigation = useNavigation()

  const goBack = onPressBack
    ? onPressBack
    : (): void => {
        navigation.goBack()
      }
  return (
    <TouchableArea
      alignItems="center"
      hitSlop={24}
      testID={TestID.Back}
      dd-action-name={TestID.Back}
      onPress={goBack}
      {...rest}
    >
      <BackButtonView color={color} showButtonLabel={showButtonLabel} size={size} />
    </TouchableArea>
  )
}
