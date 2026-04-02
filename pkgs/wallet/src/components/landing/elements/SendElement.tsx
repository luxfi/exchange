import { Flex, useIsDarkMode } from '@l.x/ui/src'
import { SendAction } from '@l.x/ui/src/components/icons'
import { colors, iconSizes, opacify, validColor } from '@l.x/ui/src/theme'

export const SendElement = (): JSX.Element => {
  const isDarkMode = useIsDarkMode()

  return (
    <Flex
      backgroundColor={isDarkMode ? opacify(20, colors.greenBase) : opacify(10, colors.greenBase)}
      borderRadius="$rounded12"
      p="$spacing12"
      $xs={{ p: '$spacing8' }}
    >
      <SendAction
        color={isDarkMode ? validColor(colors.greenVibrant) : opacify(70, colors.greenBase)}
        size="$icon.28"
        $xs={{ size: iconSizes.icon20 }}
      />
    </Flex>
  )
}
