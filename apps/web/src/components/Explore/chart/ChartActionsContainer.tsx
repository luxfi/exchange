import { Flex, styled } from '@luxfi/ui/src'

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
