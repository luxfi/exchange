import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { type TokenPriceHistoryQueryVariables, type TokenPriceHistoryQuery, type AccountListQueryVariables, type AccountListQuery, type NftsQueryVariables, type NftsQuery, type NftItemScreenQueryVariables, type NftItemScreenQuery, type NftCollectionScreenQueryVariables, type NftCollectionScreenQuery, type NftsTabQueryVariables, type NftsTabQuery, type TokenBalanceMainPartsFragment, type TokenBalanceQuantityPartsFragment, type TokenBalancePartsFragment, type PortfolioBalancesQueryVariables, type PortfolioBalancesQuery, type MultiplePortfolioBalancesQueryVariables, type MultiplePortfolioBalancesQuery, type SelectWalletScreenQueryVariables, type SelectWalletScreenQuery, type TransactionHistoryUpdaterQueryVariables, type TransactionHistoryUpdaterQuery, type TokenQueryVariables, type TokenQuery, type TokenDetailsScreenQueryVariables, type TokenDetailsScreenQuery, type TokenProjectDescriptionQueryVariables, type TokenProjectDescriptionQuery, type TokenProjectsQueryVariables, type TokenProjectsQuery, type TransactionListQueryVariables, type TransactionListQuery, type FeedTransactionListQueryVariables, type FeedTransactionListQuery, type TopTokensQueryVariables, type TopTokensQuery, type TokenPartsFragment, type TokenBasicInfoPartsFragment, type TokenBasicProjectPartsFragment, type TokenProjectUrlsPartsFragment, type TokenProjectMarketsPartsFragment, type TokenMarketPartsFragment, type TokenFeeDataPartsFragment, type TokenProtectionInfoPartsFragment, type TopTokenPartsFragment, type HomeScreenTokenPartsFragment, type HomeScreenTokensQueryVariables, type HomeScreenTokensQuery, type FavoriteTokenCardQueryVariables, type FavoriteTokenCardQuery, type WidgetTokensQueryVariables, type WidgetTokensQuery, type TokensQueryVariables, type TokensQuery, type ConvertQueryVariables, type ConvertQuery, type RecentTokenTransfersQueryVariables, type RecentTokenTransfersQuery, type SimpleTokenDetailsFragment, type TokenSpotPriceQueryVariables, type TokenSpotPriceQuery, type UniswapPricesQueryVariables, type UniswapPricesQuery, type NftAssetPartsFragment, type NftTransferPartsFragment, type TokenAssetPartsFragment, type TokenTransferPartsFragment, type OnRampTransferPartsFragment, type TokenApprovalPartsFragment, type NftApprovalPartsFragment, type NftApproveForAllPartsFragment, type TransactionPartsFragment, type TransactionDetailsPartsFragment, type OnRampTransactionDetailsPartsFragment, type OffRampTransactionDetailsPartsFragment, type SwapOrderDetailsPartsFragment, type AssetActivityPartsFragment, type ActivityWebQueryVariables, type ActivityWebQuery, type OnAssetActivitySubscriptionVariables, type OnAssetActivitySubscription, type AllV3TicksQueryVariables, type AllV3TicksQuery, type AllV4TicksQueryVariables, type AllV4TicksQuery, type FeeTierDistributionQueryVariables, type FeeTierDistributionQuery, type TokenPromoQueryVariables, type TokenPromoQuery, type CollectionPromoQueryVariables, type CollectionPromoQuery, type DailyProtocolVolumeQueryVariables, type DailyProtocolVolumeQuery, type IsV3SubgraphStaleQueryVariables, type IsV3SubgraphStaleQuery, type CollectionSearchQueryVariables, type CollectionSearchQuery, type NftBalanceQueryVariables, type NftBalanceQuery, type TokenPriceFragment, type V3PoolQueryVariables, type V3PoolQuery, type V4PoolQueryVariables, type V4PoolQuery, type PoolPriceHistoryQueryVariables, type PoolPriceHistoryQuery, type PoolVolumeHistoryQueryVariables, type PoolVolumeHistoryQuery, type V2PairQueryVariables, type V2PairQuery, type PoolTransactionTokenFragment, type V4PoolTransactionsQueryVariables, type V4PoolTransactionsQuery, type V3PoolTransactionsQueryVariables, type V3PoolTransactionsQuery, type V2PairTransactionsQueryVariables, type V2PairTransactionsQuery, type QuickTokenBalancePartsFragment, type PortfolioTokenBalancePartsFragment, type QuickTokenBalancesWebQueryVariables, type QuickTokenBalancesWebQuery, type TokenWebQueryVariables, type TokenWebQuery, type TokenProjectWebQueryVariables, type TokenProjectWebQuery, type CandlestickOhlcFragment, type PriceHistoryFallbackFragment, type TokenPriceQueryVariables, type TokenPriceQuery, type TokenHistoricalVolumesQueryVariables, type TokenHistoricalVolumesQuery, type TokenHistoricalTvlsQueryVariables, type TokenHistoricalTvlsQuery, type V4TokenTransactionsQueryVariables, type V4TokenTransactionsQuery, type V3TokenTransactionsQueryVariables, type V3TokenTransactionsQuery, type V2TokenTransactionsQueryVariables, type V2TokenTransactionsQuery, type TopV4PoolsQueryVariables, type TopV4PoolsQuery, type TopV3PoolsQueryVariables, type TopV3PoolsQuery, type TopV2PairsQueryVariables, type TopV2PairsQuery, type TransactionTokenFragment, type PoolTxFragment, type V4TransactionsQueryVariables, type V4TransactionsQuery, type V3TransactionsQueryVariables, type V3TransactionsQuery, type V2TransactionsQueryVariables, type V2TransactionsQuery } from "./operations";

const defaultOptions = {} as const;
export const TokenBalanceQuantityPartsFragmentDoc = gql`
    fragment TokenBalanceQuantityParts on TokenBalance {
  id
  quantity
}
    `;
export const TokenBalanceMainPartsFragmentDoc = gql`
    fragment TokenBalanceMainParts on TokenBalance {
  ...TokenBalanceQuantityParts
  denominatedValue {
    currency
    value
  }
  tokenProjectMarket {
    relativeChange24: pricePercentChange(duration: DAY) {
      value
    }
  }
}
    ${TokenBalanceQuantityPartsFragmentDoc}`;
export const TokenBasicInfoPartsFragmentDoc = gql`
    fragment TokenBasicInfoParts on Token {
  id
  address
  chain
  decimals
  name
  standard
  symbol
  isBridged
  bridgedWithdrawalInfo {
    chain
    provider
    url
  }
}
    `;
export const TokenBasicProjectPartsFragmentDoc = gql`
    fragment TokenBasicProjectParts on Token {
  project {
    id
    isSpam
    logoUrl
    name
    safetyLevel
    spamCode
    tokens {
      chain
      address
    }
  }
}
    `;
export const TokenFeeDataPartsFragmentDoc = gql`
    fragment TokenFeeDataParts on Token {
  feeData {
    buyFeeBps
    sellFeeBps
  }
}
    `;
export const TokenProtectionInfoPartsFragmentDoc = gql`
    fragment TokenProtectionInfoParts on Token {
  protectionInfo {
    result
    attackTypes
    blockaidFees {
      buy
      sell
      transfer
    }
  }
}
    `;
export const TokenPartsFragmentDoc = gql`
    fragment TokenParts on Token {
  ...TokenBasicInfoParts
  ...TokenBasicProjectParts
  ...TokenFeeDataParts
  ...TokenProtectionInfoParts
}
    ${TokenBasicInfoPartsFragmentDoc}
${TokenBasicProjectPartsFragmentDoc}
${TokenFeeDataPartsFragmentDoc}
${TokenProtectionInfoPartsFragmentDoc}`;
export const TokenBalancePartsFragmentDoc = gql`
    fragment TokenBalanceParts on TokenBalance {
  ...TokenBalanceMainParts
  isHidden
  token {
    ...TokenParts
  }
}
    ${TokenBalanceMainPartsFragmentDoc}
${TokenPartsFragmentDoc}`;
export const TokenProjectUrlsPartsFragmentDoc = gql`
    fragment TokenProjectUrlsParts on Token {
  project {
    homepageUrl
    twitterName
  }
}
    `;
export const TokenProjectMarketsPartsFragmentDoc = gql`
    fragment TokenProjectMarketsParts on Token {
  project {
    markets(currencies: [USD]) {
      id
      price {
        value
      }
      marketCap {
        value
      }
      fullyDilutedValuation {
        value
      }
      priceHigh52W: priceHighLow(duration: YEAR, highLow: HIGH) {
        value
      }
      priceLow52W: priceHighLow(duration: YEAR, highLow: LOW) {
        value
      }
      pricePercentChange24h {
        value
      }
    }
  }
}
    `;
export const TokenMarketPartsFragmentDoc = gql`
    fragment TokenMarketParts on Token {
  market(currency: USD) {
    id
    volume(duration: DAY) {
      value
    }
    price {
      value
    }
    priceHigh52W: priceHighLow(duration: YEAR, highLow: HIGH) {
      value
    }
    priceLow52W: priceHighLow(duration: YEAR, highLow: LOW) {
      value
    }
  }
}
    `;
export const TopTokenPartsFragmentDoc = gql`
    fragment TopTokenParts on Token {
  ...TokenBasicInfoParts
  market {
    id
    totalValueLocked {
      value
    }
    volume(duration: DAY) {
      value
    }
  }
  project {
    id
    logoUrl
    markets(currencies: [USD]) {
      id
      price {
        value
      }
      pricePercentChange24h {
        value
      }
      marketCap {
        value
      }
    }
  }
}
    ${TokenBasicInfoPartsFragmentDoc}`;
export const HomeScreenTokenPartsFragmentDoc = gql`
    fragment HomeScreenTokenParts on Token {
  ...TokenBasicInfoParts
  project {
    id
    logoUrl
    markets(currencies: [USD]) {
      id
      price {
        value
      }
      pricePercentChange24h {
        value
      }
    }
  }
}
    ${TokenBasicInfoPartsFragmentDoc}`;
export const TransactionPartsFragmentDoc = gql`
    fragment TransactionParts on Transaction {
  id
  blockNumber
  hash
  status
  to
  from
  nonce
}
    `;
export const TokenAssetPartsFragmentDoc = gql`
    fragment TokenAssetParts on Token {
  id
  address
  chain
  symbol
  name
  decimals
  standard
  project {
    id
    name
    logo {
      id
      url
    }
    safetyLevel
    logoUrl
    isSpam
  }
}
    `;
export const TokenTransferPartsFragmentDoc = gql`
    fragment TokenTransferParts on TokenTransfer {
  id
  asset {
    ...TokenAssetParts
  }
  tokenStandard
  quantity
  sender
  recipient
  direction
  transactedValue {
    id
    currency
    value
  }
}
    ${TokenAssetPartsFragmentDoc}`;
export const NftAssetPartsFragmentDoc = gql`
    fragment NFTAssetParts on NftAsset {
  id
  name
  isSpam
  nftContract {
    id
    chain
    address
  }
  tokenId
  image {
    id
    url
  }
  collection {
    id
    name
  }
}
    `;
export const NftTransferPartsFragmentDoc = gql`
    fragment NFTTransferParts on NftTransfer {
  id
  asset {
    ...NFTAssetParts
  }
  nftStandard
  sender
  recipient
  direction
}
    ${NftAssetPartsFragmentDoc}`;
export const TokenApprovalPartsFragmentDoc = gql`
    fragment TokenApprovalParts on TokenApproval {
  id
  asset {
    ...TokenAssetParts
  }
  tokenStandard
  approvedAddress
  quantity
}
    ${TokenAssetPartsFragmentDoc}`;
export const NftApprovalPartsFragmentDoc = gql`
    fragment NFTApprovalParts on NftApproval {
  id
  asset {
    ...NFTAssetParts
  }
  nftStandard
  approvedAddress
}
    ${NftAssetPartsFragmentDoc}`;
export const NftApproveForAllPartsFragmentDoc = gql`
    fragment NFTApproveForAllParts on NftApproveForAll {
  id
  asset {
    ...NFTAssetParts
  }
  nftStandard
  operatorAddress
  approved
}
    ${NftAssetPartsFragmentDoc}`;
export const SimpleTokenDetailsFragmentDoc = gql`
    fragment SimpleTokenDetails on Token {
  ...TokenBasicInfoParts
  project {
    id
    isSpam
    logoUrl
    name
    safetyLevel
  }
  ...TokenFeeDataParts
  ...TokenProtectionInfoParts
}
    ${TokenBasicInfoPartsFragmentDoc}
${TokenFeeDataPartsFragmentDoc}
${TokenProtectionInfoPartsFragmentDoc}`;
export const OnRampTransferPartsFragmentDoc = gql`
    fragment OnRampTransferParts on OnRampTransfer {
  id
  token {
    ...SimpleTokenDetails
  }
  tokenStandard
  amount
  sourceCurrency
  sourceAmount
  serviceProvider {
    serviceProvider
    name
    url
    logoLightUrl
    logoDarkUrl
  }
  transactionReferenceId
  externalSessionId
  networkFee
  transactionFee
  totalFee
}
    ${SimpleTokenDetailsFragmentDoc}`;
