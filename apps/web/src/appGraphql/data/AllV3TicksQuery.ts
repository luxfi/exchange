<<<<<<< HEAD
import { GraphQLApi } from '@l.x/api'
=======
import { GraphQLApi } from '@universe/api'
>>>>>>> upstream/main

export type Ticks = NonNullable<NonNullable<GraphQLApi.AllV3TicksQuery['v3Pool']>['ticks']>
export type TickData = Ticks[number]
