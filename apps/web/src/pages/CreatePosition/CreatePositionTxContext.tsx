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
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
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
import { useDepositInfo } from '~/components/Liquidity/Create/hooks/useDepositInfo'
import { useDynamicNativeSlippage } from '~/components/Liquidity/Create/hooks/useLPSlippageValues'
import { useCreatePositionDependentAmountFallback } from '~/components/Liquidity/hooks/useDependentAmountFallback'
import { generateLiquidityServiceCreateCalldataQueryParams } from '~/components/Liquidity/utils/generateLiquidityServiceCreateCalldata'
import { getCheckLPApprovalRequestParams } from '~/components/Liquidity/utils/getCheckLPApprovalRequestParams'
import { isInvalidRange, isOutOfRange } from '~/components/Liquidity/utils/priceRangeInfo'
import { useCreateLiquidityContext } from '~/pages/CreatePosition/CreateLiquidityContextProvider'
import { PositionField } from '~/types/position'

/** @internal - exported for testing */
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
  approvalCalldata?: NormalizedApprovalData
  createCalldata?: CreateLPPositionResponse | CreateClassicPositionResponse | CreatePositionResponse
  createCalldataQueryParams?: CreateLPPositionRequest | CreatePositionRequest
  currencyAmounts?: { [field in PositionField]?: Maybe<CurrencyAmount<Currency>> }
  poolOrPair: Pair | undefined
  canBatchTransactions: boolean
  delegatedAddress: string | null
}): CreatePositionTxAndGasInfo | undefined {
  if (!createCalldata || !currencyAmounts?.TOKEN0 || !currencyAmounts.TOKEN1) {
    return undefined
  }

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
    updatedCreateCalldataQueryParams = new CreateLPPositionRequest({
      createLpPosition: {
        case: 'v4CreateLpPosition',
        value: new V4CreateLPPosition({
          ...createCalldataQueryParams.createLpPosition.value,
          batchPermitData,
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
  const isCreatePositionV2 = useFeatureFlag(FeatureFlags.CreatePositionV2)
  const isCheckApprovalV2 = useFeatureFlag(FeatureFlags.CheckApprovalV2)
  const canBatchTransactions =
    (useUniswapContextSelector((ctx) => ctx.getCanBatchTransactions?.(poolOrPair?.chainId)) ?? false) &&
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

  const { gasFeeToken0Approval, gasFeeToken1Approval, gasFeeToken0Permit, gasFeeToken1Permit } = approvalCalldata ?? {}
  const gasFeeToken0USD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, gasFeeToken0Approval)
  const gasFeeToken1USD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, gasFeeToken1Approval)
  const gasFeeToken0PermitUSD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, gasFeeToken0Permit)
  const gasFeeToken1PermitUSD = useUSDCurrencyAmountOfGasFee(poolOrPair?.chainId, gasFeeToken1Permit)

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

      useV2Endpoints,
      poolId,
    })
  }, [
    evmAddress,
    approvalCalldata,
    currencyAmounts,
    creatingPoolOrPair,
    ticks,
    poolOrPair,
    useV2Endpoints,
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

  const { createCalldata, createError, createRefetch } = useCreatePositionQuery({
    createCalldataQueryParams,
    transactionError: !!transactionError,
    isQueryEnabled,
  })

  // oxlint-disable-next-line react/exhaustive-deps -- +createCalldataQueryParams, +addLiquidityApprovalParams
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
      createCalldataQueryParams:
        createCalldataQueryParams instanceof CreateLPPositionRequest ||
        createCalldataQueryParams instanceof CreatePositionRequest
          ? createCalldataQueryParams
          : undefined,
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

  const value = useMemo(
    (): CreatePositionTxContextType => ({
      txInfo,
      gasFeeEstimateUSD: totalGasFee,
      transactionError,
      setTransactionError,
      dependentAmount,
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
      dependentAmount,
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

