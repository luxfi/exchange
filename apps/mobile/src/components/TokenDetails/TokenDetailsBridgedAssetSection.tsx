import { navigate } from 'src/app/navigation/rootNavigation'
import { useTokenDetailsContext } from 'src/components/TokenDetails/TokenDetailsContext'
import { BridgedAssetTDPSection } from '@luxexchange/lx/src/components/BridgedAsset/BridgedAssetTDPSection'
import { ModalName } from '@luxexchange/lx/src/features/telemetry/constants'
import { useCurrencyInfo } from '@luxexchange/lx/src/features/tokens/useCurrencyInfo'
import { CurrencyField } from '@luxexchange/lx/src/types/currency'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
import { useWalletNavigation } from '@luxfi/wallet/src/contexts/WalletNavigationContext'

export function TokenDetailsBridgedAssetSection(): JSX.Element | null {
  const { currencyId, chainId, address } = useTokenDetailsContext()
  const currencyInfo = useCurrencyInfo(currencyId)
  const { navigateToSwapFlow } = useWalletNavigation()
  const handlePress = useEvent(() => {
    if (!currencyInfo) {
      return
    }
    navigate(ModalName.BridgedAsset, {
      currencyInfo0: currencyInfo,
      onContinue: () => {
        navigateToSwapFlow({
          currencyField: CurrencyField.OUTPUT,
          currencyAddress: address,
          currencyChainId: chainId,
          origin: ModalName.BridgedAsset,
        })
      },
    })
  })
  const isBridgedAsset = Boolean(currencyInfo?.isBridged)
  if (!isBridgedAsset || !currencyInfo) {
    return null
  }

  return <BridgedAssetTDPSection currencyInfo={currencyInfo} onPress={handlePress} />
}
