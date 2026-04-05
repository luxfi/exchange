import React from 'react'
import { Image, StyleSheet } from 'react-native'
<<<<<<< HEAD
import { Flex, useIsDarkMode } from '@l.x/ui/src'
import { LUX_MONO_LOGO_LARGE } from '@l.x/ui/src/assets'
import { useDeviceDimensions } from '@l.x/ui/src/hooks/useDeviceDimensions'
import { isAndroid } from '@l.x/utils/src/platform'
=======
import { Flex, useIsDarkMode } from 'ui/src'
import { UNISWAP_MONO_LOGO_LARGE } from 'ui/src/assets'
import { useDeviceDimensions } from 'ui/src/hooks/useDeviceDimensions'
import { isAndroid } from 'utilities/src/platform'
>>>>>>> upstream/main

export const SPLASH_SCREEN_IMAGE_SIZE = 150

export function SplashScreen(): JSX.Element {
  const dimensions = useDeviceDimensions()
  const isDarkMode = useIsDarkMode()

  return (
    <Flex
      alignItems="center"
      backgroundColor={isDarkMode ? '$surface1' : '$white'}
      justifyContent={isAndroid ? 'center' : undefined}
      pointerEvents="none"
      style={{
        height: dimensions.fullHeight,
        width: dimensions.fullWidth,
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
<<<<<<< HEAD
      <Image source={LUX_MONO_LOGO_LARGE} style={fixedStyle.logoStyle} />
=======
      <Image source={UNISWAP_MONO_LOGO_LARGE} style={fixedStyle.logoStyle} />
>>>>>>> upstream/main
    </Flex>
  )
}

const fixedStyle = StyleSheet.create({
  logoStyle: {
    height: SPLASH_SCREEN_IMAGE_SIZE,
    width: SPLASH_SCREEN_IMAGE_SIZE,
  },
})
