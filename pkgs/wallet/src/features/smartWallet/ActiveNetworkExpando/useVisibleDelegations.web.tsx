import {
  UseVisibleDelegationsParams,
  UseVisibleDelegationsResult,
} from '@luxfi/wallet/src/features/smartWallet/ActiveNetworkExpando/useVisibleDelegations'

export function useVisibleDelegations({ data }: UseVisibleDelegationsParams): UseVisibleDelegationsResult {
  return { maxHeight: '100%', visibleItems: data }
}
