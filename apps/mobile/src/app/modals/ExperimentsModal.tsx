import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { SeedPhraseAndPrivateKeysDevSection } from 'src/components/experiments/SeedPhraseAndPrivateKeysDevSection'
import { ServerOverrides } from 'src/components/experiments/ServerOverrides'
import { useReactNavigationModal } from 'src/components/modals/useReactNavigationModal'
import { E2EPixel } from 'src/test/E2EPixel'
import { getFullAppVersion } from 'src/utils/version'
import { Accordion, Text } from '@luxfi/ui/src'
import { spacing } from '@luxfi/ui/src/theme'
import { CacheConfig } from '@luxexchange/lx/src/components/gating/CacheConfig'
import { GatingOverrides } from '@luxexchange/lx/src/components/gating/GatingOverrides'
import { Modal } from '@luxexchange/lx/src/components/modals/Modal'
import { ModalName } from '@luxexchange/lx/src/features/telemetry/constants'
import { useAppInsets } from '@luxexchange/lx/src/hooks/useAppInsets'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'

export function ExperimentsModal(): JSX.Element {
  const insets = useAppInsets()
  const { onClose } = useReactNavigationModal()

  return (
    <Modal fullScreen renderBehindBottomInset name={ModalName.Experiments} onClose={onClose}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom,
          paddingRight: spacing.spacing24,
          paddingLeft: spacing.spacing24,
        }}
      >
        <E2EPixel testID={TestID.Close} onPress={onClose} />
        <Text variant="body2" my="$spacing12">{`Version: ${getFullAppVersion({ includeBuildNumber: true })}`}</Text>
        <Accordion collapsible gap="$spacing12" type="single">
          <Text variant="heading3">Gating</Text>
          <GatingOverrides />

          <Text variant="heading3" mt="$padding12">
            Miscellaneous
          </Text>
          <CacheConfig />
          <ServerOverrides />
          <SeedPhraseAndPrivateKeysDevSection />
        </Accordion>
      </ScrollView>
    </Modal>
  )
}
