import { PlatformSplitStubError } from '@l.x/utils/src/errors'
import { type Account } from '@luxfi/wallet/src/features/wallet/accounts/types'

export interface DappEllipsisDropdownProps {
  removeAllDappConnections: (activeAccount: Account) => Promise<void>
  // only for mobile; throw error if passed on web
  setIsEditing?: (isEditing: boolean) => void
  isEditing?: boolean
}

export function DappEllipsisDropdown(_: DappEllipsisDropdownProps): JSX.Element {
  throw new PlatformSplitStubError('BottomSheetDetachedModal')
}
