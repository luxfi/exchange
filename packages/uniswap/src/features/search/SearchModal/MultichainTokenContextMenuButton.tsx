import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { AnimateTransition, Flex, Text, TouchableArea } from 'ui/src'
import { CheckCircleFilled } from 'ui/src/components/icons/CheckCircleFilled'
import { CopyAlt } from 'ui/src/components/icons/CopyAlt'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import {
  COPY_CLOSE_DELAY,
  TokenContextMenuAction,
  useSearchTokenMenuItems,
} from 'uniswap/src/components/lists/items/tokens/useSearchTokenMenuItems'
import { ContextMenu } from 'uniswap/src/components/menus/ContextMenu'
import type { MenuOptionItem } from 'uniswap/src/components/menus/ContextMenu'
import { MenuContent } from 'uniswap/src/components/menus/ContextMenuContent'
import { ContextMenuTriggerButton } from 'uniswap/src/components/menus/ContextMenuTriggerButton'
import { ContextMenuTriggerMode } from 'uniswap/src/components/menus/types'
import { MultichainAddressList } from 'uniswap/src/components/MultichainTokenDetails/MultichainAddressList'
import { useOrderedMultichainEntries } from 'uniswap/src/components/MultichainTokenDetails/useOrderedMultichainEntries'
import type { MultichainTokenEntry } from 'uniswap/src/components/MultichainTokenDetails/useOrderedMultichainEntries'
import { useActiveAddress } from 'uniswap/src/features/accounts/store/hooks'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { usePortfolioBalances } from 'uniswap/src/features/dataApi/balances/balances'
import { CurrencyInfo, MultichainSearchResult } from 'uniswap/src/features/dataApi/types'
import { pushNotification } from 'uniswap/src/features/notifications/slice/slice'
import { AppNotificationType, CopyNotificationType } from 'uniswap/src/features/notifications/slice/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { useDelayedMenuClose } from 'uniswap/src/features/search/SearchModal/hooks/useDelayedMenuClose'
import { ElementName, SectionName, UniswapEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { currencyAddress } from 'uniswap/src/utils/currencyId'
import { setClipboard } from 'utilities/src/clipboard/clipboard'
import { isWebPlatform } from 'utilities/src/platform'
import { useBooleanState } from 'utilities/src/react/useBooleanState'

type ViewState = 'actions' | 'addresses'
const ADDRESSES_POPOVER_WIDTH = 304
const ADDRESSES_POPOVER_MAX_HEIGHT = 256

const MULTICHAIN_ACTIONS: TokenContextMenuAction[] = [
  TokenContextMenuAction.Swap,
  TokenContextMenuAction.Send,
  TokenContextMenuAction.Receive,
  TokenContextMenuAction.Share,
]

function useBestChainCurrencyInfo(tokens: CurrencyInfo[], fallback: CurrencyInfo): CurrencyInfo {
  const evmAddress = useActiveAddress(Platform.EVM)
  const svmAddress = useActiveAddress(Platform.SVM)
  const { data: balancesById } = usePortfolioBalances({ evmAddress, svmAddress })

  return useMemo(() => {
    const mainnetToken = tokens.find((t) => t.currency.chainId === UniverseChainId.Mainnet)
    const defaultToken = mainnetToken ?? fallback

    if (!balancesById || tokens.length === 0) {
      return defaultToken
    }

    let bestToken: CurrencyInfo | undefined
    let bestBalance = -1

    for (const token of tokens) {
      const balance = balancesById[token.currencyId]
      const usd = balance?.balanceUSD ?? 0
      if (usd > bestBalance) {
        bestBalance = usd
        bestToken = token
      }
    }

    return bestBalance > 0 && bestToken ? bestToken : defaultToken
  }, [balancesById, tokens, fallback])
}

function useMultichainEntries(tokens: CurrencyInfo[]): MultichainTokenEntry[] {
  const entries = useMemo<MultichainTokenEntry[]>(
    () =>
      tokens.map((ci) => ({
        chainId: ci.currency.chainId,
        address: currencyAddress(ci.currency),
        isNative: ci.currency.isNative,
      })),
    [tokens],
  )
  return useOrderedMultichainEntries(entries)
}

interface MultichainTokenContextMenuButtonProps {
  multichainResult: MultichainSearchResult
  primaryCurrencyInfo: CurrencyInfo
  isVisible?: boolean
}

function MultichainTokenContextMenuButtonInner({
  multichainResult,
  primaryCurrencyInfo,
  isVisible = true,
}: MultichainTokenContextMenuButtonProps): JSX.Element | null {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { value: isOpen, setTrue: openMenu, setFalse: rawCloseMenu } = useBooleanState(false)
  const [viewState, setViewState] = useState<ViewState>('actions')
  const [animationType, setAnimationType] = useState<'forward' | 'backward'>('forward')
  const [copiedAddress, setCopiedAddress] = useState(false)
  // When "Copy address" transitions to the addresses sub-view, DropdownMenuSheetItem
  // fires handleCloseMenu. skipNextClose prevents that single close from dismissing
  // the menu, keeping it open while the view changes.
  const skipNextClose = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const isSingleChain = multichainResult.tokens.length <= 1
  const bestCurrency = useBestChainCurrencyInfo(multichainResult.tokens, primaryCurrencyInfo)
  const orderedEntries = useMultichainEntries(multichainResult.tokens)
  const allNative = orderedEntries.every((e) => e.isNative)

  const handleCloseMenu = useCallback(() => {
    clearTimeout(timerRef.current)
    rawCloseMenu()
    setViewState('actions')
    setCopiedAddress(false)
  }, [rawCloseMenu])

  useDelayedMenuClose({ isVisible, isOpen, closeMenu: handleCloseMenu })

  const handleContentClose = useCallback(() => {
    if (skipNextClose.current) {
      skipNextClose.current = false
      return
    }
    handleCloseMenu()
  }, [handleCloseMenu])

  const onCopyAddressPress = useCallback(async (): Promise<void> => {
    if (isSingleChain) {
      await setClipboard(currencyAddress(primaryCurrencyInfo.currency))
      if (!isWebPlatform) {
        dispatch(pushNotification({ type: AppNotificationType.Copied, copyType: CopyNotificationType.Address }))
      }
      setCopiedAddress(true)
      timerRef.current = setTimeout(() => setCopiedAddress(false), COPY_CLOSE_DELAY)
    } else {
      skipNextClose.current = true
      setAnimationType('forward')
      setViewState('addresses')
    }
  }, [isSingleChain, primaryCurrencyInfo.currency, dispatch])

  const onCopyMultichainAddress = useCallback(
    async (address: string): Promise<void> => {
      await setClipboard(address)
      if (!isWebPlatform) {
        dispatch(pushNotification({ type: AppNotificationType.Copied, copyType: CopyNotificationType.Address }))
      }
      sendAnalyticsEvent(UniswapEventName.ContextMenuItemClicked, {
        element: ElementName.SearchTokenContextMenu,
        section: SectionName.NavbarSearch,
        menu_item: 'Multichain Copy Address',
        menu_item_index: -1,
      })
      timerRef.current = setTimeout(handleCloseMenu, COPY_CLOSE_DELAY)
    },
    [dispatch, handleCloseMenu],
  )

  const { menuItems: actionItems } = useSearchTokenMenuItems({
    currency: bestCurrency.currency,
    closeMenu: handleCloseMenu,
    actions: MULTICHAIN_ACTIONS,
    shareCurrencyInfo: { currencyId: primaryCurrencyInfo.currencyId, chainId: primaryCurrencyInfo.currency.chainId },
  })

  const allMenuItems = useMemo(() => {
    const isCopyDisabled = isSingleChain ? primaryCurrencyInfo.currency.isNative : allNative
    const copyItem: MenuOptionItem = {
      onPress: onCopyAddressPress,
      disabled: isCopyDisabled,
      label: copiedAddress ? t('common.copied') : t('common.copy.address'),
      Icon: copiedAddress ? CheckCircleFilled : CopyAlt,
      closeDelay: isSingleChain ? COPY_CLOSE_DELAY : undefined,
      iconColor: copiedAddress ? '$statusSuccess' : '$neutral2',
      trailingIcon:
        !isSingleChain && !allNative ? (
          <RotatableChevron direction="right" color="$neutral3" size="$icon.16" />
        ) : undefined,
    }
    return [copyItem, ...actionItems]
  }, [
    onCopyAddressPress,
    isSingleChain,
    primaryCurrencyInfo.currency.isNative,
    copiedAddress,
    t,
    actionItems,
    allNative,
  ])

  const handleBack = useCallback(() => {
    setAnimationType('backward')
    setViewState('actions')
  }, [])

  const viewIndex = viewState === 'actions' ? 0 : 1

  // Analytics props (trackItemClicks, elementName, sectionName) are passed directly to
  // MenuContent here because contentOverride bypasses ContextMenu's default MenuContent.
  const contentOverride = useMemo(
    () => (
      <AnimateTransition currentIndex={viewIndex} animationType={animationType} animation="200ms">
        <MenuContent
          trackItemClicks
          items={allMenuItems}
          handleCloseMenu={handleContentClose}
          elementName={ElementName.SearchTokenContextMenu}
          sectionName={SectionName.NavbarSearch}
        />
        {/* oxlint-disable-next-line react/forbid-elements -- needed to stop event propagation to parent row */}
        <div
          onContextMenu={(e): void => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onClick={(e): void => {
            e.stopPropagation()
          }}
          onMouseDown={(e): void => {
            e.stopPropagation()
          }}
        >
          <Flex
            backgroundColor="$surface1"
            borderRadius="$rounded20"
            borderWidth={1}
            borderColor="$surface3"
            alignItems="stretch"
            pt="$spacing8"
            px="$spacing8"
            width={ADDRESSES_POPOVER_WIDTH}
            maxHeight={ADDRESSES_POPOVER_MAX_HEIGHT}
          >
            <TouchableArea row alignItems="center" gap="$spacing8" p="$spacing8" onPress={handleBack}>
              <RotatableChevron direction="left" color="$neutral2" size="$icon.16" />
              <Text variant="buttonLabel3" color="$neutral1" flex={1} textAlign="center">
                {t('common.copy.address')}
              </Text>
            </TouchableArea>
            <Flex flex={1} minHeight={0}>
              <MultichainAddressList chains={orderedEntries} onCopyAddress={onCopyMultichainAddress} />
            </Flex>
          </Flex>
        </div>
      </AnimateTransition>
    ),
    [
      viewIndex,
      animationType,
      allMenuItems,
      handleContentClose,
      orderedEntries,
      onCopyMultichainAddress,
      handleBack,
      t,
    ],
  )

  // Web-only: the menu content above uses <div> for event propagation control, which crashes on native.
  if (!isWebPlatform) {
    return null
  }

  const shouldShow = isVisible || isOpen

  return (
    <Flex opacity={shouldShow ? 1 : 0} pointerEvents={shouldShow ? 'auto' : 'none'}>
      <ContextMenu
        menuItems={[]}
        contentOverride={contentOverride}
        triggerMode={ContextMenuTriggerMode.Primary}
        isOpen={isOpen}
        closeMenu={handleCloseMenu}
        openMenu={openMenu}
        offsetY={4}
        elementName={ElementName.SearchTokenContextMenu}
        sectionName={SectionName.NavbarSearch}
      >
        <ContextMenuTriggerButton />
      </ContextMenu>
    </Flex>
  )
}

export const MultichainTokenContextMenuButton = React.memo(MultichainTokenContextMenuButtonInner)
