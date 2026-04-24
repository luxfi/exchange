import { AppStackScreenProp } from 'src/app/navigation/types'
import { useReactNavigationModal } from 'src/components/modals/useReactNavigationModal'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { TokenList } from '@l.x/lx/src/features/dataApi/types'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { getTokenProtectionWarning } from '@l.x/lx/src/features/tokens/warnings/safetyUtils'
import { useDismissedTokenWarnings } from '@l.x/lx/src/features/tokens/warnings/slice/hooks'
import TokenWarningModal from '@l.x/lx/src/features/tokens/warnings/TokenWarningModal'
import { currencyIdToAddress, currencyIdToChain, isNativeCurrencyAddress } from '@l.x/lx/src/utils/currencyId'

export function TokenWarningModalWrapper({
  route,
}: AppStackScreenProp<typeof ModalName.TokenWarning>): JSX.Element | null {
  const { defaultChainId } = useEnabledChains()
  const { onClose } = useReactNavigationModal()

  const { currencyId, onAcknowledge } = route.params.initialState ?? {}
  const currencyChainId = (currencyId && currencyIdToChain(currencyId)) || defaultChainId
  const currencyAddress = currencyId ? currencyIdToAddress(currencyId) : undefined
  const currencyInfo = useCurrencyInfo(currencyId)
  const tokenProtectionWarning = getTokenProtectionWarning(currencyInfo)

  // Get the token info only if we have a valid non-native currency
  const isNativeCurrency = isNativeCurrencyAddress(currencyChainId, currencyAddress)
  const { tokenWarningDismissed } = useDismissedTokenWarnings(
    isNativeCurrency || !currencyAddress ? undefined : { chainId: currencyChainId, address: currencyAddress },
    tokenProtectionWarning,
  )

  // Return null if modal state is malformed
  if (!route.params.initialState) {
    return null
  }

  // If no currency info found, skip warning and proceed to SwapFlow
  if (!currencyInfo) {
    onClose()
    onAcknowledge?.()
    return null
  }

  const tokenList = currencyInfo.safetyInfo?.tokenList
  const isBlocked = tokenList === TokenList.Blocked

  // If token is verified or warning was dismissed and not blocked, skip warning and proceed to next step.
  if (!isBlocked && (tokenList === TokenList.Default || tokenWarningDismissed)) {
    onAcknowledge?.()
    return null
  }

  return (
    <TokenWarningModal
      isVisible
      currencyInfo0={currencyInfo}
      isInfoOnlyWarning={isBlocked}
      closeModalOnly={onClose}
      onAcknowledge={isBlocked ? onClose : (): void => onAcknowledge?.()}
    />
  )
}
