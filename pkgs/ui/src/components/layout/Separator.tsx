import { View as Stack, styled } from '@hanzo/gui'
import { isWebPlatform } from '@l.x/utils/src/platform'

export const Separator = styled(Stack, {
  name: 'Separator',
  borderColor: '$surface3',
  flexShrink: 0,
  borderWidth: 0,
  borderBottomWidth: 1,

  variants: {
    vertical: {
      true: {
        borderBottomWidth: 0,
        ...(isWebPlatform ? { borderLeftWidth: 1 } : { borderRightWidth: 1 }),
      },
    },
  } as const,
})
