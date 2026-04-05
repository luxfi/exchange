<<<<<<< HEAD
import { useQuery } from '@tanstack/react-query'
import { ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
import {
  CheckApprovalLPRequest,
  DecreaseLPPositionRequest,
} from '@luxamm/client-liquidity/dist/lx/liquidity/v1/api_pb'
=======
import { ProtocolVersion } from '@uniswap/client-data-api/dist/data/v1/poolTypes_pb'
import {
  CheckApprovalLPRequest,
  DecreaseLPPositionRequest,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
>>>>>>> upstream/main
import {
  Protocols,
  V2CheckApprovalLPRequest,
  V2Pool,
  V2Position,
  V3Pool,
  V3Position,
  V4Pool,
  V4Position,
<<<<<<< HEAD
} from '@luxamm/client-liquidity/dist/lx/liquidity/v1/types_pb'
import { Currency } from '@luxamm/sdk-core'
import JSBI from 'jsbi'
import { useEffect, useMemo, useState } from 'react'
import { liquidityQueries } from '@l.x/lx/src/data/apiClients/liquidityService/liquidityQueries'
import { getTradeSettingsDeadline } from '@l.x/lx/src/data/apiClients/tradingApi/utils/getTradeSettingsDeadline'
import { toSupportedChainId } from '@l.x/lx/src/features/chains/utils'
import { useTransactionGasFee, useUSDCurrencyAmountOfGasFee } from '@l.x/lx/src/features/gas/hooks'
import { InterfaceEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { useTransactionSettingsStore } from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { getErrorMessageToDisplay, parseErrorMessageTitle } from '@l.x/lx/src/features/transactions/liquidity/utils'
import { TransactionStepType } from '@l.x/lx/src/features/transactions/steps/types'
import { logger } from '@l.x/utils/src/logger/logger'
import { ONE_SECOND_MS } from '@l.x/utils/src/time/time'
import { PositionInfo } from '~/components/Liquidity/types'
=======
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/types_pb'
import { DecreasePositionRequest, LPApprovalRequest } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import { LPAction, LPToken } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/types_pb'
import type { Currency } from '@uniswap/sdk-core'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import JSBI from 'jsbi'
import { useEffect, useMemo, useState } from 'react'
import { useCheckLPApprovalQuery } from 'uniswap/src/data/apiClients/liquidityService/useCheckLPApprovalQuery'
import { useDecreasePositionQuery } from 'uniswap/src/data/apiClients/liquidityService/useDecreasePositionQuery'
import { getTradeSettingsDeadline } from 'uniswap/src/data/apiClients/tradingApi/utils/getTradeSettingsDeadline'
import { toSupportedChainId } from 'uniswap/src/features/chains/utils'
import { useTransactionGasFee, useUSDCurrencyAmountOfGasFee } from 'uniswap/src/features/gas/hooks'
import { InterfaceEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { useTransactionSettingsStore } from 'uniswap/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { getErrorMessageToDisplay, parseErrorMessageTitle } from 'uniswap/src/features/transactions/liquidity/utils'
import { TransactionStepType } from 'uniswap/src/features/transactions/steps/types'
import { logger } from 'utilities/src/logger/logger'
import type { PositionInfo } from '~/components/Liquidity/types'
>>>>>>> upstream/main
import { getTokenOrZeroAddress } from '~/components/Liquidity/utils/currency'
import { getProtocols } from '~/components/Liquidity/utils/protocolVersion'
import { useRemoveLiquidityModalContext } from '~/pages/RemoveLiquidity/RemoveLiquidityModalContext'
import type { RemoveLiquidityTxInfo } from '~/pages/RemoveLiquidity/RemoveLiquidityTxContext'

function buildCheckApprovalLPRequest({
  positionInfo,
  walletAddress,
  percent,
<<<<<<< HEAD
=======
  isCheckApprovalV2,
>>>>>>> upstream/main
}: {
  positionInfo: PositionInfo
  walletAddress: string
  percent: string
<<<<<<< HEAD
}): CheckApprovalLPRequest | undefined {
=======
  isCheckApprovalV2: boolean
}): CheckApprovalLPRequest | LPApprovalRequest | undefined {
>>>>>>> upstream/main
  const protocol = getProtocols(positionInfo.version)

  if (protocol === undefined) {
    return undefined
  }

  // Only v2 requires approvals
  switch (protocol) {
    case Protocols.V2:
<<<<<<< HEAD
      return new CheckApprovalLPRequest({
        checkApprovalLPRequest: {
          case: 'v2CheckApprovalLpRequest',
          value: new V2CheckApprovalLPRequest({
            protocol,
            walletAddress,
            chainId: positionInfo.liquidityToken?.chainId,
            positionToken: positionInfo.liquidityToken?.address,
            positionAmount: positionInfo.liquidityAmount
              ?.multiply(JSBI.BigInt(percent))
              .divide(JSBI.BigInt(100))
              .quotient.toString(),
            simulateTransaction: true,
          }),
        },
      })

=======
      if (!isCheckApprovalV2) {
        return new CheckApprovalLPRequest({
          checkApprovalLPRequest: {
            case: 'v2CheckApprovalLpRequest',
            value: new V2CheckApprovalLPRequest({
              protocol,
              walletAddress,
              chainId: positionInfo.liquidityToken?.chainId,
              positionToken: positionInfo.liquidityToken?.address,
              positionAmount: positionInfo.liquidityAmount
                ?.multiply(JSBI.BigInt(percent))
                .divide(JSBI.BigInt(100))
                .quotient.toString(),
              simulateTransaction: true,
            }),
          },
        })
      }
      return new LPApprovalRequest({
        walletAddress,
        protocol,
        chainId: positionInfo.liquidityToken?.chainId,
        lpTokens: [
          new LPToken({
            tokenAddress: positionInfo.currency0Amount.currency.wrapped.address,
            amount: '0', // the amounts here don't matter since the approval is based on the positionToken
          }),
          new LPToken({
            tokenAddress: positionInfo.currency1Amount.currency.wrapped.address,
            amount: '0',
          }),
        ],
        action: LPAction.DECREASE,
        simulateTransaction: true,
      })
>>>>>>> upstream/main
    default:
      return undefined
  }
}

function getProtocolCase(version: ProtocolVersion) {
  switch (version) {
    case ProtocolVersion.V2:
      return 'v2DecreaseLpPosition'
    case ProtocolVersion.V3:
      return 'v3DecreaseLpPosition'
    case ProtocolVersion.V4:
      return 'v4DecreaseLpPosition'
    default:
      return undefined
  }
}
function getDecreaseLPPositionQueryParams({
  positionInfo,
  address,
  percent,
  currency0,
  currency1,
  customDeadline,
  unwrapNativeCurrency,
  approvalsNeeded,
  customSlippageTolerance,
}: {
  positionInfo: PositionInfo
  address: string
  percent: string
  currency0: Currency
  currency1: Currency
  customDeadline?: number
  unwrapNativeCurrency: boolean
  approvalsNeeded: boolean
  customSlippageTolerance?: number
}): DecreaseLPPositionRequest | undefined {
  const protocolCase = getProtocolCase(positionInfo.version)
  if (!protocolCase) {
    return undefined
  }

  const deadline = getTradeSettingsDeadline(customDeadline)

  if (protocolCase === 'v2DecreaseLpPosition') {
    return new DecreaseLPPositionRequest({
      decreaseLpPosition: {
        case: protocolCase,
        value: {
          protocol: getProtocols(positionInfo.version),
          position: new V2Position({
            pool: new V2Pool({
              token0: getTokenOrZeroAddress(currency0),
              token1: getTokenOrZeroAddress(currency1),
            }),
          }),
          walletAddress: address,
          chainId: currency0.chainId,
          positionLiquidity: positionInfo.liquidityAmount?.quotient.toString(),
          liquidityPercentageToDecrease: percent,
          liquidity0: positionInfo.currency0Amount.quotient.toString(),
          liquidity1: positionInfo.currency1Amount.quotient.toString(),
          collectAsWETH: !unwrapNativeCurrency,
          simulateTransaction: !approvalsNeeded,
          slippageTolerance: customSlippageTolerance,
          deadline,
        },
      },
    })
  }

  if (!positionInfo.tokenId) {
    return undefined
  }

  if (protocolCase === 'v3DecreaseLpPosition') {
    return new DecreaseLPPositionRequest({
      decreaseLpPosition: {
        case: protocolCase,
        value: {
          protocol: getProtocols(positionInfo.version),
          tokenId: Number(positionInfo.tokenId),
          position: new V3Position({
            pool: new V3Pool({
              token0: getTokenOrZeroAddress(currency0),
              token1: getTokenOrZeroAddress(currency1),
              fee: positionInfo.feeTier?.feeAmount,
              tickSpacing: positionInfo.tickSpacing ? Number(positionInfo.tickSpacing) : undefined,
            }),
            tickLower: positionInfo.tickLower,
            tickUpper: positionInfo.tickUpper,
          }),
          walletAddress: address,
          chainId: currency0.chainId,
          positionLiquidity: positionInfo.liquidity,
          liquidityPercentageToDecrease: percent,
          expectedTokenOwed0RawAmount: positionInfo.token0UncollectedFees,
          expectedTokenOwed1RawAmount: positionInfo.token1UncollectedFees,
          collectAsWETH: !unwrapNativeCurrency,
          simulateTransaction: !approvalsNeeded,
          slippageTolerance: customSlippageTolerance,
          deadline,
        },
      },
    })
  }

  return new DecreaseLPPositionRequest({
    decreaseLpPosition: {
      case: protocolCase,
      value: {
        protocol: getProtocols(positionInfo.version),
        tokenId: Number(positionInfo.tokenId),
        position: new V4Position({
          pool: new V4Pool({
            token0: getTokenOrZeroAddress(currency0),
            token1: getTokenOrZeroAddress(currency1),
            fee: positionInfo.feeTier?.feeAmount,
            tickSpacing: positionInfo.tickSpacing ? Number(positionInfo.tickSpacing) : undefined,
            hooks: positionInfo.v4hook,
          }),
          tickLower: positionInfo.tickLower,
          tickUpper: positionInfo.tickUpper,
        }),
        walletAddress: address,
        chainId: currency0.chainId,
        liquidityPercentageToDecrease: percent,
        positionLiquidity: positionInfo.liquidity,

        simulateTransaction: !approvalsNeeded,
        slippageTolerance: customSlippageTolerance,
        deadline,
      },
    },
  })
}

export function useRemoveLiquidityTxAndGasInfo({ account }: { account?: string }): RemoveLiquidityTxInfo {
  const { positionInfo, percent, percentInvalid, currencies, currentTransactionStep, unwrapNativeCurrency } =
    useRemoveLiquidityModalContext()
  const { customDeadline, customSlippageTolerance } = useTransactionSettingsStore((s) => ({
    customDeadline: s.customDeadline,
    customSlippageTolerance: s.customSlippageTolerance,
  }))

<<<<<<< HEAD
=======
  const isDecreasePositionV2 = useFeatureFlag(FeatureFlags.DecreasePositionV2)
  const isCheckApprovalV2 = useFeatureFlag(FeatureFlags.CheckApprovalV2)
>>>>>>> upstream/main
  const [transactionError, setTransactionError] = useState<string | boolean>(false)

  const currency0 = currencies?.TOKEN0
  const currency1 = currencies?.TOKEN1

  const approvalQueryParams = useMemo(() => {
    if (!positionInfo || !account || percentInvalid) {
      return undefined
    }

    return buildCheckApprovalLPRequest({
      positionInfo,
      walletAddress: account,
      percent,
<<<<<<< HEAD
    })
  }, [positionInfo, account, percent, percentInvalid])

  const {
    data: v2LpTokenApproval,
    isLoading: v2ApprovalLoading,
    error: approvalError,
    refetch: approvalRefetch,
  } = useQuery(
    liquidityQueries.checkApproval({
      params: approvalQueryParams,
      staleTime: 5 * ONE_SECOND_MS,
      enabled: Boolean(approvalQueryParams),
    }),
  )
=======
      isCheckApprovalV2,
    })
  }, [positionInfo, account, percent, percentInvalid, isCheckApprovalV2])

  const {
    approvalData: v2LpTokenApproval,
    approvalLoading: v2ApprovalLoading,
    approvalError,
    approvalRefetch,
  } = useCheckLPApprovalQuery({
    approvalQueryParams,
    isQueryEnabled: Boolean(approvalQueryParams),
    positionTokenAddress: positionInfo?.liquidityToken?.address,
  })
