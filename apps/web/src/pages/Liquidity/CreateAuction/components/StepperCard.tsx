import { Flex, Text, TouchableArea } from 'ui/src'
import { Minus } from 'ui/src/components/icons/Minus'
import { Plus } from 'ui/src/components/icons/Plus'

export function StepperCard({
  label,
  value,
  onDecrement,
  onIncrement,
}: {
  label: string
  value: string
  onDecrement: () => void
  onIncrement: () => void
}) {
  return (
    <Flex flex={1} flexBasis={0} backgroundColor="$surface2" borderRadius="$rounded16" p="$spacing16" gap="$spacing4">
      <Text flex={1} variant="body3" color="$neutral2">
        {label}
      </Text>
      <Flex row alignItems="center" justifyContent="space-between" flex={1} userSelect="none">
        <Text variant="subheading1" color="$neutral1">
          {value}
        </Text>
        <Flex row gap="$spacing8">
          <TouchableArea
            borderWidth="$spacing1"
            borderColor="$surface3"
            borderRadius="$roundedFull"
            p="$spacing6"
            onPress={onDecrement}
          >
            <Minus size="$icon.16" color="$neutral1" />
          </TouchableArea>
          <TouchableArea
            borderWidth="$spacing1"
            borderColor="$surface3"
            borderRadius="$roundedFull"
            p="$spacing6"
            onPress={onIncrement}
          >
            <Plus size="$icon.16" color="$neutral1" />
          </TouchableArea>
        </Flex>
      </Flex>
    </Flex>
  )
}
