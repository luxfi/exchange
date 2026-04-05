import { ProtocolVersion } from '@uniswap/client-data-api/dist/data/v1/poolTypes_pb'
import { CreateLPPositionRequest } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import {
  IndependentToken,
  Protocols,
  V2CreateLPPosition,
  V3CreateLPPosition,
  V4CreateLPPosition,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/types_pb'
import {
  CreateClassicPositionRequest,
  CreatePositionRequest,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import {
  CreatePoolParameters,
  CreatePositionExistingPoolParameters,
  CreateToken,
  LPToken,
  PositionTickBounds,
  V2PoolParameters,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/types_pb'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { Pool as V3Pool } from '@uniswap/v3-sdk'
import { Pool as V4Pool } from '@uniswap/v4-sdk'
import type { NormalizedApprovalData } from 'uniswap/src/data/apiClients/liquidityService/normalizeApprovalResponse'
import { getTradeSettingsDeadline } from 'uniswap/src/data/apiClients/tradingApi/utils/getTradeSettingsDeadline'
import { DYNAMIC_FEE_DATA, PositionState } from '~/components/Liquidity/Create/types'
import { getTokenOrZeroAddress, validateCurrencyInput } from '~/components/Liquidity/utils/currency'
import { getProtocols } from '~/components/Liquidity/utils/protocolVersion'
import { PositionField } from '~/types/position'

interface BaseValidatedInput {
  address: string
  chainId: number
  independentToken: IndependentToken
  independentAmount: string
  dependentAmount: string | undefined
  slippageTolerance: number | undefined
  deadline: number | undefined
  simulateTransaction: boolean
  token0Address: string
  token1Address: string
  nativeTokenBalance?: string
  poolId?: string
}

type ValidatedCreateInput =
  | ({ protocol: ProtocolVersion.V2; pairAddress?: string; useV2Endpoints?: boolean } & BaseValidatedInput)
  | ({
      protocol: ProtocolVersion.V3
      tickLower: number
      tickUpper: number
      tickSpacing: number
      fee: number
      initialPrice: string | undefined
      useV2Endpoints?: boolean
    } & BaseValidatedInput)

interface RawCreatePositionInput {
  protocolVersion: ProtocolVersion
  creatingPoolOrPair: boolean | undefined
  address?: string
  approvalCalldata?: NormalizedApprovalData
  positionState: PositionState
  ticks: [Maybe<number>, Maybe<number>]
  poolOrPair: V3Pool | V4Pool | Pair | undefined
  displayCurrencies: { [field in PositionField]: Maybe<Currency> }
  currencyAmounts?: { [field in PositionField]?: Maybe<CurrencyAmount<Currency>> }
  independentField: PositionField
  slippageTolerance?: number
  customDeadline?: number
  nativeTokenBalance?: string
  useV2Endpoints,
}: {
  base: BaseValidatedInput
  protocolVersion: ProtocolVersion.V3 | ProtocolVersion.V4
  positionState: PositionState
  ticks: [Maybe<number>, Maybe<number>]
  poolOrPair: V3Pool | V4Pool | Pair
  creatingPoolOrPair: boolean | undefined
      useV2Endpoints,
    }
  }

  return {
    ...base,
    protocol: ProtocolVersion.V4,
    tickLower: tickLower as number,
    tickUpper: tickUpper as number,
    tickSpacing,
    fee,
    hook: positionState.hook,
    initialPrice,
    v4BatchPermitData,
    token0PermitTransaction,
    token1PermitTransaction,
  } = approvalCalldata ?? {}

  const independentToken =
    independentField === PositionField.TOKEN0 ? IndependentToken.TOKEN_0 : IndependentToken.TOKEN_1
  const dependentField = independentField === PositionField.TOKEN0 ? PositionField.TOKEN1 : PositionField.TOKEN0
  const independentAmount = currencyAmounts[independentField]
  const dependentAmount = currencyAmounts[dependentField]

  const simulateTransaction = !(
    v4BatchPermitData ||
    token0PermitTransaction ||
    token1PermitTransaction ||
    token0Approval ||
    token1Approval ||
    positionTokenApproval
  )

  const baseInput: BaseValidatedInput = {
    address,
    chainId: currencyAmounts.TOKEN0.currency.chainId,
    independentToken,
    independentAmount: independentAmount?.quotient.toString() ?? '',
    dependentAmount: dependentAmount?.quotient.toString(),
    slippageTolerance,
    deadline,
    simulateTransaction,
    token0Address: getTokenOrZeroAddress(displayCurrencies.TOKEN0),
    token1Address: getTokenOrZeroAddress(displayCurrencies.TOKEN1),
    nativeTokenBalance,
      useV2Endpoints: input.useV2Endpoints,
    }
  }

  if (protocolVersion === ProtocolVersion.V3 || protocolVersion === ProtocolVersion.V4) {
    return validatePoolInput({
      base: baseInput,
      protocolVersion,
      positionState,
      ticks,
      poolOrPair,
      creatingPoolOrPair,
function buildV2CreateRequestDeprecated(
  input: Extract<ValidatedCreateInput, { protocol: ProtocolVersion.V2 }>,
): CreateLPPositionRequest {
  return new CreateLPPositionRequest({
    createLpPosition: {
      case: 'v2CreateLpPosition',
      value: new V2CreateLPPosition({
        simulateTransaction: input.simulateTransaction,
        protocols: Protocols.V2,
        walletAddress: input.address,
        chainId: input.chainId,
        independentAmount: input.independentAmount,
        independentToken: input.independentToken,
        defaultDependentAmount: input.dependentAmount,
        slippageTolerance: input.slippageTolerance,
        deadline: input.deadline,
        position: { pool: { token0: input.token0Address, token1: input.token1Address } },
      }),
    },
  })
}

function buildClassicCreateRequest(
  input: Extract<ValidatedCreateInput, { protocol: ProtocolVersion.V2 }>,
): CreateClassicPositionRequest {
  const isToken0Independent = input.independentToken === IndependentToken.TOKEN_0
  return new CreateClassicPositionRequest({
    walletAddress: input.address,
    poolParameters: new V2PoolParameters({
      token0Address: input.token0Address,
      token1Address: input.token1Address,
      chainId: input.chainId,
    }),
    independentToken: new LPToken({
      tokenAddress: isToken0Independent ? input.token0Address : input.token1Address,
      amount: input.independentAmount,
    }),
    dependentToken: input.dependentAmount
      ? new LPToken({
          tokenAddress: isToken0Independent ? input.token1Address : input.token0Address,
          amount: input.dependentAmount,
        })
      : undefined,
    slippageTolerance: input.slippageTolerance,
    deadline: input.deadline,
    simulateTransaction: input.simulateTransaction,
  })
}

function buildV3CreateRequestDeprecated(
  input: Extract<ValidatedCreateInput, { protocol: ProtocolVersion.V3 }>,
): CreateLPPositionRequest {
  return new CreateLPPositionRequest({
    createLpPosition: {
      case: 'v3CreateLpPosition',
      value: new V3CreateLPPosition({
        simulateTransaction: input.simulateTransaction,
        protocols: Protocols.V3,
        walletAddress: input.address,
        chainId: input.chainId,
        independentAmount: input.independentAmount,
        independentToken: input.independentToken,
        // Only set initialDependentAmount if there is an initialPrice
        initialDependentAmount: input.initialPrice && input.dependentAmount,
        initialPrice: input.initialPrice,
        slippageTolerance: input.slippageTolerance,
        deadline: input.deadline,
        position: {
          tickLower: input.tickLower,
          tickUpper: input.tickUpper,
          pool: {
            tickSpacing: input.tickSpacing,
            token0: input.token0Address,
            token1: input.token1Address,
            fee: input.fee,
          },
        },
      }),
    },
  })
}

function buildV4CreateRequestDeprecated(
  input: Extract<ValidatedCreateInput, { protocol: ProtocolVersion.V4 }>,
): CreateLPPositionRequest {
  return new CreateLPPositionRequest({
    createLpPosition: {
      case: 'v4CreateLpPosition',
      value: new V4CreateLPPosition({
        simulateTransaction: input.simulateTransaction,
        protocols: Protocols.V4,
        walletAddress: input.address,
        chainId: input.chainId,
        independentAmount: input.independentAmount,
        independentToken: input.independentToken,
        // Only set initialDependentAmount if there is an initialPrice
        initialDependentAmount: input.initialPrice && input.dependentAmount,
        initialPrice: input.initialPrice,
        slippageTolerance: input.slippageTolerance,
        deadline: input.deadline,
        nativeTokenBalance: input.nativeTokenBalance,
        position: {
          tickLower: input.tickLower,
          tickUpper: input.tickUpper,
          pool: {
            tickSpacing: input.tickSpacing,
            token0: input.token0Address,
            token1: input.token1Address,
            fee: input.fee,
            hooks: input.hook,
          },
        },
      }),
    },
  })
}

  useV2Endpoints,
  poolId,
}: RawCreatePositionInput): CreateLPPositionRequest | CreateClassicPositionRequest | CreatePositionRequest | undefined {
  const validated = validateCreatePositionInput({
    protocolVersion,
    creatingPoolOrPair,
    address,
    approvalCalldata,
    positionState,
    ticks,
    poolOrPair,
    displayCurrencies,
    currencyAmounts,
    independentField,
    slippageTolerance,
    customDeadline,
    nativeTokenBalance,
      return validated.useV2Endpoints ? buildClassicCreateRequest(validated) : buildV2CreateRequestDeprecated(validated)
    case ProtocolVersion.V3:
      return validated.useV2Endpoints
        ? buildCreatePositionRequest(validated, creatingPoolOrPair)
        : buildV3CreateRequestDeprecated(validated)
    case ProtocolVersion.V4:
      return validated.useV2Endpoints
        ? buildCreatePositionRequest(validated, creatingPoolOrPair)
        : buildV4CreateRequestDeprecated(validated)
    default:
      return undefined
  }
}
