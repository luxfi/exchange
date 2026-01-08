import { WalletOptionsGrid } from 'components/WalletModal/WalletOptionsGrid'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { Wallet } from 'ui/src/components/icons/Wallet'

/**
 * Compact version of the wallet connection modal.
 * Shown when the full modal was already displayed within the last hour.
 * Shows just the wallet options without the full onboarding experience.
 */
export function CompactWalletModal(): JSX.Element {
  const { t } = useTranslation()

  return (
    <Flex gap="$gap16" p="$spacing16">
      <Flex row alignItems="center" gap="$gap8">
        <Wallet size="$icon.20" color="$neutral1" />
        <Text variant="subheading2">{t('common.connectWallet.button')}</Text>
      </Flex>
      <WalletOptionsGrid />
    </Flex>
  )
}
