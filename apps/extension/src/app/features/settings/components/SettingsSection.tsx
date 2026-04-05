import { SCREEN_ITEM_HORIZONTAL_PAD } from 'src/app/constants'
<<<<<<< HEAD
import { Flex, Text } from '@l.x/ui/src'
=======
import { Flex, Text } from 'ui/src'
>>>>>>> upstream/main

export function SettingsSection({
  title,
  children,
}: {
  title: string
  children: JSX.Element | JSX.Element[]
}): JSX.Element {
  return (
    <Flex gap="$spacing8">
      <Text color="$neutral2" px={SCREEN_ITEM_HORIZONTAL_PAD} variant="subheading2">
        {title}
      </Text>
      {children}
    </Flex>
  )
}
