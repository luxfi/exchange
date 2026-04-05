<<<<<<< HEAD
import { brand, getBrandUrl, getDocsUrl } from '@l.x/config'
import { Trans, useTranslation } from 'react-i18next'
import { Flex, Text } from '@l.x/ui/src'
import { Blocked } from '@l.x/ui/src/components/icons/Blocked'
import { Modal } from '@l.x/lx/src/components/modals/Modal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
=======
import { Trans, useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { Blocked } from 'ui/src/components/icons/Blocked'
import { Modal } from 'uniswap/src/components/modals/Modal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main
import { useModalInitialState } from '~/hooks/useModalInitialState'
import { ModalState } from '~/hooks/useModalState'
import { CopyHelper } from '~/theme/components/CopyHelper'
import { ExternalLink } from '~/theme/components/Links'

export default function ConnectedAccountBlocked({ isOpen, closeModal }: ModalState) {
  const blockedAddress = useModalInitialState(ModalName.BlockedAccount)?.blockedAddress
  const { t } = useTranslation()
  return (
    <Modal name={ModalName.AccountBlocked} isModalOpen={isOpen} onClose={closeModal} padding={0}>
      <Flex centered margin="$spacing32" gap="$spacing24">
        <Flex centered gap="$spacing8">
          <Blocked color="$neutral2" size="$icon.24" />
          <Text variant="heading3">{t('common.blockedAddress')}</Text>
          <Text color="$neutral2" variant="body3">
            {blockedAddress}
          </Text>
        </Flex>
        <Flex centered gap="$spacing8">
          <Text color="$neutral2" variant="body4" textAlign="center">
            <Trans
              i18nKey="common.blocked.reason"
<<<<<<< HEAD
              components={{ link: <ExternalLink href={getDocsUrl('/help/blocked-addresses')} /> }}
=======
              components={{ link: <ExternalLink href="https://help.uniswap.org/en/articles/6149816" /> }}
>>>>>>> upstream/main
            />
          </Text>
          <Text color="$neutral2" variant="body4" textAlign="center">
            <Trans
              i18nKey="common.blocked.ifError"
              components={{
                emailAddress: (
                  <Flex mt="$spacing12" alignItems="center">
<<<<<<< HEAD
                    <CopyHelper toCopy="compliance@lux.exchange" iconSize={16} color="$accent1" iconPosition="right">
                      compliance@lux.exchange
=======
                    <CopyHelper toCopy="compliance@uniswap.org" iconSize={16} color="$accent1" iconPosition="right">
                      compliance@uniswap.org
>>>>>>> upstream/main
                    </CopyHelper>
                  </Flex>
                ),
              }}
            />
          </Text>
        </Flex>
      </Flex>
    </Modal>
  )
}
