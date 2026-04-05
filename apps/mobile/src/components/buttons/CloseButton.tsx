import React from 'react'
<<<<<<< HEAD
import { ColorTokens, IconProps, TouchableArea, TouchableAreaProps } from '@l.x/ui/src'
import { X } from '@l.x/ui/src/components/icons'
=======
import { ColorTokens, IconProps, TouchableArea, TouchableAreaProps } from 'ui/src'
import { X } from 'ui/src/components/icons'
>>>>>>> upstream/main

type Props = {
  onPress: () => void
  size?: IconProps['size']
  strokeWidth?: number
  color?: ColorTokens
} & TouchableAreaProps

export function CloseButton({ onPress, size, strokeWidth, color, ...rest }: Props): JSX.Element {
  return (
<<<<<<< HEAD
    <TouchableArea onPress={onPress} {...rest} testID="buttons/close-button">
=======
    <TouchableArea {...rest} testID="buttons/close-button" onPress={onPress}>
>>>>>>> upstream/main
      <X color={color} size={size ?? '$icon.20'} strokeWidth={strokeWidth ?? 2} />
    </TouchableArea>
  )
}
