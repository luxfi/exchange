<<<<<<< HEAD
import { Flex, styled } from '@l.x/ui/src'
=======
import { Flex, styled } from 'ui/src'
>>>>>>> upstream/main

export const CardContents = styled(Flex, {
  width: '100%',
  height: '100%',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  opacity: 1,

  $xxl: {
    opacity: 0.2,
  },

  $lg: {
    opacity: 0,
  },
})
