<<<<<<< HEAD
import { Currency } from '@luxamm/sdk-core'
import { useCallback, useEffect } from 'react'
import { Flex } from '@l.x/ui/src'
import { TokenSelectorContent } from 'lx/src/components/TokenSelector/TokenSelector'
import { TokenSelectorFlow, TokenSelectorVariation } from 'lx/src/components/TokenSelector/types'
import { useActiveAddresses } from 'lx/src/features/accounts/store/hooks'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { InterfaceEventName, ModalName } from 'lx/src/features/telemetry/constants'
import Trace from 'lx/src/features/telemetry/Trace'
import { CurrencyField } from 'lx/src/types/currency'
import { SwapTab } from 'lx/src/types/screens/interface'
import { usePrevious } from '@l.x/utils/src/react/hooks'
=======
import { Currency } from '@uniswap/sdk-core'
import { useCallback, useEffect } from 'react'
import { Flex } from 'ui/src'
import { TokenSelectorContent } from 'uniswap/src/components/TokenSelector/TokenSelector'
import { TokenSelectorFlow, TokenSelectorVariation } from 'uniswap/src/components/TokenSelector/types'
import { useActiveAddresses } from 'uniswap/src/features/accounts/store/hooks'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { InterfaceEventName, ModalName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { CurrencyField } from 'uniswap/src/types/currency'
import { SwapTab } from 'uniswap/src/types/screens/interface'
import { usePrevious } from 'utilities/src/react/hooks'
>>>>>>> upstream/main
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

<<<<<<< HEAD
=======
  const isSingleChainContext = chainIds?.length === 1
  const resolvedChainId = isSingleChainContext
    ? chainIds[0]
    : !isMultichainContext || isUserSelectedToken
      ? chainId
      : undefined

>>>>>>> upstream/main
  return (
    <Trace logImpression eventOnTrigger={InterfaceEventName.TokenSelectorOpened} modal={ModalName.TokenSelectorWeb}>
      <Flex width="100%" flexGrow={1} flexShrink={1} flexBasis="auto">
        <TokenSelectorContent
          renderedInModal={false}
          addresses={addresses}
<<<<<<< HEAD
          chainId={!isMultichainContext || isUserSelectedToken ? chainId : undefined}
=======
          chainId={resolvedChainId}
>>>>>>> upstream/main
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
