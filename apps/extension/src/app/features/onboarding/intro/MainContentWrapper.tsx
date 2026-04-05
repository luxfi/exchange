import { PropsWithChildren } from 'react'
import { ONBOARDING_CONTENT_WIDTH } from 'src/app/features/onboarding/utils'
<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
=======
import { Flex } from 'ui/src'
>>>>>>> upstream/main

export function MainContentWrapper({ children }: PropsWithChildren): JSX.Element {
  return (
    <Flex
      backgroundColor="$surface1"
      borderColor="$surface3"
      borderRadius="$rounded32"
      borderWidth="$spacing1"
      pb="$spacing24"
      pt="$spacing48"
      px="$spacing24"
      shadowColor="$shadowColor"
      shadowOpacity={0.1}
      shadowRadius={16}
      width={ONBOARDING_CONTENT_WIDTH}
    >
      {children}
    </Flex>
  )
}
