import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { ethers } from 'ethers'
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { LuxProvider } from 'lx/src/contexts/LuxContext'
import { getDelegationService } from 'lx/src/domains/services'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useUpdateDelegatedState } from 'lx/src/features/smartWallet/delegation/hooks/useUpdateDelegateState'
import { useHasAccountMismatchCallback } from 'lx/src/features/smartWallet/mismatch/hooks'
import { MismatchContextProvider } from 'lx/src/features/smartWallet/mismatch/MismatchContext'
import type {
  HasMismatchInput,
  HasMismatchResult,
  HasMismatchUtil,
} from 'lx/src/features/smartWallet/mismatch/mismatch'
import { createHasMismatchUtil } from 'lx/src/features/smartWallet/mismatch/mismatch'
import { useGetCanSignPermits } from 'lx/src/features/transactions/hooks/useGetCanSignPermits'
import { prepareSwapFormState } from 'lx/src/features/transactions/types/transactionState'
import { CurrencyField } from 'lx/src/types/currency'
import { getLogger, logger } from 'utilities/src/logger/logger'
import { useEvent } from 'utilities/src/react/hooks'
import { useWalletNavigation } from '@luxfi/wallet/src/contexts/WalletNavigationContext'
import { useAccountsStoreContext } from '@luxfi/wallet/src/features/accounts/store/provider'
import {
  useGetSwapDelegationInfoForActiveAccount,
  WalletDelegationProvider,
} from '@luxfi/wallet/src/features/smartWallet/WalletDelegationProvider'
import { useShowSwapNetworkNotification } from '@luxfi/wallet/src/features/transactions/swap/hooks/useShowSwapNetworkNotification'
import { useProvider, useWalletSigners } from '@luxfi/wallet/src/features/wallet/context'
import { useActiveAccount, useActiveSignerAccount, useDisplayName } from '@luxfi/wallet/src/features/wallet/hooks'
import { NativeSigner } from '@luxfi/wallet/src/features/wallet/signing/NativeSigner'

// Adapts useProvider to fit lx context requirement of returning undefined instead of null
function useWalletProvider(chainId: number): ethers.providers.JsonRpcProvider | undefined {
  return useProvider(chainId) ?? undefined
}

// Gets the signer for the active account
function useWalletSigner(): NativeSigner | undefined {
  const account = useActiveSignerAccount()
  const signerManager = useWalletSigners()
  const [signer, setSigner] = useState<NativeSigner | undefined>(undefined)
  useEffect(() => {
    setSigner(undefined) // clear signer if account changes

    if (!account) {
      return
    }

    signerManager
      .getSignerForAccount(account)
      .then(setSigner)
      .catch((error) => logger.error(error, { tags: { file: 'WalletLuxContext', function: 'useWalletSigner' } }))
  }, [account, signerManager])

  return signer
}
export function WalletLuxProvider({ children }: PropsWithChildren): JSX.Element {
  return (
    <MismatchContextWrapper>
      <WalletDelegationProvider>
        <WalletLuxProviderInner>{children}</WalletLuxProviderInner>
      </WalletDelegationProvider>
    </MismatchContextWrapper>
  )
}

