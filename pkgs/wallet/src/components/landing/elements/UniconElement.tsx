import { Flex, useIsDarkMode } from '@l.x/ui/src'
import { OnboardingUnicon } from '@l.x/ui/src/components/icons'
import { DEP_accentColors, opacify, validColor } from '@l.x/ui/src/theme'

export const UniconElement = (): JSX.Element => {
  const isDarkMode = useIsDarkMode()

  return (
    <Flex
      backgroundColor={isDarkMode ? validColor('$purpleDark') : opacify(20, DEP_accentColors.violet200)}
      borderRadius="$roundedFull"
      p="$spacing8"
      transform={[{ rotateZ: '-4deg' }]}
    >
      <OnboardingUnicon color={DEP_accentColors.violet400} size="$icon.28" />
    </Flex>
  )
}
