import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from '@luxfi/ui/src'
import { ArrowLeft } from '@luxfi/ui/src/components/icons/ArrowLeft'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { isMobileWeb } from '@luxfi/utilities/src/platform'
import { LxWalletOptions } from '~/components/WalletModal/LxWalletOptions'
import { WalletModalLayout } from '~/components/WalletModal/WalletModalLayout'
import { WalletOptionsGrid } from '~/components/WalletModal/WalletOptionsGrid'
import { useOrderedWallets } from '~/features/wallet/connection/hooks/useOrderedWalletConnectors'

function getTitle(t: TFunction, connectOnPlatform: Platform | 'any'): string {
  if (connectOnPlatform === Platform.EVM) {
    return t('common.connectAWallet.button.evm')
  }

  if (connectOnPlatform === Platform.SVM) {
    return t('common.connectAWallet.button.svm')
  }

  return t('common.connectAWallet.button.switch')
}

export function SwitchWalletModal({
  connectOnPlatform,
  onClose,
}: {
  connectOnPlatform: Platform | 'any'
  onClose: () => void
}): JSX.Element {
  const { t } = useTranslation()
  const wallets = useOrderedWallets({ showSecondaryConnectors: isMobileWeb, platformFilter: connectOnPlatform })

  const header = (
    <Flex row justifyContent="flex-start" alignItems="center" width="100%" gap="$gap8">
      <TouchableArea data-testid="wallet-back" onPress={onClose}>
        <ArrowLeft size="$icon.24" />
      </TouchableArea>
      <Text variant="subheading1">{getTitle(t, connectOnPlatform)}</Text>
    </Flex>
  )

  const luxOptions = <LuxWalletOptions />

  const walletOptions = (
    <WalletOptionsGrid
      connectOnPlatform={connectOnPlatform}
      showMobileConnector={false}
      showOtherWallets={false}
      maxHeight="100vh"
      opacity={1}
    />
  )

  return (
    <WalletModalLayout
      header={
        <Flex gap="$gap16">
          {header}
          {connectOnPlatform !== Platform.SVM ? luxOptions : null}
        </Flex>
      }
      hidePolicyNotice={connectOnPlatform === Platform.SVM && wallets.length === 0}
    >
      {walletOptions}
    </WalletModalLayout>
  )
}
