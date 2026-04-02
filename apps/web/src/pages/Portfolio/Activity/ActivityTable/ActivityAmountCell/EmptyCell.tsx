import { EM_DASH, Text } from '@luxfi/ui/src'

export function EmptyCell(): JSX.Element {
  return (
    <Text variant="body3" color="$neutral3">
      {EM_DASH}
    </Text>
  )
}
