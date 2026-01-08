import { SharedEventName } from '@luxdex/analytics-events'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { NativeSyntheticEvent } from 'react-native'
import type { ContextMenuAction, ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view'
import type { SharedValue, StyleProps } from 'react-native-reanimated'
import { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useDispatch } from 'react-redux'
import { navigate } from 'src/app/navigation/rootNavigation'
import { openModal } from 'src/features/modals/modalSlice'
import { ScannerModalState } from 'lx/src/components/ReceiveQRCode/constants'
import { AssetType } from 'lx/src/entities/assets'
import type { UniverseChainId } from 'lx/src/features/chains/types'
import { useSelectHasTokenFavorited } from 'lx/src/features/favorites/useSelectHasTokenFavorited'
import { useToggleFavoriteCallback } from 'lx/src/features/favorites/useToggleFavoriteCallback'
import type { SectionName } from 'lx/src/features/telemetry/constants'
import { ElementName, ModalName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'
import type { TransactionState } from 'lx/src/features/transactions/types/transactionState'
import type { CurrencyId } from 'lx/src/types/currency'
import { CurrencyField } from 'lx/src/types/currency'
import { currencyIdToAddress } from 'lx/src/utils/currencyId'
import { useEvent } from 'utilities/src/react/hooks'
import { useWalletNavigation } from 'wallet/src/contexts/WalletNavigationContext'

interface TokenMenuParams {
  currencyId: CurrencyId
  chainId: UniverseChainId
  analyticsSection: SectionName
  // token, which are in favorite section would have it defined
  onEditFavorites?: () => void
  tokenName?: string
}

// Provide context menu related data for token
export function useExploreTokenContextMenu({
  currencyId,
  chainId,
  analyticsSection,
  onEditFavorites,
  tokenName,
}: TokenMenuParams): {
  menuActions: Array<ContextMenuAction & { onPress: () => void }>
  onContextMenuPress: (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => void
} {
  const { t } = useTranslation()
  const isFavorited = useSelectHasTokenFavorited(currencyId)
  const dispatch = useDispatch()

  const { handleShareToken } = useWalletNavigation()

  // `address` is undefined for native currencies, so we want to extract it from
  // currencyId, where we have hardcoded addresses for native currencies
  const currencyAddress = currencyIdToAddress(currencyId)

  const onPressReceive = useEvent(() =>
    dispatch(openModal({ name: ModalName.WalletConnectScan, initialState: ScannerModalState.WalletQr })),
  )

  const onPressShare = useEvent(async () => {
    handleShareToken({ currencyId })
  })

  const toggleFavoriteToken = useToggleFavoriteCallback({ id: currencyId, tokenName, isFavoriteToken: isFavorited })

  const onPressSwap = useEvent(() => {
    const swapFormState: TransactionState = {
      exactCurrencyField: CurrencyField.INPUT,
      exactAmountToken: '',
      [CurrencyField.INPUT]: null,
      [CurrencyField.OUTPUT]: {
        chainId,
        address: currencyAddress,
        type: AssetType.Currency,
      },
    }
    navigate(ModalName.Swap, swapFormState)
    sendAnalyticsEvent(SharedEventName.ELEMENT_CLICKED, {
      element: ElementName.Swap,
      section: analyticsSection,
    })
  })

  const onPressToggleFavorite = useEvent(() => {
    toggleFavoriteToken()
  })

  const menuActions = useMemo(
    () => [
      {
        title: isFavorited ? t('explore.tokens.favorite.action.remove') : t('explore.tokens.favorite.action.add'),
        systemIcon: isFavorited ? 'heart.slash.fill' : 'heart.fill',
        onPress: onPressToggleFavorite,
      },
      ...(onEditFavorites
        ? [
            {
              title: t('explore.tokens.favorite.action.edit'),
              systemIcon: 'square.and.pencil',
              onPress: onEditFavorites,
            },
          ]
        : []),
      { title: t('common.button.swap'), systemIcon: 'arrow.2.squarepath', onPress: onPressSwap },
      {
        title: t('common.button.receive'),
        systemIcon: 'qrcode',
        onPress: onPressReceive,
      },
      ...(!onEditFavorites
        ? [
            {
              title: t('common.button.share'),
              systemIcon: 'square.and.arrow.up',
              onPress: onPressShare,
            },
          ]
        : []),
    ],
    [isFavorited, t, onPressToggleFavorite, onEditFavorites, onPressSwap, onPressReceive, onPressShare],
  )

  const onContextMenuPress = useCallback(
    async (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>): Promise<void> => {
      await menuActions[e.nativeEvent.index]?.onPress?.()
    },
    [menuActions],
  )

  return { menuActions, onContextMenuPress }
}

export function useAnimatedCardDragStyle(
  pressProgress: SharedValue<number>,
  dragActivationProgress: SharedValue<number>,
): StyleProps {
  return useAnimatedStyle(() => ({
    opacity:
      pressProgress.value >= dragActivationProgress.value
        ? 1
        : interpolate(dragActivationProgress.value, [0, 1], [1, 0.5]),
  }))
}
