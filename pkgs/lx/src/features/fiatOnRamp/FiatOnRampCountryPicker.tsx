import { Flex, TouchableArea, UniversalImage } from '@l.x/ui/src'
import { RotatableChevron } from '@l.x/ui/src/components/icons/RotatableChevron'
import { iconSizes } from '@l.x/ui/src/theme'
import { getCountryFlagSvgUrl } from '@l.x/lx/src/features/fiatOnRamp/utils'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { isWebPlatform } from '@l.x/utils/src/platform'

const ICON_SIZE = iconSizes.icon16

export function FiatOnRampCountryPicker({
  onPress,
  countryCode = 'US',
}: {
  onPress: () => void
  countryCode: Maybe<string>
}): JSX.Element | null {
  if (!countryCode) {
    return null
  }

  const countryFlagUrl = getCountryFlagSvgUrl(countryCode)

  return (
    <Trace logPress element={ElementName.FiatOnRampCountryPicker}>
      <TouchableArea
        backgroundColor="$surface3"
        borderRadius="$roundedFull"
        hoverStyle={{
          opacity: 0.5,
        }}
        overflow="hidden"
        pl="$spacing8"
        pr="$spacing4"
        py="$spacing2"
        onPress={onPress}
      >
        <Flex row shrink alignItems="center" data-testid={TestID.FiatOnRampCountryPicker} flex={0} gap="$spacing2">
          <Flex borderRadius="$roundedFull" overflow="hidden">
            {isWebPlatform ? (
              <img alt={countryCode} height={ICON_SIZE} src={countryFlagUrl} width={ICON_SIZE} />
            ) : (
              <UniversalImage
                size={{
                  height: ICON_SIZE,
                  width: ICON_SIZE,
                }}
                uri={countryFlagUrl}
              />
            )}
          </Flex>
          <RotatableChevron color="$neutral2" direction="down" size="$icon.20" />
        </Flex>
      </TouchableArea>
    </Trace>
  )
}