export const TransactionDetailsPartsFragmentDoc = gql`
    fragment TransactionDetailsParts on TransactionDetails {
  id
  type
  from
  to
  hash
  nonce
  status: transactionStatus
  networkFee {
    quantity
    tokenSymbol
    tokenAddress
    tokenChain
  }
  assetChanges {
    __typename
    ... on TokenTransfer {
      ...TokenTransferParts
    }
    ... on NftTransfer {
      ...NFTTransferParts
    }
    ... on TokenApproval {
      ...TokenApprovalParts
    }
    ... on NftApproval {
      ...NFTApprovalParts
    }
    ... on NftApproveForAll {
      ...NFTApproveForAllParts
    }
    ... on OnRampTransfer {
      ...OnRampTransferParts
    }
  }
}
    ${TokenTransferPartsFragmentDoc}
${NftTransferPartsFragmentDoc}
${TokenApprovalPartsFragmentDoc}
${NftApprovalPartsFragmentDoc}
${NftApproveForAllPartsFragmentDoc}
${OnRampTransferPartsFragmentDoc}`;
export const SwapOrderDetailsPartsFragmentDoc = gql`
    fragment SwapOrderDetailsParts on SwapOrderDetails {
  id
  offerer
  hash
  orderStatus: swapOrderStatus
  expiry
  swapOrderType
  encodedOrder
  inputToken {
    ...TokenAssetParts
  }
  inputTokenQuantity
  outputToken {
    ...TokenAssetParts
  }
  outputTokenQuantity
}
    ${TokenAssetPartsFragmentDoc}`;
export const OnRampTransactionDetailsPartsFragmentDoc = gql`
    fragment OnRampTransactionDetailsParts on OnRampTransactionDetails {
  id
  status
  receiverAddress
  onRampTransfer {
    id
    token {
      ...SimpleTokenDetails
    }
    amount
    sourceCurrency
    sourceAmount
    serviceProvider {
      serviceProvider
      name
      url
      logoLightUrl
      logoDarkUrl
    }
    transactionReferenceId
    externalSessionId
  }
}
    ${SimpleTokenDetailsFragmentDoc}`;
export const OffRampTransactionDetailsPartsFragmentDoc = gql`
    fragment OffRampTransactionDetailsParts on OffRampTransactionDetails {
  id
  status
  senderAddress
  offRampTransfer {
    id
    token {
      ...SimpleTokenDetails
    }
    amount
    destinationCurrency
    destinationAmount
    serviceProvider {
      serviceProvider
      name
      url
      logoLightUrl
      logoDarkUrl
    }
    transactionReferenceId
    externalSessionId
    networkFee
    transactionFee
    totalFee
  }
}
    ${SimpleTokenDetailsFragmentDoc}`;
export const AssetActivityPartsFragmentDoc = gql`
    fragment AssetActivityParts on AssetActivity {
  id
  timestamp
  chain
  details {
    __typename
    ... on TransactionDetails {
      ...TransactionDetailsParts
    }
    ... on SwapOrderDetails {
      ...SwapOrderDetailsParts
    }
    ... on OnRampTransactionDetails {
      ...OnRampTransactionDetailsParts
    }
    ... on OffRampTransactionDetails {
      ...OffRampTransactionDetailsParts
    }
  }
}
    ${TransactionDetailsPartsFragmentDoc}
${SwapOrderDetailsPartsFragmentDoc}
${OnRampTransactionDetailsPartsFragmentDoc}
${OffRampTransactionDetailsPartsFragmentDoc}`;
export const TokenPriceFragmentDoc = gql`
    fragment TokenPrice on Token {
  id
  project {
    id
    markets(currencies: [USD]) {
      id
      price {
        id
        value
      }
    }
    logo {
      id
      url
    }
  }
  market(currency: USD) {
    id
    price {
      id
      value
    }
  }
}
    `;
export const PoolTransactionTokenFragmentDoc = gql`
    fragment PoolTransactionToken on Token {
  id
  address
  symbol
  chain
  decimals
  project {
    id
    name
    logo {
      id
      url
    }
  }
}
    `;
export const QuickTokenBalancePartsFragmentDoc = gql`
    fragment QuickTokenBalanceParts on TokenBalance {
  id
  quantity
  denominatedValue {
    id
    value
    currency
  }
  token {
    id
    address
    chain
    standard
  }
}
    `;
export const PortfolioTokenBalancePartsFragmentDoc = gql`
    fragment PortfolioTokenBalanceParts on TokenBalance {
  id
  quantity
  denominatedValue {
    id
    currency
    value
  }
  token {
    ...SimpleTokenDetails
    id
    address
    chain
    symbol
    name
    decimals
    standard
    project {
      id
      name
      logo {
        id
        url
      }
      safetyLevel
      logoUrl
      isSpam
    }
  }
  tokenProjectMarket {
    id
    pricePercentChange(duration: DAY) {
      id
      value
    }
    tokenProject {
      id
      logoUrl
      isSpam
    }
  }
}
    ${SimpleTokenDetailsFragmentDoc}`;
export const CandlestickOhlcFragmentDoc = gql`
    fragment CandlestickOHLC on TimestampedOhlc {
  id
  timestamp
  open {
    id
    value
  }
  high {
    id
    value
  }
  low {
    id
    value
  }
  close {
    id
    value
  }
}
    `;
export const PriceHistoryFallbackFragmentDoc = gql`
    fragment PriceHistoryFallback on TimestampedAmount {
  id
  value
  timestamp
}
    `;
export const TransactionTokenFragmentDoc = gql`
    fragment TransactionToken on Token {
  id
  address
  symbol
  chain
  decimals
  project {
    id
    name
    tokens {
      id
      address
      symbol
      chain
    }
    logo {
      id
      url
    }
  }
}
    `;
export const PoolTxFragmentDoc = gql`
    fragment PoolTx on PoolTransaction {
  id
  chain
  protocolVersion
  timestamp
  hash
  account
  token0 {
    ...TransactionToken
  }
  token0Quantity
  token1 {
    ...TransactionToken
  }
  token1Quantity
  usdValue {
    id
    value
  }
  type
}
    ${TransactionTokenFragmentDoc}`;
export const TokenPriceHistoryDocument = gql`
    query TokenPriceHistory($contract: ContractInput!, $duration: HistoryDuration = DAY, $maxHistoryLength: Int = 1000) {
  tokenProjects(contracts: [$contract]) {
    id
    name
    markets(currencies: [USD]) {
      id
      price {
        value
      }
      pricePercentChange24h {
        value
      }
      priceHistory(duration: $duration, maxLength: $maxHistoryLength) {
        timestamp
        value
      }
    }
    tokens {
      id
      chain
      address
      symbol
      decimals
      market(currency: USD) {
        id
        price {
          value
        }
        pricePercentChange24h: pricePercentChange(duration: DAY) {
          value
        }
        priceHistory(duration: $duration, maxLength: $maxHistoryLength) {
          timestamp
          value
        }
      }
    }
  }
}
    `;

/**
 * __useTokenPriceHistoryQuery__
 *
 * To run a query within a React component, call `useTokenPriceHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenPriceHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenPriceHistoryQuery({
 *   variables: {
 *      contract: // value for 'contract'
 *      duration: // value for 'duration'
 *      maxHistoryLength: // value for 'maxHistoryLength'
 *   },
 * });
 */
export function useTokenPriceHistoryQuery(baseOptions: Apollo.QueryHookOptions<TokenPriceHistoryQuery, TokenPriceHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenPriceHistoryQuery, TokenPriceHistoryQueryVariables>(TokenPriceHistoryDocument, options);
      }
export function useTokenPriceHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenPriceHistoryQuery, TokenPriceHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenPriceHistoryQuery, TokenPriceHistoryQueryVariables>(TokenPriceHistoryDocument, options);
        }
export type TokenPriceHistoryQueryHookResult = ReturnType<typeof useTokenPriceHistoryQuery>;
export type TokenPriceHistoryLazyQueryHookResult = ReturnType<typeof useTokenPriceHistoryLazyQuery>;
export type TokenPriceHistoryQueryResult = Apollo.QueryResult<TokenPriceHistoryQuery, TokenPriceHistoryQueryVariables>;
export const AccountListDocument = gql`
    query AccountList($addresses: [String!]!, $valueModifiers: [PortfolioValueModifier!], $chains: [Chain!]) {
  portfolios(
    ownerAddresses: $addresses
    chains: $chains
    valueModifiers: $valueModifiers
  ) {
    id
    ownerAddress
    tokensTotalDenominatedValue {
      value
    }
  }
}
    `;

/**
 * __useAccountListQuery__
 *
 * To run a query within a React component, call `useAccountListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountListQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *      valueModifiers: // value for 'valueModifiers'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useAccountListQuery(baseOptions: Apollo.QueryHookOptions<AccountListQuery, AccountListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountListQuery, AccountListQueryVariables>(AccountListDocument, options);
      }
export function useAccountListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountListQuery, AccountListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountListQuery, AccountListQueryVariables>(AccountListDocument, options);
        }
export type AccountListQueryHookResult = ReturnType<typeof useAccountListQuery>;
export type AccountListLazyQueryHookResult = ReturnType<typeof useAccountListLazyQuery>;
export type AccountListQueryResult = Apollo.QueryResult<AccountListQuery, AccountListQueryVariables>;
export const NftsDocument = gql`
    query Nfts($ownerAddress: String!) {
  portfolios(ownerAddresses: [$ownerAddress]) {
    id
    nftBalances {
      id
      ownedAsset {
        id
        collection {
          id
          collectionId
          description
          image {
            id
            url
          }
          isVerified
          name
          numAssets
          markets(currencies: [USD]) {
            id
            floorPrice {
              value
            }
            owners
            volume24h {
              value
            }
            totalVolume {
              value
            }
          }
        }
        description
        image {
          id
          url
        }
        name
        nftContract {
          id
          address
          chain
          standard
        }
        thumbnail {
          id
          url
        }
        tokenId
        creator {
          id
          address
          username
        }
      }
    }
  }
}
    `;

/**
 * __useNftsQuery__
 *
 * To run a query within a React component, call `useNftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftsQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *   },
 * });
 */
export function useNftsQuery(baseOptions: Apollo.QueryHookOptions<NftsQuery, NftsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftsQuery, NftsQueryVariables>(NftsDocument, options);
      }
export function useNftsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftsQuery, NftsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftsQuery, NftsQueryVariables>(NftsDocument, options);
        }
export type NftsQueryHookResult = ReturnType<typeof useNftsQuery>;
export type NftsLazyQueryHookResult = ReturnType<typeof useNftsLazyQuery>;
export type NftsQueryResult = Apollo.QueryResult<NftsQuery, NftsQueryVariables>;
export const NftItemScreenDocument = gql`
    query NFTItemScreen($contractAddress: String!, $filter: NftAssetsFilterInput, $activityFilter: NftActivityFilterInput) {
  nftAssets(address: $contractAddress, filter: $filter) {
    edges {
      node {
        id
        ownerAddress
        collection {
          id
          collectionId
          description
          image {
            id
            url
          }
          isVerified
          name
          numAssets
          markets(currencies: [USD]) {
            id
            floorPrice {
              value
            }
            owners
            totalVolume {
              value
            }
          }
          nftContracts {
            id
            address
          }
        }
        description
        image {
          id
          url
          dimensions {
            width
            height
          }
        }
        name
        nftContract {
          id
          address
          chain
          standard
        }
        tokenId
        creator {
          id
          address
          username
        }
        traits {
          id
          name
          rarity
          value
        }
        listings(first: 1) {
          edges {
            node {
              id
              price {
                currency
                value
              }
            }
          }
        }
      }
    }
  }
  nftActivity(filter: $activityFilter) {
    edges {
      node {
        id
        quantity
        price {
          currency
          value
        }
      }
    }
  }
}
    `;

/**
 * __useNftItemScreenQuery__
 *
 * To run a query within a React component, call `useNftItemScreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftItemScreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftItemScreenQuery({
 *   variables: {
 *      contractAddress: // value for 'contractAddress'
 *      filter: // value for 'filter'
 *      activityFilter: // value for 'activityFilter'
 *   },
 * });
 */
export function useNftItemScreenQuery(baseOptions: Apollo.QueryHookOptions<NftItemScreenQuery, NftItemScreenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftItemScreenQuery, NftItemScreenQueryVariables>(NftItemScreenDocument, options);
      }
export function useNftItemScreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftItemScreenQuery, NftItemScreenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftItemScreenQuery, NftItemScreenQueryVariables>(NftItemScreenDocument, options);
        }
