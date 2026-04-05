import { ComponentProps, PropsWithChildren } from 'react'
<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
=======
import { Flex } from 'ui/src'
>>>>>>> upstream/main
import { MAX_CONTENT_WIDTH_PX } from '~/theme'

export const ToucanContainer = ({ children, ...props }: PropsWithChildren<ComponentProps<typeof Flex>>) => {
  return (
    <Flex
      width="100%"
      mx="auto"
      maxWidth={MAX_CONTENT_WIDTH_PX}
      $xxl={{ px: 80 }}
      $xl={{ px: '$spacing48' }}
      $lg={{ px: '$spacing48' }}
      $md={{ px: '$spacing32' }}
      $sm={{ px: '$spacing16' }}
      {...props}
    >
      {children}
    </Flex>
  )
}
