import { Flex, Separator, Text, TouchableArea, useLayoutAnimationOnChange, type SpaceTokens } from 'ui/src'
import { AnglesDownUp } from 'ui/src/components/icons/AnglesDownUp'
import { SortVertical } from 'ui/src/components/icons/SortVertical'

export type ExpandoRowProps = {
  isExpanded: boolean
  onPress: () => void
  label: string
  mx?: number | SpaceTokens
}

export function ExpandoRow({ label, isExpanded, onPress, mx }: ExpandoRowProps): JSX.Element {
  useLayoutAnimationOnChange(isExpanded)

  return (
    <TouchableArea activeOpacity={1} mx={mx} testID="expando-row" onPress={onPress}>
      <Flex row alignItems="center" justifyContent="space-between" py="$spacing8">
        <Flex centered grow row gap="$spacing12">
          <Separator />

          <Flex centered row gap="$gap4">
            <Text color="$neutral3" textAlign="center" variant="body3" testID="expando-row-label">
              {label}
            </Text>

            <Flex centered justifyContent="center" testID="expando-row-icon">
              {isExpanded ? (
                <AnglesDownUp color="$neutral3" size="$icon.16" />
              ) : (
                <SortVertical color="$neutral3" size="$icon.16" />
              )}
            </Flex>
          </Flex>

          <Separator />
        </Flex>
      </Flex>
    </TouchableArea>
  )
}
