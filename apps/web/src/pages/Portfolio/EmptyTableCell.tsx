import { EM_DASH, Text } from '@l.x/ui/src'

export function EmptyTableCell(): JSX.Element {
  return (
    <Text variant="body3" color="$neutral2">
      {EM_DASH}
    </Text>
  )
}
