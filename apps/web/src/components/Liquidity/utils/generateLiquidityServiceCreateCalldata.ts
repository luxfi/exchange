<<<<<<< HEAD
import { ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
import {
  CheckApprovalLPResponse,
  CreateLPPositionRequest,
} from '@luxamm/client-liquidity/dist/lx/liquidity/v1/api_pb'
=======
import { ProtocolVersion } from '@uniswap/client-data-api/dist/data/v1/poolTypes_pb'
import { CreateLPPositionRequest } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
>>>>>>> upstream/main
import {
  IndependentToken,
  Protocols,
  V2CreateLPPosition,
  V3CreateLPPosition,
  V4CreateLPPosition,
<<<<<<< HEAD
} from '@luxamm/client-liquidity/dist/lx/liquidity/v1/types_pb'
import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { Pair } from '@luxamm/v2-sdk'
import { Pool as V3Pool } from '@luxamm/v3-sdk'
import { Pool as V4Pool } from '@luxamm/v4-sdk'
import { getTradeSettingsDeadline } from 'lx/src/data/apiClients/tradingApi/utils/getTradeSettingsDeadline'
import { DYNAMIC_FEE_DATA, PositionState } from '~/components/Liquidity/Create/types'
import { getTokenOrZeroAddress, validateCurrencyInput } from '~/components/Liquidity/utils/currency'
=======
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
>>>>>>> upstream/main
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
<<<<<<< HEAD
}

type ValidatedCreateInput =
  | ({ protocol: ProtocolVersion.V2 } & BaseValidatedInput)
=======
  poolId?: string
}

type ValidatedCreateInput =
  | ({ protocol: ProtocolVersion.V2; pairAddress?: string; useV2Endpoints?: boolean } & BaseValidatedInput)
>>>>>>> upstream/main
  | ({
      protocol: ProtocolVersion.V3
      tickLower: number
      tickUpper: number
      tickSpacing: number
      fee: number
      initialPrice: string | undefined
<<<<<<< HEAD
=======
      useV2Endpoints?: boolean
>>>>>>> upstream/main
    } & BaseValidatedInput)
  | ({
      protocol: ProtocolVersion.V4
      tickLower: number
      tickUpper: number
      tickSpacing: number
      fee: number
      hook: string | undefined
      initialPrice: string | undefined
<<<<<<< HEAD
=======
      useV2Endpoints?: boolean
>>>>>>> upstream/main
    } & BaseValidatedInput)

interface RawCreatePositionInput {
  protocolVersion: ProtocolVersion
  creatingPoolOrPair: boolean | undefined
  address?: string
<<<<<<< HEAD
  approvalCalldata?: CheckApprovalLPResponse
=======
  approvalCalldata?: NormalizedApprovalData
>>>>>>> upstream/main
  positionState: PositionState
  ticks: [Maybe<number>, Maybe<number>]
  poolOrPair: V3Pool | V4Pool | Pair | undefined
  displayCurrencies: { [field in PositionField]: Maybe<Currency> }
  currencyAmounts?: { [field in PositionField]?: Maybe<CurrencyAmount<Currency>> }
  independentField: PositionField
  slippageTolerance?: number
  customDeadline?: number
  nativeTokenBalance?: string
<<<<<<< HEAD
=======
  useV2Endpoints?: boolean
  poolId?: string
>>>>>>> upstream/main
}

function validatePoolInput({
  base,
  protocolVersion,
  positionState,
  ticks,
  poolOrPair,
  creatingPoolOrPair,
<<<<<<< HEAD
=======
  useV2Endpoints,
>>>>>>> upstream/main
}: {
  base: BaseValidatedInput
  protocolVersion: ProtocolVersion.V3 | ProtocolVersion.V4
  positionState: PositionState
  ticks: [Maybe<number>, Maybe<number>]
  poolOrPair: V3Pool | V4Pool | Pair
  creatingPoolOrPair: boolean | undefined
<<<<<<< HEAD
=======
  useV2Endpoints?: boolean
>>>>>>> upstream/main
}): ValidatedCreateInput | undefined {
  const pool = poolOrPair as V4Pool | V3Pool
  const tickLower = ticks[0]
  const tickUpper = ticks[1]

  if (tickLower === undefined || tickUpper === undefined) {
    return undefined
  }

  const initialPrice = creatingPoolOrPair ? pool.sqrtRatioX96.toString() : undefined
  const tickSpacing = pool.tickSpacing

  const fee = positionState.fee?.isDynamic ? DYNAMIC_FEE_DATA.feeAmount : positionState.fee?.feeAmount

  if (fee === undefined) {
    return undefined
  }

  if (protocolVersion === ProtocolVersion.V3) {
    return {
      ...base,
      protocol: ProtocolVersion.V3,
      tickLower: tickLower as number,
      tickUpper: tickUpper as number,
      tickSpacing,
      fee,
      initialPrice,
<<<<<<< HEAD
=======
      useV2Endpoints,
>>>>>>> upstream/main
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
<<<<<<< HEAD
=======
    useV2Endpoints,
>>>>>>> upstream/main
  }
}

function validateCreatePositionInput(input: RawCreatePositionInput): ValidatedCreateInput | undefined {
  const {
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
  } = input

  const deadline = getTradeSettingsDeadline(customDeadline)

  if (
    protocolVersion !== positionState.protocolVersion ||
    !address ||
    !currencyAmounts?.TOKEN0 ||
    !currencyAmounts.TOKEN1 ||
    !validateCurrencyInput(displayCurrencies) ||
    !poolOrPair ||
    !displayCurrencies.TOKEN0 ||
    !displayCurrencies.TOKEN1
  ) {
    return undefined
  }

  const {
    token0Approval,
    token1Approval,
    positionTokenApproval,
<<<<<<< HEAD
    permitData,
=======
    v4BatchPermitData,
>>>>>>> upstream/main
    token0PermitTransaction,
    token1PermitTransaction,
  } = approvalCalldata ?? {}

  const independentToken =
    independentField === PositionField.TOKEN0 ? IndependentToken.TOKEN_0 : IndependentToken.TOKEN_1
  const dependentField = independentField === PositionField.TOKEN0 ? PositionField.TOKEN1 : PositionField.TOKEN0
  const independentAmount = currencyAmounts[independentField]
  const dependentAmount = currencyAmounts[dependentField]

  const simulateTransaction = !(
<<<<<<< HEAD
    permitData?.value ||
=======
    v4BatchPermitData ||
>>>>>>> upstream/main
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
<<<<<<< HEAD
=======
    poolId: input.poolId,
>>>>>>> upstream/main
  }

  if (protocolVersion === ProtocolVersion.V2) {
    return {
      ...baseInput,
      protocol: ProtocolVersion.V2,
<<<<<<< HEAD
=======
      useV2Endpoints: input.useV2Endpoints,
>>>>>>> upstream/main
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
<<<<<<< HEAD
=======
      useV2Endpoints: input.useV2Endpoints,
>>>>>>> upstream/main
    })
  }

  return undefined
}

