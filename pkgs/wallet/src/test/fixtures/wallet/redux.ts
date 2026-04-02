import { PreloadedState } from 'redux'
import { createFixture } from 'lx/src/test/utils'
import { Account } from '@luxfi/wallet/src/features/wallet/accounts/types'
import { initialWalletState, WalletSliceState } from '@luxfi/wallet/src/features/wallet/slice'
import { WalletState as WalletPackageState } from '@luxfi/wallet/src/state/walletReducer'
import { signerMnemonicAccount } from '@luxfi/wallet/src/test/fixtures/wallet/accounts'

type WalletPreloadedStateOptions = {
  account: Account
}

export const preloadedWalletReducerState = createFixture<WalletSliceState, WalletPreloadedStateOptions>(() => ({
  account: signerMnemonicAccount(),
}))(({ account }) => ({
  ...initialWalletState,
  accounts: { [account.address]: account },
  activeAccountAddress: account.address,
}))

type PreloadedSharedStateOptions = {
  account: Account | undefined
}

export const preloadedWalletPackageState = createFixture<
  PreloadedState<WalletPackageState>,
  PreloadedSharedStateOptions
>({
  account: undefined,
})(({ account }) => ({
  wallet: preloadedWalletReducerState({ account }),
})) as (options?: PreloadedSharedStateOptions) => PreloadedState<WalletPackageState>
