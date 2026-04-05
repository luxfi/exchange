<<<<<<< HEAD
import { useQuery } from '@tanstack/react-query'
import { ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
import {
  CheckApprovalLPResponse,
  CreateLPPositionRequest,
  CreateLPPositionResponse,
} from '@luxamm/client-liquidity/dist/lx/liquidity/v1/api_pb'
import { V4CreateLPPosition } from '@luxamm/client-liquidity/dist/lx/liquidity/v1/types_pb'
import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { Pair } from '@luxamm/v2-sdk'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
=======
/* oxlint-disable max-lines */
import { ProtocolVersion } from '@uniswap/client-data-api/dist/data/v1/poolTypes_pb'
import {
  CreateLPPositionRequest,
  CreateLPPositionResponse,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import { V4CreateLPPosition } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/types_pb'
import {
  CreateClassicPositionResponse,
  CreatePositionRequest,
  CreatePositionResponse,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import { LPAction } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/types_pb'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
>>>>>>> upstream/main
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
<<<<<<< HEAD
import { useLuxContextSelector } from '@l.x/lx/src/contexts/LuxContext'
import { liquidityQueries } from '@l.x/lx/src/data/apiClients/liquidityService/liquidityQueries'
import { useActiveAddress } from '@l.x/lx/src/features/accounts/store/hooks'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { toSupportedChainId } from '@l.x/lx/src/features/chains/utils'
import { useTransactionGasFee, useUSDCurrencyAmountOfGasFee } from '@l.x/lx/src/features/gas/hooks'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { DelegatedState } from '@l.x/lx/src/features/smartWallet/delegation/types'
import { InterfaceEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { useTransactionSettingsStore } from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { CreatePositionTxAndGasInfo, LiquidityTransactionType } from '@l.x/lx/src/features/transactions/liquidity/types'
import { getErrorMessageToDisplay, parseErrorMessageTitle } from '@l.x/lx/src/features/transactions/liquidity/utils'
import { TransactionStepType } from '@l.x/lx/src/features/transactions/steps/types'
import { PermitMethod } from '@l.x/lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import { validatePermit, validateTransactionRequest } from '@l.x/lx/src/features/transactions/swap/utils/trade'
import { logger } from '@l.x/utils/src/logger/logger'
import { ONE_SECOND_MS } from '@l.x/utils/src/time/time'
=======
import { useUniswapContextSelector } from 'uniswap/src/contexts/UniswapContext'
import { type NormalizedApprovalData } from 'uniswap/src/data/apiClients/liquidityService/normalizeApprovalResponse'
import { useCheckLPApprovalQuery } from 'uniswap/src/data/apiClients/liquidityService/useCheckLPApprovalQuery'
import { useCreatePositionQuery } from 'uniswap/src/data/apiClients/liquidityService/useCreatePositionQuery'
import { useActiveAddress } from 'uniswap/src/features/accounts/store/hooks'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { toSupportedChainId } from 'uniswap/src/features/chains/utils'
import { useTransactionGasFee, useUSDCurrencyAmountOfGasFee } from 'uniswap/src/features/gas/hooks'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { DelegatedState } from 'uniswap/src/features/smartWallet/delegation/types'
import { InterfaceEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { useTransactionSettingsStore } from 'uniswap/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { CreatePositionTxAndGasInfo, LiquidityTransactionType } from 'uniswap/src/features/transactions/liquidity/types'
import { getErrorMessageToDisplay, parseErrorMessageTitle } from 'uniswap/src/features/transactions/liquidity/utils'
import { TransactionStepType } from 'uniswap/src/features/transactions/steps/types'
import { PermitMethod } from 'uniswap/src/features/transactions/swap/types/swapTxAndGasInfo'
import { validatePermit, validateTransactionRequest } from 'uniswap/src/features/transactions/swap/utils/trade'
import { logger } from 'utilities/src/logger/logger'
>>>>>>> upstream/main
import { useDepositInfo } from '~/components/Liquidity/Create/hooks/useDepositInfo'
import { useDynamicNativeSlippage } from '~/components/Liquidity/Create/hooks/useLPSlippageValues'
import { useCreatePositionDependentAmountFallback } from '~/components/Liquidity/hooks/useDependentAmountFallback'
import { generateLiquidityServiceCreateCalldataQueryParams } from '~/components/Liquidity/utils/generateLiquidityServiceCreateCalldata'
import { getCheckLPApprovalRequestParams } from '~/components/Liquidity/utils/getCheckLPApprovalRequestParams'
import { isInvalidRange, isOutOfRange } from '~/components/Liquidity/utils/priceRangeInfo'
import { useCreateLiquidityContext } from '~/pages/CreatePosition/CreateLiquidityContextProvider'
import { PositionField } from '~/types/position'

<<<<<<< HEAD
/**
 * @internal - exported for testing
 */
=======
/** @internal - exported for testing */
>>>>>>> upstream/main
export function generateCreatePositionTxRequest({
  protocolVersion,
  approvalCalldata,
  createCalldata,
  createCalldataQueryParams,
  currencyAmounts,
  poolOrPair,
  canBatchTransactions,
  delegatedAddress,
}: {
  protocolVersion: ProtocolVersion
<<<<<<< HEAD
  approvalCalldata?: CheckApprovalLPResponse
  createCalldata?: CreateLPPositionResponse
  createCalldataQueryParams?: CreateLPPositionRequest
=======
  approvalCalldata?: NormalizedApprovalData
  createCalldata?: CreateLPPositionResponse | CreateClassicPositionResponse | CreatePositionResponse
  createCalldataQueryParams?: CreateLPPositionRequest | CreatePositionRequest
>>>>>>> upstream/main
  currencyAmounts?: { [field in PositionField]?: Maybe<CurrencyAmount<Currency>> }
  poolOrPair: Pair | undefined
  canBatchTransactions: boolean
  delegatedAddress: string | null
}): CreatePositionTxAndGasInfo | undefined {
  if (!createCalldata || !currencyAmounts?.TOKEN0 || !currencyAmounts.TOKEN1) {
    return undefined
  }

<<<<<<< HEAD
  const validatedApprove0Request = validateTransactionRequest(approvalCalldata?.token0Approval)
  if (approvalCalldata?.token0Approval && !validatedApprove0Request) {
    return undefined
  }

  const validatedApprove1Request = validateTransactionRequest(approvalCalldata?.token1Approval)
  if (approvalCalldata?.token1Approval && !validatedApprove1Request) {
    return undefined
  }

  const validatedRevoke0Request = validateTransactionRequest(approvalCalldata?.token0Cancel)
  if (approvalCalldata?.token0Cancel && !validatedRevoke0Request) {
    return undefined
  }

  const validatedRevoke1Request = validateTransactionRequest(approvalCalldata?.token1Cancel)
  if (approvalCalldata?.token1Cancel && !validatedRevoke1Request) {
    return undefined
  }

  const validatedPermitRequest = validatePermit(approvalCalldata?.permitData.value)
  if (approvalCalldata?.permitData.value && !validatedPermitRequest) {
    return undefined
  }

  const validatedToken0PermitTransaction = validateTransactionRequest(approvalCalldata?.token0PermitTransaction)
  const validatedToken1PermitTransaction = validateTransactionRequest(approvalCalldata?.token1PermitTransaction)

  const txRequest = validateTransactionRequest(createCalldata.create)
  if (!txRequest && !(validatedToken0PermitTransaction || validatedToken1PermitTransaction)) {
    // Allow missing txRequest if mismatched (unsigned flow using token0PermitTransaction/2)
    return undefined
  }

  let updatedCreateCalldataQueryParams: CreateLPPositionRequest | undefined
  if (createCalldataQueryParams?.createLpPosition.case === 'v4CreateLpPosition') {
=======
  const approveToken0Request = validateTransactionRequest(approvalCalldata?.token0Approval)
  const approveToken1Request = validateTransactionRequest(approvalCalldata?.token1Approval)
  const revokeToken0Request = validateTransactionRequest(approvalCalldata?.token0Cancel)
  const revokeToken1Request = validateTransactionRequest(approvalCalldata?.token1Cancel)

  // If any transaction was present but failed validation, bail out
  if (
    (approvalCalldata?.token0Approval && !approveToken0Request) ||
    (approvalCalldata?.token1Approval && !approveToken1Request) ||
    (approvalCalldata?.token0Cancel && !revokeToken0Request) ||
    (approvalCalldata?.token1Cancel && !revokeToken1Request)
  ) {
    return undefined
  }

  const batchPermitData = approvalCalldata?.v4BatchPermitData
  const validatedPermitRequest = validatePermit(batchPermitData)
  if (batchPermitData && !validatedPermitRequest) {
    return undefined
  }

  const token0PermitTransaction = validateTransactionRequest(approvalCalldata?.token0PermitTransaction)
  const token1PermitTransaction = validateTransactionRequest(approvalCalldata?.token1PermitTransaction)

  const txRequest = validateTransactionRequest(createCalldata.create)
  if (!txRequest && !(token0PermitTransaction || token1PermitTransaction)) {
    return undefined
  }

  let updatedCreateCalldataQueryParams: CreateLPPositionRequest | CreatePositionRequest | undefined
  if (createCalldataQueryParams instanceof CreatePositionRequest) {
    updatedCreateCalldataQueryParams = validatedPermitRequest
      ? new CreatePositionRequest({
          ...createCalldataQueryParams,
          batchPermitData: validatedPermitRequest,
        })
      : createCalldataQueryParams
  } else if (createCalldataQueryParams?.createLpPosition.case === 'v4CreateLpPosition') {
>>>>>>> upstream/main
    updatedCreateCalldataQueryParams = new CreateLPPositionRequest({
      createLpPosition: {
        case: 'v4CreateLpPosition',
        value: new V4CreateLPPosition({
          ...createCalldataQueryParams.createLpPosition.value,
<<<<<<< HEAD
          batchPermitData:
            approvalCalldata?.permitData.case === 'permitBatchData' ? approvalCalldata.permitData.value : undefined,
=======
          batchPermitData,
>>>>>>> upstream/main
        }),
      },
    })
  } else {
    updatedCreateCalldataQueryParams = createCalldataQueryParams
  }

  return {
    type: LiquidityTransactionType.Create,
    canBatchTransactions,
    delegatedAddress,
    unsigned: Boolean(validatedPermitRequest),
    createPositionRequestArgs: updatedCreateCalldataQueryParams,
    action: {
      type: LiquidityTransactionType.Create,
      currency0Amount: currencyAmounts.TOKEN0,
      currency1Amount: currencyAmounts.TOKEN1,
      liquidityToken: protocolVersion === ProtocolVersion.V2 ? poolOrPair?.liquidityToken : undefined,
    },
<<<<<<< HEAD
    approveToken0Request: validatedApprove0Request,
    approveToken1Request: validatedApprove1Request,
    txRequest,
    approvePositionTokenRequest: undefined,
    revokeToken0Request: validatedRevoke0Request,
    revokeToken1Request: validatedRevoke1Request,
    permit: validatedPermitRequest ? { method: PermitMethod.TypedData, typedData: validatedPermitRequest } : undefined,
    token0PermitTransaction: validatedToken0PermitTransaction,
    token1PermitTransaction: validatedToken1PermitTransaction,
    positionTokenPermitTransaction: undefined,
    sqrtRatioX96: createCalldata.sqrtRatioX96,
=======
    approveToken0Request,
    approveToken1Request,
    txRequest,
    approvePositionTokenRequest: undefined,
    revokeToken0Request,
    revokeToken1Request,
    permit: validatedPermitRequest ? { method: PermitMethod.TypedData, typedData: validatedPermitRequest } : undefined,
    token0PermitTransaction,
    token1PermitTransaction,
    positionTokenPermitTransaction: undefined,
>>>>>>> upstream/main
  } satisfies CreatePositionTxAndGasInfo
}
interface CreatePositionTxContextType {
  txInfo?: CreatePositionTxAndGasInfo
  gasFeeEstimateUSD?: Maybe<CurrencyAmount<Currency>>
  transactionError: boolean | string
  setTransactionError: Dispatch<SetStateAction<string | boolean>>
  dependentAmount?: string
  currencyAmounts?: { [field in PositionField]?: Maybe<CurrencyAmount<Currency>> }
  inputError?: ReactNode
  formattedAmounts?: { [field in PositionField]?: string }
  currencyAmountsUSDValue?: { [field in PositionField]?: Maybe<CurrencyAmount<Currency>> }
  currencyBalances?: { [field in PositionField]?: CurrencyAmount<Currency> }
}

const CreatePositionTxContext = createContext<CreatePositionTxContextType | undefined>(undefined)

export function CreatePositionTxContextProvider({ children }: PropsWithChildren): JSX.Element {
  const {
    protocolVersion,
    currencies,
    ticks,
    poolOrPair,
    depositState,
    creatingPoolOrPair,
<<<<<<< HEAD
=======
    poolId,
>>>>>>> upstream/main
    currentTransactionStep,
    positionState,
    setRefetch,
  } = useCreateLiquidityContext()
  const evmAddress = useActiveAddress(Platform.EVM)
  const { TOKEN0, TOKEN1 } = currencies.display
  const { exactField } = depositState

  const invalidRange = protocolVersion !== ProtocolVersion.V2 && isInvalidRange(ticks[0], ticks[1])
  const depositInfoProps = useMemo(() => {
    const [tickLower, tickUpper] = ticks
    const outOfRange = isOutOfRange({
      poolOrPair,
      lowerTick: tickLower,
      upperTick: tickUpper,
    })

    return {
      protocolVersion,
      poolOrPair,
      address: evmAddress,
      token0: TOKEN0,
      token1: TOKEN1,
      tickLower: protocolVersion !== ProtocolVersion.V2 ? (tickLower ?? undefined) : undefined,
      tickUpper: protocolVersion !== ProtocolVersion.V2 ? (tickUpper ?? undefined) : undefined,
      exactField,
      exactAmounts: depositState.exactAmounts,
      skipDependentAmount: protocolVersion === ProtocolVersion.V2 ? false : outOfRange || invalidRange,
    }
  }, [TOKEN0, TOKEN1, exactField, ticks, poolOrPair, depositState, evmAddress, protocolVersion, invalidRange])

  const {
    currencyMaxAmounts,
    currencyAmounts,
    error: inputError,
    formattedAmounts,
    currencyAmountsUSDValue,
    currencyBalances,
  } = useDepositInfo(depositInfoProps)

  const { customDeadline, customSlippageTolerance, isSlippageDirty } = useTransactionSettingsStore((s) => ({
    customDeadline: s.customDeadline,
    customSlippageTolerance: s.customSlippageTolerance,
    isSlippageDirty: s.isSlippageDirty,
  }))
  const isLiquidityBatchedTransactionsEnabled = useFeatureFlag(FeatureFlags.LiquidityBatchedTransactions)
  const isLpDynamicNativeSlippageEnabled = useFeatureFlag(FeatureFlags.LpDynamicNativeSlippage)
<<<<<<< HEAD
  const canBatchTransactions =
    (useLuxContextSelector((ctx) => ctx.getCanBatchTransactions?.(poolOrPair?.chainId)) ?? false) &&
=======
  const isCreatePositionV2 = useFeatureFlag(FeatureFlags.CreatePositionV2)
  const isCheckApprovalV2 = useFeatureFlag(FeatureFlags.CheckApprovalV2)
  const canBatchTransactions =
    (useUniswapContextSelector((ctx) => ctx.getCanBatchTransactions?.(poolOrPair?.chainId)) ?? false) &&
>>>>>>> upstream/main
    poolOrPair?.chainId !== UniverseChainId.Monad &&
    isLiquidityBatchedTransactionsEnabled

  const delegatedAddress = useSelector((state: { delegation: DelegatedState }) =>
    poolOrPair?.chainId ? state.delegation.delegations[String(poolOrPair.chainId)] : null,
  )

  const [transactionError, setTransactionError] = useState<string | boolean>(false)

  const addLiquidityApprovalParams = useMemo(() => {
    return getCheckLPApprovalRequestParams({
      walletAddress: evmAddress,
      protocolVersion,
      currencyAmounts,
      canBatchTransactions,
<<<<<<< HEAD
    })
  }, [evmAddress, protocolVersion, currencyAmounts, canBatchTransactions])

  const {
    data: approvalCalldata,
    error: approvalError,
    isLoading: approvalLoading,
    refetch: approvalRefetch,
  } = useQuery(
    liquidityQueries.checkApproval({
      params: addLiquidityApprovalParams,
      staleTime: 5 * ONE_SECOND_MS,
      retry: false,
      enabled: !!addLiquidityApprovalParams && !inputError && !transactionError && !invalidRange,
    }),
  )
=======
      action: LPAction.CREATE,
      isCheckApprovalV2,
    })
  }, [evmAddress, protocolVersion, currencyAmounts, canBatchTransactions, isCheckApprovalV2])

  const {
    approvalData: approvalCalldata,
    approvalError,
    approvalLoading,
    approvalRefetch,
  } = useCheckLPApprovalQuery({
    approvalQueryParams: addLiquidityApprovalParams,
    isQueryEnabled: !!addLiquidityApprovalParams && !inputError && !transactionError && !invalidRange,
  })
>>>>>>> upstream/main

  if (approvalError) {
    const message = parseErrorMessageTitle(approvalError, { defaultTitle: 'unknown CheckLpApprovalQuery' })
    logger.error(message, {
      tags: { file: 'CreatePositionTxContext', function: 'useEffect' },
      extra: {
        canBatchTransactions,
        delegatedAddress,
      },
    })
  }

<<<<<<< HEAD
  const gasFeeToken0USD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, approvalCalldata?.gasFeeToken0Approval)
  const gasFeeToken1USD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, approvalCalldata?.gasFeeToken1Approval)
  const gasFeeToken0PermitUSD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, approvalCalldata?.gasFeeToken0Permit)
  const gasFeeToken1PermitUSD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, approvalCalldata?.gasFeeToken1Permit)