>>>>>>> upstream/main

  if (approvalError) {
    logger.info(
      'RemoveLiquidityTxAndGasInfo',
      'RemoveLiquidityTxAndGasInfo',
<<<<<<< HEAD
      parseErrorMessageTitle(approvalError, { defaultTitle: 'unkown CheckLpApprovalQuery' }),
=======
      parseErrorMessageTitle(approvalError, {
        defaultTitle: 'unkown CheckLpApprovalQuery',
      }),
>>>>>>> upstream/main
      {
        error: JSON.stringify(approvalError),
        v2LpTokenApprovalQueryParams: JSON.stringify(approvalQueryParams),
      },
    )
  }

  const v2ApprovalGasFeeUSD =
    useUSDCurrencyAmountOfGasFee(
      positionInfo?.liquidityToken?.chainId,
      v2LpTokenApproval?.gasFeePositionTokenApproval,
    ) ?? undefined

  const approvalsNeeded = !v2ApprovalLoading && Boolean(v2LpTokenApproval?.positionTokenApproval)

<<<<<<< HEAD
  const decreaseCalldataQueryParams = useMemo((): DecreaseLPPositionRequest | undefined => {
=======
  const decreaseCalldataQueryParams = useMemo((): DecreaseLPPositionRequest | DecreasePositionRequest | undefined => {
>>>>>>> upstream/main
    if (!positionInfo || !account || percentInvalid || !currency0 || !currency1) {
      return undefined
    }

<<<<<<< HEAD
=======
    if (isDecreasePositionV2) {
      return new DecreasePositionRequest({
        walletAddress: account,
        chainId: currency0.chainId,
        protocol: getProtocols(positionInfo.version),
        token0Address: getTokenOrZeroAddress(currency0),
        token1Address: getTokenOrZeroAddress(currency1),
        nftTokenId: positionInfo.tokenId,
        liquidityPercentageToDecrease: Number(percent),
        slippageTolerance: customSlippageTolerance,
        deadline: getTradeSettingsDeadline(customDeadline),
        simulateTransaction: !approvalsNeeded,
        withdrawAsWeth: !unwrapNativeCurrency,
      })
    }

>>>>>>> upstream/main
    return getDecreaseLPPositionQueryParams({
      positionInfo,
      address: account,
      percent,
      currency0,
      currency1,
      customDeadline,
      unwrapNativeCurrency,
      approvalsNeeded,
      customSlippageTolerance,
    })
  }, [
    positionInfo,
    account,
    percent,
    customDeadline,
    unwrapNativeCurrency,
    approvalsNeeded,
    customSlippageTolerance,
    percentInvalid,
    currency0,
    currency1,
<<<<<<< HEAD
=======
    isDecreasePositionV2,
>>>>>>> upstream/main
  ])

  const isUserCommittedToDecrease =
    currentTransactionStep?.step.type === TransactionStepType.DecreasePositionTransaction
  const isQueryEnabled =
    !isUserCommittedToDecrease &&
    ((!percentInvalid && !approvalQueryParams) || (!v2ApprovalLoading && !approvalError && Boolean(v2LpTokenApproval)))

<<<<<<< HEAD
  const {
    data: decreaseCalldata,
    isLoading: decreaseCalldataLoading,
    error: calldataError,
    refetch: calldataRefetch,
  } = useQuery(
    liquidityQueries.decreasePosition({
      params: decreaseCalldataQueryParams,
      refetchInterval: transactionError ? false : 5 * ONE_SECOND_MS,
      retry: false,
      enabled: isQueryEnabled && Boolean(decreaseCalldataQueryParams),
    }),
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: +decreaseCalldataQueryParams
=======
  const { decreaseCalldata, decreaseCalldataLoading, calldataError, calldataRefetch } = useDecreasePositionQuery({
    decreaseCalldataQueryParams,
    transactionError: Boolean(transactionError),
    isQueryEnabled: isQueryEnabled && Boolean(decreaseCalldataQueryParams),
  })

  // oxlint-disable-next-line react/exhaustive-deps -- +decreaseCalldataQueryParams
>>>>>>> upstream/main
  useEffect(() => {
    setTransactionError(getErrorMessageToDisplay({ approvalError, calldataError }))
  }, [calldataError, decreaseCalldataQueryParams, approvalError])

  if (calldataError) {
<<<<<<< HEAD
    const message = parseErrorMessageTitle(calldataError, { defaultTitle: 'DecreaseLpPositionCalldataQuery' })
=======
    const message = parseErrorMessageTitle(calldataError, {
      defaultTitle: 'DecreaseLpPositionCalldataQuery',
    })
>>>>>>> upstream/main
    logger.error(message, {
      tags: {
        file: 'RemoveLiquidityTxAndGasInfo',
        function: 'useEffect',
      },
    })
    sendAnalyticsEvent(InterfaceEventName.DecreaseLiquidityFailed, {
      message,
<<<<<<< HEAD
=======
      ...decreaseCalldataQueryParams,
>>>>>>> upstream/main
    })
  }

  const { value: estimatedGasFee } = useTransactionGasFee({
    tx: decreaseCalldata?.decrease,
    skip: !!decreaseCalldata?.gasFee,
  })
  const decreaseGasFeeUsd =
    useUSDCurrencyAmountOfGasFee(
      toSupportedChainId(decreaseCalldata?.decrease?.chainId) ?? undefined,
      decreaseCalldata?.gasFee || estimatedGasFee,
    ) ?? undefined

  const totalGasFeeEstimate = v2ApprovalGasFeeUSD ? decreaseGasFeeUsd?.add(v2ApprovalGasFeeUSD) : decreaseGasFeeUsd

  return {
    gasFeeEstimateUSD: totalGasFeeEstimate,
    decreaseCalldataLoading,
    decreaseCalldata,
    v2LpTokenApproval,
    approvalLoading: v2ApprovalLoading,
    error: getErrorMessageToDisplay({ approvalError, calldataError }),
    refetch: approvalError ? approvalRefetch : calldataError ? calldataRefetch : undefined,
  }
}
