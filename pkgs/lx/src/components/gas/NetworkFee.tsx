import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { GasFeeResult } from '@l.x/api'
import { useTranslation } from 'react-i18next'
import { Flex, Text, LXText } from '@l.x/ui/src'
import { LX } from '@l.x/ui/src/components/icons/LX'
import { iconSizes } from '@l.x/ui/src/theme'
import { NetworkLogo } from '@l.x/lx/src/components/CurrencyLogo/NetworkLogo'
import { NetworkFeeWarning } from '@l.x/lx/src/components/gas/NetworkFeeWarning'
import { IndicativeLoadingWrapper } from '@l.x/lx/src/components/misc/IndicativeLoadingWrapper'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import {
  useFormattedDEXGasFeeInfo,
  useGasFeeFormattedDisplayAmounts,
  useGasFeeHighRelativeToValue,
} from '@l.x/lx/src/features/gas/hooks'
import { LXGasBreakdown } from '@l.x/lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import { isZero } from '@l.x/lx/src/utils/number'
import { isWebApp } from '@l.x/utils/src/platform'

export function NetworkFee({
  chainId,
  gasFee,
  lxOrderGasBreakdown,
  transactionUSDValue,
  indicative,
  includesDelegation,
  showNetworkLogo = true,
}: {
  chainId: UniverseChainId
  gasFee: GasFeeResult
  lxOrderGasBreakdown?: LXGasBreakdown
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

  const lxOrderGasFeeInfo = useFormattedDEXGasFeeInfo(lxOrderGasBreakdown, chainId)
  const isGasFeeFree = gasFee.value !== undefined && isZero(gasFee.value)

  const gasFeeHighRelativeToValue = useGasFeeHighRelativeToValue(gasFeeUSD, transactionUSDValue)
  const showHighGasFeeUI = gasFeeHighRelativeToValue && !isWebApp // Avoid high gas UI on interface

  return (
    <Flex gap="$spacing4">
      <Flex row alignItems="center" gap="$spacing12" justifyContent="space-between">
        <NetworkFeeWarning
          includesDelegation={includesDelegation}
          gasFeeHighRelativeToValue={gasFeeHighRelativeToValue}
          lxOrderGasFeeInfo={lxOrderGasFeeInfo}
          chainId={chainId}
        >
          <Text color="$neutral2" flexShrink={1} numberOfLines={3} variant="body3">
            {t('transaction.networkCost.label')}
          </Text>
        </NetworkFeeWarning>
        <IndicativeLoadingWrapper loading={indicative || (!gasFee.value && gasFee.isLoading)}>
          <Flex row alignItems="center" gap={lxOrderGasBreakdown ? '$spacing4' : '$spacing8'}>
            {(!lxOrderGasBreakdown || gasFee.error) && showNetworkLogo && (
              <NetworkLogo chainId={chainId} shape="square" size={iconSizes.icon16} />
            )}
            {gasFee.error ? (
              <Text color="$neutral2" variant="body3">
                {t('common.text.notAvailable')}
              </Text>
            ) : lxOrderGasBreakdown ? (
              <LXFee
                gasFee={gasFeeFormatted}
                isFree={isGasFeeFree}
                preSavingsGasFee={lxOrderGasFeeInfo?.preSavingsGasFeeFormatted}
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

type LXFeeProps = {
  gasFee: string
  isFree?: boolean
  preSavingsGasFee?: string
  smaller?: boolean
  loading?: boolean
}
export function LXFee({ gasFee, isFree, preSavingsGasFee, smaller = false }: LXFeeProps): JSX.Element {
  const { t } = useTranslation()
  const gasFeeDisplayed = isFree ? t('common.free') : gasFee

  return (
    <Flex centered row>
      {preSavingsGasFee && (
        <Text color="$neutral2" mr="$spacing6" textDecorationLine="line-through" variant={smaller ? 'body4' : 'body3'}>
          {preSavingsGasFee}
        </Text>
      )}
      <LX marginEnd="$spacing2" size={smaller ? '$icon.12' : '$icon.16'} />
      <LXText variant={smaller ? 'body4' : 'body3'}>{gasFeeDisplayed}</LXText>
    </Flex>
  )
}