export type NftItemScreenQueryHookResult = ReturnType<typeof useNftItemScreenQuery>;
export type NftItemScreenLazyQueryHookResult = ReturnType<typeof useNftItemScreenLazyQuery>;
export type NftItemScreenQueryResult = Apollo.QueryResult<NftItemScreenQuery, NftItemScreenQueryVariables>;
export const NftCollectionScreenDocument = gql`
    query NftCollectionScreen($contractAddress: String!, $first: Int, $after: String) {
  nftCollections(filter: {addresses: [$contractAddress]}) {
    edges {
      node {
        id
        bannerImage {
          id
          url
        }
        isVerified
        numAssets
        description
        homepageUrl
        twitterName
        image {
          id
          url
        }
        name
        markets(currencies: [USD]) {
          id
          floorPrice {
            value
          }
          owners
          volume24h {
            value
          }
          totalVolume {
            value
          }
        }
      }
    }
  }
  nftAssets(
    address: $contractAddress
    first: $first
    after: $after
    orderBy: PRICE
    asc: true
  ) {
    edges {
      node {
        ownerAddress
        id
        name
        tokenId
        nftContract {
          id
          address
        }
        collection {
          id
          collectionId
          name
        }
        image {
          id
          url
          dimensions {
            width
            height
          }
        }
        listings(first: 1) {
          edges {
            node {
              id
              price {
                currency
                value
              }
            }
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useNftCollectionScreenQuery__
 *
 * To run a query within a React component, call `useNftCollectionScreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftCollectionScreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftCollectionScreenQuery({
 *   variables: {
 *      contractAddress: // value for 'contractAddress'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useNftCollectionScreenQuery(baseOptions: Apollo.QueryHookOptions<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>(NftCollectionScreenDocument, options);
      }
export function useNftCollectionScreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>(NftCollectionScreenDocument, options);
        }
export type NftCollectionScreenQueryHookResult = ReturnType<typeof useNftCollectionScreenQuery>;
export type NftCollectionScreenLazyQueryHookResult = ReturnType<typeof useNftCollectionScreenLazyQuery>;
export type NftCollectionScreenQueryResult = Apollo.QueryResult<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>;
export const NftsTabDocument = gql`
    query NftsTab($ownerAddress: String!, $first: Int, $after: String, $filter: NftBalancesFilterInput, $chains: [Chain!]!) {
  nftBalances(
    ownerAddress: $ownerAddress
    chains: $chains
    first: $first
    after: $after
    filter: $filter
  ) {
    edges {
      node {
        ownedAsset {
          chain
          id
          collection {
            id
            name
            isVerified
            markets(currencies: [ETH]) {
              id
              floorPrice {
                value
              }
            }
          }
          image {
            id
            url
            dimensions {
              width
              height
            }
          }
          thumbnail {
            id
            url
          }
          name
          tokenId
          description
          nftContract {
            id
            address
          }
          isSpam
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useNftsTabQuery__
 *
 * To run a query within a React component, call `useNftsTabQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftsTabQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftsTabQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      filter: // value for 'filter'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useNftsTabQuery(baseOptions: Apollo.QueryHookOptions<NftsTabQuery, NftsTabQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftsTabQuery, NftsTabQueryVariables>(NftsTabDocument, options);
      }
export function useNftsTabLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftsTabQuery, NftsTabQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftsTabQuery, NftsTabQueryVariables>(NftsTabDocument, options);
        }
export type NftsTabQueryHookResult = ReturnType<typeof useNftsTabQuery>;
export type NftsTabLazyQueryHookResult = ReturnType<typeof useNftsTabLazyQuery>;
export type NftsTabQueryResult = Apollo.QueryResult<NftsTabQuery, NftsTabQueryVariables>;
export const PortfolioBalancesDocument = gql`
    query PortfolioBalances($ownerAddress: String!, $valueModifiers: [PortfolioValueModifier!], $chains: [Chain!]!) {
  portfolios(
    ownerAddresses: [$ownerAddress]
    chains: $chains
    valueModifiers: $valueModifiers
  ) {
    id
    tokensTotalDenominatedValue {
      value
    }
    tokensTotalDenominatedValueChange(duration: DAY) {
      absolute {
        value
      }
      percentage {
        value
      }
    }
    tokenBalances {
      ...TokenBalanceParts
    }
  }
}
    ${TokenBalancePartsFragmentDoc}`;

/**
 * __usePortfolioBalancesQuery__
 *
 * To run a query within a React component, call `usePortfolioBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioBalancesQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *      valueModifiers: // value for 'valueModifiers'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function usePortfolioBalancesQuery(baseOptions: Apollo.QueryHookOptions<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>(PortfolioBalancesDocument, options);
      }
export function usePortfolioBalancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>(PortfolioBalancesDocument, options);
        }
export type PortfolioBalancesQueryHookResult = ReturnType<typeof usePortfolioBalancesQuery>;
export type PortfolioBalancesLazyQueryHookResult = ReturnType<typeof usePortfolioBalancesLazyQuery>;
export type PortfolioBalancesQueryResult = Apollo.QueryResult<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>;
export const MultiplePortfolioBalancesDocument = gql`
    query MultiplePortfolioBalances($ownerAddresses: [String!]!, $valueModifiers: [PortfolioValueModifier!], $chains: [Chain!]!) {
  portfolios(
    ownerAddresses: $ownerAddresses
    chains: $chains
    valueModifiers: $valueModifiers
  ) {
    id
    tokensTotalDenominatedValue {
      value
    }
    tokensTotalDenominatedValueChange(duration: DAY) {
      absolute {
        value
      }
      percentage {
        value
      }
    }
    tokenBalances {
      id
      quantity
      isHidden
      denominatedValue {
        currency
        value
      }
      token {
        ...TokenBasicInfoParts
        ...TokenBasicProjectParts
      }
      tokenProjectMarket {
        relativeChange24: pricePercentChange(duration: DAY) {
          value
        }
      }
    }
  }
}
    ${TokenBasicInfoPartsFragmentDoc}
${TokenBasicProjectPartsFragmentDoc}`;

/**
 * __useMultiplePortfolioBalancesQuery__
 *
 * To run a query within a React component, call `useMultiplePortfolioBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMultiplePortfolioBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMultiplePortfolioBalancesQuery({
 *   variables: {
 *      ownerAddresses: // value for 'ownerAddresses'
 *      valueModifiers: // value for 'valueModifiers'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useMultiplePortfolioBalancesQuery(baseOptions: Apollo.QueryHookOptions<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>(MultiplePortfolioBalancesDocument, options);
      }
export function useMultiplePortfolioBalancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>(MultiplePortfolioBalancesDocument, options);
        }
export type MultiplePortfolioBalancesQueryHookResult = ReturnType<typeof useMultiplePortfolioBalancesQuery>;
export type MultiplePortfolioBalancesLazyQueryHookResult = ReturnType<typeof useMultiplePortfolioBalancesLazyQuery>;
export type MultiplePortfolioBalancesQueryResult = Apollo.QueryResult<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>;
export const SelectWalletScreenDocument = gql`
    query SelectWalletScreen($ownerAddresses: [String!]!, $valueModifiers: [PortfolioValueModifier!], $chains: [Chain!]!) {
  portfolios(
    ownerAddresses: $ownerAddresses
    chains: $chains
    valueModifiers: $valueModifiers
  ) {
    id
    ownerAddress
    tokensTotalDenominatedValue {
      value
    }
  }
}
    `;

/**
 * __useSelectWalletScreenQuery__
 *
 * To run a query within a React component, call `useSelectWalletScreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelectWalletScreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelectWalletScreenQuery({
 *   variables: {
 *      ownerAddresses: // value for 'ownerAddresses'
 *      valueModifiers: // value for 'valueModifiers'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useSelectWalletScreenQuery(baseOptions: Apollo.QueryHookOptions<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>(SelectWalletScreenDocument, options);
      }
export function useSelectWalletScreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>(SelectWalletScreenDocument, options);
        }
export type SelectWalletScreenQueryHookResult = ReturnType<typeof useSelectWalletScreenQuery>;
export type SelectWalletScreenLazyQueryHookResult = ReturnType<typeof useSelectWalletScreenLazyQuery>;
export type SelectWalletScreenQueryResult = Apollo.QueryResult<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>;
export const TransactionHistoryUpdaterDocument = gql`
    query TransactionHistoryUpdater($addresses: [String!]!, $onRampAuth: OnRampTransactionsAuth, $chains: [Chain!]!) {
  portfolios(ownerAddresses: $addresses, chains: $chains) {
    id
    ownerAddress
    assetActivities(
      pageSize: 1
      page: 1
      chains: $chains
      onRampTransactionsAuth: $onRampAuth
      includeBridging: true
    ) {
      id
      timestamp
      details {
        ... on TransactionDetails {
          id
          hash
        }
      }
    }
  }
}
    `;

/**
 * __useTransactionHistoryUpdaterQuery__
 *
 * To run a query within a React component, call `useTransactionHistoryUpdaterQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionHistoryUpdaterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionHistoryUpdaterQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *      onRampAuth: // value for 'onRampAuth'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useTransactionHistoryUpdaterQuery(baseOptions: Apollo.QueryHookOptions<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>(TransactionHistoryUpdaterDocument, options);
      }
export function useTransactionHistoryUpdaterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>(TransactionHistoryUpdaterDocument, options);
        }
export type TransactionHistoryUpdaterQueryHookResult = ReturnType<typeof useTransactionHistoryUpdaterQuery>;
export type TransactionHistoryUpdaterLazyQueryHookResult = ReturnType<typeof useTransactionHistoryUpdaterLazyQuery>;
export type TransactionHistoryUpdaterQueryResult = Apollo.QueryResult<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>;
export const TokenDocument = gql`
    query Token($chain: Chain!, $address: String) {
  token(chain: $chain, address: $address) {
    ...TokenParts
  }
}
    ${TokenPartsFragmentDoc}`;

/**
 * __useTokenQuery__
 *
 * To run a query within a React component, call `useTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenQuery(baseOptions: Apollo.QueryHookOptions<TokenQuery, TokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenQuery, TokenQueryVariables>(TokenDocument, options);
      }
export function useTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenQuery, TokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenQuery, TokenQueryVariables>(TokenDocument, options);
        }
export type TokenQueryHookResult = ReturnType<typeof useTokenQuery>;
export type TokenLazyQueryHookResult = ReturnType<typeof useTokenLazyQuery>;
export type TokenQueryResult = Apollo.QueryResult<TokenQuery, TokenQueryVariables>;
export const TokenDetailsScreenDocument = gql`
    query TokenDetailsScreen($chain: Chain!, $address: String) {
  token(chain: $chain, address: $address) {
    ...TokenParts
    ...TokenMarketParts
    ...TokenBasicProjectParts
    ...TokenProjectUrlsParts
    ...TokenProjectMarketsParts
  }
}
    ${TokenPartsFragmentDoc}
${TokenMarketPartsFragmentDoc}
${TokenBasicProjectPartsFragmentDoc}
${TokenProjectUrlsPartsFragmentDoc}
${TokenProjectMarketsPartsFragmentDoc}`;

/**
 * __useTokenDetailsScreenQuery__
 *
 * To run a query within a React component, call `useTokenDetailsScreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenDetailsScreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenDetailsScreenQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenDetailsScreenQuery(baseOptions: Apollo.QueryHookOptions<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>(TokenDetailsScreenDocument, options);
      }
export function useTokenDetailsScreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>(TokenDetailsScreenDocument, options);
        }
export type TokenDetailsScreenQueryHookResult = ReturnType<typeof useTokenDetailsScreenQuery>;
export type TokenDetailsScreenLazyQueryHookResult = ReturnType<typeof useTokenDetailsScreenLazyQuery>;
export type TokenDetailsScreenQueryResult = Apollo.QueryResult<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>;
export const TokenProjectDescriptionDocument = gql`
    query TokenProjectDescription($chain: Chain!, $address: String, $includeSpanish: Boolean = false, $includeFrench: Boolean = false, $includeJapanese: Boolean = false, $includePortuguese: Boolean = false, $includeVietnamese: Boolean = false, $includeChineseSimplified: Boolean = false, $includeChineseTraditional: Boolean = false) {
  token(chain: $chain, address: $address) {
    chain
    address
    project {
      id
      description
      descriptionTranslations {
        descriptionEsEs @include(if: $includeSpanish)
        descriptionFrFr @include(if: $includeFrench)
        descriptionJaJp @include(if: $includeJapanese)
        descriptionPtPt @include(if: $includePortuguese)
        descriptionViVn @include(if: $includeVietnamese)
        descriptionZhHans @include(if: $includeChineseSimplified)
        descriptionZhHant @include(if: $includeChineseTraditional)
      }
    }
  }
}
    `;

/**
 * __useTokenProjectDescriptionQuery__
 *
 * To run a query within a React component, call `useTokenProjectDescriptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenProjectDescriptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenProjectDescriptionQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      includeSpanish: // value for 'includeSpanish'
 *      includeFrench: // value for 'includeFrench'
 *      includeJapanese: // value for 'includeJapanese'
 *      includePortuguese: // value for 'includePortuguese'
 *      includeVietnamese: // value for 'includeVietnamese'
 *      includeChineseSimplified: // value for 'includeChineseSimplified'
 *      includeChineseTraditional: // value for 'includeChineseTraditional'
 *   },
 * });
 */
export function useTokenProjectDescriptionQuery(baseOptions: Apollo.QueryHookOptions<TokenProjectDescriptionQuery, TokenProjectDescriptionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenProjectDescriptionQuery, TokenProjectDescriptionQueryVariables>(TokenProjectDescriptionDocument, options);
      }
