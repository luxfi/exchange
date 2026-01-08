import { FeatureFlags, useFeatureFlag } from '@luxfi/gating'
import { AZTEC_ADDRESS } from 'lx/src/features/transactions/swap/hooks/useSwapWarnings/getAztecUnavailableWarning'

export const shouldShowAztecWarning = ({
  address,
  isAztecDisabled,
}: {
  address: Address
  isAztecDisabled: boolean
}): boolean => {
  const isAztec = address.toLowerCase() === AZTEC_ADDRESS
  return isAztec && isAztecDisabled
}

export const useShouldShowAztecWarning = (address: Address): boolean => {
  const isAztecDisabled = useFeatureFlag(FeatureFlags.DisableAztecToken)
  return shouldShowAztecWarning({ address, isAztecDisabled })
}