// Abstracts wallet-specific transaction flow objects for usage in cross-platform flows in the `lx` package.
function WalletLuxProviderInner({ children }: PropsWithChildren): JSX.Element {
  const signer = useWalletSigner()
  const {
    navigateToTokenDetails,
    navigateToNftDetails,
    navigateToBuyOrReceiveWithEmptyWallet,
    navigateToFiatOnRamp,
    navigateToSwapFlow,
    navigateToSend,
    navigateToReceive,
    navigateToExternalProfile,
    navigateToPoolDetails,
    handleShareToken,
    navigateToAdvancedSettings,
  } = useWalletNavigation()
  const showSwapNetworkNotification = useShowSwapNetworkNotification()

  const navigateToSwapFromCurrencyIds = useCallback(
    ({
      inputCurrencyId,
      outputCurrencyId,
      exactCurrencyField,
      exactAmountToken,
    }: {
      inputCurrencyId?: string
      outputCurrencyId?: string
      exactCurrencyField?: CurrencyField
      exactAmountToken?: string
    }) => {
      const initialState = prepareSwapFormState({
        inputCurrencyId,
        outputCurrencyId,
        defaultChainId: UniverseChainId.Mainnet,
        exactCurrencyField,
        exactAmountToken,
      })
      navigateToSwapFlow({ initialState })
    },
    [navigateToSwapFlow],
  )

  const getHasMismatch = useHasAccountMismatchCallback()
  const isPermitMismatchUxEnabled = useFeatureFlag(FeatureFlags.EnablePermitMismatchUX)
  const getIsLXSupported = useEvent((innerChainId?: UniverseChainId) => {
    if (isPermitMismatchUxEnabled) {
      return !getHasMismatch(innerChainId)
    }
    return true
  })

  const getCanSignPermits = useGetCanSignPermits()
  const getSwapDelegationInfo = useGetSwapDelegationInfoForActiveAccount()
  const getCanPayGasInAnyToken = useCallback(() => false, [])

  return (
    <LuxProvider
      navigateToBuyOrReceiveWithEmptyWallet={navigateToBuyOrReceiveWithEmptyWallet}
      navigateToFiatOnRamp={navigateToFiatOnRamp}
      navigateToSwapFlow={navigateToSwapFromCurrencyIds}
      navigateToSendFlow={navigateToSend}
      navigateToReceive={navigateToReceive}
      navigateToTokenDetails={navigateToTokenDetails}
      navigateToExternalProfile={navigateToExternalProfile}
      navigateToNftDetails={navigateToNftDetails}
      navigateToPoolDetails={navigateToPoolDetails}
      handleShareToken={handleShareToken}
      navigateToAdvancedSettings={navigateToAdvancedSettings}
      signer={signer}
      useProviderHook={useWalletProvider}
      useWalletDisplayName={useDisplayName}
      getIsLXSupported={getIsLXSupported}
      getCanSignPermits={getCanSignPermits}
      getSwapDelegationInfo={getSwapDelegationInfo}
      useAccountsStoreContextHook={useAccountsStoreContext}
      getCanPayGasInAnyToken={getCanPayGasInAnyToken}
      onSwapChainsChanged={showSwapNetworkNotification}
    >
      {children}
    </LuxProvider>
  )
}

/**
 * MismatchContextWrapper -- wraps the MismatchContextProvider with the active account and default chain id
 * @param children - the children to render
 * @returns the MismatchContextProvider with the active account and default chain id
 */
const MismatchContextWrapper = React.memo(function MismatchContextWrapper({
  children,
}: PropsWithChildren): JSX.Element {
  const account = useActiveAccount() ?? undefined
  const { defaultChainId, chains, isTestnetModeEnabled } = useEnabledChains()
  const mismatchCallback = useMismatchCallback()
  return (
    <MismatchContextProvider
      address={account?.address}
      chainId={defaultChainId}
      mismatchCallback={mismatchCallback}
      chains={chains}
      defaultChainId={defaultChainId}
      isTestnetModeEnabled={isTestnetModeEnabled}
      onHasAnyMismatch={() => {
        // todo: implement
      }}
    >
      {children}
    </MismatchContextProvider>
  )
})

MismatchContextWrapper.displayName = 'MismatchContextWrapper'

function useMismatchCallback(): HasMismatchUtil {
  const updateDelegatedState = useUpdateDelegatedState()
  return useEvent(
    async (input: HasMismatchInput): HasMismatchResult =>
      createHasMismatchUtil({
        logger: getLogger(),
        delegationService: getDelegationService({
          onDelegationDetected: (payload) => {
            // update redux state
            updateDelegatedState({ chainId: String(payload.chainId), address: payload.address })
          },
        }),
        getIsAtomicBatchingSupported: async () => {
          // hardcoded to false for now
          return false
        },
      })(input),
  )
}