=======
  const { gasFeeToken0Approval, gasFeeToken1Approval, gasFeeToken0Permit, gasFeeToken1Permit } = approvalCalldata ?? {}
  const gasFeeToken0USD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, gasFeeToken0Approval)
  const gasFeeToken1USD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, gasFeeToken1Approval)
  const gasFeeToken0PermitUSD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, gasFeeToken0Permit)
  const gasFeeToken1PermitUSD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, gasFeeToken1Permit)
>>>>>>> upstream/main

  const nativeTokenBalance = useMemo(() => {
    if (!isLpDynamicNativeSlippageEnabled || protocolVersion !== ProtocolVersion.V4) {
      return undefined
    }
    // Only set native token balance if the token0 is the native token
    // other tokens (CELO) are not treated as native tokens
    if (currencyMaxAmounts?.TOKEN0?.currency.isNative) {
      return currencyMaxAmounts.TOKEN0.quotient.toString()
    }
    return undefined
  }, [isLpDynamicNativeSlippageEnabled, protocolVersion, currencyMaxAmounts])

<<<<<<< HEAD
=======
  const useV2Endpoints = isCreatePositionV2

>>>>>>> upstream/main
  const createCalldataQueryParams = useMemo(() => {
    return generateLiquidityServiceCreateCalldataQueryParams({
      address: evmAddress,
      approvalCalldata,
      positionState,
      protocolVersion,
      creatingPoolOrPair,
      displayCurrencies: currencies.display,
      ticks,
      poolOrPair,
      currencyAmounts,
      independentField: depositState.exactField,
      slippageTolerance: nativeTokenBalance && !isSlippageDirty ? undefined : customSlippageTolerance,
      customDeadline,
      nativeTokenBalance,
<<<<<<< HEAD
=======
      useV2Endpoints,
      poolId,
>>>>>>> upstream/main
    })
  }, [
    evmAddress,
    approvalCalldata,
    currencyAmounts,
    creatingPoolOrPair,
    ticks,
    poolOrPair,
<<<<<<< HEAD
=======
    poolId,
>>>>>>> upstream/main
    positionState,
    depositState.exactField,
    customSlippageTolerance,
    isSlippageDirty,
    currencies.display,
    protocolVersion,
    customDeadline,
    nativeTokenBalance,
<<<<<<< HEAD
=======
    useV2Endpoints,
>>>>>>> upstream/main
  ])

  const isUserCommittedToCreate =
    currentTransactionStep?.step.type === TransactionStepType.IncreasePositionTransaction ||
    currentTransactionStep?.step.type === TransactionStepType.IncreasePositionTransactionAsync

  const isQueryEnabled =
    !isUserCommittedToCreate &&
    !inputError &&
    !transactionError &&
    !approvalLoading &&
    !approvalError &&
    !invalidRange &&
    Boolean(approvalCalldata) &&
    Boolean(createCalldataQueryParams)

