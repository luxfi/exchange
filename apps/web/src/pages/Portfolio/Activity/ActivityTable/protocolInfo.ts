import { DappInfoTransactionDetails } from 'uniswap/src/features/transactions/types/transactionDetails'
import { ActivityProtocolInfo } from '~/pages/Portfolio/Activity/ActivityTable/activityTableModels'

/**
 * Normalizes protocol names for display in the activity table.
 * Applies hardcoded corrections to protocol names from the backend.
 */
function normalizeProtocolName(name: string): string {
  if (name === 'Across API') {
    return 'Across'
  }
  if (name === 'Uniswap V4' || name === 'Uniswap V3' || name === 'Uniswap V2') {
    return 'Uniswap'
  }
  return name
}

export function toProtocolInfo(dappInfo: DappInfoTransactionDetails | undefined): ActivityProtocolInfo | null {
  if (!dappInfo?.name) {
    return null
  }
  return {
    name: normalizeProtocolName(dappInfo.name),
    logoUrl: dappInfo.icon,
  }
}
