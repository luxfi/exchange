import { Currency } from '@luxamm/sdk-core'
import { useCallback, useEffect } from 'react'
import { Flex } from '@luxfi/ui/src'
import { TokenSelectorContent } from 'lx/src/components/TokenSelector/TokenSelector'
import { TokenSelectorFlow, TokenSelectorVariation } from 'lx/src/components/TokenSelector/types'
import { useActiveAddresses } from 'lx/src/features/accounts/store/hooks'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { InterfaceEventName, ModalName } from 'lx/src/features/telemetry/constants'
import Trace from 'lx/src/features/telemetry/Trace'
import { CurrencyField } from 'lx/src/types/currency'
import { SwapTab } from 'lx/src/types/screens/interface'
import { usePrevious } from '@luxfi/utilities/src/react/hooks'
import { SwitchNetworkAction } from '~/components/Popups/types'
import useSelectChain from '~/hooks/useSelectChain'
import { useMultichainContext } from '~/state/multichain/useMultichainContext'
import { useSwapAndLimitContext } from '~/state/swap/useSwapContext'
import { showSwitchNetworkNotification } from '~/utils/showSwitchNetworkNotification'

interface CurrencySearchProps {
  currencyField: CurrencyField
  switchNetworkAction: SwitchNetworkAction
  onCurrencySelect: (currency: Currency) => void
  onDismiss: () => void
  chainIds?: UniverseChainId[]
  variation?: TokenSelectorVariation
  flow?: TokenSelectorFlow
}

export function CurrencySearch({
  currencyField,
  switchNetworkAction,
  onCurrencySelect,
  onDismiss,
  chainIds,
  variation,
  flow = TokenSelectorFlow.Swap,
}: CurrencySearchProps) {
  const addresses = useActiveAddresses()

  const { chainId, setSelectedChainId, isUserSelectedToken, setIsUserSelectedToken, isMultichainContext } =
    useMultichainContext()
  const { currentTab } = useSwapAndLimitContext()
  const prevChainId = usePrevious(chainId)

  const selectChain = useSelectChain()
  const { chains } = useEnabledChains()

  const handleCurrencySelectTokenSelectorCallback = useCallback(
    async ({ currency }: { currency: Currency }) => {
      if (!isMultichainContext) {
        const correctChain = await selectChain(currency.chainId)
        if (!correctChain) {
          return
        }
      }

      onCurrencySelect(currency)
      setSelectedChainId(currency.chainId)
      setIsUserSelectedToken(true)
      onDismiss()
    },
    [onCurrencySelect, onDismiss, setSelectedChainId, setIsUserSelectedToken, selectChain, isMultichainContext],
  )

  useEffect(() => {
    if ((currentTab !== SwapTab.Swap && currentTab !== SwapTab.Send) || !isMultichainContext) {
      return
    }

    showSwitchNetworkNotification({ chainId, prevChainId, action: switchNetworkAction })
  }, [currentTab, chainId, prevChainId, isMultichainContext, switchNetworkAction])

  return (
    <Trace logImpression eventOnTrigger={InterfaceEventName.TokenSelectorOpened} modal={ModalName.TokenSelectorWeb}>
      <Flex width="100%" flexGrow={1} flexShrink={1} flexBasis="auto">
        <TokenSelectorContent
          renderedInModal={false}
          addresses={addresses}
          chainId={!isMultichainContext || isUserSelectedToken ? chainId : undefined}
          chainIds={chainIds ?? chains}
          currencyField={currencyField}
          flow={currentTab === SwapTab.Limit ? TokenSelectorFlow.Limit : flow}
          isSurfaceReady={true}
          variation={
            variation ??
            (currencyField === CurrencyField.INPUT
              ? TokenSelectorVariation.SwapInput
              : TokenSelectorVariation.SwapOutput)
          }
          onClose={onDismiss}
          onSelectCurrency={handleCurrencySelectTokenSelectorCallback}
        />
      </Flex>
    </Trace>
  )
}
