import { ReactNode } from 'react'
import { Flex, Text, TouchableArea } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'

export function SettingsButton({
  title,
  currentState,
  onClick,
  testId,
  showArrow = true,
  icon,
}: {
  title: ReactNode
  currentState?: ReactNode
  onClick: () => void
  testId?: string
  showArrow?: boolean
  icon?: ReactNode
}): JSX.Element {
  return (
    <TouchableArea row justifyContent="space-between" py="$padding12" onPress={onClick} testID={testId}>
      <Flex row gap="$gap12" alignItems="center">
        {icon}
        <Text variant="subheading2" color="$neutral1">
          {title}
        </Text>
      </Flex>
      <Flex row gap="$spacing4" alignItems="center" width="min-content">
        {currentState && (
          <Text variant="body3" color="$neutral2" whiteSpace="nowrap">
            {currentState}
          </Text>
        )}
        {showArrow && <RotatableChevron color="$neutral3" direction="right" size="$icon.20" />}
      </Flex>
    </TouchableArea>
  )
}
