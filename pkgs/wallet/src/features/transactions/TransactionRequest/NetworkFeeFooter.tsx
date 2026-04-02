import { GasFeeResult } from '@l.x/api'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { iconSizes } from 'ui/src/theme'
import { NetworkLogo } from 'lx/src/components/CurrencyLogo/NetworkLogo'
import { LXFee } from 'lx/src/components/gas/NetworkFee'
import { NetworkFeeWarning } from 'lx/src/components/gas/NetworkFeeWarning'
import { ContentRow } from 'lx/src/components/transactions/requests/ContentRow'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { DappRequestType, EthMethod, EthSignMethod } from 'lx/src/features/dappRequests/types'
import { useGasFeeFormattedDisplayAmounts } from 'lx/src/features/gas/hooks'
import { isMobileApp } from 'utilities/src/platform'

interface NetworkFeeFooterProps {
  chainId: UniverseChainId
  showNetworkLogo: boolean
  gasFee: GasFeeResult | undefined
  isLxSwap?: boolean
  requestMethod?: string
  showSmartWalletActivation?: boolean
}

// Since EthSignMethod is a TypeScript type that doesn't exist at runtime,
// we need to explicitly list its values here for string comparison
const ethSignMethod: EthSignMethod[] = [
  EthMethod.PersonalSign,
  EthMethod.SignTypedData,
  EthMethod.SignTypedDataV4,
  EthMethod.EthSign,
]

const SignatureMethods: Array<string> = [
  ...ethSignMethod,
  DappRequestType.SignMessage,
  DappRequestType.SignTransaction,
  DappRequestType.SignTypedData,
]

export function NetworkFeeFooter({
  chainId,
  showNetworkLogo,
  gasFee,
  isLxSwap,
  requestMethod,
  showSmartWalletActivation,
}: NetworkFeeFooterProps): JSX.Element | null {
  const { t } = useTranslation()
  const variant = isMobileApp ? 'body3' : 'body4'

  const { gasFeeFormatted } = useGasFeeFormattedDisplayAmounts({
    gasFee,
    chainId,
    placeholder: '-',
  })

  if (typeof requestMethod === 'string' && SignatureMethods.includes(requestMethod)) {
    return null
  }

  return (
    <Flex px="$spacing8">
      <ContentRow
        label={
          <Flex>
            <Flex row gap="$spacing4" alignItems="center">
              <Text color="$neutral2" variant={variant}>
                {t('transaction.networkCost.label')}
              </Text>
              <NetworkFeeWarning includesDelegation={showSmartWalletActivation} chainId={chainId} />
            </Flex>
            {showSmartWalletActivation && (
              <Text color="$neutral3" variant="body4">
                {t('transaction.networkCost.includesSmartWalletActivation')}
              </Text>
            )}
          </Flex>
        }
        variant={variant}
      >
        <Flex centered row gap="$spacing4">
          {showNetworkLogo && <NetworkLogo chainId={chainId} size={iconSizes.icon16} />}
          {isLxSwap ? (
            <LXFee gasFee={gasFeeFormatted} />
          ) : (
            <Text color="$neutral1" variant={variant}>
              {gasFeeFormatted}
            </Text>
          )}
        </Flex>
      </ContentRow>
    </Flex>
  )
}
