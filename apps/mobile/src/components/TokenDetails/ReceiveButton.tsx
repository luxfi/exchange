import { useTranslation } from 'react-i18next'
import { useOpenReceiveModal } from 'src/features/modals/hooks/useOpenReceiveModal'
<<<<<<< HEAD
import { Button, Flex } from '@l.x/ui/src'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
=======
import { Button, Flex } from 'ui/src'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
>>>>>>> upstream/main

export function ReceiveButton({ onPress }: { onPress: () => void }): JSX.Element {
  const { t } = useTranslation()
  const openReceiveModal = useOpenReceiveModal()

  return (
    <Flex row>
      <Trace logPress element={ElementName.Receive}>
        <Button
          size="medium"
          emphasis="secondary"
          onPress={() => {
            onPress()
            openReceiveModal()
          }}
        >
          {t('common.receive')}
        </Button>
      </Trace>
    </Flex>
  )
}
