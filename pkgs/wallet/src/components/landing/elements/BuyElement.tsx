import { Flex, useIsDarkMode } from '@l.x/ui/src'
import { Buy } from '@l.x/ui/src/components/icons'
import { colors, opacify, validColor } from '@l.x/ui/src/theme'

export const BuyElement = (): JSX.Element => {
  const isDarkMode = useIsDarkMode()

  return (
    <Flex
      centered
      row
      backgroundColor={isDarkMode ? opacify(10, colors.orangeBase) : validColor(colors.orangeLight)}
      borderRadius="$rounded12"
      gap="$spacing4"
      p="$spacing12"
    >
      <Buy color={validColor('$orangeBase')} size="$icon.20" />
    </Flex>
  )
}
