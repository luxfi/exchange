import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppStackParamList } from 'src/app/navigation/types'
import { useTokenDetailsColors } from 'src/components/TokenDetails/useTokenDetailsColors'
import { setHasViewedContractAddressExplainer } from 'lx/src/features/behaviorHistory/slice'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { pushNotification } from 'lx/src/features/notifications/slice/slice'
import { AppNotificationType, CopyNotificationType } from 'lx/src/features/notifications/slice/types'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { CurrencyField } from 'lx/src/types/currency'
import { MobileScreens } from 'lx/src/types/screens/mobile'
import { setClipboard } from 'lx/src/utils/clipboard'
import { currencyIdToAddress, currencyIdToChain } from 'lx/src/utils/currencyId'
import { useBooleanState } from 'utilities/src/react/useBooleanState'

type TokenDetailsContextState = {
  currencyId: string
  navigation: NativeStackNavigationProp<AppStackParamList, MobileScreens.TokenDetails, undefined>
  address: Address
  chainId: UniverseChainId
  currencyInfo?: CurrencyInfo
  tokenColor: string | null
  tokenColorLoading: boolean
  isChainEnabled: boolean
  activeTransactionType?: CurrencyField
  setActiveTransactionType: (activeTransactionType: CurrencyField | undefined) => void
  isTokenWarningModalOpen: boolean
  openTokenWarningModal: () => void
  closeTokenWarningModal: () => void
  isContractAddressExplainerModalOpen: boolean
  openContractAddressExplainerModal: () => void
  closeContractAddressExplainerModal: (markViewed: boolean) => void
  isAztecWarningModalOpen: boolean
  openAztecWarningModal: () => void
  closeAztecWarningModal: () => void
  copyAddressToClipboard: (address: string) => Promise<void>
  error: unknown | undefined
  setError: (error: unknown | undefined) => void
}

const TokenDetailsContext = createContext<TokenDetailsContextState | undefined>(undefined)

export function TokenDetailsContextProvider({
  children,
  currencyId,
  navigation,
}: PropsWithChildren<Pick<TokenDetailsContextState, 'currencyId' | 'navigation'>>): JSX.Element {
  const dispatch = useDispatch()

  const [error, setError] = useState<unknown>(undefined)

  const [isTokenWarningModalOpen, setIsTokenWarningModalOpen] = useState(false)
  const openTokenWarningModal = useCallback(() => setIsTokenWarningModalOpen(true), [])
  const closeTokenWarningModal = useCallback(() => setIsTokenWarningModalOpen(false), [])

  const [isContractAddressExplainerModalOpen, setIsContractAddressExplainerModalOpen] = useState(false)
  const openContractAddressExplainerModal = useCallback(() => setIsContractAddressExplainerModalOpen(true), [])
  const closeContractAddressExplainerModal = useCallback(
    (markViewed: boolean) => {
      if (markViewed) {
        dispatch(setHasViewedContractAddressExplainer(true))
      }
      setIsContractAddressExplainerModalOpen(false)
    },
    [dispatch],
  )

  const {
    value: isAztecWarningModalOpen,
    setTrue: openAztecWarningModal,
    setFalse: closeAztecWarningModal,
  } = useBooleanState(false)

  const copyAddressToClipboard = useCallback(
    async (address: string): Promise<void> => {
      await setClipboard(address)
      dispatch(
        pushNotification({
          type: AppNotificationType.Copied,
          copyType: CopyNotificationType.ContractAddress,
        }),
      )
    },
    [dispatch],
  )

  // Set if attempting to buy or sell, used for token warning modal.
  const [activeTransactionType, setActiveTransactionType] = useState<CurrencyField | undefined>(undefined)

  const currencyInfo = useCurrencyInfo(currencyId) ?? undefined

  const { tokenColor, tokenColorLoading } = useTokenDetailsColors({ currencyId })

  const { chains: enabledChains } = useEnabledChains()

  const state = useMemo<TokenDetailsContextState>((): TokenDetailsContextState => {
    const chainId = currencyIdToChain(currencyId)
    const address = currencyIdToAddress(currencyId)

    if (!chainId) {
      throw new Error(`Unable to find chainId for currencyId: ${currencyId}`)
    }

    const isChainEnabled = !!enabledChains.find((_chainId) => _chainId === chainId)

    return {
      currencyId,
      navigation,
      address,
      chainId,
      currencyInfo,
      tokenColor,
      tokenColorLoading,
      isChainEnabled,
      activeTransactionType,
      setActiveTransactionType,
      isTokenWarningModalOpen,
      openTokenWarningModal,
      closeTokenWarningModal,
      isContractAddressExplainerModalOpen,
      openContractAddressExplainerModal,
      closeContractAddressExplainerModal,
      isAztecWarningModalOpen,
      openAztecWarningModal,
      closeAztecWarningModal,
      copyAddressToClipboard,
      error,
      setError,
    }
  }, [
    activeTransactionType,
    closeTokenWarningModal,
    closeContractAddressExplainerModal,
    closeAztecWarningModal,
    currencyId,
    currencyInfo,
    enabledChains,
    error,
    isAztecWarningModalOpen,
    isContractAddressExplainerModalOpen,
    isTokenWarningModalOpen,
    navigation,
    openAztecWarningModal,
    openContractAddressExplainerModal,
    openTokenWarningModal,
    tokenColor,
    tokenColorLoading,
    copyAddressToClipboard,
  ])

  return <TokenDetailsContext.Provider value={state}>{children}</TokenDetailsContext.Provider>
}

export const useTokenDetailsContext = (): TokenDetailsContextState => {
  const context = useContext(TokenDetailsContext)

  if (context === undefined) {
    throw new Error('`useTokenDetailsContext` must be used inside of `TokenDetailsContextProvider`')
  }

  return context
}
