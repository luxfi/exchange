<<<<<<< HEAD
import { useQuery } from '@tanstack/react-query'
import {
  CheckApprovalLPRequest,
  IncreaseLPPositionRequest,
} from '@luxamm/client-liquidity/dist/lx/liquidity/v1/api_pb'
import type { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
=======
import { IncreaseLPPositionRequest } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import {
  IncreasePositionRequest,
  IncreasePositionResponse,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import { LPAction, LPToken } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/types_pb'
import type { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
>>>>>>> upstream/main
import {
  createContext,
  Dispatch,
  type PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
<<<<<<< HEAD
import { useLuxContextSelector } from '@l.x/lx/src/contexts/LuxContext'
import { liquidityQueries } from '@l.x/lx/src/data/apiClients/liquidityService/liquidityQueries'
import { useActiveAddress } from '@l.x/lx/src/features/accounts/store/hooks'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { toSupportedChainId } from '@l.x/lx/src/features/chains/utils'
import type { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { useTransactionGasFee, useUSDCurrencyAmountOfGasFee } from '@l.x/lx/src/features/gas/hooks'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { DelegatedState } from '@l.x/lx/src/features/smartWallet/delegation/types'
import { InterfaceEventName, ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { useTransactionSettingsStore } from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import {
  type IncreasePositionTxAndGasInfo,
  LiquidityTransactionType,
} from '@l.x/lx/src/features/transactions/liquidity/types'
import { getErrorMessageToDisplay, parseErrorMessageTitle } from '@l.x/lx/src/features/transactions/liquidity/utils'
import { TransactionStepType } from '@l.x/lx/src/features/transactions/steps/types'
import { PermitMethod } from '@l.x/lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import { validatePermit, validateTransactionRequest } from '@l.x/lx/src/features/transactions/swap/utils/trade'
import { currencyId } from '@l.x/lx/src/utils/currencyId'
import { logger } from '@l.x/utils/src/logger/logger'
import { ONE_SECOND_MS } from '@l.x/utils/src/time/time'
import { useIncreasePositionDependentAmountFallback } from '~/components/Liquidity/hooks/useDependentAmountFallback'
import { generateLiquidityServiceIncreaseCalldataParams } from '~/components/Liquidity/utils/generateLiquidityServiceIncreaseCalldata.ts'
import { getCheckLPApprovalRequestParams } from '~/components/Liquidity/utils/getCheckLPApprovalRequestParams'
import { hasLPFoTTransferError } from '~/components/Liquidity/utils/hasLPFoTTransferError'
import { useModalInitialState } from '~/hooks/useModalInitialState'
import { useIncreaseLiquidityContext } from '~/pages/IncreaseLiquidity/IncreaseLiquidityContext'
=======
import { useUniswapContextSelector } from 'uniswap/src/contexts/UniswapContext'
import { useCheckLPApprovalQuery } from 'uniswap/src/data/apiClients/liquidityService/useCheckLPApprovalQuery'
import { useIncreasePositionQuery } from 'uniswap/src/data/apiClients/liquidityService/useIncreasePositionQuery'
import { getTradeSettingsDeadline } from 'uniswap/src/data/apiClients/tradingApi/utils/getTradeSettingsDeadline'
import { useActiveAddress } from 'uniswap/src/features/accounts/store/hooks'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { toSupportedChainId } from 'uniswap/src/features/chains/utils'
import type { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { useTransactionGasFee, useUSDCurrencyAmountOfGasFee } from 'uniswap/src/features/gas/hooks'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { DelegatedState } from 'uniswap/src/features/smartWallet/delegation/types'
import { InterfaceEventName, ModalName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { useCurrencyInfo } from 'uniswap/src/features/tokens/useCurrencyInfo'
import { useTransactionSettingsStore } from 'uniswap/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import {
  type IncreasePositionTxAndGasInfo,
  LiquidityTransactionType,
} from 'uniswap/src/features/transactions/liquidity/types'
import { getErrorMessageToDisplay, parseErrorMessageTitle } from 'uniswap/src/features/transactions/liquidity/utils'
import { TransactionStepType } from 'uniswap/src/features/transactions/steps/types'
import { PermitMethod } from 'uniswap/src/features/transactions/swap/types/swapTxAndGasInfo'
import { validatePermit, validateTransactionRequest } from 'uniswap/src/features/transactions/swap/utils/trade'
import { currencyId } from 'uniswap/src/utils/currencyId'
import { logger } from 'utilities/src/logger/logger'
import { useIncreasePositionDependentAmountFallback } from '~/components/Liquidity/hooks/useDependentAmountFallback'
import { getTokenOrZeroAddress } from '~/components/Liquidity/utils/currency'
import { generateLiquidityServiceIncreaseCalldataParams } from '~/components/Liquidity/utils/generateLiquidityServiceIncreaseCalldata.ts'
import { getCheckLPApprovalRequestParams } from '~/components/Liquidity/utils/getCheckLPApprovalRequestParams'
import { hasLPFoTTransferError } from '~/components/Liquidity/utils/hasLPFoTTransferError'
import { getProtocols } from '~/components/Liquidity/utils/protocolVersion'
import { useModalInitialState } from '~/hooks/useModalInitialState'
import { useIncreaseLiquidityContext } from '~/pages/IncreaseLiquidity/IncreaseLiquidityContext'
import { PositionField } from '~/types/position'
>>>>>>> upstream/main

interface IncreasePositionContextType {
  txInfo?: IncreasePositionTxAndGasInfo
  gasFeeEstimateUSD?: CurrencyAmount<Currency>
  error: boolean | string
  refetch?: () => void
  dependentAmount?: string
  fotErrorToken: Maybe<CurrencyInfo>
  setTransactionError: Dispatch<SetStateAction<string | boolean>>
}

const IncreaseLiquidityTxContext = createContext<IncreasePositionContextType | undefined>(undefined)

export function IncreaseLiquidityTxContextProvider({ children }: PropsWithChildren): JSX.Element {
  const positionInfo = useModalInitialState(ModalName.AddLiquidity)

  const { derivedIncreaseLiquidityInfo, increaseLiquidityState, currentTransactionStep } = useIncreaseLiquidityContext()
  const { customDeadline, customSlippageTolerance } = useTransactionSettingsStore((s) => ({
    customDeadline: s.customDeadline,
    customSlippageTolerance: s.customSlippageTolerance,
  }))
  const [transactionError, setTransactionError] = useState<string | boolean>(false)

  const { currencyAmounts, error } = derivedIncreaseLiquidityInfo
  const { exactField } = increaseLiquidityState

  const accountAddress = useActiveAddress(Platform.EVM)
<<<<<<< HEAD
  const isLiquidityBatchedTransactionsEnabled = useFeatureFlag(FeatureFlags.LiquidityBatchedTransactions)
  const canBatchTransactions =
    useLuxContextSelector((ctx) => ctx.getCanBatchTransactions?.(positionInfo?.chainId)) &&
=======
  const isIncreasePositionV2 = useFeatureFlag(FeatureFlags.IncreasePositionV2)
  const isCheckApprovalV2 = useFeatureFlag(FeatureFlags.CheckApprovalV2)
  const isLiquidityBatchedTransactionsEnabled = useFeatureFlag(FeatureFlags.LiquidityBatchedTransactions)
  const canBatchTransactions =
    useUniswapContextSelector((ctx) => ctx.getCanBatchTransactions?.(positionInfo?.chainId)) &&
>>>>>>> upstream/main
    positionInfo?.chainId !== UniverseChainId.Monad &&
    isLiquidityBatchedTransactionsEnabled

  const delegatedAddress = useSelector((state: { delegation: DelegatedState }) =>
    positionInfo?.chainId ? state.delegation.delegations[String(positionInfo.chainId)] : null,
  )

<<<<<<< HEAD
  const increaseLiquidityApprovalParams: CheckApprovalLPRequest | undefined = useMemo(() => {
=======
  const increaseLiquidityApprovalParams = useMemo(() => {
>>>>>>> upstream/main
    if (!positionInfo || !accountAddress || !currencyAmounts?.TOKEN0 || !currencyAmounts.TOKEN1) {
      return undefined
    }

    return getCheckLPApprovalRequestParams({
      walletAddress: accountAddress,
      protocolVersion: positionInfo.version,
      currencyAmounts,
      canBatchTransactions,
<<<<<<< HEAD
    })
  }, [positionInfo, accountAddress, currencyAmounts, canBatchTransactions])

  const {
    data: increaseLiquidityTokenApprovals,
    isLoading: approvalLoading,
    error: approvalError,
    refetch: approvalRefetch,
  } = useQuery(
    liquidityQueries.checkApproval({
      params: increaseLiquidityApprovalParams,
      staleTime: 5 * ONE_SECOND_MS,
      enabled: !!increaseLiquidityApprovalParams && !error,
    }),
  )
=======
      action: LPAction.INCREASE,
      isCheckApprovalV2,
    })
  }, [positionInfo, accountAddress, currencyAmounts, canBatchTransactions, isCheckApprovalV2])

  const {
    approvalData: increaseLiquidityTokenApprovals,
    approvalLoading,
    approvalError,
    approvalRefetch,
  } = useCheckLPApprovalQuery({
    approvalQueryParams: increaseLiquidityApprovalParams,
    isQueryEnabled: !!increaseLiquidityApprovalParams && !error,
  })
>>>>>>> upstream/main

  if (approvalError) {
    const message = parseErrorMessageTitle(approvalError, { defaultTitle: 'unknown CheckLpApprovalQuery' })
    logger.error(message, {
      tags: {
        file: 'IncreaseLiquidityTxContext',
        function: 'useEffect',
      },
      extra: {
        canBatchTransactions: canBatchTransactions ?? false,
        delegatedAddress,
      },
    })
  }

<<<<<<< HEAD
  const permitData = increaseLiquidityTokenApprovals?.permitData.value
=======
>>>>>>> upstream/main
  const {
    token0Approval,
    token1Approval,
    positionTokenApproval,
<<<<<<< HEAD
    gasFeeToken0Approval,
    gasFeeToken1Approval,
    gasFeePositionTokenApproval,
=======
    v4BatchPermitData: permitData,
>>>>>>> upstream/main
    token0Cancel,
    token1Cancel,
    token0PermitTransaction,
    token1PermitTransaction,
<<<<<<< HEAD
=======
    gasFeeToken0Approval,
    gasFeeToken1Approval,
    gasFeePositionTokenApproval,
>>>>>>> upstream/main
    gasFeeToken0Permit,
    gasFeeToken1Permit,
  } = increaseLiquidityTokenApprovals ?? {}
  const gasFeeToken0USD = useUSDCurrencyAmountOfGasFee(
    positionInfo?.currency0Amount.currency.chainId,
    gasFeeToken0Approval,
  )
  const gasFeeToken1USD = useUSDCurrencyAmountOfGasFee(
    positionInfo?.currency1Amount.currency.chainId,
    gasFeeToken1Approval,
  )
  const gasFeeLiquidityTokenUSD = useUSDCurrencyAmountOfGasFee(
    positionInfo?.liquidityToken?.chainId,
    gasFeePositionTokenApproval,
  )
  const gasFeeToken0PermitUSD = useUSDCurrencyAmountOfGasFee(
    positionInfo?.currency1Amount.currency.chainId,
    gasFeeToken0Permit,
  )
  const gasFeeToken1PermitUSD = useUSDCurrencyAmountOfGasFee(
    positionInfo?.currency1Amount.currency.chainId,
    gasFeeToken1Permit,
  )

  const approvalsNeeded =
    !approvalLoading &&
    Boolean(
      permitData ||
<<<<<<< HEAD
        token0Approval ||
        token1Approval ||
        positionTokenApproval ||
        token0PermitTransaction ||
        token1PermitTransaction,
=======
      token0Approval ||
      token1Approval ||
      positionTokenApproval ||
      token0PermitTransaction ||
      token1PermitTransaction,
>>>>>>> upstream/main
    )

  const token0 = currencyAmounts?.TOKEN0?.currency
  const token1 = currencyAmounts?.TOKEN1?.currency

  const token0Amount = currencyAmounts?.TOKEN0?.quotient.toString()
  const token1Amount = currencyAmounts?.TOKEN1?.quotient.toString()

<<<<<<< HEAD
  const increaseCalldataQueryParams = useMemo((): IncreaseLPPositionRequest | undefined => {
=======
  const increaseCalldataQueryParams = useMemo((): IncreaseLPPositionRequest | IncreasePositionRequest | undefined => {
>>>>>>> upstream/main
    if (!positionInfo || !accountAddress || !token0 || !token1 || !token0Amount || !token1Amount) {
      return undefined
    }

<<<<<<< HEAD
=======
    if (isIncreasePositionV2) {
      const independentToken = exactField === PositionField.TOKEN0 ? token0 : token1
      const independentAmount = exactField === PositionField.TOKEN0 ? token0Amount : token1Amount

      return new IncreasePositionRequest({
        walletAddress: accountAddress,
        chainId: positionInfo.currency0Amount.currency.chainId,
        protocol: getProtocols(positionInfo.version),
        token0Address: getTokenOrZeroAddress(token0),
        token1Address: getTokenOrZeroAddress(token1),
        nftTokenId: positionInfo.tokenId ?? undefined,
        independentToken: new LPToken({
          tokenAddress: getTokenOrZeroAddress(independentToken),
          amount: independentAmount,
        }),
        slippageTolerance: customSlippageTolerance,
        deadline: getTradeSettingsDeadline(customDeadline),
        simulateTransaction: !approvalsNeeded,
      })
    }

>>>>>>> upstream/main
    return generateLiquidityServiceIncreaseCalldataParams({
      token0,
      token1,
      exactField,
      token0Amount,
      token1Amount,
      approvalsNeeded,
      positionInfo,
      accountAddress,
      customSlippageTolerance,
      customDeadline,
    })
  }, [
    accountAddress,
    positionInfo,
    token0,
    token1,
    token0Amount,
    token1Amount,
    approvalsNeeded,
    customSlippageTolerance,
    exactField,
    customDeadline,
<<<<<<< HEAD
=======
    isIncreasePositionV2,
>>>>>>> upstream/main
  ])

  const currency0Info = useCurrencyInfo(currencyId(positionInfo?.currency0Amount.currency))
  const currency1Info = useCurrencyInfo(currencyId(positionInfo?.currency1Amount.currency))
  const token0FoTError = hasLPFoTTransferError(currency0Info, positionInfo?.version)
  const token1FoTError = hasLPFoTTransferError(currency1Info, positionInfo?.version)
  const fotErrorToken = token0FoTError || token1FoTError

  const isUserCommittedToIncrease =
    currentTransactionStep?.step.type === TransactionStepType.IncreasePositionTransaction ||
    currentTransactionStep?.step.type === TransactionStepType.IncreasePositionTransactionAsync

  const isQueryEnabled =
    !isUserCommittedToIncrease &&
    !error &&
    !approvalLoading &&
    !approvalError &&
    Boolean(increaseCalldataQueryParams) &&
    !fotErrorToken

<<<<<<< HEAD
  const {
    data: increaseCalldata,
    isLoading: isCalldataLoading,
    error: calldataError,
    refetch: calldataRefetch,
  } = useQuery(
    liquidityQueries.increasePosition({
      params: increaseCalldataQueryParams,
      refetchInterval: transactionError ? false : 5 * ONE_SECOND_MS,
      retry: false,
      enabled: isQueryEnabled && Boolean(increaseCalldataQueryParams),
    }),
  )

  const { increase, gasFee: actualGasFee, dependentAmount, sqrtRatioX96 } = increaseCalldata || {}
=======
  const { increaseCalldata, isCalldataLoading, calldataError, calldataRefetch } = useIncreasePositionQuery({
    increaseCalldataQueryParams,
    transactionError: Boolean(transactionError),
    isQueryEnabled: isQueryEnabled && Boolean(increaseCalldataQueryParams),
  })

  const increase = increaseCalldata?.increase
  const actualGasFee = increaseCalldata?.gasFee
>>>>>>> upstream/main

  if (calldataError) {
    const message = parseErrorMessageTitle(calldataError, { defaultTitle: 'unknown IncreaseLpPositionCalldataQuery' })
    logger.error(message, {
      tags: {
        file: 'IncreaseLiquidityTxContext',
        function: 'useEffect',
      },
      extra: {
        canBatchTransactions: canBatchTransactions ?? false,
        delegatedAddress,
      },
    })

    if (increaseCalldataQueryParams) {
      sendAnalyticsEvent(InterfaceEventName.IncreaseLiquidityFailed, {
        message,
        ...increaseCalldataQueryParams,
      })
    }
  }

<<<<<<< HEAD
  const fallbackDependentAmount = useIncreasePositionDependentAmountFallback(
    increaseCalldataQueryParams,
    isQueryEnabled && Boolean(calldataError),
  )
=======
  const fallbackDependentAmount = useIncreasePositionDependentAmountFallback({
    queryParams: increaseCalldataQueryParams,
    isQueryEnabled: isQueryEnabled && Boolean(calldataError),
    exactField,
  })

  const dependentAmount = useMemo(() => {
    if (calldataError && fallbackDependentAmount) {
      return fallbackDependentAmount
    }
    if (increaseCalldata instanceof IncreasePositionResponse) {
      const dependentToken = exactField === PositionField.TOKEN0 ? increaseCalldata.token1 : increaseCalldata.token0
      return dependentToken?.amount
    }
    return increaseCalldata?.dependentAmount
  }, [increaseCalldata, calldataError, fallbackDependentAmount, exactField])
>>>>>>> upstream/main

  const { value: calculatedGasFee } = useTransactionGasFee({ tx: increase, skip: !!actualGasFee })
  const increaseGasFeeUsd = useUSDCurrencyAmountOfGasFee(
    toSupportedChainId(increaseCalldata?.increase?.chainId) ?? undefined,
    actualGasFee || calculatedGasFee,
  )

  useEffect(() => {
    setTransactionError(
      getErrorMessageToDisplay({
        approvalError,
        calldataError,
      }),
    )
  }, [approvalError, calldataError])

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: +token0Amount, +token1Amount
=======
  // oxlint-disable-next-line react/exhaustive-deps -- +token0Amount, +token1Amount
>>>>>>> upstream/main
  useEffect(() => {
    setTransactionError(false)
  }, [token0Amount, token1Amount])

  const increaseLiquidityTxContext = useMemo((): IncreasePositionTxAndGasInfo | undefined => {
    if (
      !positionInfo ||
      approvalLoading ||
      isCalldataLoading ||
      !increaseCalldata ||
      !currencyAmounts?.TOKEN0 ||
      !currencyAmounts.TOKEN1
    ) {
      return undefined
    }

    const approveToken0Request = validateTransactionRequest(token0Approval)
    const approveToken1Request = validateTransactionRequest(token1Approval)
    const approvePositionTokenRequest = validateTransactionRequest(positionTokenApproval)
    const revokeToken0Request = validateTransactionRequest(token0Cancel)
    const revokeToken1Request = validateTransactionRequest(token1Cancel)
<<<<<<< HEAD
    const permit = validatePermit(permitData)
    const unsigned = Boolean(permitData)
    const txRequest = validateTransactionRequest(increase)
    const validatedToken0PermitTx = validateTransactionRequest(token0PermitTransaction)
    const validatedToken1PermitTx = validateTransactionRequest(token1PermitTransaction)

    let updatedIncreaseCalldataQueryParams: IncreaseLPPositionRequest | undefined
    if (increaseCalldataQueryParams?.increaseLpPosition.case === 'v4IncreaseLpPosition') {
      const batchPermitData =
        increaseLiquidityTokenApprovals?.permitData.case === 'permitBatchData'
          ? increaseLiquidityTokenApprovals.permitData.value
          : undefined
=======
    const validatedPermit = validatePermit(permitData)
    // Only treat as unsigned if permit data is present AND valid — invalid permit data
    // should fall back to the signed (simulated) path rather than skipping simulation.
    const unsigned = Boolean(validatedPermit)
    const txRequest = validateTransactionRequest(increase)

    const validatedToken0PermitTx = validateTransactionRequest(token0PermitTransaction)
    const validatedToken1PermitTx = validateTransactionRequest(token1PermitTransaction)

    let updatedIncreaseCalldataQueryParams: IncreaseLPPositionRequest | IncreasePositionRequest | undefined
    if (increaseCalldataQueryParams instanceof IncreasePositionRequest) {
      updatedIncreaseCalldataQueryParams = validatedPermit
        ? new IncreasePositionRequest({
            ...increaseCalldataQueryParams,
            v4BatchPermitData: validatedPermit,
          })
        : increaseCalldataQueryParams
    } else if (increaseCalldataQueryParams?.increaseLpPosition.case === 'v4IncreaseLpPosition') {
>>>>>>> upstream/main
      updatedIncreaseCalldataQueryParams = new IncreaseLPPositionRequest({
        ...increaseCalldataQueryParams,
        increaseLpPosition: {
          case: 'v4IncreaseLpPosition',
          value: {
            ...increaseCalldataQueryParams.increaseLpPosition.value,
<<<<<<< HEAD
            batchPermitData,
=======
            batchPermitData: validatedPermit,
>>>>>>> upstream/main
          },
        },
      })
    } else {
      updatedIncreaseCalldataQueryParams = increaseCalldataQueryParams
    }

    return {
      type: LiquidityTransactionType.Increase,
      canBatchTransactions: canBatchTransactions ?? false,
      delegatedAddress,
      action: {
        type: LiquidityTransactionType.Increase,
        currency0Amount: currencyAmounts.TOKEN0,
        currency1Amount: currencyAmounts.TOKEN1,
        liquidityToken: positionInfo.liquidityToken,
      },
      approveToken0Request,
      approveToken1Request,
      approvePositionTokenRequest,
      revokeToken0Request,
      revokeToken1Request,
<<<<<<< HEAD
      permit: permit ? { method: PermitMethod.TypedData, typedData: permit } : undefined, // TODO: make a PermitMethod.Transaction one if we get them from BE
=======
      permit: validatedPermit ? { method: PermitMethod.TypedData, typedData: validatedPermit } : undefined,
>>>>>>> upstream/main
      token0PermitTransaction: validatedToken0PermitTx,
      token1PermitTransaction: validatedToken1PermitTx,
      positionTokenPermitTransaction: undefined,
      increasePositionRequestArgs: updatedIncreaseCalldataQueryParams,
      txRequest,
<<<<<<< HEAD
      sqrtRatioX96,
=======
>>>>>>> upstream/main
      unsigned,
    }
  }, [
    positionInfo,
    approvalLoading,
    isCalldataLoading,
    increaseCalldata,
    currencyAmounts?.TOKEN0,
    currencyAmounts?.TOKEN1,
    token0Approval,
    token1Approval,
    positionTokenApproval,
    token0Cancel,
    token1Cancel,
    permitData,
    increase,
    token0PermitTransaction,
    token1PermitTransaction,
    increaseCalldataQueryParams,
<<<<<<< HEAD
    increaseLiquidityTokenApprovals,
    sqrtRatioX96,
=======
>>>>>>> upstream/main
    canBatchTransactions,
    delegatedAddress,
  ])

  const totalGasFee = useMemo(() => {
    const fees = [
      gasFeeToken0USD,
      gasFeeToken1USD,
      gasFeeLiquidityTokenUSD,
      increaseGasFeeUsd,
      gasFeeToken0PermitUSD,
      gasFeeToken1PermitUSD,
    ]
    return fees.reduce((total, fee) => {
      if (fee && total) {
        return total.add(fee)
      }
      return total || fee
    })
  }, [
    gasFeeToken0USD,
    gasFeeToken1USD,
    gasFeeLiquidityTokenUSD,
    increaseGasFeeUsd,
    gasFeeToken0PermitUSD,
    gasFeeToken1PermitUSD,
  ])

  const value = {
    txInfo: increaseLiquidityTxContext,
    gasFeeEstimateUSD: totalGasFee ?? undefined,
<<<<<<< HEAD
    // in some cases there is an error with create but createCalldata still has a cached value
    dependentAmount: calldataError && fallbackDependentAmount ? fallbackDependentAmount : dependentAmount,
=======
    dependentAmount,
>>>>>>> upstream/main
    error: transactionError,
    setTransactionError,
    refetch: approvalError ? approvalRefetch : calldataError ? calldataRefetch : undefined,
    fotErrorToken,
  }

  return <IncreaseLiquidityTxContext.Provider value={value}>{children}</IncreaseLiquidityTxContext.Provider>
}

export const useIncreaseLiquidityTxContext = (): IncreasePositionContextType => {
  const increaseContext = useContext(IncreaseLiquidityTxContext)

  if (!increaseContext) {
    throw new Error('`useIncreaseLiquidityTxContext` must be used inside of `IncreaseLiquidityTxContextProvider`')
  }

  return increaseContext
}
