import { Currency } from '@lux/sdk-core'
import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { nativeOnChain } from 'lx/src/constants/tokens'
import { luxUrls } from 'lx/src/constants/urls'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { useSupportedChainId } from 'lx/src/features/chains/hooks/useSupportedChainId'
import { getChainLabel } from 'lx/src/features/chains/utils'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
import { AutoColumn } from '~/components/deprecated/Column'
import Row from '~/components/deprecated/Row'
import DEXRouterLabel, { DEXGradient } from '~/components/RouterLabel/DEXRouterLabel'
import { deprecatedStyled } from '~/lib/deprecated-styled'
import { InterfaceTrade } from '~/state/routing/types'
import { isLimitTrade, isPreviewTrade, isDEXTrade } from '~/state/routing/utils'
import { ThemedText } from '~/theme/components'
import { Divider } from '~/theme/components/Dividers'
import { ExternalLink } from '~/theme/components/Links'

const Container = deprecatedStyled(AutoColumn)`
  padding: 4px;
`

type GasCostItemProps = { title: ReactNode; itemValue?: React.ReactNode; amount?: number }

const GasCostItem = ({ title, amount, itemValue }: GasCostItemProps) => {
  const { convertFiatAmountFormatted } = useLocalizationContext()

  if (!amount && !itemValue) {
    return null
  }

  const value = itemValue ?? convertFiatAmountFormatted(amount, NumberType.FiatGasPrice)
  return (
    <Row justify="space-between">
      <ThemedText.SubHeaderSmall>{title}</ThemedText.SubHeaderSmall>
      <ThemedText.SubHeaderSmall color="neutral1">{value}</ThemedText.SubHeaderSmall>
    </Row>
  )
}

const GaslessSwapLabel = () => {
  const { convertFiatAmountFormatted } = useLocalizationContext()
  return <DEXRouterLabel>{convertFiatAmountFormatted(0, NumberType.FiatGasPrice)}</DEXRouterLabel>
}

type GasBreakdownTooltipProps = { trade: InterfaceTrade }

export function GasBreakdownTooltip({ trade }: GasBreakdownTooltipProps) {
  const isDEX = isDEXTrade(trade)
  const inputCurrency = trade.inputAmount.currency
  const native = nativeOnChain(inputCurrency.chainId)

  if (isPreviewTrade(trade)) {
    return <NetworkCostDescription native={native} />
  }

  const swapEstimate = !isDEX ? trade.gasUseEstimateUSD : undefined
  const approvalEstimate = trade.approveInfo.needsApprove ? trade.approveInfo.approveGasEstimateUSD : undefined
  // Limit orders still require wrapping ETH to WETH (unlike regular DEX swaps which now support native ETH)
  const wrapEstimate = isLimitTrade(trade) && trade.wrapInfo.needsWrap ? trade.wrapInfo.wrapGasEstimateUSD : undefined
  const showEstimateDetails = Boolean(wrapEstimate || approvalEstimate)

  const description = isDEX ? <DEXDescription /> : <NetworkCostDescription native={native} />

  if (!showEstimateDetails) {
    return description
  }

  return (
    <Container gap="md">
      <AutoColumn gap="sm">
        <GasCostItem
          title={<Trans i18nKey="swap.wrap.token" values={{ sym: native.symbol }} />}
          amount={wrapEstimate}
        />
        <GasCostItem
          title={<Trans i18nKey="swap.allow.oneTime" values={{ sym: inputCurrency.symbol }} />}
          amount={approvalEstimate}
        />
        <GasCostItem title={<Trans i18nKey="common.swap" />} amount={swapEstimate} />
        {isDEX && <GasCostItem title={<Trans i18nKey="common.swap" />} itemValue={<GaslessSwapLabel />} />}
      </AutoColumn>
      <Divider />
      {description}
    </Container>
  )
}

function NetworkCostDescription({ native }: { native: Currency }) {
  const supportedChain = useSupportedChainId(native.chainId)
  const { defaultChainId } = useEnabledChains()
  const chainName = getChainLabel(supportedChain ?? defaultChainId)

  return (
    <ThemedText.LabelMicro>
      <Trans i18nKey="swap.networkCost.paidIn" values={{ sym: native.symbol, chainName }} />{' '}
      <ExternalLink href="https://docs.lux.exchange/help/network-fees">
        <Trans i18nKey="common.button.learn" />
      </ExternalLink>
    </ThemedText.LabelMicro>
  )
}

const InlineDEXGradient = deprecatedStyled(DEXGradient)`
  display: inline;
`
export function DEXDescription() {
  return (
    <ThemedText.Caption color="neutral2">
      <Trans
        i18nKey="dex.aggregatesLiquidity"
        components={{
          logo: <InlineDEXGradient>DEX</InlineDEXGradient>,
        }}
      />{' '}
      <ExternalLink href={luxUrls.helpArticleUrls.dexInfo}>
        <Trans i18nKey="common.button.learn" />
      </ExternalLink>
    </ThemedText.Caption>
  )
}
