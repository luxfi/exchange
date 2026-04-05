import { CSSProperties, ReactNode } from 'react'
<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
=======
import { Flex } from 'ui/src'
>>>>>>> upstream/main

interface TokenLaunchedBannerWrapperProps {
  bannerGradient: CSSProperties
  children: ReactNode
}

export function TokenLaunchedBannerWrapper({ bannerGradient, children }: TokenLaunchedBannerWrapperProps) {
  return (
    <Flex
      position="relative"
      overflow="hidden"
      borderRadius="$rounded24"
      width="100%"
      p="$spacing20"
      mb="$spacing28"
      $md={{ mb: '$spacing20' }}
      style={bannerGradient}
    >
      {children}
    </Flex>
  )
}