export function useTokenProjectDescriptionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenProjectDescriptionQuery, TokenProjectDescriptionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenProjectDescriptionQuery, TokenProjectDescriptionQueryVariables>(TokenProjectDescriptionDocument, options);
        }
export type TokenProjectDescriptionQueryHookResult = ReturnType<typeof useTokenProjectDescriptionQuery>;
export type TokenProjectDescriptionLazyQueryHookResult = ReturnType<typeof useTokenProjectDescriptionLazyQuery>;
export type TokenProjectDescriptionQueryResult = Apollo.QueryResult<TokenProjectDescriptionQuery, TokenProjectDescriptionQueryVariables>;
export const TokenProjectsDocument = gql`
    query TokenProjects($contracts: [ContractInput!]!) {
  tokenProjects(contracts: $contracts) {
    id
    logoUrl
    safetyLevel
    tokens {
      ...TokenBasicInfoParts
      ...TokenFeeDataParts
      ...TokenProtectionInfoParts
    }
  }
}
    ${TokenBasicInfoPartsFragmentDoc}
${TokenFeeDataPartsFragmentDoc}
${TokenProtectionInfoPartsFragmentDoc}`;

/**
 * __useTokenProjectsQuery__
 *
 * To run a query within a React component, call `useTokenProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenProjectsQuery({
 *   variables: {
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useTokenProjectsQuery(baseOptions: Apollo.QueryHookOptions<TokenProjectsQuery, TokenProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenProjectsQuery, TokenProjectsQueryVariables>(TokenProjectsDocument, options);
      }
export function useTokenProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenProjectsQuery, TokenProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenProjectsQuery, TokenProjectsQueryVariables>(TokenProjectsDocument, options);
        }
export type TokenProjectsQueryHookResult = ReturnType<typeof useTokenProjectsQuery>;
export type TokenProjectsLazyQueryHookResult = ReturnType<typeof useTokenProjectsLazyQuery>;
export type TokenProjectsQueryResult = Apollo.QueryResult<TokenProjectsQuery, TokenProjectsQueryVariables>;
export const TransactionListDocument = gql`
    query TransactionList($address: String!, $onRampAuth: OnRampTransactionsAuth, $chains: [Chain!]!, $pageSize: Int = 100) {
  portfolios(ownerAddresses: [$address], chains: $chains) {
    id
    assetActivities(
      pageSize: $pageSize
      page: 1
      includeOffChain: true
      includeBridging: true
      chains: $chains
      onRampTransactionsAuth: $onRampAuth
    ) {
      id
      timestamp
      chain
      details {
        ... on OnRampTransactionDetails {
          id
          status
          receiverAddress
          onRampTransfer {
            id
            transactionReferenceId
            externalSessionId
            token {
              ...TokenBasicInfoParts
              ...TokenBasicProjectParts
            }
            tokenStandard
            amount
            sourceCurrency
            sourceAmount
            serviceProvider {
              serviceProvider
              name
              url
              logoLightUrl
              logoDarkUrl
              supportUrl
            }
            networkFee
            transactionFee
            totalFee
          }
        }
        ... on TransactionDetails {
          id
          to
          type
          hash
          from
          status
          application {
            name
            address
            icon {
              url
            }
          }
          assetChanges {
            __typename
            ... on TokenTransfer {
              id
              asset {
                id
                symbol
                address
                decimals
                chain
                project {
                  id
                  isSpam
                  spamCode
                }
              }
              tokenStandard
              quantity
              sender
              recipient
              direction
              transactedValue {
                id
                currency
                value
              }
            }
            ... on NftTransfer {
              id
              asset {
                id
                name
                isSpam
                nftContract {
                  id
                  chain
                  address
                }
                tokenId
                image {
                  id
                  url
                }
                collection {
                  id
                  name
                }
              }
              nftStandard
              sender
              recipient
              direction
            }
            ... on OnRampTransfer {
              id
              transactionReferenceId
              externalSessionId
              token {
                ...TokenBasicInfoParts
                ...TokenBasicProjectParts
              }
              tokenStandard
              amount
              sourceCurrency
              sourceAmount
              serviceProvider {
                serviceProvider
                name
                url
                logoLightUrl
                logoDarkUrl
                supportUrl
              }
              networkFee
              transactionFee
              totalFee
            }
            ... on TokenApproval {
              id
              asset {
                id
                symbol
                decimals
                address
                chain
              }
              tokenStandard
              approvedAddress
              quantity
            }
          }
          networkFee {
            quantity
            tokenSymbol
            tokenAddress
            tokenChain
          }
        }
        ... on SwapOrderDetails {
          id
          offerer
          hash
          orderStatus: swapOrderStatus
          expiry
          swapOrderType
          encodedOrder
          inputToken {
            id
            symbol
            address
            decimals
            chain
          }
          inputTokenQuantity
          outputToken {
            id
            symbol
            address
            decimals
            chain
          }
          outputTokenQuantity
        }
      }
    }
  }
}
    ${TokenBasicInfoPartsFragmentDoc}
${TokenBasicProjectPartsFragmentDoc}`;

/**
 * __useTransactionListQuery__
 *
 * To run a query within a React component, call `useTransactionListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionListQuery({
 *   variables: {
 *      address: // value for 'address'
 *      onRampAuth: // value for 'onRampAuth'
 *      chains: // value for 'chains'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useTransactionListQuery(baseOptions: Apollo.QueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, options);
      }
export function useTransactionListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, options);
        }
export type TransactionListQueryHookResult = ReturnType<typeof useTransactionListQuery>;
export type TransactionListLazyQueryHookResult = ReturnType<typeof useTransactionListLazyQuery>;
export type TransactionListQueryResult = Apollo.QueryResult<TransactionListQuery, TransactionListQueryVariables>;
export const FeedTransactionListDocument = gql`
    query FeedTransactionList($addresses: [String!]!, $chains: [Chain!]!) {
  portfolios(ownerAddresses: $addresses, chains: $chains) {
    id
    ownerAddress
    assetActivities(pageSize: 30, includeBridging: true, page: 1, chains: $chains) {
      id
      timestamp
      chain
      details {
        ... on TransactionDetails {
          id
          to
          type
          hash
          from
          status
          assetChanges {
            __typename
            ... on TokenTransfer {
              id
              asset {
                id
                symbol
                address
                decimals
                chain
                project {
                  id
                  isSpam
                  spamCode
                }
              }
              tokenStandard
              quantity
              sender
              recipient
              direction
              transactedValue {
                currency
                value
              }
            }
            ... on NftTransfer {
              id
              asset {
                id
                name
                isSpam
                nftContract {
                  id
                  chain
                  address
                }
                tokenId
                image {
                  id
                  url
                }
                collection {
                  id
                  name
                }
              }
              nftStandard
              sender
              recipient
              direction
            }
            ... on TokenApproval {
              id
              asset {
                id
                symbol
                decimals
                address
                chain
              }
              tokenStandard
              approvedAddress
              quantity
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useFeedTransactionListQuery__
 *
 * To run a query within a React component, call `useFeedTransactionListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedTransactionListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedTransactionListQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useFeedTransactionListQuery(baseOptions: Apollo.QueryHookOptions<FeedTransactionListQuery, FeedTransactionListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FeedTransactionListQuery, FeedTransactionListQueryVariables>(FeedTransactionListDocument, options);
      }
export function useFeedTransactionListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeedTransactionListQuery, FeedTransactionListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FeedTransactionListQuery, FeedTransactionListQueryVariables>(FeedTransactionListDocument, options);
        }
export type FeedTransactionListQueryHookResult = ReturnType<typeof useFeedTransactionListQuery>;
export type FeedTransactionListLazyQueryHookResult = ReturnType<typeof useFeedTransactionListLazyQuery>;
export type FeedTransactionListQueryResult = Apollo.QueryResult<FeedTransactionListQuery, FeedTransactionListQueryVariables>;
export const TopTokensDocument = gql`
    query TopTokens($chain: Chain, $page: Int = 1, $pageSize: Int = 100, $orderBy: TokenSortableField = POPULARITY) {
  topTokens(chain: $chain, page: $page, pageSize: $pageSize, orderBy: $orderBy) {
    ...TokenParts
  }
}
    ${TokenPartsFragmentDoc}`;

/**
 * __useTopTokensQuery__
 *
 * To run a query within a React component, call `useTopTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopTokensQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useTopTokensQuery(baseOptions?: Apollo.QueryHookOptions<TopTokensQuery, TopTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopTokensQuery, TopTokensQueryVariables>(TopTokensDocument, options);
      }
export function useTopTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopTokensQuery, TopTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopTokensQuery, TopTokensQueryVariables>(TopTokensDocument, options);
        }
export type TopTokensQueryHookResult = ReturnType<typeof useTopTokensQuery>;
export type TopTokensLazyQueryHookResult = ReturnType<typeof useTopTokensLazyQuery>;
export type TopTokensQueryResult = Apollo.QueryResult<TopTokensQuery, TopTokensQueryVariables>;
export const HomeScreenTokensDocument = gql`
    query HomeScreenTokens($contracts: [ContractInput!]!, $chain: Chain!) {
  tokens(contracts: $contracts) {
    ...HomeScreenTokenParts
  }
  eth: token(address: null, chain: $chain) {
    ...HomeScreenTokenParts
  }
}
    ${HomeScreenTokenPartsFragmentDoc}`;

/**
 * __useHomeScreenTokensQuery__
 *
 * To run a query within a React component, call `useHomeScreenTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeScreenTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeScreenTokensQuery({
 *   variables: {
 *      contracts: // value for 'contracts'
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useHomeScreenTokensQuery(baseOptions: Apollo.QueryHookOptions<HomeScreenTokensQuery, HomeScreenTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HomeScreenTokensQuery, HomeScreenTokensQueryVariables>(HomeScreenTokensDocument, options);
      }
export function useHomeScreenTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomeScreenTokensQuery, HomeScreenTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HomeScreenTokensQuery, HomeScreenTokensQueryVariables>(HomeScreenTokensDocument, options);
        }
export type HomeScreenTokensQueryHookResult = ReturnType<typeof useHomeScreenTokensQuery>;
export type HomeScreenTokensLazyQueryHookResult = ReturnType<typeof useHomeScreenTokensLazyQuery>;
export type HomeScreenTokensQueryResult = Apollo.QueryResult<HomeScreenTokensQuery, HomeScreenTokensQueryVariables>;
export const FavoriteTokenCardDocument = gql`
    query FavoriteTokenCard($chain: Chain!, $address: String) {
  token(chain: $chain, address: $address) {
    ...TokenBasicInfoParts
    ...TokenBasicProjectParts
    ...TokenProjectMarketsParts
    market(currency: USD) {
      id
      price {
        value
      }
      pricePercentChange(duration: DAY) {
        value
      }
    }
  }
}
    ${TokenBasicInfoPartsFragmentDoc}
${TokenBasicProjectPartsFragmentDoc}
${TokenProjectMarketsPartsFragmentDoc}`;

/**
 * __useFavoriteTokenCardQuery__
 *
 * To run a query within a React component, call `useFavoriteTokenCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useFavoriteTokenCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFavoriteTokenCardQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useFavoriteTokenCardQuery(baseOptions: Apollo.QueryHookOptions<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>(FavoriteTokenCardDocument, options);
      }
export function useFavoriteTokenCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>(FavoriteTokenCardDocument, options);
        }
export type FavoriteTokenCardQueryHookResult = ReturnType<typeof useFavoriteTokenCardQuery>;
export type FavoriteTokenCardLazyQueryHookResult = ReturnType<typeof useFavoriteTokenCardLazyQuery>;
export type FavoriteTokenCardQueryResult = Apollo.QueryResult<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>;
export const WidgetTokensDocument = gql`
    query WidgetTokens($contracts: [ContractInput!]!) {
  tokens(contracts: $contracts) {
    symbol
    chain
    address
    name
  }
}
    `;

/**
 * __useWidgetTokensQuery__
 *
 * To run a query within a React component, call `useWidgetTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useWidgetTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWidgetTokensQuery({
 *   variables: {
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useWidgetTokensQuery(baseOptions: Apollo.QueryHookOptions<WidgetTokensQuery, WidgetTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WidgetTokensQuery, WidgetTokensQueryVariables>(WidgetTokensDocument, options);
      }
export function useWidgetTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WidgetTokensQuery, WidgetTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WidgetTokensQuery, WidgetTokensQueryVariables>(WidgetTokensDocument, options);
        }
export type WidgetTokensQueryHookResult = ReturnType<typeof useWidgetTokensQuery>;
export type WidgetTokensLazyQueryHookResult = ReturnType<typeof useWidgetTokensLazyQuery>;
export type WidgetTokensQueryResult = Apollo.QueryResult<WidgetTokensQuery, WidgetTokensQueryVariables>;
export const TokensDocument = gql`
    query Tokens($contracts: [ContractInput!]!) {
  tokens(contracts: $contracts) {
    ...TokenParts
  }
}
    ${TokenPartsFragmentDoc}`;

/**
 * __useTokensQuery__
 *
 * To run a query within a React component, call `useTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokensQuery({
 *   variables: {
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useTokensQuery(baseOptions: Apollo.QueryHookOptions<TokensQuery, TokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokensQuery, TokensQueryVariables>(TokensDocument, options);
      }
export function useTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokensQuery, TokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokensQuery, TokensQueryVariables>(TokensDocument, options);
        }
export type TokensQueryHookResult = ReturnType<typeof useTokensQuery>;
export type TokensLazyQueryHookResult = ReturnType<typeof useTokensLazyQuery>;
export type TokensQueryResult = Apollo.QueryResult<TokensQuery, TokensQueryVariables>;
export const ConvertDocument = gql`
    query Convert($fromCurrency: Currency!, $toCurrency: Currency!) {
  convert(
    fromAmount: {currency: $fromCurrency, value: 1.0}
    toCurrency: $toCurrency
  ) {
    value
    currency
  }
}
    `;

/**
 * __useConvertQuery__
 *
 * To run a query within a React component, call `useConvertQuery` and pass it any options that fit your needs.
 * When your component renders, `useConvertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConvertQuery({
 *   variables: {
 *      fromCurrency: // value for 'fromCurrency'
 *      toCurrency: // value for 'toCurrency'
 *   },
 * });
 */
