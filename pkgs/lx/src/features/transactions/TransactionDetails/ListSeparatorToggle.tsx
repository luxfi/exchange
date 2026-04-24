import { Flex, Separator, Text, TouchableArea } from '@l.x/ui/src'
import { AnglesMaximize } from '@l.x/ui/src/components/icons/AnglesMaximize'
import { AnglesMinimize } from '@l.x/ui/src/components/icons/AnglesMinimize'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'

export function ListSeparatorToggle({
  onPress,
  isOpen,
  openText,
  closedText,
}: {
  onPress: (() => void) | null | undefined
  isOpen?: boolean
  openText: string
  closedText: string
}): JSX.Element {
  return (
    <Flex group centered row gap="$spacing16" mb="$spacing16" px="$spacing12" testID={TestID.ListSeparatorToggle}>
      <Separator />
      <TouchableArea
        flexGrow={1}
        alignItems="center"
        flexDirection="row"
        justifyContent="center"
        pb="$spacing4"
        pt="$spacing8"
        onPress={onPress}
      >
        <Text $group-hover={{ color: '$neutral2Hovered' }} color="$neutral2" variant="body3">
          {isOpen ? openText : closedText}
        </Text>
        {isOpen ? (
          <AnglesMinimize color="$neutral2" size="$icon.20" />
        ) : (
          <AnglesMaximize color="$neutral2" size="$icon.20" />
        )}
      </TouchableArea>
      <Separator />
    </Flex>
  )
}
