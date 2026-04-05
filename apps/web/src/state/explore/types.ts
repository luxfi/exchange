<<<<<<< HEAD
import { Amount, PoolStats, TokenStats } from '@luxamm/client-explore/dist/lx/explore/v1/service_pb'
import { Percent } from '@luxamm/sdk-core'
import { GraphQLApi } from '@l.x/api'
=======
import type { PlainMessage } from '@bufbuild/protobuf'
import { Amount, PoolStats, TokenStats } from '@uniswap/client-explore/dist/uniswap/explore/v1/service_pb'
import { Percent } from '@uniswap/sdk-core'
import { GraphQLApi } from '@universe/api'
>>>>>>> upstream/main
import { FeeData as CreatePositionFeeData } from '~/components/Liquidity/Create/types'

type PricePoint = { timestamp: number; value: number }

<<<<<<< HEAD
export interface TokenStat
  extends Omit<TokenStats, 'volume1Hour' | 'volume1Day' | 'volume1Week' | 'volume1Month' | 'volume1Year'> {
  volume?: Amount
  priceHistory?: PricePoint[]
  feeData?: GraphQLApi.FeeData
=======
/** Data-only shape for token stats (display/API). Plain type so plain objects satisfy it without cast. */
export type TokenStat = Omit<
  PlainMessage<TokenStats>,
  'volume1Hour' | 'volume1Day' | 'volume1Week' | 'volume1Month' | 'volume1Year'
> & {
  volume?: Amount
  priceHistory?: PricePoint[]
  feeData?: GraphQLApi.FeeData
  /** Stable key for sparkline/cache/row: multichainId when from multichain, normalized address when single-chain. */
  id?: string
>>>>>>> upstream/main
}

type PoolStatWithoutMethods = Omit<
  PoolStats,
  | 'clone'
  | 'toBinary'
  | 'toJson'
  | 'equals'
  | 'fromBinary'
  | 'fromJson'
  | 'fromJsonString'
  | 'toJsonString'
  | 'getType'
  | 'feeTier'
>

export interface PoolStat extends PoolStatWithoutMethods {
  apr: Percent
  boostedApr?: number
  volOverTvl?: number
  hookAddress?: string
  feeTier?: CreatePositionFeeData
}