export function useConvertQuery(baseOptions: Apollo.QueryHookOptions<ConvertQuery, ConvertQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConvertQuery, ConvertQueryVariables>(ConvertDocument, options);
      }
export function useConvertLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConvertQuery, ConvertQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConvertQuery, ConvertQueryVariables>(ConvertDocument, options);
        }
export type ConvertQueryHookResult = ReturnType<typeof useConvertQuery>;
export type ConvertLazyQueryHookResult = ReturnType<typeof useConvertLazyQuery>;
export type ConvertQueryResult = Apollo.QueryResult<ConvertQuery, ConvertQueryVariables>;
export const RecentTokenTransfersDocument = gql`
    query RecentTokenTransfers($address: String!, $chains: [Chain!]) {
  portfolios(ownerAddresses: [$address], chains: $chains) {
    id
    ownerAddress
    assetActivities(pageSize: 100, page: 1, chains: $chains) {
      id
      timestamp
      chain
      details {
        ... on TransactionDetails {
          to
          type
          hash
          from
          status
          assetChanges {
            __typename
            ... on TokenTransfer {
              id
              asset {
                id
                symbol
                address
                decimals
                chain
                project {
                  id
                  isSpam
                  spamCode
                }
              }
              tokenStandard
              quantity
              sender
              recipient
              direction
              transactedValue {
                currency
                value
              }
            }
            ... on NftTransfer {
              id
              asset {
                id
                name
                isSpam
                nftContract {
                  id
                  chain
                  address
                }
                tokenId
                image {
                  id
                  url
                }
                collection {
                  id
                  name
                }
              }
              nftStandard
              sender
              recipient
              direction
            }
            ... on TokenApproval {
              id
              asset {
                id
                symbol
                decimals
                address
                chain
              }
              tokenStandard
              approvedAddress
              quantity
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useRecentTokenTransfersQuery__
 *
 * To run a query within a React component, call `useRecentTokenTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentTokenTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentTokenTransfersQuery({
 *   variables: {
 *      address: // value for 'address'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useRecentTokenTransfersQuery(baseOptions: Apollo.QueryHookOptions<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>(RecentTokenTransfersDocument, options);
      }
export function useRecentTokenTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>(RecentTokenTransfersDocument, options);
        }
export type RecentTokenTransfersQueryHookResult = ReturnType<typeof useRecentTokenTransfersQuery>;
export type RecentTokenTransfersLazyQueryHookResult = ReturnType<typeof useRecentTokenTransfersLazyQuery>;
export type RecentTokenTransfersQueryResult = Apollo.QueryResult<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>;
export const TokenSpotPriceDocument = gql`
    query TokenSpotPrice($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    name
    symbol
    project {
      id
      markets(currencies: [USD]) {
        id
        price {
          id
          value
        }
      }
    }
  }
}
    `;

/**
 * __useTokenSpotPriceQuery__
 *
 * To run a query within a React component, call `useTokenSpotPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenSpotPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenSpotPriceQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenSpotPriceQuery(baseOptions: Apollo.QueryHookOptions<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>(TokenSpotPriceDocument, options);
      }
export function useTokenSpotPriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>(TokenSpotPriceDocument, options);
        }
export type TokenSpotPriceQueryHookResult = ReturnType<typeof useTokenSpotPriceQuery>;
export type TokenSpotPriceLazyQueryHookResult = ReturnType<typeof useTokenSpotPriceLazyQuery>;
export type TokenSpotPriceQueryResult = Apollo.QueryResult<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>;
export const UniswapPricesDocument = gql`
    query UniswapPrices($contracts: [ContractInput!]!) {
  tokens(contracts: $contracts) {
    id
    address
    chain
    standard
    project {
      id
      markets(currencies: [USD]) {
        id
        price {
          id
          value
        }
      }
    }
  }
}
    `;

/**
 * __useUniswapPricesQuery__
 *
 * To run a query within a React component, call `useUniswapPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUniswapPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUniswapPricesQuery({
 *   variables: {
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useUniswapPricesQuery(baseOptions: Apollo.QueryHookOptions<UniswapPricesQuery, UniswapPricesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UniswapPricesQuery, UniswapPricesQueryVariables>(UniswapPricesDocument, options);
      }
export function useUniswapPricesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UniswapPricesQuery, UniswapPricesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UniswapPricesQuery, UniswapPricesQueryVariables>(UniswapPricesDocument, options);
        }
export type UniswapPricesQueryHookResult = ReturnType<typeof useUniswapPricesQuery>;
export type UniswapPricesLazyQueryHookResult = ReturnType<typeof useUniswapPricesLazyQuery>;
export type UniswapPricesQueryResult = Apollo.QueryResult<UniswapPricesQuery, UniswapPricesQueryVariables>;
export const ActivityWebDocument = gql`
    query ActivityWeb($account: String!, $chains: [Chain!]!, $onRampTransactionIDs: [String!], $includeOffChain: Boolean!, $page: Int = 1, $pageSize: Int = 100) {
  portfolios(ownerAddresses: [$account], chains: $chains) {
    id
    assetActivities(
      pageSize: $pageSize
      page: $page
      includeOffChain: $includeOffChain
      chains: $chains
      onRampTransactionIDs: $onRampTransactionIDs
      includeBridging: true
    ) {
      ...AssetActivityParts
    }
  }
}
    ${AssetActivityPartsFragmentDoc}`;

/**
 * __useActivityWebQuery__
 *
 * To run a query within a React component, call `useActivityWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivityWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivityWebQuery({
 *   variables: {
 *      account: // value for 'account'
 *      chains: // value for 'chains'
 *      onRampTransactionIDs: // value for 'onRampTransactionIDs'
 *      includeOffChain: // value for 'includeOffChain'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useActivityWebQuery(baseOptions: Apollo.QueryHookOptions<ActivityWebQuery, ActivityWebQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ActivityWebQuery, ActivityWebQueryVariables>(ActivityWebDocument, options);
      }
export function useActivityWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActivityWebQuery, ActivityWebQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ActivityWebQuery, ActivityWebQueryVariables>(ActivityWebDocument, options);
        }
export type ActivityWebQueryHookResult = ReturnType<typeof useActivityWebQuery>;
export type ActivityWebLazyQueryHookResult = ReturnType<typeof useActivityWebLazyQuery>;
export type ActivityWebQueryResult = Apollo.QueryResult<ActivityWebQuery, ActivityWebQueryVariables>;
export const OnAssetActivityDocument = gql`
    subscription OnAssetActivity($subscriptionId: ID!, $account: String!) {
  onAssetActivity(subscriptionId: $subscriptionId, addresses: [$account]) {
    ...AssetActivityParts
  }
}
    ${AssetActivityPartsFragmentDoc}`;

/**
 * __useOnAssetActivitySubscription__
 *
 * To run a query within a React component, call `useOnAssetActivitySubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnAssetActivitySubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnAssetActivitySubscription({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *      account: // value for 'account'
 *   },
 * });
 */
export function useOnAssetActivitySubscription(baseOptions: Apollo.SubscriptionHookOptions<OnAssetActivitySubscription, OnAssetActivitySubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnAssetActivitySubscription, OnAssetActivitySubscriptionVariables>(OnAssetActivityDocument, options);
      }
export type OnAssetActivitySubscriptionHookResult = ReturnType<typeof useOnAssetActivitySubscription>;
export type OnAssetActivitySubscriptionResult = Apollo.SubscriptionResult<OnAssetActivitySubscription>;
export const AllV3TicksDocument = gql`
    query AllV3Ticks($chain: Chain!, $address: String!, $skip: Int, $first: Int) {
  v3Pool(chain: $chain, address: $address) {
    id
    ticks(skip: $skip, first: $first) {
      tick: tickIdx
      liquidityNet
      price0
      price1
    }
  }
}
    `;

/**
 * __useAllV3TicksQuery__
 *
 * To run a query within a React component, call `useAllV3TicksQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllV3TicksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllV3TicksQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useAllV3TicksQuery(baseOptions: Apollo.QueryHookOptions<AllV3TicksQuery, AllV3TicksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllV3TicksQuery, AllV3TicksQueryVariables>(AllV3TicksDocument, options);
      }
export function useAllV3TicksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllV3TicksQuery, AllV3TicksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllV3TicksQuery, AllV3TicksQueryVariables>(AllV3TicksDocument, options);
        }
export type AllV3TicksQueryHookResult = ReturnType<typeof useAllV3TicksQuery>;
export type AllV3TicksLazyQueryHookResult = ReturnType<typeof useAllV3TicksLazyQuery>;
export type AllV3TicksQueryResult = Apollo.QueryResult<AllV3TicksQuery, AllV3TicksQueryVariables>;
export const AllV4TicksDocument = gql`
    query AllV4Ticks($chain: Chain!, $poolId: String!, $skip: Int, $first: Int) {
  v4Pool(chain: $chain, poolId: $poolId) {
    id
    ticks(skip: $skip, first: $first) {
      tick: tickIdx
      liquidityNet
      price0
      price1
    }
  }
}
    `;

/**
 * __useAllV4TicksQuery__
 *
 * To run a query within a React component, call `useAllV4TicksQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllV4TicksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllV4TicksQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      poolId: // value for 'poolId'
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useAllV4TicksQuery(baseOptions: Apollo.QueryHookOptions<AllV4TicksQuery, AllV4TicksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllV4TicksQuery, AllV4TicksQueryVariables>(AllV4TicksDocument, options);
      }
export function useAllV4TicksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllV4TicksQuery, AllV4TicksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllV4TicksQuery, AllV4TicksQueryVariables>(AllV4TicksDocument, options);
        }
export type AllV4TicksQueryHookResult = ReturnType<typeof useAllV4TicksQuery>;
export type AllV4TicksLazyQueryHookResult = ReturnType<typeof useAllV4TicksLazyQuery>;
export type AllV4TicksQueryResult = Apollo.QueryResult<AllV4TicksQuery, AllV4TicksQueryVariables>;
export const FeeTierDistributionDocument = gql`
    query FeeTierDistribution($chain: Chain!, $token0: String!, $token1: String!) {
  v3PoolsForTokenPair(chain: $chain, token0: $token0, token1: $token1) {
    feeTier
    token0Supply
    token1Supply
  }
}
    `;

/**
 * __useFeeTierDistributionQuery__
 *
 * To run a query within a React component, call `useFeeTierDistributionQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeeTierDistributionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeeTierDistributionQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      token0: // value for 'token0'
 *      token1: // value for 'token1'
 *   },
 * });
 */
export function useFeeTierDistributionQuery(baseOptions: Apollo.QueryHookOptions<FeeTierDistributionQuery, FeeTierDistributionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FeeTierDistributionQuery, FeeTierDistributionQueryVariables>(FeeTierDistributionDocument, options);
      }
export function useFeeTierDistributionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeeTierDistributionQuery, FeeTierDistributionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FeeTierDistributionQuery, FeeTierDistributionQueryVariables>(FeeTierDistributionDocument, options);
        }
export type FeeTierDistributionQueryHookResult = ReturnType<typeof useFeeTierDistributionQuery>;
export type FeeTierDistributionLazyQueryHookResult = ReturnType<typeof useFeeTierDistributionLazyQuery>;
export type FeeTierDistributionQueryResult = Apollo.QueryResult<FeeTierDistributionQuery, FeeTierDistributionQueryVariables>;
export const TokenPromoDocument = gql`
    query TokenPromo($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    market(currency: USD) {
      id
      price {
        id
        value
      }
      pricePercentChange(duration: DAY) {
        id
        value
      }
    }
  }
}
    `;

