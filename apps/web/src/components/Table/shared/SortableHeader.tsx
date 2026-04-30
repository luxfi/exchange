import { ArrowDown } from '@l.x/ui/src/components/icons/ArrowDown'
import { ArrowUp } from '@l.x/ui/src/components/icons/ArrowUp'
import { Flex, styled, Text } from '@l.x/ui/src/index'
import { IconSizeTokens } from '@l.x/ui/src/theme'
import { ClickableGuiStyle } from '~/theme/components/styles'

export const ClickableHeaderRow = styled(Flex, {
  row: true,
  alignItems: 'center',
  justifyContent: 'flex-end',

  ...ClickableGuiStyle,
})

export function HeaderArrow({
  orderDirection,
  size,
}: {
  orderDirection: 'asc' | 'desc'
  size: IconSizeTokens
}): JSX.Element {
  const Icon = orderDirection === 'asc' ? ArrowUp : ArrowDown
  return <Icon size={size} color="$neutral1" hoverStyle={{ opacity: 0.5 }} transition="opacity 0.08s ease-in-out" />
}

export const HeaderSortText = styled(Text, {
  variant: 'body3',
  color: '$neutral2',
  whiteSpace: 'nowrap',

  variants: {
    active: {
      true: {
        color: '$neutral1',
      },
    },
  } as const,
})
