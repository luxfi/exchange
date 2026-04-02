import { TradingApi } from '@l.x/api'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import type { TFunction } from 'i18next'
import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Flex, type FlexProps, HeightAnimator, Switch, Text, TouchableArea, LXText, useSporeColors } from 'ui/src'
import { InfoCircleFilled } from 'ui/src/components/icons/InfoCircleFilled'
import { Lightning } from 'ui/src/components/icons/Lightning'
import { LX } from 'ui/src/components/icons/LX'
import { spacing, zIndexes } from 'ui/src/theme'
import { WarningSeverity } from 'lx/src/components/modals/WarningModal/types'
import { WarningInfo } from 'lx/src/components/modals/WarningModal/WarningInfo'
import { WarningModal } from 'lx/src/components/modals/WarningModal/WarningModal'
import { LearnMoreLink } from 'lx/src/components/text/LearnMoreLink'
import { InfoTooltip } from 'lx/src/components/tooltip/InfoTooltip'
import WarningIcon from 'lx/src/components/warnings/WarningIcon'
import { lxUrls } from 'lx/src/constants/urls'
import { useLuxContextSelector } from 'lx/src/contexts/LuxContext'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { ElementName, ModalName } from 'lx/src/features/telemetry/constants'
import Trace from 'lx/src/features/telemetry/Trace'
import { TransactionSettingsModalId } from 'lx/src/features/transactions/components/settings/stores/TransactionSettingsModalStore/createTransactionSettingsModalStore'
import { useModalHide } from 'lx/src/features/transactions/components/settings/stores/TransactionSettingsModalStore/useTransactionSettingsModalStore'
import {
  useTransactionSettingsActions,
  useTransactionSettingsStore,
} from 'lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { isDefaultTradeRouteOptions } from 'lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/TradeRoutingPreference/isDefaultTradeRouteOptions'
import { LxSwapInfo } from 'lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/TradeRoutingPreference/LxSwapInfo'
import { V4HooksInfo } from 'lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/TradeRoutingPreference/V4HooksInfo'
import { useV4SwapEnabled } from 'lx/src/features/transactions/swap/hooks/useV4SwapEnabled'
import { useSwapFormStoreDerivedSwapInfo } from 'lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import type { FrontendSupportedProtocol } from 'lx/src/features/transactions/swap/utils/protocols'
import { DEFAULT_PROTOCOL_OPTIONS } from 'lx/src/features/transactions/swap/utils/protocols'
import { openUri } from 'lx/src/utils/linking'
import { isExtensionApp, isMobileApp, isMobileWeb, isWebApp, isWebPlatform } from 'utilities/src/platform'
import { useEvent } from 'utilities/src/react/hooks'

