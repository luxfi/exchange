import { Flex, useIsDarkMode } from '@l.x/ui/src'
import { Plus } from '@l.x/ui/src/components/icons'
import { iconSizes } from '@l.x/ui/src/theme'
import { isExtensionApp } from '@l.x/utils/src/platform'

export function PlusCircle(): JSX.Element {
  const isDarkMode = useIsDarkMode()

  return (
    <Flex
      centered
      backgroundColor="$surface1"
      borderColor="$surface3"
      borderRadius="$roundedFull"
      borderWidth="$spacing1"
      height={isExtensionApp ? iconSizes.icon40 : iconSizes.icon32}
      p="$spacing8"
      shadowColor={isDarkMode ? '$shadowColor' : '$surface3'}
      shadowOffset={{ width: 0, height: 0 }}
      shadowRadius={10}
      width={isExtensionApp ? iconSizes.icon40 : iconSizes.icon32}
    >
      <Plus color="$neutral2" size={isExtensionApp ? '$icon.36' : '$icon.16'} strokeWidth={2} />
    </Flex>
  )
}
