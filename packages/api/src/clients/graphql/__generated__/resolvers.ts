import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { type Maybe, type InputMaybe, type Exact, type MakeOptional, type MakeMaybe, type Scalars, type ActivityDetails, type ActivityDetailsInput, type ActivityType, type Amount, type AmountChange, type AmountInput, type ApplicationContract, type ApplicationContractInput, type AssetActivity, type AssetActivityInput, type AssetActivitySwitch, type AssetChange, type AssetChangeInput, type BlockaidFees, type BridgedWithdrawalInfo, type Chain, type CollectionSortableField, type ContractInput, type Currency, type CurrencyAmountInput, type DescriptionTranslations, type Dimensions, type DimensionsInput, type FeeData, type HighLow, type HistoryDuration, type IAmount, type IContract, type IPool, type IPoolCumulativeVolumeArgs, type IPoolHistoricalVolumeArgs, type IPoolPriceHistoryArgs, type IPoolTransactionsArgs, type Image, type ImageInput, type MediaType, type Mutation, type MutationAssetActivityArgs, type MutationHeartbeatArgs, type MutationUnsubscribeArgs, type NetworkFee, type NftActivity, type NftActivityConnection, type NftActivityEdge, type NftActivityFilterInput, type NftActivityType, type NftApproval, type NftApprovalInput, type NftApproveForAll, type NftApproveForAllInput, type NftAsset, type NftAssetListingsArgs, type NftAssetConnection, type NftAssetEdge, type NftAssetInput, type NftAssetRarity, type NftAssetSortableField, type NftAssetTrait, type NftAssetTraitInput, type NftAssetsFilterInput, type NftBalance, type NftBalanceAssetInput, type NftBalanceConnection, type NftBalanceEdge, type NftBalancesFilterInput, type NftCollection, type NftCollectionMarketsArgs, type NftCollectionBalance, type NftCollectionBalanceConnection, type NftCollectionBalanceEdge, type NftCollectionConnection, type NftCollectionEdge, type NftCollectionInput, type NftCollectionMarket, type NftCollectionMarketFloorPricePercentChangeArgs, type NftCollectionMarketMarketplacesArgs, type NftCollectionMarketSalesArgs, type NftCollectionMarketVolumeArgs, type NftCollectionMarketVolumePercentChangeArgs, type NftCollectionMarketplace, type NftCollectionTrait, type NftCollectionTraitStats, type NftCollectionsFilterInput, type NftContract, type NftContractInput, type NftFee, type NftMarketplace, type NftOrder, type NftOrderConnection, type NftOrderEdge, type NftProfile, type NftRarityProvider, type NftRouteResponse, type NftStandard, type NftTrade, type NftTradeInput, type NftTransfer, type NftTransferInput, type OffRampServiceProvider, type OffRampServiceProviderInput, type OffRampTransactionDetails, type OffRampTransactionDetailsInput, type OffRampTransfer, type OffRampTransferInput, type OnRampServiceProvider, type OnRampServiceProviderInput, type OnRampTransactionDetails, type OnRampTransactionDetailsInput, type OnRampTransactionsAuth, type OnRampTransfer, type OnRampTransferInput, type OrderStatus, type OrderType, type PageInfo, type PairInput, type PermitDetailsInput, type PermitInput, type PoolInput, type PoolTransaction, type PoolTransactionType, type Portfolio, type PortfolioAssetActivitiesArgs, type PortfolioTokensTotalDenominatedValueChangeArgs, type PortfolioValueModifier, type PriceSource, type ProtectionAttackType, type ProtectionInfo, type ProtectionResult, type ProtocolVersion, type PushNotification, type Query, type QueryConvertArgs, type QueryDailyProtocolTvlArgs, type QueryHistoricalProtocolVolumeArgs, type QueryIsV3SubgraphStaleArgs, type QueryNftActivityArgs, type QueryNftAssetsArgs, type QueryNftBalancesArgs, type QueryNftCollectionBalancesArgs, type QueryNftCollectionsArgs, type QueryNftRouteArgs, type QueryPortfoliosArgs, type QuerySearchTokensArgs, type QueryTokenArgs, type QueryTokenProjectsArgs, type QueryTokensArgs, type QueryTopCollectionsArgs, type QueryTopTokensArgs, type QueryTopV2PairsArgs, type QueryTopV3PoolsArgs, type QueryTopV4PoolsArgs, type QueryTransactionNotificationArgs, type QueryV2PairArgs, type QueryV2TransactionsArgs, type QueryV3PoolArgs, type QueryV3PoolsForTokenPairArgs, type QueryV3TransactionsArgs, type QueryV4PoolArgs, type QueryV4PoolsForTokenPairArgs, type QueryV4TransactionsArgs, type RewardsCampaign, type SafetyLevel, type Status, type Subscription, type SubscriptionOnAssetActivityArgs, type SubscriptionType, type SwapOrderDetails, type SwapOrderDetailsInput, type SwapOrderStatus, type SwapOrderType, type TimestampedAmount, type TimestampedOhlc, type TimestampedPoolPrice, type Token, type TokenMarketArgs, type TokenV2TransactionsArgs, type TokenV3TransactionsArgs, type TokenV4TransactionsArgs, type TokenAmount, type TokenAmountInput, type TokenApproval, type TokenApprovalInput, type TokenAssetInput, type TokenBalance, type TokenInput, type TokenMarket, type TokenMarketHistoricalTvlArgs, type TokenMarketHistoricalVolumeArgs, type TokenMarketOhlcArgs, type TokenMarketPriceHighLowArgs, type TokenMarketPriceHistoryArgs, type TokenMarketPricePercentChangeArgs, type TokenMarketVolumeArgs, type TokenProject, type TokenProjectMarketsArgs, type TokenProjectMarket, type TokenProjectMarketPriceHighLowArgs, type TokenProjectMarketPriceHistoryArgs, type TokenProjectMarketPricePercentChangeArgs, type TokenSortableField, type TokenSource, type TokenStandard, type TokenTradeInput, type TokenTradeRouteInput, type TokenTradeRoutesInput, type TokenTradeType, type TokenTransfer, type TokenTransferInput, type TradePoolInput, type Transaction, type TransactionDetails, type TransactionDetailsInput, type TransactionDirection, type TransactionNotification, type TransactionStatus, type TransactionType, type V2Pair, type V2PairCumulativeVolumeArgs, type V2PairHistoricalVolumeArgs, type V2PairPriceHistoryArgs, type V2PairTransactionsArgs, type V3Pool, type V3PoolCumulativeVolumeArgs, type V3PoolHistoricalVolumeArgs, type V3PoolPriceHistoryArgs, type V3PoolTicksArgs, type V3PoolTransactionsArgs, type V3PoolTick, type V4Pool, type V4PoolCumulativeVolumeArgs, type V4PoolHistoricalVolumeArgs, type V4PoolPriceHistoryArgs, type V4PoolTicksArgs, type V4PoolTransactionsArgs, type V4PoolHook, type V4PoolTick } from "./schema-types";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };


export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes = {
  ActivityDetails: ( OffRampTransactionDetails ) | ( OnRampTransactionDetails ) | ( SwapOrderDetails ) | ( Omit<TransactionDetails, 'assetChanges'> & { assetChanges: Array<Maybe<ResolversTypes['AssetChange']>> } );
  AssetChange: ( NftApproval ) | ( NftApproveForAll ) | ( NftTransfer ) | ( OffRampTransfer ) | ( OnRampTransfer ) | ( TokenApproval ) | ( TokenTransfer );
};

