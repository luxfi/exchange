import { FormattedDEXGasFeeInfo } from '@universe/api'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { DEX } from 'ui/src/components/icons/DEX'
import { DEXText } from 'ui/src/components/text/DEXText'
import { NetworkLogo } from 'lx/src/components/CurrencyLogo/NetworkLogo'
import { TransactionDetailsTooltip as Tooltip } from 'lx/src/components/TransactionDetailsTooltip'
import { luxUrls } from 'lx/src/constants/urls'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { UniverseChainId } from 'lx/src/features/chains/types'

export function NetworkCostTooltip({
  chainId,
  includesDelegation,
}: {
  chainId: UniverseChainId
  includesDelegation: boolean
}): JSX.Element {
  const { t } = useTranslation()

  const learnMoreUrl = includesDelegation
    ? luxUrls.helpArticleUrls.smartWalletDelegation
    : luxUrls.helpArticleUrls.networkFeeInfo
  const text = includesDelegation
    ? t('smartWallet.banner.networkCost', { chainName: getChainInfo(chainId).label })
    : t('transaction.networkCost.description')
  return (
    <Tooltip.Outer>
      <Tooltip.Header
        title={{ title: t('common.chain.networkCost', { chain: getChainInfo(chainId).name }) }}
        logo={<NetworkLogo chainId={chainId} size={16} />}
      />
      <Tooltip.Description learnMorePinkColor={false} learnMoreUrl={learnMoreUrl} text={text} />
    </Tooltip.Outer>
  )
}

export function NetworkCostTooltipDEX({
  dexGasFeeInfo,
}: {
  dexGasFeeInfo: FormattedDEXGasFeeInfo
}): JSX.Element {
  const { t } = useTranslation()
  const { approvalFeeFormatted, swapFeeFormatted, inputTokenSymbol } = dexGasFeeInfo

  return (
    <Tooltip.Outer>
      <Tooltip.Header
        title={{ title: t('swap.warning.networkFee.message.dex.title'), dex: true }}
        Icon={DEX}
      />
      <Tooltip.Content>
        <Tooltip.Row>
          <Tooltip.LineItemLabel label={t('transaction.details.networkFee.swap')} />
          <Flex row gap="$spacing6">
            <Text color="$neutral2" textDecorationLine="line-through" variant="body4">
              {swapFeeFormatted}
            </Text>
            <DEXText variant="body4">{t('common.free')}</DEXText>
          </Flex>
        </Tooltip.Row>
        {approvalFeeFormatted && (
          <Tooltip.Row>
            <Tooltip.LineItemLabel
              label={t('swap.warning.networkFee.allow', { inputTokenSymbol: inputTokenSymbol ?? '' })}
            />
            <Tooltip.LineItemValue value={approvalFeeFormatted} />
          </Tooltip.Row>
        )}
      </Tooltip.Content>
      <Tooltip.Separator />
      <Tooltip.Description
        learnMorePinkColor={false}
        learnMoreUrl={luxUrls.helpArticleUrls.dexInfo}
        text={t('dex.cost')}
      />
    </Tooltip.Outer>
  )
}
