import { useState } from 'react'
import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Text } from '@l.x/ui/src'
import { MAINNET_CHAIN_INFO } from '@l.x/lx/src/features/chains/evm/info/mainnet'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { SOLANA_CHAIN_INFO } from '@l.x/lx/src/features/chains/svm/info/solana'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { shortenAddress } from '@l.x/utils/src/addresses'
import { isEVMAddress } from '@l.x/utils/src/addresses/evm/evm'
=======
import { Text } from 'ui/src'
import { MAINNET_CHAIN_INFO } from 'uniswap/src/features/chains/evm/info/mainnet'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { SOLANA_CHAIN_INFO } from 'uniswap/src/features/chains/svm/info/solana'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { shortenAddress } from 'utilities/src/addresses'
import { isEVMAddress } from 'utilities/src/addresses/evm/evm'
>>>>>>> upstream/main
import { AddressDisplay } from '~/components/AccountDetails/AddressDisplay'
import StatusIcon from '~/components/StatusIcon'
import { deprecatedStyled } from '~/lib/deprecated-styled'
import { ThemedText } from '~/theme/components'

const Container = deprecatedStyled.div`
  display: flex;
  padding-right: 8px;
`
const Identifiers = deprecatedStyled.div`
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  user-select: none;
  overflow: hidden;
  flex: 1 1 auto;
`

export function AccountOption({
  account,
  ensUsername,
<<<<<<< HEAD
  luxUsername,
}: {
  account: string
  ensUsername?: string | null
  luxUsername?: string
=======
  uniswapUsername,
}: {
  account: string
  ensUsername?: string | null
  uniswapUsername?: string
>>>>>>> upstream/main
}) {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useTranslation()

  const { chains } = useEnabledChains({ platform: isEVMAddress(account) ? Platform.EVM : Platform.SVM })
  const platformAddressDisplay = isEVMAddress(account)
    ? `${MAINNET_CHAIN_INFO.name} +${chains.length - 1} ${t('extension.connection.networks').toLowerCase()}`
    : SOLANA_CHAIN_INFO.name

  return (
    <Container onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <StatusIcon address={account} size={40} />
      <Identifiers>
        <ThemedText.SubHeader>
          <AddressDisplay address={account} />
        </ThemedText.SubHeader>
<<<<<<< HEAD
        {luxUsername || ensUsername ? (
=======
        {uniswapUsername || ensUsername ? (
>>>>>>> upstream/main
          <Text variant="body4" color="neutral2">
            {isHovered ? platformAddressDisplay : shortenAddress({ address: account })}
          </Text>
        ) : (
          <Text variant="body4" color="neutral2">
            {platformAddressDisplay}
          </Text>
        )}
      </Identifiers>
    </Container>
  )
}
