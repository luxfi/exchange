import { PropsWithChildren } from 'react'
import { ContextMenuTriggerMode } from '@l.x/lx/src/components/menus/types'
import { PortfolioBalance } from '@l.x/lx/src/features/dataApi/types'
import { TokenMenuActionType } from '@l.x/lx/src/features/portfolio/balances/hooks/useTokenContextMenuOptions'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export interface TokenBalanceItemContextMenuProps {
  portfolioBalance: PortfolioBalance
  excludedActions?: TokenMenuActionType[]
  openContractAddressExplainerModal?: () => void
  openReportTokenModal: () => void
  copyAddressToClipboard?: (address: string) => Promise<void>
  triggerMode?: ContextMenuTriggerMode
  onPressToken?: () => void
  disableNotifications?: boolean
  recipient?: Address // Pre-filled recipient address for send action
}

export function TokenBalanceItemContextMenu(_props: PropsWithChildren<TokenBalanceItemContextMenuProps>): JSX.Element {
  throw new PlatformSplitStubError('TokenBalanceItemContextMenu')
}
