import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { GasFeeResult } from '@universe/api'
import { useTranslation } from 'react-i18next'
import { Flex, Text, DEXText } from 'ui/src'
import { DEX } from 'ui/src/components/icons/DEX'
import { iconSizes } from 'ui/src/theme'
import { NetworkLogo } from 'lx/src/components/CurrencyLogo/NetworkLogo'
import { NetworkFeeWarning } from 'lx/src/components/gas/NetworkFeeWarning'
import { IndicativeLoadingWrapper } from 'lx/src/components/misc/IndicativeLoadingWrapper'
import { UniverseChainId } from 'lx/src/features/chains/types'
import {
  useFormattedDEXGasFeeInfo,
  useGasFeeFormattedDisplayAmounts,
  useGasFeeHighRelativeToValue,
} from 'lx/src/features/gas/hooks'
import { DEXGasBreakdown } from 'lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import { isZero } from 'lx/src/utils/number'
import { isWebApp } from 'utilities/src/platform'

export function NetworkFee({
  chainId,
  gasFee,
  dexGasBreakdown,
  transactionUSDValue,
  indicative,
  includesDelegation,
  showNetworkLogo = true,
}: {
  chainId: UniverseChainId
  gasFee: GasFeeResult
  dexGasBreakdown?: DEXGasBreakdown
  transactionUSDValue?: Maybe<CurrencyAmount<Currency>>
  indicative?: boolean
  includesDelegation?: boolean
  showNetworkLogo?: boolean
}): JSX.Element {
  const { t } = useTranslation()

  const { gasFeeFormatted, gasFeeUSD } = useGasFeeFormattedDisplayAmounts({
    gasFee,
    chainId,
    placeholder: '-',
    includesDelegation,
  })

  const dexGasFeeInfo = useFormattedDEXGasFeeInfo(dexGasBreakdown, chainId)
  const isGasFeeFree = gasFee.value !== undefined && isZero(gasFee.value)

  const gasFeeHighRelativeToValue = useGasFeeHighRelativeToValue(gasFeeUSD, transactionUSDValue)
  const showHighGasFeeUI = gasFeeHighRelativeToValue && !isWebApp // Avoid high gas UI on interface

  return (
    <Flex gap="$spacing4">
      <Flex row alignItems="center" gap="$spacing12" justifyContent="space-between">
        <NetworkFeeWarning
          includesDelegation={includesDelegation}
          gasFeeHighRelativeToValue={gasFeeHighRelativeToValue}
          dexGasFeeInfo={dexGasFeeInfo}
          chainId={chainId}
        >
          <Text color="$neutral2" flexShrink={1} numberOfLines={3} variant="body3">
            {t('transaction.networkCost.label')}
          </Text>
        </NetworkFeeWarning>
        <IndicativeLoadingWrapper loading={indicative || (!gasFee.value && gasFee.isLoading)}>
          <Flex row alignItems="center" gap={dexGasBreakdown ? '$spacing4' : '$spacing8'}>
            {(!dexGasBreakdown || gasFee.error) && showNetworkLogo && (
              <NetworkLogo chainId={chainId} shape="square" size={iconSizes.icon16} />
            )}
            {gasFee.error ? (
              <Text color="$neutral2" variant="body3">
                {t('common.text.notAvailable')}
              </Text>
            ) : dexGasBreakdown ? (
              <DEXFee
                gasFee={gasFeeFormatted}
                isFree={isGasFeeFree}
                preSavingsGasFee={dexGasFeeInfo?.preSavingsGasFeeFormatted}
              />
            ) : (
              <Text
                color={gasFee.isLoading ? '$neutral3' : showHighGasFeeUI ? '$statusCritical' : '$neutral1'}
                variant="body3"
              >
                {gasFeeFormatted}
              </Text>
            )}
          </Flex>
        </IndicativeLoadingWrapper>
      </Flex>
      {includesDelegation && (
        <Text color="$neutral3" variant="body4">
          {t('swap.warning.networkFee.includesDelegation')}
        </Text>
      )}
    </Flex>
  )
}

type DEXFeeProps = {
  gasFee: string
  isFree?: boolean
  preSavingsGasFee?: string
  smaller?: boolean
  loading?: boolean
}
export function DEXFee({ gasFee, isFree, preSavingsGasFee, smaller = false }: DEXFeeProps): JSX.Element {
  const { t } = useTranslation()
  const gasFeeDisplayed = isFree ? t('common.free') : gasFee

  return (
    <Flex centered row>
      {preSavingsGasFee && (
        <Text color="$neutral2" mr="$spacing6" textDecorationLine="line-through" variant={smaller ? 'body4' : 'body3'}>
          {preSavingsGasFee}
        </Text>
      )}
      <DEX marginEnd="$spacing2" size={smaller ? '$icon.12' : '$icon.16'} />
      <DEXText variant={smaller ? 'body4' : 'body3'}>{gasFeeDisplayed}</DEXText>
    </Flex>
  )
}
