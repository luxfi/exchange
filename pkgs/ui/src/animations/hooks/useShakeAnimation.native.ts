import { useMemo } from 'react'
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { errorShakeAnimation } from '@l.x/ui/src/animations/errorShakeAnimation.native'
import { useEvent } from '@l.x/utils/src/react/hooks'

export interface ShakeAnimation {
  shakeStyle: ReturnType<typeof useAnimatedStyle>
  triggerShakeAnimation: () => void
}

export const useShakeAnimation = (): ShakeAnimation => {
  const shakeValue = useSharedValue(0)
  const shakeStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: shakeValue.value }],
    }),
    [shakeValue.value],
  )

  const triggerShakeAnimation = useEvent(() => {
    shakeValue.value = errorShakeAnimation(shakeValue)
  })

  return useMemo(
    () => ({
      shakeStyle,
      triggerShakeAnimation,
    }),
    [shakeStyle, triggerShakeAnimation],
  )
}