<<<<<<< HEAD
  const {
    data: createCalldata,
    error: createError,
    refetch: createRefetch,
  } = useQuery(
    liquidityQueries.createPosition({
      params: createCalldataQueryParams,
      refetchInterval: transactionError ? false : 5 * ONE_SECOND_MS,
      retry: false,
      enabled: isQueryEnabled,
    }),
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: +createCalldataQueryParams, +addLiquidityApprovalParams
=======
  const { createCalldata, createError, createRefetch } = useCreatePositionQuery({
    createCalldataQueryParams,
    transactionError: !!transactionError,
    isQueryEnabled,
  })

  // oxlint-disable-next-line react/exhaustive-deps -- +createCalldataQueryParams, +addLiquidityApprovalParams
>>>>>>> upstream/main
  useEffect(() => {
    setRefetch(() => (approvalError ? approvalRefetch : createError ? createRefetch : undefined)) // this must set it as a function otherwise it will actually call createRefetch immediately
  }, [
    approvalError,
    createError,
    createCalldataQueryParams,
    addLiquidityApprovalParams,
    setTransactionError,
    setRefetch,
    createRefetch,
    approvalRefetch,
  ])

  useEffect(() => {
    setTransactionError(getErrorMessageToDisplay({ approvalError, calldataError: createError }))
  }, [approvalError, createError])

  if (createError) {
    const message = parseErrorMessageTitle(createError, { defaultTitle: 'unknown CreateLpPositionCalldataQuery' })
    logger.error(message, {
      tags: { file: 'CreatePositionTxContext', function: 'useEffect' },
      extra: {
        canBatchTransactions,
        delegatedAddress,
      },
    })

    if (createCalldataQueryParams) {
      sendAnalyticsEvent(InterfaceEventName.CreatePositionFailed, {
        message,
        ...createCalldataQueryParams,
      })
    }
  }

<<<<<<< HEAD
  const dependentAmountFallback = useCreatePositionDependentAmountFallback(
    createCalldataQueryParams,
    isQueryEnabled && Boolean(createError),
  )

  const actualGasFee = createCalldata?.gasFee
  const needsApprovals = !!(
    approvalCalldata?.token0Approval ||
    approvalCalldata?.token1Approval ||
    approvalCalldata?.token0Cancel ||
    approvalCalldata?.token1Cancel ||
    approvalCalldata?.token0PermitTransaction ||
    approvalCalldata?.token1PermitTransaction
=======
  const dependentAmountFallback = useCreatePositionDependentAmountFallback({
    queryParams: createCalldataQueryParams,
    isQueryEnabled: isQueryEnabled && Boolean(createError),
    exactField: depositState.exactField,
  })

  const actualGasFee = createCalldata?.gasFee
  const {
    token0Approval,
    token1Approval,
    positionTokenApproval,
    v4BatchPermitData: permitData,
    token0Cancel,
    token1Cancel,
    token0PermitTransaction,
    token1PermitTransaction,
  } = approvalCalldata ?? {}
  const needsApprovals = Boolean(
    permitData ||
    token0Approval ||
    token1Approval ||
    positionTokenApproval ||
    token0Cancel ||
    token1Cancel ||
    token0PermitTransaction ||
    token1PermitTransaction,
>>>>>>> upstream/main
  )
  const { value: calculatedGasFee } = useTransactionGasFee({
    tx: createCalldata?.create,
    skip: !!actualGasFee || needsApprovals,
  })
  const increaseGasFeeUsd = useUSDCurrencyAmountOfGasFee(
    toSupportedChainId(createCalldata?.create?.chainId) ?? undefined,
    actualGasFee || calculatedGasFee,
  )

  const lastKnownGasFeeRef = useRef<CurrencyAmount<Currency> | undefined>(undefined)
<<<<<<< HEAD

=======
>>>>>>> upstream/main
  const totalGasFee = useMemo(() => {
    const fees = [gasFeeToken0USD, gasFeeToken1USD, increaseGasFeeUsd, gasFeeToken0PermitUSD, gasFeeToken1PermitUSD]
    const currentFee = fees.reduce((total, fee) => {
      if (fee && total) {
        return total.add(fee)
      }
      return total || fee
    })

    // Keep the last known value if current is undefined
    if (currentFee) {
      lastKnownGasFeeRef.current = currentFee
    }

    return currentFee || lastKnownGasFeeRef.current
  }, [gasFeeToken0USD, gasFeeToken1USD, increaseGasFeeUsd, gasFeeToken0PermitUSD, gasFeeToken1PermitUSD])

  const txInfo = useMemo(() => {
    return generateCreatePositionTxRequest({
      protocolVersion,
      approvalCalldata,
      createCalldata,
<<<<<<< HEAD
      createCalldataQueryParams,
=======
      createCalldataQueryParams:
        createCalldataQueryParams instanceof CreateLPPositionRequest ||
        createCalldataQueryParams instanceof CreatePositionRequest
          ? createCalldataQueryParams
          : undefined,
>>>>>>> upstream/main
      currencyAmounts,
      poolOrPair: protocolVersion === ProtocolVersion.V2 ? poolOrPair : undefined,
      canBatchTransactions,
      delegatedAddress,
    })
  }, [
    approvalCalldata,
    createCalldata,
    createCalldataQueryParams,
    currencyAmounts,
    poolOrPair,
    protocolVersion,
    canBatchTransactions,
    delegatedAddress,
  ])

  useDynamicNativeSlippage({
    isEnabled: isLpDynamicNativeSlippageEnabled,
    nativeTokenBalance,
<<<<<<< HEAD
    createCalldata,
    isSlippageDirty,
  })

=======
    createCalldata: createCalldata instanceof CreateLPPositionResponse ? createCalldata : undefined,
    isSlippageDirty,
  })

  const dependentAmount = useMemo(() => {
    if (createError && dependentAmountFallback) {
      return dependentAmountFallback
    }
    if (createCalldata instanceof CreateClassicPositionResponse) {
      return createCalldata.dependentToken?.amount
    }
    if (createCalldata instanceof CreatePositionResponse) {
      const dependentField =
        depositState.exactField === PositionField.TOKEN0 ? createCalldata.token1 : createCalldata.token0
      return dependentField?.amount
    }
    return createCalldata?.dependentAmount
  }, [createCalldata, createError, dependentAmountFallback, depositState.exactField])

