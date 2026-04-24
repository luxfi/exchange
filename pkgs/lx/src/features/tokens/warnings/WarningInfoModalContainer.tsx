import { Flex, styled } from '@l.x/ui/src'
import { isMobileApp } from '@l.x/utils/src/platform'

export const WarningModalInfoContainer = styled(Flex, {
  width: '100%',
  backgroundColor: '$surface2',
  px: '$spacing16',
  py: isMobileApp ? '$spacing8' : '$spacing12',
  alignItems: 'center',
  flexWrap: 'nowrap',
})