<<<<<<< HEAD
function buildV2CreateRequest(
=======
function buildV2CreateRequestDeprecated(
>>>>>>> upstream/main
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

<<<<<<< HEAD
function buildV3CreateRequest(
=======
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
>>>>>>> upstream/main
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

<<<<<<< HEAD
function buildV4CreateRequest(
=======
function buildV4CreateRequestDeprecated(
>>>>>>> upstream/main
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

<<<<<<< HEAD
=======
function buildCreatePositionRequest(
  input: Extract<ValidatedCreateInput, { protocol: ProtocolVersion.V3 | ProtocolVersion.V4 }>,
  creatingPoolOrPair: boolean | undefined,
): CreatePositionRequest | undefined {
  const isToken0Independent = input.independentToken === IndependentToken.TOKEN_0

  // For existing pools, poolId is required. Returning undefined here is safe because the caller
  // (CreatePositionTxContext) gates isQueryEnabled on Boolean(createCalldataQueryParams), so the
  // query won't fire until poolId is populated from derivedPositionInfo.
  if (!creatingPoolOrPair && !input.poolId) {
    return undefined
  }

  const poolParams: CreatePositionRequest['pool'] = creatingPoolOrPair
    ? {
        case: 'newPool' as const,
        value: new CreatePoolParameters({
          token0Address: input.token0Address,
          token1Address: input.token1Address,
          fee: input.fee,
          tickSpacing: input.tickSpacing,
          hooks: 'hook' in input ? input.hook : undefined,
          initialPrice: input.initialPrice,
        }),
      }
    : {
        case: 'existingPool' as const,
        value: new CreatePositionExistingPoolParameters({
          token0Address: input.token0Address,
          token1Address: input.token1Address,
          poolReference: input.poolId,
        }),
      }

  return new CreatePositionRequest({
    walletAddress: input.address,
    pool: poolParams,
    chainId: input.chainId,
    protocol: getProtocols(input.protocol),
    independentToken: new CreateToken({
      tokenAddress: isToken0Independent ? input.token0Address : input.token1Address,
      amount: input.independentAmount,
    }),
    dependentToken: input.dependentAmount
      ? new CreateToken({
          tokenAddress: isToken0Independent ? input.token1Address : input.token0Address,
          amount: input.dependentAmount,
        })
      : undefined,
    tickPrice: {
      case: 'tickBounds' as const,
      value: new PositionTickBounds({
        tickLower: input.tickLower,
        tickUpper: input.tickUpper,
      }),
    },
    slippageTolerance: input.slippageTolerance,
    deadline: input.deadline,
    simulateTransaction: input.simulateTransaction,
    nativeTokenBalance: input.nativeTokenBalance,
  })
}

>>>>>>> upstream/main
export function generateLiquidityServiceCreateCalldataQueryParams({
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
<<<<<<< HEAD
}: RawCreatePositionInput): CreateLPPositionRequest | undefined {
=======
  useV2Endpoints,
  poolId,
}: RawCreatePositionInput): CreateLPPositionRequest | CreateClassicPositionRequest | CreatePositionRequest | undefined {
>>>>>>> upstream/main
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
<<<<<<< HEAD
=======
    useV2Endpoints,
    poolId,
>>>>>>> upstream/main
  })

  if (!validated) {
    return undefined
  }

  switch (validated.protocol) {
    case ProtocolVersion.V2:
<<<<<<< HEAD
      return buildV2CreateRequest(validated)
    case ProtocolVersion.V3:
      return buildV3CreateRequest(validated)
    case ProtocolVersion.V4:
      return buildV4CreateRequest(validated)
=======
      return validated.useV2Endpoints ? buildClassicCreateRequest(validated) : buildV2CreateRequestDeprecated(validated)
    case ProtocolVersion.V3:
      return validated.useV2Endpoints
        ? buildCreatePositionRequest(validated, creatingPoolOrPair)
        : buildV3CreateRequestDeprecated(validated)
    case ProtocolVersion.V4:
      return validated.useV2Endpoints
        ? buildCreatePositionRequest(validated, creatingPoolOrPair)
        : buildV4CreateRequestDeprecated(validated)
>>>>>>> upstream/main
    default:
      return undefined
  }
}