export function TradeRoutingPreferenceScreen(): JSX.Element {
  const { t } = useTranslation()
  const getIsLXSupported = useLuxContextSelector((state) => state.getIsLXSupported)
  const { selectedProtocols, isV4HookPoolsEnabled } = useTransactionSettingsStore((s) => ({
    selectedProtocols: s.selectedProtocols,
    isV4HookPoolsEnabled: s.isV4HookPoolsEnabled,
  }))
  const { setSelectedProtocols, setIsV4HookPoolsEnabled, toggleProtocol } = useTransactionSettingsActions()

  const [isDefault, setIsDefault] = useState(
    isDefaultTradeRouteOptions({
      selectedProtocols,
      isV4HookPoolsEnabled,
    }),
  )
  const lxSwapEnabled = useFeatureFlag(FeatureFlags.LX)
  const allowLXOnly = useFeatureFlag(FeatureFlags.AllowLXOnlyRoutesInSwapSettings)

  const chainId = useSwapFormStoreDerivedSwapInfo((s) => s.chainId)
  const isLXSupported = getIsLXSupported?.(chainId)
  const v4SwapEnabled = useV4SwapEnabled(chainId)
  const chainName = getChainInfo(chainId).name
  const restrictionDescription = t('swap.settings.protection.subtitle.unavailable', { chainName })

  // We prevent the user from deselecting all options
  const onlyOneProtocolSelected = selectedProtocols.length === 1 && !isV4HookPoolsEnabled

  const classicProtocolsCount = selectedProtocols.filter((p) => {
    if (!v4SwapEnabled && p === TradingApi.ProtocolItems.V4) {
      return false
    }

    return p !== TradingApi.ProtocolItems.LXSWAP_V2
  }).length

  // Prevent the user from deselecting all on-chain protocols (AKA only selecting LX)
  // unless the `AllowLXOnlyRoutesInSwapSettings` flag is enabled (this is for local testing only! the flag is always false in production).
  const shouldPreventClassicProtocolDeselection =
    !allowLXOnly &&
    ((classicProtocolsCount === 1 && !isV4HookPoolsEnabled) || (classicProtocolsCount === 0 && isV4HookPoolsEnabled))

  const toggleV4Hooks = useCallback(() => {
    setIsV4HookPoolsEnabled(!isV4HookPoolsEnabled)
  }, [setIsV4HookPoolsEnabled, isV4HookPoolsEnabled])

  const toggleDefault = useCallback(() => {
    setIsDefault(!isDefault)
    if (!isDefault) {
      setSelectedProtocols(DEFAULT_PROTOCOL_OPTIONS)
      setIsV4HookPoolsEnabled(true)
    }
  }, [setSelectedProtocols, setIsV4HookPoolsEnabled, isDefault])

  const getProtocolTitle = createGetProtocolTitle({
    isLXSupported,
    t,
  })

  return (
    <Flex gap="$spacing16" my="$spacing16">
      <OptionRow
        alignItems="flex-start"
        active={isDefault}
        description={<DefaultOptionDescription v4SwapEnabled={v4SwapEnabled} />}
        elementName={ElementName.SwapRoutingPreferenceDefault}
        title={<DefaultOptionTitle v4SwapEnabled={v4SwapEnabled} />}
        cantDisable={false}
        footerContent={
          <DefaultOptionFooterContent
            isLXSupported={isLXSupported}
            isLXEnabled={lxSwapEnabled}
            isDefault={isDefault}
          />
        }
        onSelect={toggleDefault}
      />
      <HeightAnimator open={!isDefault} animationDisabled={isMobileApp || isMobileWeb}>
        {lxSwapEnabled && (
          <OptionRow
            active={
              isLXSupported === false ? false : selectedProtocols.includes(TradingApi.ProtocolItems.LXSWAP_V2)
            }
            elementName={ElementName.SwapRoutingPreferenceLX}
            title={getProtocolTitle(TradingApi.ProtocolItems.LXSWAP_V2)}
            cantDisable={onlyOneProtocolSelected}
            disabled={isLXSupported === false}
            onSelect={() => toggleProtocol(TradingApi.ProtocolItems.LXSWAP_V2)}
          />
        )}
        <OptionRow
          active={v4SwapEnabled && selectedProtocols.includes(TradingApi.ProtocolItems.V4)}
          elementName={ElementName.SwapRoutingPreferenceV4}
          title={getProtocolTitle(TradingApi.ProtocolItems.V4)}
          cantDisable={shouldPreventClassicProtocolDeselection}
          disabled={!v4SwapEnabled}
          description={!v4SwapEnabled ? restrictionDescription : undefined}
          onSelect={() => toggleProtocol(TradingApi.ProtocolItems.V4)}
        />
        <OptionRow
          active={isV4HookPoolsEnabled}
          elementName={ElementName.SwapRoutingPreferenceV4Hooks}
          title={<V4HooksInfo />}
          cantDisable={shouldPreventClassicProtocolDeselection}
          disabled={!v4SwapEnabled}
          onSelect={toggleV4Hooks}
        />
        <OptionRow
          active={selectedProtocols.includes(TradingApi.ProtocolItems.V3)}
          elementName={ElementName.SwapRoutingPreferenceV3}
          title={getProtocolTitle(TradingApi.ProtocolItems.V3)}
          cantDisable={shouldPreventClassicProtocolDeselection}
          onSelect={() => toggleProtocol(TradingApi.ProtocolItems.V3)}
        />
        <OptionRow
          active={selectedProtocols.includes(TradingApi.ProtocolItems.V2)}
          elementName={ElementName.SwapRoutingPreferenceV2}
          title={getProtocolTitle(TradingApi.ProtocolItems.V2)}
          cantDisable={shouldPreventClassicProtocolDeselection}
          onSelect={() => toggleProtocol(TradingApi.ProtocolItems.V2)}
        />
      </HeightAnimator>
    </Flex>
  )
}

