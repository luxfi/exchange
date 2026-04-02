import { SwapTransactionSettingsStoreContextProvider } from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/SwapTransactionSettingsStoreContextProvider'
import { Slippage } from '@l.x/lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/slippage/Slippage/Slippage'
import { TradeRoutingPreference } from '@l.x/lx/src/features/transactions/swap/components/SwapFormSettings/settingsConfigurations/TradeRoutingPreference/TradeRoutingPreference'
import { SwapFlow, type SwapFlowProps } from '@l.x/lx/src/features/transactions/swap/SwapFlow/SwapFlow'
import { SwapDependenciesStoreContextProvider } from '@l.x/lx/src/features/transactions/swap/stores/swapDependenciesStore/SwapDependenciesStoreContextProvider'
import { SwapFormStoreContextProvider } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/SwapFormStoreContextProvider'
import { useSwapHandlers } from '@luxfi/wallet/src/features/transactions/swap/hooks/useSwapHandlers'
import { SwapProtection } from '@luxfi/wallet/src/features/transactions/swap/settings/SwapProtection'

type WalletSwapFlowProps = Omit<SwapFlowProps, 'settings'> & {
  onSubmitSwap?: () => Promise<void>
}

const SETTINGS: SwapFlowProps['settings'] = [Slippage, SwapProtection, TradeRoutingPreference]

export function WalletSwapFlow(props: WalletSwapFlowProps): JSX.Element {
  const swapHandlers = useSwapHandlers()

  return (
    <SwapTransactionSettingsStoreContextProvider>
      <SwapFormStoreContextProvider
        prefilledState={props.prefilledState}
        hideSettings={props.hideHeader}
        hideFooter={props.hideFooter}
      >
        <SwapDependenciesStoreContextProvider swapHandlers={swapHandlers}>
          <SwapFlow {...props} settings={SETTINGS} />
        </SwapDependenciesStoreContextProvider>
      </SwapFormStoreContextProvider>
    </SwapTransactionSettingsStoreContextProvider>
  )
}