/** Mapping of union parent types */
export type ResolversUnionParentTypes = {
  ActivityDetails: ( OffRampTransactionDetails ) | ( OnRampTransactionDetails ) | ( SwapOrderDetails ) | ( Omit<TransactionDetails, 'assetChanges'> & { assetChanges: Array<Maybe<ResolversParentTypes['AssetChange']>> } );
  AssetChange: ( NftApproval ) | ( NftApproveForAll ) | ( NftTransfer ) | ( OffRampTransfer ) | ( OnRampTransfer ) | ( TokenApproval ) | ( TokenTransfer );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AWSJSON: ResolverTypeWrapper<Scalars['AWSJSON']>;
  ActivityDetails: ResolverTypeWrapper<ResolversUnionTypes['ActivityDetails']>;
  ActivityDetailsInput: ActivityDetailsInput;
  ActivityType: ActivityType;
  Amount: ResolverTypeWrapper<Amount>;
  AmountChange: ResolverTypeWrapper<AmountChange>;
  AmountInput: AmountInput;
  ApplicationContract: ResolverTypeWrapper<ApplicationContract>;
  ApplicationContractInput: ApplicationContractInput;
  AssetActivity: ResolverTypeWrapper<Omit<AssetActivity, 'assetChanges' | 'details'> & { assetChanges: Array<Maybe<ResolversTypes['AssetChange']>>, details: ResolversTypes['ActivityDetails'] }>;
  AssetActivityInput: AssetActivityInput;
  AssetActivitySwitch: AssetActivitySwitch;
  AssetChange: ResolverTypeWrapper<ResolversUnionTypes['AssetChange']>;
  AssetChangeInput: AssetChangeInput;
  BlockaidFees: ResolverTypeWrapper<BlockaidFees>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BridgedWithdrawalInfo: ResolverTypeWrapper<BridgedWithdrawalInfo>;
  Chain: Chain;
  CollectionSortableField: CollectionSortableField;
  ContractInput: ContractInput;
  Currency: Currency;
  CurrencyAmountInput: CurrencyAmountInput;
  DescriptionTranslations: ResolverTypeWrapper<DescriptionTranslations>;
  Dimensions: ResolverTypeWrapper<Dimensions>;
  DimensionsInput: DimensionsInput;
  FeeData: ResolverTypeWrapper<FeeData>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  HighLow: HighLow;
  HistoryDuration: HistoryDuration;
  IAmount: ResolversTypes['Amount'] | ResolversTypes['TimestampedAmount'];
  IContract: ResolversTypes['ApplicationContract'] | ResolversTypes['NftContract'] | ResolversTypes['Token'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IPool: ResolversTypes['V2Pair'] | ResolversTypes['V3Pool'];
  Image: ResolverTypeWrapper<Image>;
  ImageInput: ImageInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  MediaType: MediaType;
  Mutation: ResolverTypeWrapper<{}>;
  NetworkFee: ResolverTypeWrapper<NetworkFee>;
  NftActivity: ResolverTypeWrapper<NftActivity>;
  NftActivityConnection: ResolverTypeWrapper<NftActivityConnection>;
  NftActivityEdge: ResolverTypeWrapper<NftActivityEdge>;
  NftActivityFilterInput: NftActivityFilterInput;
  NftActivityType: NftActivityType;
  NftApproval: ResolverTypeWrapper<NftApproval>;
  NftApprovalInput: NftApprovalInput;
  NftApproveForAll: ResolverTypeWrapper<NftApproveForAll>;
  NftApproveForAllInput: NftApproveForAllInput;
  NftAsset: ResolverTypeWrapper<NftAsset>;
  NftAssetConnection: ResolverTypeWrapper<NftAssetConnection>;
  NftAssetEdge: ResolverTypeWrapper<NftAssetEdge>;
  NftAssetInput: NftAssetInput;
  NftAssetRarity: ResolverTypeWrapper<NftAssetRarity>;
  NftAssetSortableField: NftAssetSortableField;
  NftAssetTrait: ResolverTypeWrapper<NftAssetTrait>;
  NftAssetTraitInput: NftAssetTraitInput;
  NftAssetsFilterInput: NftAssetsFilterInput;
  NftBalance: ResolverTypeWrapper<NftBalance>;
  NftBalanceAssetInput: NftBalanceAssetInput;
  NftBalanceConnection: ResolverTypeWrapper<NftBalanceConnection>;
  NftBalanceEdge: ResolverTypeWrapper<NftBalanceEdge>;
  NftBalancesFilterInput: NftBalancesFilterInput;
  NftCollection: ResolverTypeWrapper<NftCollection>;
  NftCollectionBalance: ResolverTypeWrapper<NftCollectionBalance>;
  NftCollectionBalanceConnection: ResolverTypeWrapper<NftCollectionBalanceConnection>;
  NftCollectionBalanceEdge: ResolverTypeWrapper<NftCollectionBalanceEdge>;
  NftCollectionConnection: ResolverTypeWrapper<NftCollectionConnection>;
  NftCollectionEdge: ResolverTypeWrapper<NftCollectionEdge>;
  NftCollectionInput: NftCollectionInput;
  NftCollectionMarket: ResolverTypeWrapper<NftCollectionMarket>;
  NftCollectionMarketplace: ResolverTypeWrapper<NftCollectionMarketplace>;
  NftCollectionTrait: ResolverTypeWrapper<NftCollectionTrait>;
  NftCollectionTraitStats: ResolverTypeWrapper<NftCollectionTraitStats>;
  NftCollectionsFilterInput: NftCollectionsFilterInput;
  NftContract: ResolverTypeWrapper<NftContract>;
  NftContractInput: NftContractInput;
  NftFee: ResolverTypeWrapper<NftFee>;
  NftMarketplace: NftMarketplace;
  NftOrder: ResolverTypeWrapper<NftOrder>;
  NftOrderConnection: ResolverTypeWrapper<NftOrderConnection>;
  NftOrderEdge: ResolverTypeWrapper<NftOrderEdge>;
  NftProfile: ResolverTypeWrapper<NftProfile>;
  NftRarityProvider: NftRarityProvider;
  NftRouteResponse: ResolverTypeWrapper<NftRouteResponse>;
  NftStandard: NftStandard;
  NftTrade: ResolverTypeWrapper<NftTrade>;
  NftTradeInput: NftTradeInput;
  NftTransfer: ResolverTypeWrapper<NftTransfer>;
  NftTransferInput: NftTransferInput;
  OffRampServiceProvider: ResolverTypeWrapper<OffRampServiceProvider>;
  OffRampServiceProviderInput: OffRampServiceProviderInput;
  OffRampTransactionDetails: ResolverTypeWrapper<OffRampTransactionDetails>;
  OffRampTransactionDetailsInput: OffRampTransactionDetailsInput;
  OffRampTransfer: ResolverTypeWrapper<OffRampTransfer>;
  OffRampTransferInput: OffRampTransferInput;
  OnRampServiceProvider: ResolverTypeWrapper<OnRampServiceProvider>;
  OnRampServiceProviderInput: OnRampServiceProviderInput;
  OnRampTransactionDetails: ResolverTypeWrapper<OnRampTransactionDetails>;
  OnRampTransactionDetailsInput: OnRampTransactionDetailsInput;
  OnRampTransactionsAuth: OnRampTransactionsAuth;
  OnRampTransfer: ResolverTypeWrapper<OnRampTransfer>;
  OnRampTransferInput: OnRampTransferInput;
  OrderStatus: OrderStatus;
  OrderType: OrderType;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PairInput: PairInput;
  PermitDetailsInput: PermitDetailsInput;
  PermitInput: PermitInput;
  PoolInput: PoolInput;
  PoolTransaction: ResolverTypeWrapper<PoolTransaction>;
  PoolTransactionType: PoolTransactionType;
  Portfolio: ResolverTypeWrapper<Portfolio>;
  PortfolioValueModifier: PortfolioValueModifier;
  PriceSource: PriceSource;
  ProtectionAttackType: ProtectionAttackType;
  ProtectionInfo: ResolverTypeWrapper<ProtectionInfo>;
  ProtectionResult: ProtectionResult;
  ProtocolVersion: ProtocolVersion;
  PushNotification: ResolverTypeWrapper<PushNotification>;
  Query: ResolverTypeWrapper<{}>;
  RewardsCampaign: ResolverTypeWrapper<RewardsCampaign>;
  SafetyLevel: SafetyLevel;
  Status: ResolverTypeWrapper<Status>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  SubscriptionType: SubscriptionType;
  SwapOrderDetails: ResolverTypeWrapper<SwapOrderDetails>;
  SwapOrderDetailsInput: SwapOrderDetailsInput;
  SwapOrderStatus: SwapOrderStatus;
  SwapOrderType: SwapOrderType;
  TimestampedAmount: ResolverTypeWrapper<TimestampedAmount>;
  TimestampedOhlc: ResolverTypeWrapper<TimestampedOhlc>;
  TimestampedPoolPrice: ResolverTypeWrapper<TimestampedPoolPrice>;
  Token: ResolverTypeWrapper<Token>;
  TokenAmount: ResolverTypeWrapper<TokenAmount>;
  TokenAmountInput: TokenAmountInput;
  TokenApproval: ResolverTypeWrapper<TokenApproval>;
  TokenApprovalInput: TokenApprovalInput;
  TokenAssetInput: TokenAssetInput;
  TokenBalance: ResolverTypeWrapper<TokenBalance>;
  TokenInput: TokenInput;
  TokenMarket: ResolverTypeWrapper<TokenMarket>;
  TokenProject: ResolverTypeWrapper<TokenProject>;
  TokenProjectMarket: ResolverTypeWrapper<TokenProjectMarket>;
  TokenSortableField: TokenSortableField;
  TokenSource: TokenSource;
  TokenStandard: TokenStandard;
  TokenTradeInput: TokenTradeInput;
  TokenTradeRouteInput: TokenTradeRouteInput;
  TokenTradeRoutesInput: TokenTradeRoutesInput;
  TokenTradeType: TokenTradeType;
  TokenTransfer: ResolverTypeWrapper<TokenTransfer>;
  TokenTransferInput: TokenTransferInput;
  TradePoolInput: TradePoolInput;
  Transaction: ResolverTypeWrapper<Transaction>;
  TransactionDetails: ResolverTypeWrapper<Omit<TransactionDetails, 'assetChanges'> & { assetChanges: Array<Maybe<ResolversTypes['AssetChange']>> }>;
  TransactionDetailsInput: TransactionDetailsInput;
  TransactionDirection: TransactionDirection;
  TransactionNotification: ResolverTypeWrapper<TransactionNotification>;
  TransactionStatus: TransactionStatus;
  TransactionType: TransactionType;
  V2Pair: ResolverTypeWrapper<V2Pair>;
  V3Pool: ResolverTypeWrapper<V3Pool>;
  V3PoolTick: ResolverTypeWrapper<V3PoolTick>;
  V4Pool: ResolverTypeWrapper<V4Pool>;
  V4PoolHook: ResolverTypeWrapper<V4PoolHook>;
  V4PoolTick: ResolverTypeWrapper<V4PoolTick>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AWSJSON: Scalars['AWSJSON'];
  ActivityDetails: ResolversUnionParentTypes['ActivityDetails'];
  ActivityDetailsInput: ActivityDetailsInput;
  Amount: Amount;
  AmountChange: AmountChange;
  AmountInput: AmountInput;
  ApplicationContract: ApplicationContract;
  ApplicationContractInput: ApplicationContractInput;
  AssetActivity: Omit<AssetActivity, 'assetChanges' | 'details'> & { assetChanges: Array<Maybe<ResolversParentTypes['AssetChange']>>, details: ResolversParentTypes['ActivityDetails'] };
  AssetActivityInput: AssetActivityInput;
  AssetChange: ResolversUnionParentTypes['AssetChange'];
  AssetChangeInput: AssetChangeInput;
  BlockaidFees: BlockaidFees;
  Boolean: Scalars['Boolean'];
  BridgedWithdrawalInfo: BridgedWithdrawalInfo;
  ContractInput: ContractInput;
  CurrencyAmountInput: CurrencyAmountInput;
  DescriptionTranslations: DescriptionTranslations;
  Dimensions: Dimensions;
  DimensionsInput: DimensionsInput;
  FeeData: FeeData;
  Float: Scalars['Float'];
  IAmount: ResolversParentTypes['Amount'] | ResolversParentTypes['TimestampedAmount'];
  IContract: ResolversParentTypes['ApplicationContract'] | ResolversParentTypes['NftContract'] | ResolversParentTypes['Token'];
  ID: Scalars['ID'];
  IPool: ResolversParentTypes['V2Pair'] | ResolversParentTypes['V3Pool'];
  Image: Image;
  ImageInput: ImageInput;
  Int: Scalars['Int'];
  Mutation: {};
  NetworkFee: NetworkFee;
  NftActivity: NftActivity;
  NftActivityConnection: NftActivityConnection;
  NftActivityEdge: NftActivityEdge;
  NftActivityFilterInput: NftActivityFilterInput;
  NftApproval: NftApproval;
  NftApprovalInput: NftApprovalInput;
  NftApproveForAll: NftApproveForAll;
  NftApproveForAllInput: NftApproveForAllInput;
  NftAsset: NftAsset;
  NftAssetConnection: NftAssetConnection;
  NftAssetEdge: NftAssetEdge;
  NftAssetInput: NftAssetInput;
  NftAssetRarity: NftAssetRarity;
  NftAssetTrait: NftAssetTrait;
  NftAssetTraitInput: NftAssetTraitInput;
  NftAssetsFilterInput: NftAssetsFilterInput;
  NftBalance: NftBalance;
  NftBalanceAssetInput: NftBalanceAssetInput;
  NftBalanceConnection: NftBalanceConnection;
  NftBalanceEdge: NftBalanceEdge;
  NftBalancesFilterInput: NftBalancesFilterInput;
  NftCollection: NftCollection;
  NftCollectionBalance: NftCollectionBalance;
  NftCollectionBalanceConnection: NftCollectionBalanceConnection;
  NftCollectionBalanceEdge: NftCollectionBalanceEdge;
  NftCollectionConnection: NftCollectionConnection;
  NftCollectionEdge: NftCollectionEdge;
  NftCollectionInput: NftCollectionInput;
  NftCollectionMarket: NftCollectionMarket;
  NftCollectionMarketplace: NftCollectionMarketplace;
  NftCollectionTrait: NftCollectionTrait;
  NftCollectionTraitStats: NftCollectionTraitStats;
  NftCollectionsFilterInput: NftCollectionsFilterInput;
  NftContract: NftContract;
  NftContractInput: NftContractInput;
  NftFee: NftFee;
  NftOrder: NftOrder;
  NftOrderConnection: NftOrderConnection;
  NftOrderEdge: NftOrderEdge;
  NftProfile: NftProfile;
  NftRouteResponse: NftRouteResponse;
  NftTrade: NftTrade;
  NftTradeInput: NftTradeInput;
  NftTransfer: NftTransfer;
  NftTransferInput: NftTransferInput;
  OffRampServiceProvider: OffRampServiceProvider;
  OffRampServiceProviderInput: OffRampServiceProviderInput;
  OffRampTransactionDetails: OffRampTransactionDetails;
  OffRampTransactionDetailsInput: OffRampTransactionDetailsInput;
  OffRampTransfer: OffRampTransfer;
  OffRampTransferInput: OffRampTransferInput;
  OnRampServiceProvider: OnRampServiceProvider;
  OnRampServiceProviderInput: OnRampServiceProviderInput;
  OnRampTransactionDetails: OnRampTransactionDetails;
  OnRampTransactionDetailsInput: OnRampTransactionDetailsInput;
  OnRampTransactionsAuth: OnRampTransactionsAuth;
  OnRampTransfer: OnRampTransfer;
  OnRampTransferInput: OnRampTransferInput;
  PageInfo: PageInfo;
  PairInput: PairInput;
  PermitDetailsInput: PermitDetailsInput;
  PermitInput: PermitInput;
  PoolInput: PoolInput;
  PoolTransaction: PoolTransaction;
  Portfolio: Portfolio;
  PortfolioValueModifier: PortfolioValueModifier;
  ProtectionInfo: ProtectionInfo;
  PushNotification: PushNotification;
  Query: {};
  RewardsCampaign: RewardsCampaign;
  Status: Status;
  String: Scalars['String'];
  Subscription: {};
  SwapOrderDetails: SwapOrderDetails;
  SwapOrderDetailsInput: SwapOrderDetailsInput;
  TimestampedAmount: TimestampedAmount;
  TimestampedOhlc: TimestampedOhlc;
  TimestampedPoolPrice: TimestampedPoolPrice;
  Token: Token;
  TokenAmount: TokenAmount;
  TokenAmountInput: TokenAmountInput;
  TokenApproval: TokenApproval;
  TokenApprovalInput: TokenApprovalInput;
  TokenAssetInput: TokenAssetInput;
  TokenBalance: TokenBalance;
  TokenInput: TokenInput;
  TokenMarket: TokenMarket;
  TokenProject: TokenProject;
  TokenProjectMarket: TokenProjectMarket;
  TokenTradeInput: TokenTradeInput;
  TokenTradeRouteInput: TokenTradeRouteInput;
  TokenTradeRoutesInput: TokenTradeRoutesInput;
  TokenTransfer: TokenTransfer;
  TokenTransferInput: TokenTransferInput;
  TradePoolInput: TradePoolInput;
  Transaction: Transaction;
  TransactionDetails: Omit<TransactionDetails, 'assetChanges'> & { assetChanges: Array<Maybe<ResolversParentTypes['AssetChange']>> };
  TransactionDetailsInput: TransactionDetailsInput;
  TransactionNotification: TransactionNotification;
  V2Pair: V2Pair;
  V3Pool: V3Pool;
  V3PoolTick: V3PoolTick;
  V4Pool: V4Pool;
  V4PoolHook: V4PoolHook;
  V4PoolTick: V4PoolTick;
};

export type Aws_Api_KeyDirectiveArgs = { };

export type Aws_Api_KeyDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_Api_KeyDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_AuthDirectiveArgs = {
  cognito_groups?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Aws_AuthDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_Cognito_User_PoolsDirectiveArgs = {
  cognito_groups?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Aws_Cognito_User_PoolsDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_Cognito_User_PoolsDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_IamDirectiveArgs = { };

export type Aws_IamDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_IamDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_LambdaDirectiveArgs = { };

export type Aws_LambdaDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_LambdaDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_OidcDirectiveArgs = { };

export type Aws_OidcDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_OidcDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_PublishDirectiveArgs = {
  subscriptions?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Aws_PublishDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_PublishDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_SubscribeDirectiveArgs = {
  mutations?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Aws_SubscribeDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_SubscribeDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DeferDirectiveArgs = { };

export type DeferDirectiveResolver<Result, Parent, ContextType = any, Args = DeferDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface AwsjsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSJSON'], any> {
  name: 'AWSJSON';
}

export type ActivityDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivityDetails'] = ResolversParentTypes['ActivityDetails']> = {
  __resolveType: TypeResolveFn<'OffRampTransactionDetails' | 'OnRampTransactionDetails' | 'SwapOrderDetails' | 'TransactionDetails', ParentType, ContextType>;
};

export type AmountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Amount'] = ResolversParentTypes['Amount']> = {
  currency?: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AmountChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AmountChange'] = ResolversParentTypes['AmountChange']> = {
  absolute?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  percentage?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApplicationContractResolvers<ContextType = any, ParentType extends ResolversParentTypes['ApplicationContract'] = ResolversParentTypes['ApplicationContract']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetActivity'] = ResolversParentTypes['AssetActivity']> = {
  addresses?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  assetChanges?: Resolver<Array<Maybe<ResolversTypes['AssetChange']>>, ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  details?: Resolver<ResolversTypes['ActivityDetails'], ParentType, ContextType>;
  gasUsed?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetChange'] = ResolversParentTypes['AssetChange']> = {
  __resolveType: TypeResolveFn<'NftApproval' | 'NftApproveForAll' | 'NftTransfer' | 'OffRampTransfer' | 'OnRampTransfer' | 'TokenApproval' | 'TokenTransfer', ParentType, ContextType>;
};

export type BlockaidFeesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockaidFees'] = ResolversParentTypes['BlockaidFees']> = {
  buy?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sell?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  transfer?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BridgedWithdrawalInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['BridgedWithdrawalInfo'] = ResolversParentTypes['BridgedWithdrawalInfo']> = {
  chain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DescriptionTranslationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DescriptionTranslations'] = ResolversParentTypes['DescriptionTranslations']> = {
  descriptionEnUs?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionEs419?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionEsEs?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionEsUs?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionFrFr?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionHiIn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionIdId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionJaJp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionMsMy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionNlNl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionPtPt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionRuRu?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionThTh?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionTrTr?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionUkUa?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionUrPk?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionViVn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionZhHans?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionZhHant?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DimensionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dimensions'] = ResolversParentTypes['Dimensions']> = {
  height?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeeDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeeData'] = ResolversParentTypes['FeeData']> = {
  buyFeeBps?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  externalTransferFailed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  feeTakenOnTransfer?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sellFeeBps?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sellReverted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IAmountResolvers<ContextType = any, ParentType extends ResolversParentTypes['IAmount'] = ResolversParentTypes['IAmount']> = {
  __resolveType: TypeResolveFn<'Amount' | 'TimestampedAmount', ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type IContractResolvers<ContextType = any, ParentType extends ResolversParentTypes['IContract'] = ResolversParentTypes['IContract']> = {
  __resolveType: TypeResolveFn<'ApplicationContract' | 'NftContract' | 'Token', ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
};

export type IPoolResolvers<ContextType = any, ParentType extends ResolversParentTypes['IPool'] = ResolversParentTypes['IPool']> = {
  __resolveType: TypeResolveFn<'V2Pair' | 'V3Pool', ParentType, ContextType>;
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cumulativeVolume?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<IPoolCumulativeVolumeArgs, 'duration'>>;
  historicalVolume?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<IPoolHistoricalVolumeArgs, 'duration'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedPoolPrice']>>>, ParentType, ContextType, RequireFields<IPoolPriceHistoryArgs, 'duration'>>;
  protocolVersion?: Resolver<ResolversTypes['ProtocolVersion'], ParentType, ContextType>;
  token0?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token0Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  token1?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token1Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalLiquidity?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  totalLiquidityPercentChange24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<IPoolTransactionsArgs, 'first'>>;
  txCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  dimensions?: Resolver<Maybe<ResolversTypes['Dimensions']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  assetActivity?: Resolver<ResolversTypes['AssetActivity'], ParentType, ContextType, RequireFields<MutationAssetActivityArgs, 'input'>>;
  heartbeat?: Resolver<ResolversTypes['Status'], ParentType, ContextType, RequireFields<MutationHeartbeatArgs, 'subscriptionId' | 'type'>>;
  unsubscribe?: Resolver<ResolversTypes['Status'], ParentType, ContextType, RequireFields<MutationUnsubscribeArgs, 'subscriptionId' | 'type'>>;
};

export type NetworkFeeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NetworkFee'] = ResolversParentTypes['NetworkFee']> = {
  quantity?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenChain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenSymbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftActivity'] = ResolversParentTypes['NftActivity']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  asset?: Resolver<Maybe<ResolversTypes['NftAsset']>, ParentType, ContextType>;
  fromAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  marketplace?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orderStatus?: Resolver<Maybe<ResolversTypes['OrderStatus']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  toAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  transactionHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NftActivityType'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftActivityConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftActivityConnection'] = ResolversParentTypes['NftActivityConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftActivityEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftActivityEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftActivityEdge'] = ResolversParentTypes['NftActivityEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftActivity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftApprovalResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftApproval'] = ResolversParentTypes['NftApproval']> = {
  approvedAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  asset?: Resolver<ResolversTypes['NftAsset'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftStandard?: Resolver<ResolversTypes['NftStandard'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftApproveForAllResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftApproveForAll'] = ResolversParentTypes['NftApproveForAll']> = {
  approved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  asset?: Resolver<ResolversTypes['NftAsset'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftStandard?: Resolver<ResolversTypes['NftStandard'], ParentType, ContextType>;
  operatorAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAsset'] = ResolversParentTypes['NftAsset']> = {
  animationUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  chain?: Resolver<Maybe<ResolversTypes['Chain']>, ParentType, ContextType>;
  collection?: Resolver<Maybe<ResolversTypes['NftCollection']>, ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['NftProfile']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  flaggedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isSpam?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  listings?: Resolver<Maybe<ResolversTypes['NftOrderConnection']>, ParentType, ContextType, Partial<NftAssetListingsArgs>>;
  mediaType?: Resolver<Maybe<ResolversTypes['MediaType']>, ParentType, ContextType>;
  metadataUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nftContract?: Resolver<Maybe<ResolversTypes['NftContract']>, ParentType, ContextType>;
  originalImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  ownerAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  protectionInfo?: Resolver<Maybe<ResolversTypes['ProtectionInfo']>, ParentType, ContextType>;
  rarities?: Resolver<Maybe<Array<ResolversTypes['NftAssetRarity']>>, ParentType, ContextType>;
  smallImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  smallImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  suspiciousFlag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  traits?: Resolver<Maybe<Array<ResolversTypes['NftAssetTrait']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAssetConnection'] = ResolversParentTypes['NftAssetConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftAssetEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAssetEdge'] = ResolversParentTypes['NftAssetEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftAsset'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetRarityResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAssetRarity'] = ResolversParentTypes['NftAssetRarity']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  provider?: Resolver<Maybe<ResolversTypes['NftRarityProvider']>, ParentType, ContextType>;
  rank?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetTraitResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAssetTrait'] = ResolversParentTypes['NftAssetTrait']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rarity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftBalanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftBalance'] = ResolversParentTypes['NftBalance']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastPrice?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  listedMarketplaces?: Resolver<Maybe<Array<ResolversTypes['NftMarketplace']>>, ParentType, ContextType>;
  listingFees?: Resolver<Maybe<Array<Maybe<ResolversTypes['NftFee']>>>, ParentType, ContextType>;
  ownedAsset?: Resolver<Maybe<ResolversTypes['NftAsset']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftBalanceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftBalanceConnection'] = ResolversParentTypes['NftBalanceConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftBalanceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftBalanceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftBalanceEdge'] = ResolversParentTypes['NftBalanceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftBalance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollection'] = ResolversParentTypes['NftCollection']> = {
  bannerImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  bannerImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  collectionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['NftProfile']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  homepageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  instagramName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  markets?: Resolver<Maybe<Array<ResolversTypes['NftCollectionMarket']>>, ParentType, ContextType, RequireFields<NftCollectionMarketsArgs, 'currencies'>>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nftContracts?: Resolver<Maybe<Array<ResolversTypes['NftContract']>>, ParentType, ContextType>;
  numAssets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  openseaUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  traits?: Resolver<Maybe<Array<ResolversTypes['NftCollectionTrait']>>, ParentType, ContextType>;
  twitterName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionBalanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionBalance'] = ResolversParentTypes['NftCollectionBalance']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logoImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionBalanceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionBalanceConnection'] = ResolversParentTypes['NftCollectionBalanceConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftCollectionBalanceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionBalanceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionBalanceEdge'] = ResolversParentTypes['NftCollectionBalanceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftCollectionBalance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionConnection'] = ResolversParentTypes['NftCollectionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftCollectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionEdge'] = ResolversParentTypes['NftCollectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftCollection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionMarketResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionMarket'] = ResolversParentTypes['NftCollectionMarket']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  floorPricePercentChange?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType, Partial<NftCollectionMarketFloorPricePercentChangeArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  listings?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  marketplaces?: Resolver<Maybe<Array<ResolversTypes['NftCollectionMarketplace']>>, ParentType, ContextType, Partial<NftCollectionMarketMarketplacesArgs>>;
  nftContracts?: Resolver<Maybe<Array<ResolversTypes['NftContract']>>, ParentType, ContextType>;
  owners?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  percentListed?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  percentUniqueOwners?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  sales?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType, Partial<NftCollectionMarketSalesArgs>>;
  totalVolume?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType, Partial<NftCollectionMarketVolumeArgs>>;
  volume24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  volumePercentChange?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType, Partial<NftCollectionMarketVolumePercentChangeArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionMarketplaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionMarketplace'] = ResolversParentTypes['NftCollectionMarketplace']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  listings?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  marketplace?: Resolver<Maybe<ResolversTypes['NftMarketplace']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionTraitResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionTrait'] = ResolversParentTypes['NftCollectionTrait']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<Array<ResolversTypes['NftCollectionTraitStats']>>, ParentType, ContextType>;
  values?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionTraitStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionTraitStats'] = ResolversParentTypes['NftCollectionTraitStats']> = {
  assets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  listings?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftContractResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftContract'] = ResolversParentTypes['NftContract']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  standard?: Resolver<Maybe<ResolversTypes['NftStandard']>, ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalSupply?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftFeeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftFee'] = ResolversParentTypes['NftFee']> = {
  basisPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  payoutAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftOrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftOrder'] = ResolversParentTypes['NftOrder']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  auctionType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  endAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  maker?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  marketplace?: Resolver<ResolversTypes['NftMarketplace'], ParentType, ContextType>;
  marketplaceUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  poolPrices?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  protocolParameters?: Resolver<Maybe<ResolversTypes['AWSJSON']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  taker?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['OrderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftOrderConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftOrderConnection'] = ResolversParentTypes['NftOrderConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftOrderEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftOrderEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftOrderEdge'] = ResolversParentTypes['NftOrderEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftOrder'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftProfile'] = ResolversParentTypes['NftProfile']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  profileImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftRouteResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftRouteResponse'] = ResolversParentTypes['NftRouteResponse']> = {
  calldata?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  route?: Resolver<Maybe<Array<ResolversTypes['NftTrade']>>, ParentType, ContextType>;
  sendAmount?: Resolver<ResolversTypes['TokenAmount'], ParentType, ContextType>;
  toAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftTradeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftTrade'] = ResolversParentTypes['NftTrade']> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contractAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  marketplace?: Resolver<ResolversTypes['NftMarketplace'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['TokenAmount'], ParentType, ContextType>;
  quotePrice?: Resolver<Maybe<ResolversTypes['TokenAmount']>, ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenType?: Resolver<Maybe<ResolversTypes['NftStandard']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftTransfer'] = ResolversParentTypes['NftTransfer']> = {
  asset?: Resolver<ResolversTypes['NftAsset'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['TransactionDirection'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftStandard?: Resolver<ResolversTypes['NftStandard'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OffRampServiceProviderResolvers<ContextType = any, ParentType extends ResolversParentTypes['OffRampServiceProvider'] = ResolversParentTypes['OffRampServiceProvider']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logoDarkUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logoLightUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  serviceProvider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  supportUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OffRampTransactionDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['OffRampTransactionDetails'] = ResolversParentTypes['OffRampTransactionDetails']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  offRampTransfer?: Resolver<ResolversTypes['OffRampTransfer'], ParentType, ContextType>;
  senderAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TransactionStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OffRampTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['OffRampTransfer'] = ResolversParentTypes['OffRampTransfer']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  destinationAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  destinationCurrency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  externalSessionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  networkFee?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  serviceProvider?: Resolver<ResolversTypes['OffRampServiceProvider'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  tokenStandard?: Resolver<ResolversTypes['TokenStandard'], ParentType, ContextType>;
  totalFee?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  transactionFee?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  transactionReferenceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OnRampServiceProviderResolvers<ContextType = any, ParentType extends ResolversParentTypes['OnRampServiceProvider'] = ResolversParentTypes['OnRampServiceProvider']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logoDarkUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logoLightUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  serviceProvider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  supportUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OnRampTransactionDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['OnRampTransactionDetails'] = ResolversParentTypes['OnRampTransactionDetails']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  onRampTransfer?: Resolver<ResolversTypes['OnRampTransfer'], ParentType, ContextType>;
  receiverAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TransactionStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OnRampTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['OnRampTransfer'] = ResolversParentTypes['OnRampTransfer']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  externalSessionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  networkFee?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  serviceProvider?: Resolver<ResolversTypes['OnRampServiceProvider'], ParentType, ContextType>;
  sourceAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sourceCurrency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  tokenStandard?: Resolver<ResolversTypes['TokenStandard'], ParentType, ContextType>;
  totalFee?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  transactionFee?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  transactionReferenceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasPreviousPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PoolTransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PoolTransaction'] = ResolversParentTypes['PoolTransaction']> = {
  account?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  protocolVersion?: Resolver<ResolversTypes['ProtocolVersion'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  token0Quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  token1Quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['PoolTransactionType'], ParentType, ContextType>;
  usdValue?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortfolioResolvers<ContextType = any, ParentType extends ResolversParentTypes['Portfolio'] = ResolversParentTypes['Portfolio']> = {
  assetActivities?: Resolver<Maybe<Array<Maybe<ResolversTypes['AssetActivity']>>>, ParentType, ContextType, Partial<PortfolioAssetActivitiesArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftBalances?: Resolver<Maybe<Array<Maybe<ResolversTypes['NftBalance']>>>, ParentType, ContextType>;
  ownerAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenBalances?: Resolver<Maybe<Array<Maybe<ResolversTypes['TokenBalance']>>>, ParentType, ContextType>;
  tokensTotalDenominatedValue?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  tokensTotalDenominatedValueChange?: Resolver<Maybe<ResolversTypes['AmountChange']>, ParentType, ContextType, Partial<PortfolioTokensTotalDenominatedValueChangeArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProtectionInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProtectionInfo'] = ResolversParentTypes['ProtectionInfo']> = {
  attackTypes?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProtectionAttackType']>>>, ParentType, ContextType>;
  blockaidFees?: Resolver<Maybe<ResolversTypes['BlockaidFees']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['ProtectionResult']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PushNotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PushNotification'] = ResolversParentTypes['PushNotification']> = {
  contents?: Resolver<ResolversTypes['AWSJSON'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notifyAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signerHeader?: Resolver<ResolversTypes['AWSJSON'], ParentType, ContextType>;
  viewerHeader?: Resolver<ResolversTypes['AWSJSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  convert?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<QueryConvertArgs, 'fromAmount' | 'toCurrency'>>;
  dailyProtocolTvl?: Resolver<Maybe<Array<ResolversTypes['TimestampedAmount']>>, ParentType, ContextType, RequireFields<QueryDailyProtocolTvlArgs, 'chain' | 'version'>>;
  historicalProtocolVolume?: Resolver<Maybe<Array<ResolversTypes['TimestampedAmount']>>, ParentType, ContextType, RequireFields<QueryHistoricalProtocolVolumeArgs, 'chain' | 'duration' | 'version'>>;
  isV3SubgraphStale?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<QueryIsV3SubgraphStaleArgs, 'chain'>>;
  nftActivity?: Resolver<Maybe<ResolversTypes['NftActivityConnection']>, ParentType, ContextType, Partial<QueryNftActivityArgs>>;
  nftAssets?: Resolver<Maybe<ResolversTypes['NftAssetConnection']>, ParentType, ContextType, RequireFields<QueryNftAssetsArgs, 'address'>>;
  nftBalances?: Resolver<Maybe<ResolversTypes['NftBalanceConnection']>, ParentType, ContextType, RequireFields<QueryNftBalancesArgs, 'ownerAddress'>>;
  nftCollectionBalances?: Resolver<Maybe<ResolversTypes['NftCollectionBalanceConnection']>, ParentType, ContextType, RequireFields<QueryNftCollectionBalancesArgs, 'ownerAddress'>>;
  nftCollections?: Resolver<Maybe<ResolversTypes['NftCollectionConnection']>, ParentType, ContextType, Partial<QueryNftCollectionsArgs>>;
  nftRoute?: Resolver<Maybe<ResolversTypes['NftRouteResponse']>, ParentType, ContextType, RequireFields<QueryNftRouteArgs, 'nftTrades' | 'senderAddress'>>;
  portfolios?: Resolver<Maybe<Array<Maybe<ResolversTypes['Portfolio']>>>, ParentType, ContextType, RequireFields<QueryPortfoliosArgs, 'ownerAddresses'>>;
  searchTokens?: Resolver<Maybe<Array<Maybe<ResolversTypes['Token']>>>, ParentType, ContextType, RequireFields<QuerySearchTokensArgs, 'searchQuery'>>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QueryTokenArgs, 'chain'>>;
  tokenProjects?: Resolver<Maybe<Array<Maybe<ResolversTypes['TokenProject']>>>, ParentType, ContextType, RequireFields<QueryTokenProjectsArgs, 'contracts'>>;
  tokens?: Resolver<Maybe<Array<Maybe<ResolversTypes['Token']>>>, ParentType, ContextType, RequireFields<QueryTokensArgs, 'contracts'>>;
  topCollections?: Resolver<Maybe<ResolversTypes['NftCollectionConnection']>, ParentType, ContextType, Partial<QueryTopCollectionsArgs>>;
  topTokens?: Resolver<Maybe<Array<Maybe<ResolversTypes['Token']>>>, ParentType, ContextType, Partial<QueryTopTokensArgs>>;
  topV2Pairs?: Resolver<Maybe<Array<ResolversTypes['V2Pair']>>, ParentType, ContextType, RequireFields<QueryTopV2PairsArgs, 'chain' | 'first'>>;
  topV3Pools?: Resolver<Maybe<Array<ResolversTypes['V3Pool']>>, ParentType, ContextType, RequireFields<QueryTopV3PoolsArgs, 'chain' | 'first'>>;
  topV4Pools?: Resolver<Maybe<Array<ResolversTypes['V4Pool']>>, ParentType, ContextType, RequireFields<QueryTopV4PoolsArgs, 'chain' | 'first'>>;
  transactionNotification?: Resolver<Maybe<ResolversTypes['TransactionNotification']>, ParentType, ContextType, RequireFields<QueryTransactionNotificationArgs, 'address' | 'chain' | 'transactionHash'>>;
  v2Pair?: Resolver<Maybe<ResolversTypes['V2Pair']>, ParentType, ContextType, RequireFields<QueryV2PairArgs, 'address' | 'chain'>>;
  v2Transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<QueryV2TransactionsArgs, 'chain' | 'first'>>;
  v3Pool?: Resolver<Maybe<ResolversTypes['V3Pool']>, ParentType, ContextType, RequireFields<QueryV3PoolArgs, 'address' | 'chain'>>;
  v3PoolsForTokenPair?: Resolver<Maybe<Array<ResolversTypes['V3Pool']>>, ParentType, ContextType, RequireFields<QueryV3PoolsForTokenPairArgs, 'chain' | 'token0' | 'token1'>>;
  v3Transactions?: Resolver<Maybe<Array<ResolversTypes['PoolTransaction']>>, ParentType, ContextType, RequireFields<QueryV3TransactionsArgs, 'chain' | 'first'>>;
  v4Pool?: Resolver<Maybe<ResolversTypes['V4Pool']>, ParentType, ContextType, RequireFields<QueryV4PoolArgs, 'chain' | 'poolId'>>;
  v4PoolsForTokenPair?: Resolver<Maybe<Array<ResolversTypes['V4Pool']>>, ParentType, ContextType, RequireFields<QueryV4PoolsForTokenPairArgs, 'chain' | 'token0' | 'token1'>>;
  v4Transactions?: Resolver<Maybe<Array<ResolversTypes['PoolTransaction']>>, ParentType, ContextType, RequireFields<QueryV4TransactionsArgs, 'chain' | 'first'>>;
};

export type RewardsCampaignResolvers<ContextType = any, ParentType extends ResolversParentTypes['RewardsCampaign'] = ResolversParentTypes['RewardsCampaign']> = {
  boostedApr?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  distributedRewards?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  startTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalRewardAllocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['Status'] = ResolversParentTypes['Status']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  onAssetActivity?: SubscriptionResolver<Maybe<ResolversTypes['AssetActivity']>, "onAssetActivity", ParentType, ContextType, RequireFields<SubscriptionOnAssetActivityArgs, 'addresses' | 'subscriptionId'>>;
};

export type SwapOrderDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SwapOrderDetails'] = ResolversParentTypes['SwapOrderDetails']> = {
  encodedOrder?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiry?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inputToken?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  inputTokenQuantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  offerer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  outputToken?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  outputTokenQuantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SwapOrderStatus'], ParentType, ContextType>;
  swapOrderStatus?: Resolver<ResolversTypes['SwapOrderStatus'], ParentType, ContextType>;
  swapOrderType?: Resolver<ResolversTypes['SwapOrderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimestampedAmountResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimestampedAmount'] = ResolversParentTypes['TimestampedAmount']> = {
  currency?: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimestampedOhlcResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimestampedOhlc'] = ResolversParentTypes['TimestampedOhlc']> = {
  close?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  high?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  low?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  open?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimestampedPoolPriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimestampedPoolPrice'] = ResolversParentTypes['TimestampedPoolPrice']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token0Price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  token1Price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bridgedWithdrawalInfo?: Resolver<Maybe<ResolversTypes['BridgedWithdrawalInfo']>, ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  decimals?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  feeData?: Resolver<Maybe<ResolversTypes['FeeData']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isBridged?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  market?: Resolver<Maybe<ResolversTypes['TokenMarket']>, ParentType, ContextType, Partial<TokenMarketArgs>>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project?: Resolver<Maybe<ResolversTypes['TokenProject']>, ParentType, ContextType>;
  protectionInfo?: Resolver<Maybe<ResolversTypes['ProtectionInfo']>, ParentType, ContextType>;
  source?: Resolver<Maybe<ResolversTypes['TokenSource']>, ParentType, ContextType>;
  standard?: Resolver<Maybe<ResolversTypes['TokenStandard']>, ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  v2Transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<TokenV2TransactionsArgs, 'first'>>;
  v3Transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<TokenV3TransactionsArgs, 'first'>>;
  v4Transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<TokenV4TransactionsArgs, 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenAmountResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenAmount'] = ResolversParentTypes['TokenAmount']> = {
  currency?: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenApprovalResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenApproval'] = ResolversParentTypes['TokenApproval']> = {
  approvedAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  asset?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenStandard?: Resolver<ResolversTypes['TokenStandard'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenBalanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenBalance'] = ResolversParentTypes['TokenBalance']> = {
  blockNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  blockTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  denominatedValue?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isHidden?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  ownerAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  tokenProjectMarket?: Resolver<Maybe<ResolversTypes['TokenProjectMarket']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenMarketResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenMarket'] = ResolversParentTypes['TokenMarket']> = {
  fullyDilutedValuation?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  historicalTvl?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<TokenMarketHistoricalTvlArgs, 'duration'>>;
  historicalVolume?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<TokenMarketHistoricalVolumeArgs, 'duration'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ohlc?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedOhlc']>>>, ParentType, ContextType, RequireFields<TokenMarketOhlcArgs, 'duration'>>;
  price?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  priceHighLow?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenMarketPriceHighLowArgs, 'duration' | 'highLow'>>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<TokenMarketPriceHistoryArgs, 'duration'>>;
  pricePercentChange?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenMarketPricePercentChangeArgs, 'duration'>>;
  priceSource?: Resolver<ResolversTypes['PriceSource'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  totalValueLocked?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenMarketVolumeArgs, 'duration'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenProject'] = ResolversParentTypes['TokenProject']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionTranslations?: Resolver<Maybe<ResolversTypes['DescriptionTranslations']>, ParentType, ContextType>;
  homepageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSpam?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  markets?: Resolver<Maybe<Array<Maybe<ResolversTypes['TokenProjectMarket']>>>, ParentType, ContextType, RequireFields<TokenProjectMarketsArgs, 'currencies'>>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  safetyLevel?: Resolver<Maybe<ResolversTypes['SafetyLevel']>, ParentType, ContextType>;
  smallLogo?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  spamCode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType>;
  twitterName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenProjectMarketResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenProjectMarket'] = ResolversParentTypes['TokenProjectMarket']> = {
  currency?: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  fullyDilutedValuation?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  marketCap?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  priceHigh52w?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  priceHighLow?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenProjectMarketPriceHighLowArgs, 'duration' | 'highLow'>>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<TokenProjectMarketPriceHistoryArgs, 'duration'>>;
  priceLow52w?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  pricePercentChange?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenProjectMarketPricePercentChangeArgs, 'duration'>>;
  pricePercentChange24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  tokenProject?: Resolver<ResolversTypes['TokenProject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenTransfer'] = ResolversParentTypes['TokenTransfer']> = {
  asset?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['TransactionDirection'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenStandard?: Resolver<ResolversTypes['TokenStandard'], ParentType, ContextType>;
  transactedValue?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  from?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gasLimit?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  maxFeePerGas?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TransactionStatus'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionDetails'] = ResolversParentTypes['TransactionDetails']> = {
  application?: Resolver<Maybe<ResolversTypes['ApplicationContract']>, ParentType, ContextType>;
  assetChanges?: Resolver<Array<Maybe<ResolversTypes['AssetChange']>>, ParentType, ContextType>;
  from?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  networkFee?: Resolver<Maybe<ResolversTypes['NetworkFee']>, ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TransactionStatus'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionStatus?: Resolver<ResolversTypes['TransactionStatus'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TransactionType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionNotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionNotification'] = ResolversParentTypes['TransactionNotification']> = {
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  push?: Resolver<Array<ResolversTypes['PushNotification']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type V2PairResolvers<ContextType = any, ParentType extends ResolversParentTypes['V2Pair'] = ResolversParentTypes['V2Pair']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cumulativeVolume?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<V2PairCumulativeVolumeArgs, 'duration'>>;
  historicalVolume?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<V2PairHistoricalVolumeArgs, 'duration'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedPoolPrice']>>>, ParentType, ContextType, RequireFields<V2PairPriceHistoryArgs, 'duration'>>;
  protocolVersion?: Resolver<ResolversTypes['ProtocolVersion'], ParentType, ContextType>;
  token0?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token0Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  token1?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token1Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalLiquidity?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  totalLiquidityPercentChange24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<V2PairTransactionsArgs, 'first'>>;
  txCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type V3PoolResolvers<ContextType = any, ParentType extends ResolversParentTypes['V3Pool'] = ResolversParentTypes['V3Pool']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cumulativeVolume?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<V3PoolCumulativeVolumeArgs, 'duration'>>;
  feeTier?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  historicalVolume?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<V3PoolHistoricalVolumeArgs, 'duration'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedPoolPrice']>>>, ParentType, ContextType, RequireFields<V3PoolPriceHistoryArgs, 'duration'>>;
  protocolVersion?: Resolver<ResolversTypes['ProtocolVersion'], ParentType, ContextType>;
  ticks?: Resolver<Maybe<Array<Maybe<ResolversTypes['V3PoolTick']>>>, ParentType, ContextType, Partial<V3PoolTicksArgs>>;
  token0?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token0Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  token1?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token1Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalLiquidity?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  totalLiquidityPercentChange24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<V3PoolTransactionsArgs, 'first'>>;
  txCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type V3PoolTickResolvers<ContextType = any, ParentType extends ResolversParentTypes['V3PoolTick'] = ResolversParentTypes['V3PoolTick']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityGross?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  liquidityNet?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price0?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tickIdx?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type V4PoolResolvers<ContextType = any, ParentType extends ResolversParentTypes['V4Pool'] = ResolversParentTypes['V4Pool']> = {
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cumulativeVolume?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<V4PoolCumulativeVolumeArgs, 'duration'>>;
  feeTier?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  historicalVolume?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<V4PoolHistoricalVolumeArgs, 'duration'>>;
  hook?: Resolver<Maybe<ResolversTypes['V4PoolHook']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDynamicFee?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  poolId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedPoolPrice']>>>, ParentType, ContextType, RequireFields<V4PoolPriceHistoryArgs, 'duration'>>;
  protocolVersion?: Resolver<ResolversTypes['ProtocolVersion'], ParentType, ContextType>;
  rewardsCampaign?: Resolver<Maybe<ResolversTypes['RewardsCampaign']>, ParentType, ContextType>;
  tickSpacing?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ticks?: Resolver<Maybe<Array<Maybe<ResolversTypes['V4PoolTick']>>>, ParentType, ContextType, Partial<V4PoolTicksArgs>>;
  token0?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token0Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  token1?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token1Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalLiquidity?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  totalLiquidityPercentChange24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<V4PoolTransactionsArgs, 'first'>>;
  txCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type V4PoolHookResolvers<ContextType = any, ParentType extends ResolversParentTypes['V4PoolHook'] = ResolversParentTypes['V4PoolHook']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type V4PoolTickResolvers<ContextType = any, ParentType extends ResolversParentTypes['V4PoolTick'] = ResolversParentTypes['V4PoolTick']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityGross?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  liquidityNet?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price0?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tickIdx?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AWSJSON?: GraphQLScalarType;
  ActivityDetails?: ActivityDetailsResolvers<ContextType>;
  Amount?: AmountResolvers<ContextType>;
  AmountChange?: AmountChangeResolvers<ContextType>;
  ApplicationContract?: ApplicationContractResolvers<ContextType>;
  AssetActivity?: AssetActivityResolvers<ContextType>;
  AssetChange?: AssetChangeResolvers<ContextType>;
  BlockaidFees?: BlockaidFeesResolvers<ContextType>;
  BridgedWithdrawalInfo?: BridgedWithdrawalInfoResolvers<ContextType>;
  DescriptionTranslations?: DescriptionTranslationsResolvers<ContextType>;
  Dimensions?: DimensionsResolvers<ContextType>;
  FeeData?: FeeDataResolvers<ContextType>;
  IAmount?: IAmountResolvers<ContextType>;
  IContract?: IContractResolvers<ContextType>;
  IPool?: IPoolResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NetworkFee?: NetworkFeeResolvers<ContextType>;
  NftActivity?: NftActivityResolvers<ContextType>;
  NftActivityConnection?: NftActivityConnectionResolvers<ContextType>;
  NftActivityEdge?: NftActivityEdgeResolvers<ContextType>;
  NftApproval?: NftApprovalResolvers<ContextType>;
  NftApproveForAll?: NftApproveForAllResolvers<ContextType>;
  NftAsset?: NftAssetResolvers<ContextType>;
  NftAssetConnection?: NftAssetConnectionResolvers<ContextType>;
  NftAssetEdge?: NftAssetEdgeResolvers<ContextType>;
  NftAssetRarity?: NftAssetRarityResolvers<ContextType>;
  NftAssetTrait?: NftAssetTraitResolvers<ContextType>;
  NftBalance?: NftBalanceResolvers<ContextType>;
  NftBalanceConnection?: NftBalanceConnectionResolvers<ContextType>;
  NftBalanceEdge?: NftBalanceEdgeResolvers<ContextType>;
  NftCollection?: NftCollectionResolvers<ContextType>;
  NftCollectionBalance?: NftCollectionBalanceResolvers<ContextType>;
  NftCollectionBalanceConnection?: NftCollectionBalanceConnectionResolvers<ContextType>;
  NftCollectionBalanceEdge?: NftCollectionBalanceEdgeResolvers<ContextType>;
  NftCollectionConnection?: NftCollectionConnectionResolvers<ContextType>;
  NftCollectionEdge?: NftCollectionEdgeResolvers<ContextType>;
  NftCollectionMarket?: NftCollectionMarketResolvers<ContextType>;
  NftCollectionMarketplace?: NftCollectionMarketplaceResolvers<ContextType>;
  NftCollectionTrait?: NftCollectionTraitResolvers<ContextType>;
  NftCollectionTraitStats?: NftCollectionTraitStatsResolvers<ContextType>;
  NftContract?: NftContractResolvers<ContextType>;
  NftFee?: NftFeeResolvers<ContextType>;
  NftOrder?: NftOrderResolvers<ContextType>;
  NftOrderConnection?: NftOrderConnectionResolvers<ContextType>;
  NftOrderEdge?: NftOrderEdgeResolvers<ContextType>;
  NftProfile?: NftProfileResolvers<ContextType>;
  NftRouteResponse?: NftRouteResponseResolvers<ContextType>;
  NftTrade?: NftTradeResolvers<ContextType>;
  NftTransfer?: NftTransferResolvers<ContextType>;
  OffRampServiceProvider?: OffRampServiceProviderResolvers<ContextType>;
  OffRampTransactionDetails?: OffRampTransactionDetailsResolvers<ContextType>;
  OffRampTransfer?: OffRampTransferResolvers<ContextType>;
  OnRampServiceProvider?: OnRampServiceProviderResolvers<ContextType>;
  OnRampTransactionDetails?: OnRampTransactionDetailsResolvers<ContextType>;
  OnRampTransfer?: OnRampTransferResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PoolTransaction?: PoolTransactionResolvers<ContextType>;
  Portfolio?: PortfolioResolvers<ContextType>;
  ProtectionInfo?: ProtectionInfoResolvers<ContextType>;
  PushNotification?: PushNotificationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RewardsCampaign?: RewardsCampaignResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SwapOrderDetails?: SwapOrderDetailsResolvers<ContextType>;
  TimestampedAmount?: TimestampedAmountResolvers<ContextType>;
  TimestampedOhlc?: TimestampedOhlcResolvers<ContextType>;
  TimestampedPoolPrice?: TimestampedPoolPriceResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  TokenAmount?: TokenAmountResolvers<ContextType>;
  TokenApproval?: TokenApprovalResolvers<ContextType>;
  TokenBalance?: TokenBalanceResolvers<ContextType>;
  TokenMarket?: TokenMarketResolvers<ContextType>;
  TokenProject?: TokenProjectResolvers<ContextType>;
  TokenProjectMarket?: TokenProjectMarketResolvers<ContextType>;
  TokenTransfer?: TokenTransferResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
  TransactionDetails?: TransactionDetailsResolvers<ContextType>;
  TransactionNotification?: TransactionNotificationResolvers<ContextType>;
  V2Pair?: V2PairResolvers<ContextType>;
  V3Pool?: V3PoolResolvers<ContextType>;
  V3PoolTick?: V3PoolTickResolvers<ContextType>;
  V4Pool?: V4PoolResolvers<ContextType>;
  V4PoolHook?: V4PoolHookResolvers<ContextType>;
  V4PoolTick?: V4PoolTickResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  aws_api_key?: Aws_Api_KeyDirectiveResolver<any, any, ContextType>;
  aws_auth?: Aws_AuthDirectiveResolver<any, any, ContextType>;
  aws_cognito_user_pools?: Aws_Cognito_User_PoolsDirectiveResolver<any, any, ContextType>;
  aws_iam?: Aws_IamDirectiveResolver<any, any, ContextType>;
  aws_lambda?: Aws_LambdaDirectiveResolver<any, any, ContextType>;
  aws_oidc?: Aws_OidcDirectiveResolver<any, any, ContextType>;
  aws_publish?: Aws_PublishDirectiveResolver<any, any, ContextType>;
  aws_subscribe?: Aws_SubscribeDirectiveResolver<any, any, ContextType>;
  defer?: DeferDirectiveResolver<any, any, ContextType>;
};
