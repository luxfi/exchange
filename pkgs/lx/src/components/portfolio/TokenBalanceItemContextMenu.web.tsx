import { memo, PropsWithChildren, useCallback, useMemo } from 'react'
import { TouchableArea } from '@l.x/ui/src'
import { ContextMenu } from '@l.x/lx/src/components/menus/ContextMenu'
import { ContextMenuTriggerMode } from '@l.x/lx/src/components/menus/types'
import { TokenBalanceItemContextMenuProps } from '@l.x/lx/src/components/portfolio/TokenBalanceItemContextMenu'
import { TokenList } from '@l.x/lx/src/features/dataApi/types'
import { useTokenContextMenuOptions } from '@l.x/lx/src/features/portfolio/balances/hooks/useTokenContextMenuOptions'
import { ElementName, SectionName } from '@l.x/lx/src/features/telemetry/constants'
import { isExtensionApp } from '@l.x/utils/src/platform'
import { useBooleanState } from '@l.x/utils/src/react/useBooleanState'

export const TokenBalanceItemContextMenu = memo(function TokenBalanceItemContextMenu({
  children,
  portfolioBalance,
  excludedActions,
  openContractAddressExplainerModal,
  openReportTokenModal,
  copyAddressToClipboard,
  triggerMode,
  onPressToken: onPressToken,
  disableNotifications,
  recipient,
}: PropsWithChildren<TokenBalanceItemContextMenuProps>): JSX.Element {
  const { value: isOpen, setTrue: openMenu, setFalse: closeMenu } = useBooleanState(false)
  const isPrimaryTriggerMode = isExtensionApp || triggerMode === ContextMenuTriggerMode.Primary

  const menuActions = useTokenContextMenuOptions({
    excludedActions,
    currencyId: portfolioBalance.currencyInfo.currencyId,
    isBlocked: portfolioBalance.currencyInfo.safetyInfo?.tokenList === TokenList.Blocked,
    tokenSymbolForNotification: portfolioBalance.currencyInfo.currency.symbol,
    portfolioBalance,
    openContractAddressExplainerModal,
    openReportTokenModal,
    copyAddressToClipboard,
    closeMenu,
    disableNotifications,
    recipient,
  })

  const ignoreDefault = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const actionableItem = useMemo(() => {
    return (
      // biome-ignore lint/correctness/noRestrictedElements: needed here
      <div style={{ cursor: 'pointer' }} onContextMenu={isExtensionApp ? ignoreDefault : openMenu}>
        <TouchableArea
          onPressIn={(e) => e.stopPropagation()}
          onPressOut={(e) => e.stopPropagation()}
          onPress={isPrimaryTriggerMode ? openMenu : onPressToken}
        >
          {children}
        </TouchableArea>
      </div>
    )
  }, [children, ignoreDefault, onPressToken, openMenu, isPrimaryTriggerMode])
  return (
    <ContextMenu
      trackItemClicks
      menuItems={menuActions}
      triggerMode={isPrimaryTriggerMode ? ContextMenuTriggerMode.Primary : ContextMenuTriggerMode.Secondary}
      isOpen={isOpen}
      openMenu={openMenu}
      closeMenu={closeMenu}
      elementName={ElementName.PortfolioTokenContextMenu}
      sectionName={SectionName.PortfolioTokensTab}
    >
      {actionableItem}
    </ContextMenu>
  )
})
