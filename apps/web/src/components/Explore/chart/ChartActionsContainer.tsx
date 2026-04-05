<<<<<<< HEAD
import { Flex, styled } from '@l.x/ui/src'
=======
import { Flex, styled } from 'ui/src'
>>>>>>> upstream/main

export const ChartActionsContainer = styled(Flex, {
  flexDirection: 'row-reverse',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: 12,
  $md: {
    flexDirection: 'column',
    gap: 16,
  },
})