/**
 * __useTokenPromoQuery__
 *
 * To run a query within a React component, call `useTokenPromoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenPromoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenPromoQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenPromoQuery(baseOptions: Apollo.QueryHookOptions<TokenPromoQuery, TokenPromoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenPromoQuery, TokenPromoQueryVariables>(TokenPromoDocument, options);
      }
export function useTokenPromoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenPromoQuery, TokenPromoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenPromoQuery, TokenPromoQueryVariables>(TokenPromoDocument, options);
        }
export type TokenPromoQueryHookResult = ReturnType<typeof useTokenPromoQuery>;
export type TokenPromoLazyQueryHookResult = ReturnType<typeof useTokenPromoLazyQuery>;
export type TokenPromoQueryResult = Apollo.QueryResult<TokenPromoQuery, TokenPromoQueryVariables>;
export const CollectionPromoDocument = gql`
    query CollectionPromo($addresses: [String!]!) {
  nftCollections(filter: {addresses: $addresses}) {
    edges {
      node {
        markets(currencies: ETH) {
          floorPricePercentChange(duration: DAY) {
            value
          }
        }
      }
    }
  }
}
    `;

/**
 * __useCollectionPromoQuery__
 *
 * To run a query within a React component, call `useCollectionPromoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionPromoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionPromoQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useCollectionPromoQuery(baseOptions: Apollo.QueryHookOptions<CollectionPromoQuery, CollectionPromoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionPromoQuery, CollectionPromoQueryVariables>(CollectionPromoDocument, options);
      }
export function useCollectionPromoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPromoQuery, CollectionPromoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionPromoQuery, CollectionPromoQueryVariables>(CollectionPromoDocument, options);
        }
export type CollectionPromoQueryHookResult = ReturnType<typeof useCollectionPromoQuery>;
export type CollectionPromoLazyQueryHookResult = ReturnType<typeof useCollectionPromoLazyQuery>;
export type CollectionPromoQueryResult = Apollo.QueryResult<CollectionPromoQuery, CollectionPromoQueryVariables>;
export const DailyProtocolVolumeDocument = gql`
    query DailyProtocolVolume($version: ProtocolVersion!) {
  historicalProtocolVolume(chain: ETHEREUM, version: $version, duration: MONTH) {
    value
  }
}
    `;

/**
 * __useDailyProtocolVolumeQuery__
 *
 * To run a query within a React component, call `useDailyProtocolVolumeQuery` and pass it any options that fit your needs.
 * When your component renders, `useDailyProtocolVolumeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDailyProtocolVolumeQuery({
 *   variables: {
 *      version: // value for 'version'
 *   },
 * });
 */
export function useDailyProtocolVolumeQuery(baseOptions: Apollo.QueryHookOptions<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>(DailyProtocolVolumeDocument, options);
      }
export function useDailyProtocolVolumeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>(DailyProtocolVolumeDocument, options);
        }
export type DailyProtocolVolumeQueryHookResult = ReturnType<typeof useDailyProtocolVolumeQuery>;
export type DailyProtocolVolumeLazyQueryHookResult = ReturnType<typeof useDailyProtocolVolumeLazyQuery>;
export type DailyProtocolVolumeQueryResult = Apollo.QueryResult<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>;
export const IsV3SubgraphStaleDocument = gql`
    query isV3SubgraphStale($chain: Chain!) {
  isV3SubgraphStale(chain: $chain)
}
    `;

/**
 * __useIsV3SubgraphStaleQuery__
 *
 * To run a query within a React component, call `useIsV3SubgraphStaleQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsV3SubgraphStaleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsV3SubgraphStaleQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useIsV3SubgraphStaleQuery(baseOptions: Apollo.QueryHookOptions<IsV3SubgraphStaleQuery, IsV3SubgraphStaleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsV3SubgraphStaleQuery, IsV3SubgraphStaleQueryVariables>(IsV3SubgraphStaleDocument, options);
      }
export function useIsV3SubgraphStaleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsV3SubgraphStaleQuery, IsV3SubgraphStaleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsV3SubgraphStaleQuery, IsV3SubgraphStaleQueryVariables>(IsV3SubgraphStaleDocument, options);
        }
export type IsV3SubgraphStaleQueryHookResult = ReturnType<typeof useIsV3SubgraphStaleQuery>;
export type IsV3SubgraphStaleLazyQueryHookResult = ReturnType<typeof useIsV3SubgraphStaleLazyQuery>;
export type IsV3SubgraphStaleQueryResult = Apollo.QueryResult<IsV3SubgraphStaleQuery, IsV3SubgraphStaleQueryVariables>;
export const CollectionSearchDocument = gql`
    query CollectionSearch($query: String!) {
  nftCollections(filter: {nameQuery: $query}) {
    edges {
      cursor
      node {
        image {
          url
        }
        isVerified
        name
        numAssets
        nftContracts {
          address
          chain
          name
          symbol
          totalSupply
        }
        markets(currencies: ETH) {
          floorPrice {
            currency
            value
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useCollectionSearchQuery__
 *
 * To run a query within a React component, call `useCollectionSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useCollectionSearchQuery(baseOptions: Apollo.QueryHookOptions<CollectionSearchQuery, CollectionSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionSearchQuery, CollectionSearchQueryVariables>(CollectionSearchDocument, options);
      }
export function useCollectionSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionSearchQuery, CollectionSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionSearchQuery, CollectionSearchQueryVariables>(CollectionSearchDocument, options);
        }
export type CollectionSearchQueryHookResult = ReturnType<typeof useCollectionSearchQuery>;
export type CollectionSearchLazyQueryHookResult = ReturnType<typeof useCollectionSearchLazyQuery>;
export type CollectionSearchQueryResult = Apollo.QueryResult<CollectionSearchQuery, CollectionSearchQueryVariables>;
export const NftBalanceDocument = gql`
    query NftBalance($ownerAddress: String!, $filter: NftBalancesFilterInput, $chains: [Chain!] = [ETHEREUM], $first: Int, $after: String, $last: Int, $before: String) {
  nftBalances(
    ownerAddress: $ownerAddress
    chains: $chains
    filter: $filter
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    edges {
      node {
        ownedAsset {
          id
          animationUrl
          collection {
            id
            isVerified
            image {
              id
              url
            }
            name
            twitterName
            nftContracts {
              id
              address
              chain
              name
              standard
              symbol
              totalSupply
            }
            markets(currencies: ETH) {
              id
              floorPrice {
                id
                value
              }
            }
          }
          chain
          description
          flaggedBy
          image {
            id
            url
          }
          originalImage {
            id
            url
          }
          name
          ownerAddress
          smallImage {
            id
            url
          }
          suspiciousFlag
          tokenId
          thumbnail {
            id
            url
          }
          listings(first: 1) {
            edges {
              node {
                price {
                  id
                  value
                  currency
                }
                createdAt
                marketplace
                endAt
              }
            }
          }
        }
        listedMarketplaces
        listingFees {
          id
          payoutAddress
          basisPoints
        }
        lastPrice {
          id
          currency
          timestamp
          value
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useNftBalanceQuery__
 *
 * To run a query within a React component, call `useNftBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftBalanceQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *      filter: // value for 'filter'
 *      chains: // value for 'chains'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useNftBalanceQuery(baseOptions: Apollo.QueryHookOptions<NftBalanceQuery, NftBalanceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftBalanceQuery, NftBalanceQueryVariables>(NftBalanceDocument, options);
      }
export function useNftBalanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftBalanceQuery, NftBalanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftBalanceQuery, NftBalanceQueryVariables>(NftBalanceDocument, options);
        }
export type NftBalanceQueryHookResult = ReturnType<typeof useNftBalanceQuery>;
export type NftBalanceLazyQueryHookResult = ReturnType<typeof useNftBalanceLazyQuery>;
export type NftBalanceQueryResult = Apollo.QueryResult<NftBalanceQuery, NftBalanceQueryVariables>;
export const V3PoolDocument = gql`
    query V3Pool($chain: Chain!, $address: String!) {
  v3Pool(chain: $chain, address: $address) {
    id
    protocolVersion
    address
    feeTier
    token0 {
      ...SimpleTokenDetails
      ...TokenPrice
    }
    token0Supply
    token1 {
      ...SimpleTokenDetails
      ...TokenPrice
    }
    token1Supply
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    historicalVolume(duration: WEEK) {
      value
      timestamp
    }
    totalLiquidity {
      value
    }
    totalLiquidityPercentChange24h {
      value
    }
  }
}
    ${SimpleTokenDetailsFragmentDoc}
${TokenPriceFragmentDoc}`;

/**
 * __useV3PoolQuery__
 *
 * To run a query within a React component, call `useV3PoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useV3PoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV3PoolQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useV3PoolQuery(baseOptions: Apollo.QueryHookOptions<V3PoolQuery, V3PoolQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V3PoolQuery, V3PoolQueryVariables>(V3PoolDocument, options);
      }
export function useV3PoolLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V3PoolQuery, V3PoolQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V3PoolQuery, V3PoolQueryVariables>(V3PoolDocument, options);
        }
export type V3PoolQueryHookResult = ReturnType<typeof useV3PoolQuery>;
export type V3PoolLazyQueryHookResult = ReturnType<typeof useV3PoolLazyQuery>;
export type V3PoolQueryResult = Apollo.QueryResult<V3PoolQuery, V3PoolQueryVariables>;
export const V4PoolDocument = gql`
    query V4Pool($chain: Chain!, $poolId: String!) {
  v4Pool(chain: $chain, poolId: $poolId) {
    id
    protocolVersion
    feeTier
    isDynamicFee
    tickSpacing
    poolId
    hook {
      id
      address
    }
    token0 {
      ...SimpleTokenDetails
      ...TokenPrice
    }
    token0Supply
    token1 {
      ...SimpleTokenDetails
      ...TokenPrice
    }
    token1Supply
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    historicalVolume(duration: WEEK) {
      value
      timestamp
    }
    rewardsCampaign {
      id
      boostedApr
      startTimestamp
      endTimestamp
      totalRewardAllocation
      distributedRewards
    }
    totalLiquidity {
      value
    }
    totalLiquidityPercentChange24h {
      value
    }
  }
}
    ${SimpleTokenDetailsFragmentDoc}
${TokenPriceFragmentDoc}`;

/**
 * __useV4PoolQuery__
 *
 * To run a query within a React component, call `useV4PoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useV4PoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV4PoolQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      poolId: // value for 'poolId'
 *   },
 * });
 */
export function useV4PoolQuery(baseOptions: Apollo.QueryHookOptions<V4PoolQuery, V4PoolQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V4PoolQuery, V4PoolQueryVariables>(V4PoolDocument, options);
      }
export function useV4PoolLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V4PoolQuery, V4PoolQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V4PoolQuery, V4PoolQueryVariables>(V4PoolDocument, options);
        }
export type V4PoolQueryHookResult = ReturnType<typeof useV4PoolQuery>;
export type V4PoolLazyQueryHookResult = ReturnType<typeof useV4PoolLazyQuery>;
export type V4PoolQueryResult = Apollo.QueryResult<V4PoolQuery, V4PoolQueryVariables>;
export const PoolPriceHistoryDocument = gql`
    query PoolPriceHistory($chain: Chain!, $addressOrId: String!, $duration: HistoryDuration!, $isV4: Boolean!, $isV3: Boolean!, $isV2: Boolean!) {
  v4Pool(chain: $chain, poolId: $addressOrId) @include(if: $isV4) {
    id
    priceHistory(duration: $duration) {
      id
      token0Price
      token1Price
      timestamp
    }
  }
  v3Pool(chain: $chain, address: $addressOrId) @include(if: $isV3) {
    id
    priceHistory(duration: $duration) {
      id
      token0Price
      token1Price
      timestamp
    }
  }
  v2Pair(chain: $chain, address: $addressOrId) @include(if: $isV2) {
    id
    priceHistory(duration: $duration) {
      id
      token0Price
      token1Price
      timestamp
    }
  }
}
    `;

/**
 * __usePoolPriceHistoryQuery__
 *
 * To run a query within a React component, call `usePoolPriceHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoolPriceHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoolPriceHistoryQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      addressOrId: // value for 'addressOrId'
 *      duration: // value for 'duration'
 *      isV4: // value for 'isV4'
 *      isV3: // value for 'isV3'
 *      isV2: // value for 'isV2'
 *   },
 * });
 */
export function usePoolPriceHistoryQuery(baseOptions: Apollo.QueryHookOptions<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>(PoolPriceHistoryDocument, options);
      }
export function usePoolPriceHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>(PoolPriceHistoryDocument, options);
        }
export type PoolPriceHistoryQueryHookResult = ReturnType<typeof usePoolPriceHistoryQuery>;
export type PoolPriceHistoryLazyQueryHookResult = ReturnType<typeof usePoolPriceHistoryLazyQuery>;
export type PoolPriceHistoryQueryResult = Apollo.QueryResult<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>;
export const PoolVolumeHistoryDocument = gql`
    query PoolVolumeHistory($chain: Chain!, $addressOrId: String!, $duration: HistoryDuration!, $isV4: Boolean!, $isV3: Boolean!, $isV2: Boolean!) {
  v4Pool(chain: $chain, poolId: $addressOrId) @include(if: $isV4) {
    id
    historicalVolume(duration: $duration) {
      id
      value
      timestamp
    }
  }
  v3Pool(chain: $chain, address: $addressOrId) @include(if: $isV3) {
    id
    historicalVolume(duration: $duration) {
      id
      value
      timestamp
    }
  }
  v2Pair(chain: $chain, address: $addressOrId) @include(if: $isV2) {
    id
    historicalVolume(duration: $duration) {
      id
      value
      timestamp
    }
  }
}
    `;

