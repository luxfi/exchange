import { useTranslation } from 'react-i18next'
import { BackButton } from 'src/components/buttons/BackButton'
<<<<<<< HEAD
import { Text, TouchableArea } from '@l.x/ui/src'
import { RotatableChevron } from '@l.x/ui/src/components/icons'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
=======
import { Text, TouchableArea } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
>>>>>>> upstream/main

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
