import { GraphQLApi } from '@luxfi/api'

export type Ticks = NonNullable<NonNullable<GraphQLApi.AllV3TicksQuery['v3Pool']>['ticks']>
export type TickData = Ticks[number]
