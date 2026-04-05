import React from 'react'
import { Extrapolate, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
import { AnimatedFlex } from '@l.x/ui/src/components/layout/AnimatedFlex'
import { useDeviceDimensions } from '@l.x/ui/src/hooks/useDeviceDimensions'
=======
import { Flex } from 'ui/src'
import { AnimatedFlex } from 'ui/src/components/layout/AnimatedFlex'
import { useDeviceDimensions } from 'ui/src/hooks/useDeviceDimensions'
>>>>>>> upstream/main

export function AnimatedIndicator({
  scroll,
  stepCount,
}: {
  scroll: SharedValue<number>
  stepCount: number
}): JSX.Element {
  return (
    <Flex centered row gap="$spacing12" px="$spacing24">
      {[...Array(stepCount)].map((_, i) => (
        <AnimatedIndicatorPill key={i} index={i} scroll={scroll} />
      ))}
    </Flex>
  )
}

function AnimatedIndicatorPill({ index, scroll }: { index: number; scroll: SharedValue<number> }): JSX.Element {
  const { fullWidth } = useDeviceDimensions()
  const style = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth]
    return {
      opacity: interpolate(scroll.value, inputRange, [0.2, 1, 0.2], Extrapolate.CLAMP),
    }
  })

  return (
    <AnimatedFlex
      key={`indicator-${index}`}
      fill
      backgroundColor="$neutral1"
      borderRadius="$rounded16"
      height={4}
      style={style}
    />
  )
}
