import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from 'ui/src'
import { X } from 'ui/src/components/icons/X'
import { Modal } from 'uniswap/src/components/modals/Modal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { DetailsTab } from '~/components/Toucan/Auction/ActivityTimeline/DetailsTab'

interface AuctionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuctionDetailsModal({ isOpen, onClose }: AuctionDetailsModalProps) {
  const { t } = useTranslation()

  return (
    <Modal isModalOpen={isOpen} name={ModalName.Dialog} onClose={onClose} maxWidth={540} padding={0}>
      <Flex backgroundColor="$surface1" overflow="hidden">
        {/* Header */}
        <Flex px="$spacing24" py="$spacing16">
          <Flex row justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderColor="$surface3">
            <Text variant="subheading1" color="$neutral1">
              {t('toucan.details.title')}
            </Text>
            <TouchableArea onPress={onClose} p="$spacing8" borderRadius="$rounded8">
              <X size="$icon.24" color="$neutral1" />
            </TouchableArea>
          </Flex>
        </Flex>

        <DetailsTab />
      </Flex>
    </Modal>
  )
}