function createGetProtocolTitle(ctx: {
  isLXSupported?: boolean
  t: TFunction
}): (preference: FrontendSupportedProtocol) => JSX.Element | string {
  const { isLXSupported, t } = ctx
  return (preference: FrontendSupportedProtocol) => {
    switch (preference) {
      case TradingApi.ProtocolItems.LXSWAP_V2: {
        if (isLXSupported === false) {
          return <LXTitleInfoTooltip />
        }
        return <LxSwapInfo tooltipTrigger={<LxSwapInfoTooltipTrigger />} />
      }
      case TradingApi.ProtocolItems.V2:
        return t('swap.settings.routingPreference.option.v2.title')
      case TradingApi.ProtocolItems.V3:
        return t('swap.settings.routingPreference.option.v3.title')
      case TradingApi.ProtocolItems.V4:
        return t('swap.settings.routingPreference.option.v4.title')
      default:
        return <></>
    }
  }
}

function LXTitleInfoTooltip(): JSX.Element {
  const [forceCloseTooltip, setForceCloseTooltip] = useState(undefined as undefined | true)
  const [showModal, setShowModal] = useState(false)
  if (isWebPlatform) {
    return (
      <InfoTooltip
        text={<LxSwapInfoTooltipText onPress={() => setForceCloseTooltip(true)} />}
        trigger={<LxSwapInfoTooltipTrigger />}
        placement="top"
        open={forceCloseTooltip === undefined ? undefined : !forceCloseTooltip}
      />
    )
  }

  return (
    <>
      <TouchableArea onPress={() => setShowModal(true)}>
        <LxSwapInfoTooltipTrigger />
      </TouchableArea>
      <LxSwapInfoModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

function LxSwapInfoTooltipTrigger(): JSX.Element {
  return (
    <Text
      alignItems="center"
      color="$neutral2"
      variant="subheading2"
      flexDirection="row"
      flexShrink={0}
      display="inline-flex"
      gap="$gap4"
      // This is to offset the left padding built-into the LX icon
      left={-spacing.spacing2}
    >
      <Trans
        components={{
          icon: <LX size="$icon.16" />,
          gradient: <LXText height={18} variant="subheading2" />,
          info: <InfoCircleFilled color="$neutral3" size="$icon.16" />,
        }}
        i18nKey="lx.item"
      />
    </Text>
  )
}
type OptionRowProps = {
  title: JSX.Element | string
  active: boolean
  elementName: ElementName
  cantDisable: boolean
  onSelect: () => void
  description?: string | ReactNode
  disabled?: boolean
  alignItems?: Extract<FlexProps['alignItems'], 'flex-start' | 'center'>
  footerContent?: JSX.Element
}

function OptionRow({
  title,
  description,
  active,
  elementName,
  cantDisable,
  onSelect,
  disabled,
  alignItems = 'center',
  footerContent,
}: OptionRowProps): JSX.Element {
  return (
    <Flex flexDirection="column" gap="$spacing12">
      <Flex row py="$spacing2" alignItems={alignItems} gap="$spacing16" justifyContent="space-between">
        <Flex shrink gap="$spacing4">
          {typeof title === 'string' ? (
            <Text color="$neutral1" variant="subheading2">
              {title}
            </Text>
          ) : (
            title
          )}

          {typeof description === 'string' ? (
            <Text color="$neutral2" variant="body3">
              {description}
            </Text>
          ) : (
            description
          )}
        </Flex>
        {/* Only log this event if toggle value is off, and then turned on */}
        <Trace element={elementName} logPress={!active}>
          <Switch
            disabled={(active && cantDisable) || disabled}
            checked={active}
            variant="branded"
            onCheckedChange={onSelect}
          />
        </Trace>
      </Flex>
      {footerContent}
    </Flex>
  )
}

function DefaultOptionDescription({ v4SwapEnabled }: { v4SwapEnabled: boolean }): JSX.Element {
  const { t } = useTranslation()
  const cheapestRouteText = t('swap.settings.routingPreference.option.default.description.preV4')
  const cheapestRouteTextV4 = t('swap.settings.routingPreference.option.default.description')

  return (
    <Text color="$neutral2" variant="body3" textWrap="pretty">
      {v4SwapEnabled ? cheapestRouteTextV4 : cheapestRouteText}
    </Text>
  )
}

function DefaultOptionFooterContent(props: {
  isLXSupported?: boolean
  isLXEnabled: boolean
  isDefault: boolean
}): JSX.Element | null {
  const { isLXSupported, isLXEnabled, isDefault } = props
  const showIncludesLX = isLXEnabled && isLXSupported && isDefault
  const showLXNotSupported = isLXSupported === false && isLXEnabled && isDefault

  if (showIncludesLX) {
    return (
      <LxSwapInfo
        tooltipTrigger={
          <Text
            alignItems="center"
            color="$neutral2"
            variant="body3"
            flexDirection="row"
            gap="$gap4"
            display="inline-flex"
          >
            <Trans
              components={{
                icon: <LX size="$icon.16" />,
                gradient: <LXText height={18} variant="body3" />,
              }}
              i18nKey="lx.included"
            />
          </Text>
        }
      />
    )
  }

  if (showLXNotSupported) {
    return <LXNotSupportedDescription />
  }

  return null
}

const LXNotSupportedDescription = (): JSX.Element => {
  const { t } = useTranslation()
  const [forceCloseTooltip, setForceCloseTooltip] = useState(undefined as undefined | true)
  const [showModal, setShowModal] = useState(false)

  const trigger = (
    <Flex cursor="default" gap="$spacing4" alignItems="flex-start" flexDirection="row">
      <WarningIcon color="$neutral2" size="$icon.16" />
      <Text color="$neutral2" variant="body3">
        {t('swap.settings.routingPreference.option.default.description.lxSwapUnavailable')}
      </Text>
    </Flex>
  )

  if (isWebPlatform) {
    return (
      <InfoTooltip
        open={forceCloseTooltip === undefined ? undefined : !forceCloseTooltip}
        text={
          <LxSwapInfoTooltipText
            onPress={() => {
              setForceCloseTooltip(true)
            }}
          />
        }
        placement="top"
        trigger={trigger}
      />
    )
  }

  return (
    <>
      <TouchableArea onPress={() => setShowModal(true)}>{trigger}</TouchableArea>
      <LxSwapInfoModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

function LxSwapInfoTooltipText(props?: { onPress?: () => void }): JSX.Element {
  const { t } = useTranslation()
  const handleOnPressLXUnsupported = useLuxContextSelector((state) => state.handleOnPressLXUnsupported)
  const handleHideTransactionSettingsModal = useModalHide(TransactionSettingsModalId.TransactionSettings)

  const onPress = useEvent(() => {
    if (isExtensionApp) {
      openUri({ uri: lxUrls.helpArticleUrls.multichainDelegation }).catch(() => {})
    } else {
      handleOnPressLXUnsupported?.()
      handleHideTransactionSettingsModal()
    }
    props?.onPress?.()
  })

  const body = isExtensionApp ? t('lx.description.unsupported') : t('wallet.mismatch.popup.description')

  return (
    <TouchableArea onPress={onPress}>
      <Flex gap="$spacing4">
        <Text color="$neutral2" variant="body3">
          {body}
        </Text>
        <Text color="$accent1" variant="body3">
          {isWebApp ? t('common.button.viewDetails') : t('common.button.learn')}
        </Text>
      </Flex>
    </TouchableArea>
  )
}

function DefaultOptionTitle({ v4SwapEnabled }: { v4SwapEnabled: boolean }): JSX.Element {
  const { t } = useTranslation()

  if (!v4SwapEnabled) {
    return (
      <Text color="$neutral1" variant="subheading2">
        {t('common.default')}
      </Text>
    )
  }

  return (
    <Flex row gap="$spacing4" alignItems="center">
      <Text color="$neutral1" variant="subheading2">
        {t('common.default')}
      </Text>
      <WarningInfo
        modalProps={{
          caption: t('swap.settings.routingPreference.option.default.tooltip'),
          rejectText: t('common.button.close'),
          modalName: ModalName.SwapSettingsDefaultRoutingInfo,
        }}
        tooltipProps={{
          text: t('swap.settings.routingPreference.option.default.tooltip'),
          placement: 'bottom',
        }}
      />
    </Flex>
  )
}

function LxSwapInfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): JSX.Element {
  const { t } = useTranslation()
  const colors = useSporeColors()
  return (
    <WarningModal
      isOpen={isOpen}
      onClose={onClose}
      {...{
        caption: t('lx.description.unsupported'),
        rejectText: t('common.button.close'),
        icon: <Lightning size="$icon.24" fill={colors.neutral1.val} />,
        modalName: ModalName.LxSwapInfo,
        severity: WarningSeverity.None,
        title: t('lx.unavailable.title'),
        zIndex: zIndexes.popover,
      }}
    >
      <LearnMoreLink
        textVariant={isWebPlatform ? 'body4' : 'buttonLabel3'}
        url={lxUrls.helpArticleUrls.multichainDelegation}
      />
    </WarningModal>
  )
}
