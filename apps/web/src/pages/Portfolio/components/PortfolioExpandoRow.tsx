import { Flex, FlexProps, Text, TextProps, TouchableArea } from 'ui/src'
import { ChevronsIn } from 'ui/src/components/icons/ChevronsIn'
import { ChevronsOut } from 'ui/src/components/icons/ChevronsOut'
import { IconSizeTokens } from 'ui/src/theme'

interface PortfolioExpandoRowProps {
  isExpanded: boolean
  label: string
  onPress: () => void
  dataTestId?: string
  iconAlignRight?: boolean
  textVariant?: TextProps['variant']
  iconSize?: IconSizeTokens
  p?: FlexProps['p']
}

export function PortfolioExpandoRow({
  isExpanded,
  label,
  onPress,
  dataTestId,
  iconAlignRight = false,
  textVariant = 'body2',
  iconSize = '$icon.20',
  p = '$spacing16',
}: PortfolioExpandoRowProps): JSX.Element {
  return (
    <TouchableArea
      onPress={onPress}
      row
      gap={iconAlignRight ? undefined : '$gap8'}
      justifyContent={iconAlignRight ? 'space-between' : undefined}
      alignItems="center"
      p={p}
      data-testid={dataTestId}
    >
      <Text variant={textVariant} color="$neutral2">
        {label}
      </Text>
      <Flex justifyContent="center" testID="expando-row-icon">
        {isExpanded ? (
          <ChevronsIn color="$neutral2" size={iconSize} />
        ) : (
          <ChevronsOut color="$neutral2" size={iconSize} />
        )}
      </Flex>
    </TouchableArea>
  )
}
