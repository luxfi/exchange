import { FormattedLxSwapGasFeeInfo } from '@l.x/api'
import { PropsWithChildren } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Text, LXText, useSporeColors } from 'ui/src'
import { AlertTriangleFilled } from 'ui/src/components/icons/AlertTriangleFilled'
import { Gas } from 'ui/src/components/icons/Gas'
import { fonts, NATIVE_LINE_HEIGHT_SCALE, zIndexes } from 'ui/src/theme'
import { NetworkCostTooltip, NetworkCostTooltipDEX } from 'lx/src/components/gas/NetworkCostTooltip'
import { WarningSeverity } from 'lx/src/components/modals/WarningModal/types'
import { WarningInfo } from 'lx/src/components/modals/WarningModal/WarningInfo'
import { InfoTooltipProps } from 'lx/src/components/tooltip/InfoTooltipProps'
import { lxUrls } from 'lx/src/constants/urls'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { NetworkCostBanner } from 'lx/src/features/smartWallet/banner/NetworkCostBanner'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { isMobileApp, isWebApp, isWebPlatform } from 'utilities/src/platform'

export function NetworkFeeWarning({
  gasFeeHighRelativeToValue,
  children,
  disabled = false,
  tooltipTrigger,
  placement = 'top',
  lxSwapGasFeeInfo,
  chainId,
  includesDelegation,
}: PropsWithChildren<{
  gasFeeHighRelativeToValue?: boolean
  disabled?: boolean
  tooltipTrigger?: InfoTooltipProps['trigger']
  placement?: InfoTooltipProps['placement']
  lxSwapGasFeeInfo?: FormattedLxSwapGasFeeInfo
  chainId: UniverseChainId
  includesDelegation?: boolean
}>): JSX.Element {
  const colors = useSporeColors()
  const { t } = useTranslation()

  const showHighGasFeeUI = gasFeeHighRelativeToValue && !lxSwapGasFeeInfo && !isWebApp // Avoid high gas UI on interface

  return (
    <WarningInfo
      mobileBanner={
        includesDelegation &&
        isMobileApp && (
          <NetworkCostBanner
            bannerText={t('smartWallet.banner.networkCost', { chainName: getChainInfo(chainId).label })}
            url={lxUrls.helpArticleUrls.smartWalletDelegation}
          />
        )
      }
      modalProps={{
        backgroundIconColor: showHighGasFeeUI ? colors.statusCritical2.get() : colors.surface2.get(),
        captionComponent: (
          <NetworkFeeText
            includesDelegation={includesDelegation}
            showHighGasFeeUI={showHighGasFeeUI}
            lxSwapGasFeeInfo={lxSwapGasFeeInfo}
            chainId={chainId}
          />
        ),
        rejectText: t('common.button.close'),
        icon: showHighGasFeeUI ? (
          <AlertTriangleFilled color="$statusCritical" size="$icon.24" />
        ) : (
          <Gas color="$neutral2" size="$icon.24" />
        ),
        modalName: ModalName.NetworkFeeInfo,
        severity: WarningSeverity.None,
        title: showHighGasFeeUI ? t('transaction.networkCost.veryHigh.label') : t('transaction.networkCost.label'),
        zIndex: zIndexes.popover,
      }}
      tooltipProps={{
        text: lxSwapGasFeeInfo ? (
          <NetworkCostTooltipDEX lxSwapGasFeeInfo={lxSwapGasFeeInfo} />
        ) : (
          <NetworkCostTooltip chainId={chainId} includesDelegation={includesDelegation ?? false} />
        ),
        placement,
        icon: null,
        maxWidth: 300,
        enabled: !disabled,
      }}
      trigger={tooltipTrigger}
      analyticsTitle="Network cost"
    >
      {children}
    </WarningInfo>
  )
}

function NetworkFeeText({
  includesDelegation,
  showHighGasFeeUI,
  lxSwapGasFeeInfo,
  chainId,
}: {
  includesDelegation?: boolean
  showHighGasFeeUI?: boolean
  lxSwapGasFeeInfo?: FormattedLxSwapGasFeeInfo
  chainId: UniverseChainId
}): JSX.Element {
  const { t } = useTranslation()

  const variant: keyof typeof fonts = isWebPlatform ? 'body4' : 'body2'
  // we need to remove `NATIVE_LINE_HEIGHT_SCALE` if we switch to a button label font
  const lineHeight = fonts[variant].lineHeight / (isWebPlatform ? 1 : NATIVE_LINE_HEIGHT_SCALE)

  if (lxSwapGasFeeInfo) {
    // TODO(WEB-4313): Remove need to manually adjust the height of the LXText component for mobile.
    const components = { gradient: <LXText height={lineHeight} variant={variant} /> }

    return (
      <Text color="$neutral2" textAlign={isWebPlatform ? 'left' : 'center'} variant={variant}>
        {/* TODO(WALL-5311): Investigate Trans component vertical alignment on android */}
        {chainId === UniverseChainId.Unichain ? (
          <Trans components={components} i18nKey="swap.warning.networkFee.message.lxSwap.unichain" />
        ) : (
          <Trans components={components} i18nKey="swap.warning.networkFee.message.lxSwap" />
        )}
      </Text>
    )
  }

  if (includesDelegation) {
    return (
      <Text color="$neutral2" textAlign={isWebPlatform ? 'left' : 'center'} variant="body3">
        {t('swap.warning.networkFee.delegation.message')}
      </Text>
    )
  }

  return (
    <Text color="$neutral2" textAlign={isWebPlatform ? 'left' : 'center'} variant={variant}>
      {showHighGasFeeUI
        ? chainId === UniverseChainId.Unichain
          ? t('swap.warning.networkFee.highRelativeToValue.unichain')
          : t('swap.warning.networkFee.highRelativeToValue')
        : chainId === UniverseChainId.Unichain
          ? t('swap.warning.networkFee.message.unichain')
          : t('swap.warning.networkFee.message')}
    </Text>
  )
}