/**
 * __usePoolVolumeHistoryQuery__
 *
 * To run a query within a React component, call `usePoolVolumeHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoolVolumeHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoolVolumeHistoryQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      addressOrId: // value for 'addressOrId'
 *      duration: // value for 'duration'
 *      isV4: // value for 'isV4'
 *      isV3: // value for 'isV3'
 *      isV2: // value for 'isV2'
 *   },
 * });
 */
export function usePoolVolumeHistoryQuery(baseOptions: Apollo.QueryHookOptions<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>(PoolVolumeHistoryDocument, options);
      }
export function usePoolVolumeHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>(PoolVolumeHistoryDocument, options);
        }
export type PoolVolumeHistoryQueryHookResult = ReturnType<typeof usePoolVolumeHistoryQuery>;
export type PoolVolumeHistoryLazyQueryHookResult = ReturnType<typeof usePoolVolumeHistoryLazyQuery>;
export type PoolVolumeHistoryQueryResult = Apollo.QueryResult<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>;
export const V2PairDocument = gql`
    query V2Pair($chain: Chain!, $address: String!) {
  v2Pair(chain: $chain, address: $address) {
    id
    protocolVersion
    address
    token0 {
      ...SimpleTokenDetails
      ...TokenPrice
    }
    token0Supply
    token1 {
      ...SimpleTokenDetails
      ...TokenPrice
    }
    token1Supply
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    historicalVolume(duration: WEEK) {
      value
      timestamp
    }
    totalLiquidity {
      value
    }
    totalLiquidityPercentChange24h {
      value
    }
  }
}
    ${SimpleTokenDetailsFragmentDoc}
${TokenPriceFragmentDoc}`;

/**
 * __useV2PairQuery__
 *
 * To run a query within a React component, call `useV2PairQuery` and pass it any options that fit your needs.
 * When your component renders, `useV2PairQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV2PairQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useV2PairQuery(baseOptions: Apollo.QueryHookOptions<V2PairQuery, V2PairQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V2PairQuery, V2PairQueryVariables>(V2PairDocument, options);
      }
export function useV2PairLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V2PairQuery, V2PairQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V2PairQuery, V2PairQueryVariables>(V2PairDocument, options);
        }
export type V2PairQueryHookResult = ReturnType<typeof useV2PairQuery>;
export type V2PairLazyQueryHookResult = ReturnType<typeof useV2PairLazyQuery>;
export type V2PairQueryResult = Apollo.QueryResult<V2PairQuery, V2PairQueryVariables>;
export const V4PoolTransactionsDocument = gql`
    query V4PoolTransactions($chain: Chain!, $poolId: String!, $first: Int!, $cursor: Int) {
  v4Pool(chain: $chain, poolId: $poolId) {
    id
    transactions(first: $first, timestampCursor: $cursor) {
      timestamp
      hash
      account
      token0 {
        ...PoolTransactionToken
      }
      token0Quantity
      token1 {
        ...PoolTransactionToken
      }
      token1Quantity
      usdValue {
        value
      }
      type
    }
  }
}
    ${PoolTransactionTokenFragmentDoc}`;

/**
 * __useV4PoolTransactionsQuery__
 *
 * To run a query within a React component, call `useV4PoolTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV4PoolTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV4PoolTransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      poolId: // value for 'poolId'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV4PoolTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V4PoolTransactionsQuery, V4PoolTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V4PoolTransactionsQuery, V4PoolTransactionsQueryVariables>(V4PoolTransactionsDocument, options);
      }
export function useV4PoolTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V4PoolTransactionsQuery, V4PoolTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V4PoolTransactionsQuery, V4PoolTransactionsQueryVariables>(V4PoolTransactionsDocument, options);
        }
export type V4PoolTransactionsQueryHookResult = ReturnType<typeof useV4PoolTransactionsQuery>;
export type V4PoolTransactionsLazyQueryHookResult = ReturnType<typeof useV4PoolTransactionsLazyQuery>;
export type V4PoolTransactionsQueryResult = Apollo.QueryResult<V4PoolTransactionsQuery, V4PoolTransactionsQueryVariables>;
export const V3PoolTransactionsDocument = gql`
    query V3PoolTransactions($chain: Chain!, $address: String!, $first: Int!, $cursor: Int) {
  v3Pool(chain: $chain, address: $address) {
    id
    transactions(first: $first, timestampCursor: $cursor) {
      timestamp
      hash
      account
      token0 {
        ...PoolTransactionToken
      }
      token0Quantity
      token1 {
        ...PoolTransactionToken
      }
      token1Quantity
      usdValue {
        value
      }
      type
    }
  }
}
    ${PoolTransactionTokenFragmentDoc}`;

/**
 * __useV3PoolTransactionsQuery__
 *
 * To run a query within a React component, call `useV3PoolTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV3PoolTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV3PoolTransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV3PoolTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>(V3PoolTransactionsDocument, options);
      }
export function useV3PoolTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>(V3PoolTransactionsDocument, options);
        }
export type V3PoolTransactionsQueryHookResult = ReturnType<typeof useV3PoolTransactionsQuery>;
export type V3PoolTransactionsLazyQueryHookResult = ReturnType<typeof useV3PoolTransactionsLazyQuery>;
export type V3PoolTransactionsQueryResult = Apollo.QueryResult<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>;
export const V2PairTransactionsDocument = gql`
    query V2PairTransactions($chain: Chain!, $address: String!, $first: Int!, $cursor: Int) {
  v2Pair(chain: $chain, address: $address) {
    id
    transactions(first: $first, timestampCursor: $cursor) {
      timestamp
      hash
      account
      token0 {
        ...PoolTransactionToken
      }
      token0Quantity
      token1 {
        ...PoolTransactionToken
      }
      token1Quantity
      usdValue {
        value
      }
      type
    }
  }
}
    ${PoolTransactionTokenFragmentDoc}`;

/**
 * __useV2PairTransactionsQuery__
 *
 * To run a query within a React component, call `useV2PairTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV2PairTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV2PairTransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV2PairTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>(V2PairTransactionsDocument, options);
      }
export function useV2PairTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>(V2PairTransactionsDocument, options);
        }
export type V2PairTransactionsQueryHookResult = ReturnType<typeof useV2PairTransactionsQuery>;
export type V2PairTransactionsLazyQueryHookResult = ReturnType<typeof useV2PairTransactionsLazyQuery>;
export type V2PairTransactionsQueryResult = Apollo.QueryResult<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>;
export const QuickTokenBalancesWebDocument = gql`
    query QuickTokenBalancesWeb($ownerAddress: String!, $chains: [Chain!]!) {
  portfolios(ownerAddresses: [$ownerAddress], chains: $chains) {
    id
    tokenBalances {
      ...QuickTokenBalanceParts
    }
  }
}
    ${QuickTokenBalancePartsFragmentDoc}`;

/**
 * __useQuickTokenBalancesWebQuery__
 *
 * To run a query within a React component, call `useQuickTokenBalancesWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuickTokenBalancesWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuickTokenBalancesWebQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useQuickTokenBalancesWebQuery(baseOptions: Apollo.QueryHookOptions<QuickTokenBalancesWebQuery, QuickTokenBalancesWebQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuickTokenBalancesWebQuery, QuickTokenBalancesWebQueryVariables>(QuickTokenBalancesWebDocument, options);
      }
export function useQuickTokenBalancesWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuickTokenBalancesWebQuery, QuickTokenBalancesWebQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuickTokenBalancesWebQuery, QuickTokenBalancesWebQueryVariables>(QuickTokenBalancesWebDocument, options);
        }
export type QuickTokenBalancesWebQueryHookResult = ReturnType<typeof useQuickTokenBalancesWebQuery>;
export type QuickTokenBalancesWebLazyQueryHookResult = ReturnType<typeof useQuickTokenBalancesWebLazyQuery>;
export type QuickTokenBalancesWebQueryResult = Apollo.QueryResult<QuickTokenBalancesWebQuery, QuickTokenBalancesWebQueryVariables>;
export const TokenWebDocument = gql`
    query TokenWeb($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    decimals
    name
    chain
    address
    symbol
    standard
    market(currency: USD) {
      id
      totalValueLocked {
        id
        value
        currency
      }
      price {
        id
        value
        currency
      }
      volume24H: volume(duration: DAY) {
        id
        value
        currency
      }
      priceHigh52W: priceHighLow(duration: YEAR, highLow: HIGH) {
        id
        value
      }
      priceLow52W: priceHighLow(duration: YEAR, highLow: LOW) {
        id
        value
      }
    }
    project {
      id
      name
      description
      homepageUrl
      twitterName
      logoUrl
      isSpam
      tokens {
        id
        chain
        address
      }
      markets(currencies: [USD]) {
        id
        fullyDilutedValuation {
          id
          value
          currency
        }
        marketCap {
          id
          value
          currency
        }
      }
    }
  }
}
    `;

/**
 * __useTokenWebQuery__
 *
 * To run a query within a React component, call `useTokenWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenWebQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenWebQuery(baseOptions: Apollo.QueryHookOptions<TokenWebQuery, TokenWebQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenWebQuery, TokenWebQueryVariables>(TokenWebDocument, options);
      }
export function useTokenWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenWebQuery, TokenWebQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenWebQuery, TokenWebQueryVariables>(TokenWebDocument, options);
        }
export type TokenWebQueryHookResult = ReturnType<typeof useTokenWebQuery>;
export type TokenWebLazyQueryHookResult = ReturnType<typeof useTokenWebLazyQuery>;
export type TokenWebQueryResult = Apollo.QueryResult<TokenWebQuery, TokenWebQueryVariables>;
export const TokenProjectWebDocument = gql`
    query TokenProjectWeb($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    decimals
    name
    chain
    address
    symbol
    standard
    project {
      id
      description
      homepageUrl
      twitterName
      logoUrl
      isSpam
      tokens {
        id
        chain
        address
      }
    }
  }
}
    `;

/**
 * __useTokenProjectWebQuery__
 *
 * To run a query within a React component, call `useTokenProjectWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenProjectWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenProjectWebQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenProjectWebQuery(baseOptions: Apollo.QueryHookOptions<TokenProjectWebQuery, TokenProjectWebQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenProjectWebQuery, TokenProjectWebQueryVariables>(TokenProjectWebDocument, options);
      }
export function useTokenProjectWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenProjectWebQuery, TokenProjectWebQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenProjectWebQuery, TokenProjectWebQueryVariables>(TokenProjectWebDocument, options);
        }
export type TokenProjectWebQueryHookResult = ReturnType<typeof useTokenProjectWebQuery>;
export type TokenProjectWebLazyQueryHookResult = ReturnType<typeof useTokenProjectWebLazyQuery>;
export type TokenProjectWebQueryResult = Apollo.QueryResult<TokenProjectWebQuery, TokenProjectWebQueryVariables>;
export const TokenPriceDocument = gql`
    query TokenPrice($chain: Chain!, $address: String = null, $duration: HistoryDuration!, $fallback: Boolean = false) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    market(currency: USD) {
      id
      price {
        id
        value
      }
      ohlc(duration: $duration) @skip(if: $fallback) {
        ...CandlestickOHLC
      }
      priceHistory(duration: $duration) @include(if: $fallback) {
        ...PriceHistoryFallback
      }
    }
  }
}
    ${CandlestickOhlcFragmentDoc}
${PriceHistoryFallbackFragmentDoc}`;

/**
 * __useTokenPriceQuery__
 *
 * To run a query within a React component, call `useTokenPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenPriceQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      duration: // value for 'duration'
 *      fallback: // value for 'fallback'
 *   },
 * });
 */
export function useTokenPriceQuery(baseOptions: Apollo.QueryHookOptions<TokenPriceQuery, TokenPriceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenPriceQuery, TokenPriceQueryVariables>(TokenPriceDocument, options);
      }
export function useTokenPriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenPriceQuery, TokenPriceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenPriceQuery, TokenPriceQueryVariables>(TokenPriceDocument, options);
        }
export type TokenPriceQueryHookResult = ReturnType<typeof useTokenPriceQuery>;
export type TokenPriceLazyQueryHookResult = ReturnType<typeof useTokenPriceLazyQuery>;
export type TokenPriceQueryResult = Apollo.QueryResult<TokenPriceQuery, TokenPriceQueryVariables>;
export const TokenHistoricalVolumesDocument = gql`
    query TokenHistoricalVolumes($chain: Chain!, $address: String = null, $duration: HistoryDuration!) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    market(currency: USD) {
      id
      historicalVolume(duration: $duration) {
        id
        timestamp
        value
      }
    }
  }
}
    `;

