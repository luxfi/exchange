import { useTranslation } from 'react-i18next'
import { BackButton } from 'src/components/buttons/BackButton'
import { Text, TouchableArea } from '@luxfi/ui/src'
import { RotatableChevron } from '@luxfi/ui/src/components/icons'
import { ElementName } from '@luxexchange/lx/src/features/telemetry/constants'
import Trace from '@luxexchange/lx/src/features/telemetry/Trace'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'

export const renderHeaderBackButton = (): JSX.Element => (
  <BackButton color="$neutral2" size="$icon.28" testID={TestID.OnboardingHeaderBack} />
)

export const renderHeaderBackImage = (): JSX.Element => <RotatableChevron color="$neutral2" size="$icon.28" />

export const HeaderSkipButton = ({ onPress }: { onPress: () => void }): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Trace logPress element={ElementName.Skip}>
      <TouchableArea testID={TestID.Skip} onPress={() => onPress()}>
        <Text color="$neutral2" variant="buttonLabel2" testID={TestID.Skip}>
          {t('common.button.skip')}
        </Text>
      </TouchableArea>
    </Trace>
  )
}