>>>>>>> upstream/main
  const value = useMemo(
    (): CreatePositionTxContextType => ({
      txInfo,
      gasFeeEstimateUSD: totalGasFee,
      transactionError,
      setTransactionError,
<<<<<<< HEAD
      dependentAmount:
        createError && dependentAmountFallback ? dependentAmountFallback : createCalldata?.dependentAmount,
=======
      dependentAmount,
>>>>>>> upstream/main
      currencyAmounts,
      inputError,
      formattedAmounts,
      currencyAmountsUSDValue,
      currencyBalances,
    }),
    [
      txInfo,
      totalGasFee,
      transactionError,
<<<<<<< HEAD
      createError,
      dependentAmountFallback,
      createCalldata?.dependentAmount,
=======
      dependentAmount,
>>>>>>> upstream/main
      currencyAmounts,
      inputError,
      formattedAmounts,
      currencyAmountsUSDValue,
      currencyBalances,
    ],
  )

  return <CreatePositionTxContext.Provider value={value}>{children}</CreatePositionTxContext.Provider>
}

export const useCreatePositionTxContext = (): CreatePositionTxContextType => {
  const context = useContext(CreatePositionTxContext)
<<<<<<< HEAD

=======
>>>>>>> upstream/main
  if (!context) {
    throw new Error('`useCreatePositionTxContext` must be used inside of `CreatePositionTxContextProvider`')
  }

  return context
}
