import { GraphQLApi } from '@luxfi/api'
import { STALE_TRANSACTION_TIME_MS } from 'lx/src/features/notifications/constants'
import {
  erc20ApproveAssetChange,
  erc20TokenTransferOut,
  erc20TransferIn,
} from 'lx/src/test/fixtures/gql/activities/tokens'
import { GQL_CHAINS } from 'lx/src/test/fixtures/gql/misc'
import { gqlTransaction, gqlTransactionDetails } from 'lx/src/test/fixtures/gql/transactions'
import { faker, MAX_FIXTURE_TIMESTAMP } from 'lx/src/test/shared'
import { createFixture, randomChoice, randomEnumValue } from 'lx/src/test/utils'
import { ONE_MINUTE_MS } from 'utilities/src/time/time'

export * from './nfts'
export * from './swap'
export * from './tokens'

/**
 * Base fixtures
 */

export const assetActivity = createFixture<GraphQLApi.AssetActivity>()(() => ({
  id: faker.datatype.uuid(),
  chain: randomChoice(GQL_CHAINS),
  /** @deprecated use assetChanges field in details */
  assetChanges: [] as GraphQLApi.AssetChange[],
  details: gqlTransactionDetails(),
  timestamp: faker.datatype.number({ max: MAX_FIXTURE_TIMESTAMP }),
  /** @deprecated use type field in details */
  transaction: gqlTransaction(),
  /** @deprecated use type field in details */
  type: randomEnumValue(GraphQLApi.ActivityType),
}))

/**
 * Derived fixtures
 */

export const approveAssetActivity = createFixture<GraphQLApi.AssetActivity>()(() =>
  assetActivity({
    chain: GraphQLApi.Chain.Ethereum,
    /** @deprecated use type field in details */
    type: GraphQLApi.ActivityType.Approve,
    details: gqlTransactionDetails({
      type: GraphQLApi.TransactionType.Approve,
      transactionStatus: GraphQLApi.TransactionStatus.Confirmed,
      assetChanges: [erc20ApproveAssetChange()],
    }),
  }),
)

export const erc20SwapAssetActivity = createFixture<GraphQLApi.AssetActivity>()(() =>
  assetActivity({
    chain: GraphQLApi.Chain.Ethereum,
    /** @deprecated use type field in details */
    type: GraphQLApi.ActivityType.Swap,
    details: gqlTransactionDetails({
      type: GraphQLApi.TransactionType.Swap,
      transactionStatus: GraphQLApi.TransactionStatus.Confirmed,
      assetChanges: [erc20TransferIn(), erc20TokenTransferOut()],
    }),
  }),
)

export const erc20RecentReceiveAssetActivity = createFixture<GraphQLApi.AssetActivity>()(() =>
  assetActivity({
    chain: GraphQLApi.Chain.Ethereum,
    /** @deprecated use type field in details */
    type: GraphQLApi.ActivityType.Receive,
    timestamp: (Date.now() - ONE_MINUTE_MS * 5) / 1000,
    details: gqlTransactionDetails({
      type: GraphQLApi.TransactionType.Receive,
      transactionStatus: GraphQLApi.TransactionStatus.Confirmed,
      assetChanges: [erc20TransferIn()],
    }),
  }),
)

export const erc20StaleReceiveAssetActivity = createFixture<GraphQLApi.AssetActivity>()(() =>
  assetActivity({
    chain: GraphQLApi.Chain.Ethereum,
    /** @deprecated use type field in details */
    type: GraphQLApi.ActivityType.Receive,
    timestamp: (Date.now() - STALE_TRANSACTION_TIME_MS * 2) / 1000,
    details: gqlTransactionDetails({
      type: GraphQLApi.TransactionType.Receive,
      transactionStatus: GraphQLApi.TransactionStatus.Confirmed,
      assetChanges: [erc20TransferIn()],
    }),
  }),
)
