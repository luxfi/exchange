import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from '@luxfi/ui/src'
import { iconSizes } from '@luxfi/ui/src/theme'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { AccountIcon } from '@l.x/lx/src/features/accounts/AccountIcon'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { SmartWalletModal } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletModal'

interface SmartWalletUnavailableModalProps {
  isOpen: boolean
  onClose: () => void
  displayName: string
  walletAddress: string
}

export function SmartWalletUnavailableModal({
  isOpen,
  onClose,
  displayName,
  walletAddress,
}: SmartWalletUnavailableModalProps): JSX.Element {
  const { t } = useTranslation()

  const walletIcon = useMemo(
    () => (
      <Flex opacity={0.3}>
        <AccountIcon address={walletAddress} size={iconSizes.icon48} />
      </Flex>
    ),
    [walletAddress],
  )

  return (
    <SmartWalletModal
      isOpen={isOpen}
      icon={walletIcon}
      title={t('smartWallets.unavailableModal.title')}
      subtext={t('smartWallets.unavailableModal.description', { displayName })}
      modalName={ModalName.SmartWalletUnavailableModal}
      learnMoreUrl={lxUrls.helpArticleUrls.mismatchedImports}
      primaryButton={{ text: t('common.close'), onClick: onClose, variant: 'default', emphasis: 'secondary' }}
      onClose={onClose}
    />
  )
}