/**
 * __useTokenHistoricalVolumesQuery__
 *
 * To run a query within a React component, call `useTokenHistoricalVolumesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenHistoricalVolumesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenHistoricalVolumesQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useTokenHistoricalVolumesQuery(baseOptions: Apollo.QueryHookOptions<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>(TokenHistoricalVolumesDocument, options);
      }
export function useTokenHistoricalVolumesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>(TokenHistoricalVolumesDocument, options);
        }
export type TokenHistoricalVolumesQueryHookResult = ReturnType<typeof useTokenHistoricalVolumesQuery>;
export type TokenHistoricalVolumesLazyQueryHookResult = ReturnType<typeof useTokenHistoricalVolumesLazyQuery>;
export type TokenHistoricalVolumesQueryResult = Apollo.QueryResult<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>;
export const TokenHistoricalTvlsDocument = gql`
    query TokenHistoricalTvls($chain: Chain!, $address: String = null, $duration: HistoryDuration!) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    market(currency: USD) {
      id
      historicalTvl(duration: $duration) {
        id
        timestamp
        value
      }
      totalValueLocked {
        id
        value
        currency
      }
    }
  }
}
    `;

/**
 * __useTokenHistoricalTvlsQuery__
 *
 * To run a query within a React component, call `useTokenHistoricalTvlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenHistoricalTvlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenHistoricalTvlsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useTokenHistoricalTvlsQuery(baseOptions: Apollo.QueryHookOptions<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>(TokenHistoricalTvlsDocument, options);
      }
export function useTokenHistoricalTvlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>(TokenHistoricalTvlsDocument, options);
        }
export type TokenHistoricalTvlsQueryHookResult = ReturnType<typeof useTokenHistoricalTvlsQuery>;
export type TokenHistoricalTvlsLazyQueryHookResult = ReturnType<typeof useTokenHistoricalTvlsLazyQuery>;
export type TokenHistoricalTvlsQueryResult = Apollo.QueryResult<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>;
export const V4TokenTransactionsDocument = gql`
    query V4TokenTransactions($chain: Chain!, $address: String!, $first: Int!, $cursor: Int) {
  token(chain: $chain, address: $address) {
    ...TransactionToken
    v4Transactions(first: $first, timestampCursor: $cursor) {
      ...PoolTx
    }
  }
}
    ${TransactionTokenFragmentDoc}
${PoolTxFragmentDoc}`;

/**
 * __useV4TokenTransactionsQuery__
 *
 * To run a query within a React component, call `useV4TokenTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV4TokenTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV4TokenTransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV4TokenTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V4TokenTransactionsQuery, V4TokenTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V4TokenTransactionsQuery, V4TokenTransactionsQueryVariables>(V4TokenTransactionsDocument, options);
      }
export function useV4TokenTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V4TokenTransactionsQuery, V4TokenTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V4TokenTransactionsQuery, V4TokenTransactionsQueryVariables>(V4TokenTransactionsDocument, options);
        }
export type V4TokenTransactionsQueryHookResult = ReturnType<typeof useV4TokenTransactionsQuery>;
export type V4TokenTransactionsLazyQueryHookResult = ReturnType<typeof useV4TokenTransactionsLazyQuery>;
export type V4TokenTransactionsQueryResult = Apollo.QueryResult<V4TokenTransactionsQuery, V4TokenTransactionsQueryVariables>;
export const V3TokenTransactionsDocument = gql`
    query V3TokenTransactions($chain: Chain!, $address: String!, $first: Int!, $cursor: Int) {
  token(chain: $chain, address: $address) {
    ...TransactionToken
    v3Transactions(first: $first, timestampCursor: $cursor) {
      ...PoolTx
    }
  }
}
    ${TransactionTokenFragmentDoc}
${PoolTxFragmentDoc}`;

/**
 * __useV3TokenTransactionsQuery__
 *
 * To run a query within a React component, call `useV3TokenTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV3TokenTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV3TokenTransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV3TokenTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>(V3TokenTransactionsDocument, options);
      }
export function useV3TokenTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>(V3TokenTransactionsDocument, options);
        }
export type V3TokenTransactionsQueryHookResult = ReturnType<typeof useV3TokenTransactionsQuery>;
export type V3TokenTransactionsLazyQueryHookResult = ReturnType<typeof useV3TokenTransactionsLazyQuery>;
export type V3TokenTransactionsQueryResult = Apollo.QueryResult<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>;
export const V2TokenTransactionsDocument = gql`
    query V2TokenTransactions($chain: Chain!, $address: String!, $first: Int!, $cursor: Int) {
  token(chain: $chain, address: $address) {
    ...TransactionToken
    v2Transactions(first: $first, timestampCursor: $cursor) {
      ...PoolTx
    }
  }
}
    ${TransactionTokenFragmentDoc}
${PoolTxFragmentDoc}`;

/**
 * __useV2TokenTransactionsQuery__
 *
 * To run a query within a React component, call `useV2TokenTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV2TokenTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV2TokenTransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV2TokenTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>(V2TokenTransactionsDocument, options);
      }
export function useV2TokenTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>(V2TokenTransactionsDocument, options);
        }
export type V2TokenTransactionsQueryHookResult = ReturnType<typeof useV2TokenTransactionsQuery>;
export type V2TokenTransactionsLazyQueryHookResult = ReturnType<typeof useV2TokenTransactionsLazyQuery>;
export type V2TokenTransactionsQueryResult = Apollo.QueryResult<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>;
export const TopV4PoolsDocument = gql`
    query TopV4Pools($chain: Chain!, $first: Int!, $cursor: Float, $tokenAddress: String) {
  topV4Pools(
    first: $first
    chain: $chain
    tokenFilter: $tokenAddress
    tvlCursor: $cursor
  ) {
    id
    protocolVersion
    poolId
    isDynamicFee
    hook {
      id
      address
    }
    totalLiquidity {
      value
    }
    feeTier
    token0 {
      ...SimpleTokenDetails
    }
    token1 {
      ...SimpleTokenDetails
    }
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    volume30d: cumulativeVolume(duration: MONTH) {
      value
    }
  }
}
    ${SimpleTokenDetailsFragmentDoc}`;

/**
 * __useTopV4PoolsQuery__
 *
 * To run a query within a React component, call `useTopV4PoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopV4PoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopV4PoolsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      tokenAddress: // value for 'tokenAddress'
 *   },
 * });
 */
export function useTopV4PoolsQuery(baseOptions: Apollo.QueryHookOptions<TopV4PoolsQuery, TopV4PoolsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopV4PoolsQuery, TopV4PoolsQueryVariables>(TopV4PoolsDocument, options);
      }
export function useTopV4PoolsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopV4PoolsQuery, TopV4PoolsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopV4PoolsQuery, TopV4PoolsQueryVariables>(TopV4PoolsDocument, options);
        }
export type TopV4PoolsQueryHookResult = ReturnType<typeof useTopV4PoolsQuery>;
export type TopV4PoolsLazyQueryHookResult = ReturnType<typeof useTopV4PoolsLazyQuery>;
export type TopV4PoolsQueryResult = Apollo.QueryResult<TopV4PoolsQuery, TopV4PoolsQueryVariables>;
export const TopV3PoolsDocument = gql`
    query TopV3Pools($chain: Chain!, $first: Int!, $cursor: Float, $tokenAddress: String) {
  topV3Pools(
    first: $first
    chain: $chain
    tokenFilter: $tokenAddress
    tvlCursor: $cursor
  ) {
    id
    protocolVersion
    address
    totalLiquidity {
      value
    }
    feeTier
    token0 {
      ...SimpleTokenDetails
    }
    token1 {
      ...SimpleTokenDetails
    }
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    volume30d: cumulativeVolume(duration: MONTH) {
      value
    }
  }
}
    ${SimpleTokenDetailsFragmentDoc}`;

/**
 * __useTopV3PoolsQuery__
 *
 * To run a query within a React component, call `useTopV3PoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopV3PoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopV3PoolsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      tokenAddress: // value for 'tokenAddress'
 *   },
 * });
 */
export function useTopV3PoolsQuery(baseOptions: Apollo.QueryHookOptions<TopV3PoolsQuery, TopV3PoolsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopV3PoolsQuery, TopV3PoolsQueryVariables>(TopV3PoolsDocument, options);
      }
export function useTopV3PoolsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopV3PoolsQuery, TopV3PoolsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopV3PoolsQuery, TopV3PoolsQueryVariables>(TopV3PoolsDocument, options);
        }
export type TopV3PoolsQueryHookResult = ReturnType<typeof useTopV3PoolsQuery>;
export type TopV3PoolsLazyQueryHookResult = ReturnType<typeof useTopV3PoolsLazyQuery>;
export type TopV3PoolsQueryResult = Apollo.QueryResult<TopV3PoolsQuery, TopV3PoolsQueryVariables>;
export const TopV2PairsDocument = gql`
    query TopV2Pairs($chain: Chain!, $first: Int!, $cursor: Float, $tokenAddress: String) {
  topV2Pairs(
    first: $first
    chain: $chain
    tokenFilter: $tokenAddress
    tvlCursor: $cursor
  ) {
    id
    protocolVersion
    address
    totalLiquidity {
      value
    }
    token0 {
      ...SimpleTokenDetails
    }
    token1 {
      ...SimpleTokenDetails
    }
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    volume30d: cumulativeVolume(duration: MONTH) {
      value
    }
  }
}
    ${SimpleTokenDetailsFragmentDoc}`;

/**
 * __useTopV2PairsQuery__
 *
 * To run a query within a React component, call `useTopV2PairsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopV2PairsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopV2PairsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      tokenAddress: // value for 'tokenAddress'
 *   },
 * });
 */
export function useTopV2PairsQuery(baseOptions: Apollo.QueryHookOptions<TopV2PairsQuery, TopV2PairsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopV2PairsQuery, TopV2PairsQueryVariables>(TopV2PairsDocument, options);
      }
export function useTopV2PairsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopV2PairsQuery, TopV2PairsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopV2PairsQuery, TopV2PairsQueryVariables>(TopV2PairsDocument, options);
        }
export type TopV2PairsQueryHookResult = ReturnType<typeof useTopV2PairsQuery>;
export type TopV2PairsLazyQueryHookResult = ReturnType<typeof useTopV2PairsLazyQuery>;
export type TopV2PairsQueryResult = Apollo.QueryResult<TopV2PairsQuery, TopV2PairsQueryVariables>;
export const V4TransactionsDocument = gql`
    query V4Transactions($chain: Chain!, $first: Int!, $cursor: Int) {
  v4Transactions(chain: $chain, first: $first, timestampCursor: $cursor) {
    ...PoolTx
  }
}
    ${PoolTxFragmentDoc}`;

/**
 * __useV4TransactionsQuery__
 *
 * To run a query within a React component, call `useV4TransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV4TransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV4TransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV4TransactionsQuery(baseOptions: Apollo.QueryHookOptions<V4TransactionsQuery, V4TransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V4TransactionsQuery, V4TransactionsQueryVariables>(V4TransactionsDocument, options);
      }
export function useV4TransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V4TransactionsQuery, V4TransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V4TransactionsQuery, V4TransactionsQueryVariables>(V4TransactionsDocument, options);
        }
export type V4TransactionsQueryHookResult = ReturnType<typeof useV4TransactionsQuery>;
export type V4TransactionsLazyQueryHookResult = ReturnType<typeof useV4TransactionsLazyQuery>;
export type V4TransactionsQueryResult = Apollo.QueryResult<V4TransactionsQuery, V4TransactionsQueryVariables>;
export const V3TransactionsDocument = gql`
    query V3Transactions($chain: Chain!, $first: Int!, $cursor: Int) {
  v3Transactions(chain: $chain, first: $first, timestampCursor: $cursor) {
    ...PoolTx
  }
}
    ${PoolTxFragmentDoc}`;

/**
 * __useV3TransactionsQuery__
 *
 * To run a query within a React component, call `useV3TransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV3TransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV3TransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV3TransactionsQuery(baseOptions: Apollo.QueryHookOptions<V3TransactionsQuery, V3TransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V3TransactionsQuery, V3TransactionsQueryVariables>(V3TransactionsDocument, options);
      }
export function useV3TransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V3TransactionsQuery, V3TransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V3TransactionsQuery, V3TransactionsQueryVariables>(V3TransactionsDocument, options);
        }
export type V3TransactionsQueryHookResult = ReturnType<typeof useV3TransactionsQuery>;
export type V3TransactionsLazyQueryHookResult = ReturnType<typeof useV3TransactionsLazyQuery>;
export type V3TransactionsQueryResult = Apollo.QueryResult<V3TransactionsQuery, V3TransactionsQueryVariables>;
export const V2TransactionsDocument = gql`
    query V2Transactions($chain: Chain!, $first: Int!, $cursor: Int) {
  v2Transactions(chain: $chain, first: $first, timestampCursor: $cursor) {
    ...PoolTx
  }
}
    ${PoolTxFragmentDoc}`;

/**
 * __useV2TransactionsQuery__
 *
 * To run a query within a React component, call `useV2TransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV2TransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV2TransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV2TransactionsQuery(baseOptions: Apollo.QueryHookOptions<V2TransactionsQuery, V2TransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<V2TransactionsQuery, V2TransactionsQueryVariables>(V2TransactionsDocument, options);
      }
export function useV2TransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V2TransactionsQuery, V2TransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<V2TransactionsQuery, V2TransactionsQueryVariables>(V2TransactionsDocument, options);
        }
export type V2TransactionsQueryHookResult = ReturnType<typeof useV2TransactionsQuery>;
export type V2TransactionsLazyQueryHookResult = ReturnType<typeof useV2TransactionsLazyQuery>;
export type V2TransactionsQueryResult = Apollo.QueryResult<V2TransactionsQuery, V2TransactionsQueryVariables>;