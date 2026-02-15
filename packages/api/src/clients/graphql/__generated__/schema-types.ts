export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `AWSJSON` scalar type provided by AWS AppSync, represents a JSON string that
   * complies with [RFC 8259](https://tools.ietf.org/html/rfc8259).  Maps like
   * "**{\\"upvotes\\": 10}**", lists like "**[1,2,3]**", and scalar values like
   * "**\\"AWSJSON example string\\"**", "**1**", and "**true**" are accepted as
   * valid JSON and will automatically be parsed and loaded in the resolver mapping
   * templates as Maps, Lists, or Scalar values rather than as the literal input
   * strings.  Invalid JSON strings like "**{a: 1}**", "**{'a': 1}**" and "**Unquoted
   * string**" will throw GraphQL validation errors.
   */
  AWSJSON: any;
};

/**
 *  Types, unions, and inputs (alphabetized):
 * These are colocated to highlight the relationship between some types and their inputs.
 */
export type ActivityDetails = OffRampTransactionDetails | OnRampTransactionDetails | SwapOrderDetails | TransactionDetails;

export type ActivityDetailsInput = {
  offRampTransactionDetails?: InputMaybe<OffRampTransactionDetailsInput>;
  onRampTransactionDetails?: InputMaybe<OnRampTransactionDetailsInput>;
  swapOrderDetails?: InputMaybe<SwapOrderDetailsInput>;
  transactionDetails?: InputMaybe<TransactionDetailsInput>;
};

/**
 *  Enums (alphabetized):
 * deprecated and replaced with TransactionType, please do not use this
 */
export enum ActivityType {
  Approve = 'APPROVE',
  Borrow = 'BORROW',
  Burn = 'BURN',
  Cancel = 'CANCEL',
  Claim = 'CLAIM',
  Deployment = 'DEPLOYMENT',
  Lend = 'LEND',
  Mint = 'MINT',
  Nft = 'NFT',
  OffRamp = 'OFF_RAMP',
  OnRamp = 'ON_RAMP',
  Receive = 'RECEIVE',
  Repay = 'REPAY',
  Send = 'SEND',
  Stake = 'STAKE',
  Swap = 'SWAP',
  SwapOrder = 'SWAP_ORDER',
  Staking = 'Staking',
  Unknown = 'UNKNOWN',
  Unstake = 'UNSTAKE',
  Withdraw = 'WITHDRAW',
  Market = 'market',
  Money = 'money'
}

export type Amount = IAmount & {
  __typename?: 'Amount';
  currency?: Maybe<Currency>;
  id: Scalars['ID'];
  value: Scalars['Float'];
};

export type AmountChange = {
  __typename?: 'AmountChange';
  absolute?: Maybe<Amount>;
  id: Scalars['ID'];
  percentage?: Maybe<Amount>;
};

export type AmountInput = {
  currency?: InputMaybe<Currency>;
  value: Scalars['Float'];
};

export type ApplicationContract = IContract & {
  __typename?: 'ApplicationContract';
  address: Scalars['String'];
  chain: Chain;
  icon?: Maybe<Image>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type ApplicationContractInput = {
  address: Scalars['String'];
  chain: Chain;
  icon?: InputMaybe<ImageInput>;
  name?: InputMaybe<Scalars['String']>;
};

export type AssetActivity = {
  __typename?: 'AssetActivity';
  addresses?: Maybe<Array<Scalars['String']>>;
  /** @deprecated use assetChanges field in details */
  assetChanges: Array<Maybe<AssetChange>>;
  chain: Chain;
  details: ActivityDetails;
  /** @deprecated not required, remove usage */
  gasUsed?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  /** @deprecated use fields from details */
  transaction: Transaction;
  /** @deprecated use type field in details */
  type: ActivityType;
};

export type AssetActivityInput = {
  chain: Chain;
  details: ActivityDetailsInput;
  timestamp: Scalars['Int'];
};

export enum AssetActivitySwitch {
  Alternate = 'ALTERNATE',
  Legacy = 'LEGACY'
}

export type AssetChange = NftApproval | NftApproveForAll | NftTransfer | OffRampTransfer | OnRampTransfer | TokenApproval | TokenTransfer;

export type AssetChangeInput = {
  nftApproval?: InputMaybe<NftApprovalInput>;
  nftApproveForAll?: InputMaybe<NftApproveForAllInput>;
  nftTransfer?: InputMaybe<NftTransferInput>;
  offRampTransfer?: InputMaybe<OffRampTransferInput>;
  onRampTransfer?: InputMaybe<OnRampTransferInput>;
  tokenApproval?: InputMaybe<TokenApprovalInput>;
  tokenTransfer?: InputMaybe<TokenTransferInput>;
};

export type BlockaidFees = {
  __typename?: 'BlockaidFees';
  buy?: Maybe<Scalars['Float']>;
  sell?: Maybe<Scalars['Float']>;
  transfer?: Maybe<Scalars['Float']>;
};

export type BridgedWithdrawalInfo = {
  __typename?: 'BridgedWithdrawalInfo';
  chain: Scalars['String'];
  provider: Scalars['String'];
  url: Scalars['String'];
};

export enum Chain {
  Arbitrum = 'ARBITRUM',
  ArbitrumSepolia = 'ARBITRUM_SEPOLIA',
  AstrochainSepolia = 'ASTROCHAIN_SEPOLIA',
  Avalanche = 'AVALANCHE',
  Base = 'BASE',
  BaseSepolia = 'BASE_SEPOLIA',
  Blast = 'BLAST',
  Bnb = 'BNB',
  Celo = 'CELO',
  Ethereum = 'ETHEREUM',
  EthereumGoerli = 'ETHEREUM_GOERLI',
  EthereumSepolia = 'ETHEREUM_SEPOLIA',
  Monad = 'MONAD',
  MonadTestnet = 'MONAD_TESTNET',
  Optimism = 'OPTIMISM',
  Polygon = 'POLYGON',
  Solana = 'SOLANA',
  Soneium = 'SONEIUM',
  Unichain = 'UNICHAIN',
  UnknownChain = 'UNKNOWN_CHAIN',
  Worldchain = 'WORLDCHAIN',
  Zksync = 'ZKSYNC',
  Zora = 'ZORA'
}

export enum CollectionSortableField {
  Volume = 'VOLUME'
}

export type ContractInput = {
  address?: InputMaybe<Scalars['String']>;
  chain: Chain;
};

export enum Currency {
  Ars = 'ARS',
  Aud = 'AUD',
  Brl = 'BRL',
  Cad = 'CAD',
  Cny = 'CNY',
  Cop = 'COP',
  Eth = 'ETH',
  Eur = 'EUR',
  Gbp = 'GBP',
  Hkd = 'HKD',
  Idr = 'IDR',
  Inr = 'INR',
  Jpy = 'JPY',
  Krw = 'KRW',
  Matic = 'MATIC',
  Mxn = 'MXN',
  Ngn = 'NGN',
  Nzd = 'NZD',
  Pkr = 'PKR',
  Rub = 'RUB',
  Sgd = 'SGD',
  Thb = 'THB',
  Try = 'TRY',
  Uah = 'UAH',
  Usd = 'USD',
  Vnd = 'VND'
}

export type CurrencyAmountInput = {
  currency: Currency;
  value: Scalars['Float'];
};

export type DescriptionTranslations = {
  __typename?: 'DescriptionTranslations';
  descriptionEnUs?: Maybe<Scalars['String']>;
  descriptionEs419?: Maybe<Scalars['String']>;
  descriptionEsEs?: Maybe<Scalars['String']>;
  descriptionEsUs?: Maybe<Scalars['String']>;
  descriptionFrFr?: Maybe<Scalars['String']>;
  descriptionHiIn?: Maybe<Scalars['String']>;
  descriptionIdId?: Maybe<Scalars['String']>;
  descriptionJaJp?: Maybe<Scalars['String']>;
  descriptionMsMy?: Maybe<Scalars['String']>;
  descriptionNlNl?: Maybe<Scalars['String']>;
  descriptionPtPt?: Maybe<Scalars['String']>;
  descriptionRuRu?: Maybe<Scalars['String']>;
  descriptionThTh?: Maybe<Scalars['String']>;
  descriptionTrTr?: Maybe<Scalars['String']>;
  descriptionUkUa?: Maybe<Scalars['String']>;
  descriptionUrPk?: Maybe<Scalars['String']>;
  descriptionViVn?: Maybe<Scalars['String']>;
  descriptionZhHans?: Maybe<Scalars['String']>;
  descriptionZhHant?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type Dimensions = {
  __typename?: 'Dimensions';
  height?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  width?: Maybe<Scalars['Float']>;
};

export type DimensionsInput = {
  height?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type FeeData = {
  __typename?: 'FeeData';
  buyFeeBps?: Maybe<Scalars['String']>;
  externalTransferFailed?: Maybe<Scalars['Boolean']>;
  feeTakenOnTransfer?: Maybe<Scalars['Boolean']>;
  sellFeeBps?: Maybe<Scalars['String']>;
  sellReverted?: Maybe<Scalars['Boolean']>;
};

export enum HighLow {
  High = 'HIGH',
  Low = 'LOW'
}

/**   FIVE_MINUTE is only supported for TokenMarket.pricePercentChange */
export enum HistoryDuration {
  Day = 'DAY',
  FiveMinute = 'FIVE_MINUTE',
  Hour = 'HOUR',
  Max = 'MAX',
  Month = 'MONTH',
  Week = 'WEEK',
  Year = 'YEAR'
}

/**   Interfaces (alphabetized): */
export type IAmount = {
  currency?: Maybe<Currency>;
  value: Scalars['Float'];
};

export type IContract = {
  address?: Maybe<Scalars['String']>;
  chain: Chain;
};

export type IPool = {
  address: Scalars['String'];
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']>;
  cumulativeVolume?: Maybe<Amount>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']>;
};


export type IPoolCumulativeVolumeArgs = {
  duration: HistoryDuration;
};


export type IPoolHistoricalVolumeArgs = {
  duration: HistoryDuration;
};


export type IPoolPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type IPoolTransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type Image = {
  __typename?: 'Image';
  dimensions?: Maybe<Dimensions>;
  id: Scalars['ID'];
  url: Scalars['String'];
};

export type ImageInput = {
  dimensions?: InputMaybe<DimensionsInput>;
  url: Scalars['String'];
};

export enum MediaType {
  Audio = 'AUDIO',
  Image = 'IMAGE',
  Raw = 'RAW',
  Video = 'VIDEO'
}

export type Mutation = {
  __typename?: 'Mutation';
  assetActivity: AssetActivity;
  heartbeat: Status;
  unsubscribe: Status;
};


export type MutationAssetActivityArgs = {
  input: AssetActivityInput;
};


export type MutationHeartbeatArgs = {
  subscriptionId: Scalars['ID'];
  type: SubscriptionType;
};


export type MutationUnsubscribeArgs = {
  subscriptionId: Scalars['ID'];
  type: SubscriptionType;
};

export type NetworkFee = {
  __typename?: 'NetworkFee';
  quantity?: Maybe<Scalars['String']>;
  tokenAddress?: Maybe<Scalars['String']>;
  tokenChain?: Maybe<Scalars['String']>;
  tokenSymbol?: Maybe<Scalars['String']>;
};

export type NftActivity = {
  __typename?: 'NftActivity';
  address: Scalars['String'];
  asset?: Maybe<NftAsset>;
  fromAddress: Scalars['String'];
  id: Scalars['ID'];
  marketplace?: Maybe<Scalars['String']>;
  orderStatus?: Maybe<OrderStatus>;
  price?: Maybe<Amount>;
  quantity?: Maybe<Scalars['Int']>;
  timestamp: Scalars['Int'];
  toAddress?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
  type: NftActivityType;
  url?: Maybe<Scalars['String']>;
};

export type NftActivityConnection = {
  __typename?: 'NftActivityConnection';
  edges: Array<NftActivityEdge>;
  pageInfo: PageInfo;
};

export type NftActivityEdge = {
  __typename?: 'NftActivityEdge';
  cursor: Scalars['String'];
  node: NftActivity;
};

export type NftActivityFilterInput = {
  activityTypes?: InputMaybe<Array<NftActivityType>>;
  address?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
};

export enum NftActivityType {
  CancelListing = 'CANCEL_LISTING',
  Listing = 'LISTING',
  Sale = 'SALE',
  Transfer = 'TRANSFER'
}

export type NftApproval = {
  __typename?: 'NftApproval';
  approvedAddress: Scalars['String'];
  /**   can be erc721, erc1155, noncompliant */
  asset: NftAsset;
  id: Scalars['ID'];
  nftStandard: NftStandard;
};

export type NftApprovalInput = {
  approvedAddress: Scalars['String'];
  asset: NftAssetInput;
  nftStandard: NftStandard;
};

export type NftApproveForAll = {
  __typename?: 'NftApproveForAll';
  approved: Scalars['Boolean'];
  /**   can be erc721, erc1155, noncompliant */
  asset: NftAsset;
  id: Scalars['ID'];
  nftStandard: NftStandard;
  operatorAddress: Scalars['String'];
};

export type NftApproveForAllInput = {
  approved: Scalars['Boolean'];
  asset: NftAssetInput;
  nftStandard: NftStandard;
  operatorAddress: Scalars['String'];
};

export type NftAsset = {
  __typename?: 'NftAsset';
  animationUrl?: Maybe<Scalars['String']>;
  chain?: Maybe<Chain>;
  collection?: Maybe<NftCollection>;
  creator?: Maybe<NftProfile>;
  description?: Maybe<Scalars['String']>;
  flaggedBy?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  imageUrl?: Maybe<Scalars['String']>;
  isSpam?: Maybe<Scalars['Boolean']>;
  listings?: Maybe<NftOrderConnection>;
  mediaType?: Maybe<MediaType>;
  metadataUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nftContract?: Maybe<NftContract>;
  originalImage?: Maybe<Image>;
  /**   TODO: may need to be array to support erc1155 cases. not needed at the moment so will revisit. */
  ownerAddress?: Maybe<Scalars['String']>;
  protectionInfo?: Maybe<ProtectionInfo>;
  rarities?: Maybe<Array<NftAssetRarity>>;
  smallImage?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  smallImageUrl?: Maybe<Scalars['String']>;
  suspiciousFlag?: Maybe<Scalars['Boolean']>;
  thumbnail?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  thumbnailUrl?: Maybe<Scalars['String']>;
  tokenId: Scalars['String'];
  traits?: Maybe<Array<NftAssetTrait>>;
};


export type NftAssetListingsArgs = {
  after?: InputMaybe<Scalars['String']>;
  asc?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type NftAssetConnection = {
  __typename?: 'NftAssetConnection';
  edges: Array<NftAssetEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type NftAssetEdge = {
  __typename?: 'NftAssetEdge';
  cursor: Scalars['String'];
  node: NftAsset;
};

export type NftAssetInput = {
  animationUrl?: InputMaybe<Scalars['String']>;
  collection?: InputMaybe<NftCollectionInput>;
  description?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<ImageInput>;
  isSpam?: InputMaybe<Scalars['Boolean']>;
  mediaType?: InputMaybe<MediaType>;
  name?: InputMaybe<Scalars['String']>;
  nftContract?: InputMaybe<NftContractInput>;
  smallImage?: InputMaybe<ImageInput>;
  thumbnail?: InputMaybe<ImageInput>;
  tokenId: Scalars['String'];
};

export type NftAssetRarity = {
  __typename?: 'NftAssetRarity';
  id: Scalars['ID'];
  provider?: Maybe<NftRarityProvider>;
  rank?: Maybe<Scalars['Int']>;
  score?: Maybe<Scalars['Float']>;
};

export enum NftAssetSortableField {
  Price = 'PRICE',
  Rarity = 'RARITY'
}

export type NftAssetTrait = {
  __typename?: 'NftAssetTrait';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  rarity?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['String']>;
};

export type NftAssetTraitInput = {
  name: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type NftAssetsFilterInput = {
  listed?: InputMaybe<Scalars['Boolean']>;
  marketplaces?: InputMaybe<Array<NftMarketplace>>;
  maxPrice?: InputMaybe<Scalars['String']>;
  minPrice?: InputMaybe<Scalars['String']>;
  tokenIds?: InputMaybe<Array<Scalars['String']>>;
  tokenSearchQuery?: InputMaybe<Scalars['String']>;
  traits?: InputMaybe<Array<NftAssetTraitInput>>;
};

export type NftBalance = {
  __typename?: 'NftBalance';
  id: Scalars['ID'];
  lastPrice?: Maybe<TimestampedAmount>;
  listedMarketplaces?: Maybe<Array<NftMarketplace>>;
  listingFees?: Maybe<Array<Maybe<NftFee>>>;
  ownedAsset?: Maybe<NftAsset>;
  quantity?: Maybe<Scalars['Int']>;
};

export type NftBalanceAssetInput = {
  address: Scalars['String'];
  tokenId: Scalars['String'];
};

export type NftBalanceConnection = {
  __typename?: 'NftBalanceConnection';
  edges: Array<NftBalanceEdge>;
  pageInfo: PageInfo;
};

export type NftBalanceEdge = {
  __typename?: 'NftBalanceEdge';
  cursor: Scalars['String'];
  node: NftBalance;
};

export type NftBalancesFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  assets?: InputMaybe<Array<NftBalanceAssetInput>>;
  filterSpam?: InputMaybe<Scalars['Boolean']>;
};

export type NftCollection = {
  __typename?: 'NftCollection';
  bannerImage?: Maybe<Image>;
  /**
   *  TODO: support querying for collection assets here
   * assets(page: Int, pageSize: Int, orderBy: NftAssetSortableField): [NftAsset]
   * @deprecated Field no longer supported
   */
  bannerImageUrl?: Maybe<Scalars['String']>;
  collectionId: Scalars['String'];
  creator?: Maybe<NftProfile>;
  description?: Maybe<Scalars['String']>;
  discordUrl?: Maybe<Scalars['String']>;
  homepageUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  imageUrl?: Maybe<Scalars['String']>;
  instagramName?: Maybe<Scalars['String']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  markets?: Maybe<Array<NftCollectionMarket>>;
  name?: Maybe<Scalars['String']>;
  nftContracts?: Maybe<Array<NftContract>>;
  numAssets?: Maybe<Scalars['Int']>;
  /** @deprecated Field no longer supported */
  openseaUrl?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<NftCollectionTrait>>;
  twitterName?: Maybe<Scalars['String']>;
};


export type NftCollectionMarketsArgs = {
  currencies: Array<Currency>;
};

export type NftCollectionBalance = {
  __typename?: 'NftCollectionBalance';
  address: Scalars['String'];
  balance: Scalars['Float'];
  id: Scalars['ID'];
  logoImage?: Maybe<Image>;
  name: Scalars['String'];
};

export type NftCollectionBalanceConnection = {
  __typename?: 'NftCollectionBalanceConnection';
  edges: Array<NftCollectionBalanceEdge>;
  pageInfo: PageInfo;
};

export type NftCollectionBalanceEdge = {
  __typename?: 'NftCollectionBalanceEdge';
  cursor: Scalars['String'];
  node: NftCollectionBalance;
};

export type NftCollectionConnection = {
  __typename?: 'NftCollectionConnection';
  edges: Array<NftCollectionEdge>;
  pageInfo: PageInfo;
};

export type NftCollectionEdge = {
  __typename?: 'NftCollectionEdge';
  cursor: Scalars['String'];
  node: NftCollection;
};

export type NftCollectionInput = {
  collectionId: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  nftContracts?: InputMaybe<Array<NftContractInput>>;
};

export type NftCollectionMarket = {
  __typename?: 'NftCollectionMarket';
  floorPrice?: Maybe<TimestampedAmount>;
  floorPricePercentChange?: Maybe<TimestampedAmount>;
  id: Scalars['ID'];
  listings?: Maybe<TimestampedAmount>;
  marketplaces?: Maybe<Array<NftCollectionMarketplace>>;
  nftContracts?: Maybe<Array<NftContract>>;
  owners?: Maybe<Scalars['Int']>;
  percentListed?: Maybe<TimestampedAmount>;
  percentUniqueOwners?: Maybe<TimestampedAmount>;
  sales?: Maybe<TimestampedAmount>;
  totalVolume?: Maybe<TimestampedAmount>;
  volume?: Maybe<TimestampedAmount>;
  /** @deprecated Field no longer supported */
  volume24h?: Maybe<Amount>;
  volumePercentChange?: Maybe<TimestampedAmount>;
};


export type NftCollectionMarketFloorPricePercentChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};


export type NftCollectionMarketMarketplacesArgs = {
  marketplaces?: InputMaybe<Array<NftMarketplace>>;
};


export type NftCollectionMarketSalesArgs = {
  duration?: InputMaybe<HistoryDuration>;
};


export type NftCollectionMarketVolumeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};


export type NftCollectionMarketVolumePercentChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

export type NftCollectionMarketplace = {
  __typename?: 'NftCollectionMarketplace';
  floorPrice?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  listings?: Maybe<Scalars['Int']>;
  marketplace?: Maybe<NftMarketplace>;
};

export type NftCollectionTrait = {
  __typename?: 'NftCollectionTrait';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  stats?: Maybe<Array<NftCollectionTraitStats>>;
  values?: Maybe<Array<Scalars['String']>>;
};

export type NftCollectionTraitStats = {
  __typename?: 'NftCollectionTraitStats';
  assets?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  listings?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type NftCollectionsFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  nameQuery?: InputMaybe<Scalars['String']>;
};

export type NftContract = IContract & {
  __typename?: 'NftContract';
  address: Scalars['String'];
  chain: Chain;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  standard?: Maybe<NftStandard>;
  symbol?: Maybe<Scalars['String']>;
  totalSupply?: Maybe<Scalars['Int']>;
};

export type NftContractInput = {
  address: Scalars['String'];
  chain: Chain;
  name?: InputMaybe<Scalars['String']>;
  standard?: InputMaybe<NftStandard>;
  symbol?: InputMaybe<Scalars['String']>;
  totalSupply?: InputMaybe<Scalars['Int']>;
};

export type NftFee = {
  __typename?: 'NftFee';
  basisPoints: Scalars['Int'];
  id: Scalars['ID'];
  payoutAddress: Scalars['String'];
};

export enum NftMarketplace {
  Cryptopunks = 'CRYPTOPUNKS',
  Foundation = 'FOUNDATION',
  Looksrare = 'LOOKSRARE',
  Nft20 = 'NFT20',
  Nftx = 'NFTX',
  Opensea = 'OPENSEA',
  Sudoswap = 'SUDOSWAP',
  X2Y2 = 'X2Y2'
}

export type NftOrder = {
  __typename?: 'NftOrder';
  address: Scalars['String'];
  auctionType?: Maybe<Scalars['String']>;
  createdAt: Scalars['Float'];
  endAt?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  maker: Scalars['String'];
  marketplace: NftMarketplace;
  marketplaceUrl: Scalars['String'];
  orderHash?: Maybe<Scalars['String']>;
  poolPrices?: Maybe<Array<Scalars['String']>>;
  price: Amount;
  protocolParameters?: Maybe<Scalars['AWSJSON']>;
  quantity: Scalars['Int'];
  startAt: Scalars['Float'];
  status: OrderStatus;
  taker?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  type: OrderType;
};

export type NftOrderConnection = {
  __typename?: 'NftOrderConnection';
  edges: Array<NftOrderEdge>;
  pageInfo: PageInfo;
};

export type NftOrderEdge = {
  __typename?: 'NftOrderEdge';
  cursor: Scalars['String'];
  node: NftOrder;
};

export type NftProfile = {
  __typename?: 'NftProfile';
  address: Scalars['String'];
  id: Scalars['ID'];
  isVerified?: Maybe<Scalars['Boolean']>;
  profileImage?: Maybe<Image>;
  username?: Maybe<Scalars['String']>;
};

export enum NftRarityProvider {
  RaritySniper = 'RARITY_SNIPER'
}

export type NftRouteResponse = {
  __typename?: 'NftRouteResponse';
  calldata: Scalars['String'];
  id: Scalars['ID'];
  route?: Maybe<Array<NftTrade>>;
  sendAmount: TokenAmount;
  toAddress: Scalars['String'];
};

export enum NftStandard {
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Noncompliant = 'NONCOMPLIANT'
}

export type NftTrade = {
  __typename?: 'NftTrade';
  amount: Scalars['Int'];
  contractAddress: Scalars['String'];
  id: Scalars['ID'];
  marketplace: NftMarketplace;
  /**   price represents the current price of the NFT, which can be different from quotePrice */
  price: TokenAmount;
  /**   quotePrice represents the last quoted price of the NFT */
  quotePrice?: Maybe<TokenAmount>;
  tokenId: Scalars['String'];
  tokenType?: Maybe<NftStandard>;
};

export type NftTradeInput = {
  amount: Scalars['Int'];
  contractAddress: Scalars['String'];
  id: Scalars['ID'];
  marketplace: NftMarketplace;
  quotePrice?: InputMaybe<TokenAmountInput>;
  tokenId: Scalars['String'];
  tokenType?: InputMaybe<NftStandard>;
};

export type NftTransfer = {
  __typename?: 'NftTransfer';
  asset: NftAsset;
  direction: TransactionDirection;
  id: Scalars['ID'];
  nftStandard: NftStandard;
  recipient: Scalars['String'];
  sender: Scalars['String'];
};

export type NftTransferInput = {
  asset: NftAssetInput;
  direction: TransactionDirection;
  nftStandard: NftStandard;
  recipient: Scalars['String'];
  sender: Scalars['String'];
};

export type OffRampServiceProvider = {
  __typename?: 'OffRampServiceProvider';
  id: Scalars['ID'];
  logoDarkUrl: Scalars['String'];
  logoLightUrl: Scalars['String'];
  name: Scalars['String'];
  serviceProvider: Scalars['String'];
  supportUrl?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type OffRampServiceProviderInput = {
  logoDarkUrl: Scalars['String'];
  logoLightUrl: Scalars['String'];
  name: Scalars['String'];
  serviceProvider: Scalars['String'];
  supportUrl?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type OffRampTransactionDetails = {
  __typename?: 'OffRampTransactionDetails';
  id: Scalars['ID'];
  offRampTransfer: OffRampTransfer;
  senderAddress: Scalars['String'];
  status: TransactionStatus;
};

export type OffRampTransactionDetailsInput = {
  offRampTransfer: OffRampTransferInput;
  senderAddress: Scalars['String'];
  status: TransactionStatus;
};

export type OffRampTransfer = {
  __typename?: 'OffRampTransfer';
  amount: Scalars['Float'];
  destinationAmount: Scalars['Float'];
  destinationCurrency?: Maybe<Scalars['String']>;
  externalSessionId: Scalars['String'];
  id: Scalars['ID'];
  networkFee?: Maybe<Scalars['Float']>;
  serviceProvider: OffRampServiceProvider;
  token: Token;
  tokenStandard: TokenStandard;
  totalFee?: Maybe<Scalars['Float']>;
  transactionFee?: Maybe<Scalars['Float']>;
  transactionReferenceId: Scalars['String'];
};

export type OffRampTransferInput = {
  amount: Scalars['Float'];
  destinationAmount: Scalars['Float'];
  destinationCurrency?: InputMaybe<Scalars['String']>;
  networkFee?: InputMaybe<Scalars['Float']>;
  serviceProvider: OffRampServiceProviderInput;
  token: TokenAssetInput;
  tokenStandard: TokenStandard;
  totalFee?: InputMaybe<Scalars['Float']>;
  transactionFee?: InputMaybe<Scalars['Float']>;
  transactionReferenceId: Scalars['String'];
};

export type OnRampServiceProvider = {
  __typename?: 'OnRampServiceProvider';
  id: Scalars['ID'];
  logoDarkUrl: Scalars['String'];
  logoLightUrl: Scalars['String'];
  name: Scalars['String'];
  serviceProvider: Scalars['String'];
  supportUrl?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type OnRampServiceProviderInput = {
  logoDarkUrl: Scalars['String'];
  logoLightUrl: Scalars['String'];
  name: Scalars['String'];
  serviceProvider: Scalars['String'];
  supportUrl?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type OnRampTransactionDetails = {
  __typename?: 'OnRampTransactionDetails';
  id: Scalars['ID'];
  onRampTransfer: OnRampTransfer;
  receiverAddress: Scalars['String'];
  status: TransactionStatus;
};

export type OnRampTransactionDetailsInput = {
  onRampTransfer: OnRampTransferInput;
  receiverAddress: Scalars['String'];
  status: TransactionStatus;
};

export type OnRampTransactionsAuth = {
  queryParams: Scalars['String'];
  signature: Scalars['String'];
};

export type OnRampTransfer = {
  __typename?: 'OnRampTransfer';
  amount: Scalars['Float'];
  externalSessionId: Scalars['String'];
  id: Scalars['ID'];
  networkFee?: Maybe<Scalars['Float']>;
  serviceProvider: OnRampServiceProvider;
  sourceAmount: Scalars['Float'];
  sourceCurrency?: Maybe<Scalars['String']>;
  token: Token;
  tokenStandard: TokenStandard;
  totalFee?: Maybe<Scalars['Float']>;
  transactionFee?: Maybe<Scalars['Float']>;
  transactionReferenceId: Scalars['String'];
};

export type OnRampTransferInput = {
  amount: Scalars['Float'];
  networkFee?: InputMaybe<Scalars['Float']>;
  serviceProvider: OnRampServiceProviderInput;
  sourceAmount: Scalars['Float'];
  sourceCurrency?: InputMaybe<Scalars['String']>;
  token: TokenAssetInput;
  tokenStandard: TokenStandard;
  totalFee?: InputMaybe<Scalars['Float']>;
  transactionFee?: InputMaybe<Scalars['Float']>;
  transactionReferenceId: Scalars['String'];
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Executed = 'EXECUTED',
  Expired = 'EXPIRED',
  Valid = 'VALID'
}

export enum OrderType {
  Listing = 'LISTING',
  Offer = 'OFFER'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
  startCursor?: Maybe<Scalars['String']>;
};

/**   v2 pool parameters as defined by https://github.com/Uniswap/v2-sdk/blob/main/src/entities/pair.ts */
export type PairInput = {
  tokenAmountA: TokenAmountInput;
  tokenAmountB: TokenAmountInput;
};

export type PermitDetailsInput = {
  amount: Scalars['String'];
  expiration: Scalars['String'];
  nonce: Scalars['String'];
  token: Scalars['String'];
};

export type PermitInput = {
  details: PermitDetailsInput;
  sigDeadline: Scalars['String'];
  signature: Scalars['String'];
  spender: Scalars['String'];
};

/**   v3 pool parameters as defined by https://github.com/Uniswap/v3-sdk/blob/main/src/entities/pool.ts */
export type PoolInput = {
  fee: Scalars['Int'];
  liquidity: Scalars['String'];
  sqrtRatioX96: Scalars['String'];
  tickCurrent: Scalars['String'];
  tokenA: TokenInput;
  tokenB: TokenInput;
};

export type PoolTransaction = {
  __typename?: 'PoolTransaction';
  account: Scalars['String'];
  chain: Chain;
  hash: Scalars['String'];
  id: Scalars['ID'];
  protocolVersion: ProtocolVersion;
  timestamp: Scalars['Int'];
  token0: Token;
  token0Quantity: Scalars['String'];
  token1: Token;
  token1Quantity: Scalars['String'];
  type: PoolTransactionType;
  usdValue: Amount;
};

export enum PoolTransactionType {
  Add = 'ADD',
  Remove = 'REMOVE',
  Swap = 'SWAP'
}

export type Portfolio = {
  __typename?: 'Portfolio';
  assetActivities?: Maybe<Array<Maybe<AssetActivity>>>;
  id: Scalars['ID'];
  /**   TODO: (michael.zhang) replace with paginated query */
  nftBalances?: Maybe<Array<Maybe<NftBalance>>>;
  ownerAddress: Scalars['String'];
  tokenBalances?: Maybe<Array<Maybe<TokenBalance>>>;
  tokensTotalDenominatedValue?: Maybe<Amount>;
  tokensTotalDenominatedValueChange?: Maybe<AmountChange>;
};


export type PortfolioAssetActivitiesArgs = {
  _fs?: InputMaybe<AssetActivitySwitch>;
  chains?: InputMaybe<Array<Chain>>;
  includeBridging?: InputMaybe<Scalars['Boolean']>;
  includeOffChain?: InputMaybe<Scalars['Boolean']>;
  onRampTransactionIDs?: InputMaybe<Array<Scalars['String']>>;
  onRampTransactionsAuth?: InputMaybe<OnRampTransactionsAuth>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type PortfolioTokensTotalDenominatedValueChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

/**   Specify how the portfolio value should be calculated for each `ownerAddress`. */
export type PortfolioValueModifier = {
  includeSmallBalances?: InputMaybe<Scalars['Boolean']>;
  includeSpamTokens?: InputMaybe<Scalars['Boolean']>;
  ownerAddress: Scalars['String'];
  tokenBalancesLimit?: InputMaybe<Scalars['Int']>;
  tokenExcludeOverrides?: InputMaybe<Array<ContractInput>>;
  tokenIncludeOverrides?: InputMaybe<Array<ContractInput>>;
};

export enum PriceSource {
  External = 'EXTERNAL',
  SubgraphV2 = 'SUBGRAPH_V2',
  SubgraphV3 = 'SUBGRAPH_V3',
  SubgraphV4 = 'SUBGRAPH_V4'
}

export enum ProtectionAttackType {
  AirdropPattern = 'AIRDROP_PATTERN',
  DynamicAnalysis = 'DYNAMIC_ANALYSIS',
  HighFees = 'HIGH_FEES',
  Honeypot = 'HONEYPOT',
  Impersonator = 'IMPERSONATOR',
  InorganicVolume = 'INORGANIC_VOLUME',
  KnownMalicious = 'KNOWN_MALICIOUS',
  Metadata = 'METADATA',
  Rugpull = 'RUGPULL',
  StaticCodeSignature = 'STATIC_CODE_SIGNATURE',
  Unknown = 'UNKNOWN',
  UnstableTokenPrice = 'UNSTABLE_TOKEN_PRICE'
}

export type ProtectionInfo = {
  __typename?: 'ProtectionInfo';
  attackTypes?: Maybe<Array<Maybe<ProtectionAttackType>>>;
  blockaidFees?: Maybe<BlockaidFees>;
  result?: Maybe<ProtectionResult>;
};

export enum ProtectionResult {
  Benign = 'BENIGN',
  Malicious = 'MALICIOUS',
  Spam = 'SPAM',
  Unknown = 'UNKNOWN',
  Warning = 'WARNING'
}

export enum ProtocolVersion {
  V2 = 'V2',
  V3 = 'V3',
  V4 = 'V4'
}

export type PushNotification = {
  __typename?: 'PushNotification';
  contents: Scalars['AWSJSON'];
  id: Scalars['ID'];
  notifyAddress: Scalars['String'];
  signerHeader: Scalars['AWSJSON'];
  viewerHeader: Scalars['AWSJSON'];
};

export type Query = {
  __typename?: 'Query';
  convert?: Maybe<Amount>;
  dailyProtocolTvl?: Maybe<Array<TimestampedAmount>>;
  historicalProtocolVolume?: Maybe<Array<TimestampedAmount>>;
  isV3SubgraphStale?: Maybe<Scalars['Boolean']>;
  nftActivity?: Maybe<NftActivityConnection>;
  nftAssets?: Maybe<NftAssetConnection>;
  nftBalances?: Maybe<NftBalanceConnection>;
  nftCollectionBalances?: Maybe<NftCollectionBalanceConnection>;
  nftCollections?: Maybe<NftCollectionConnection>;
  nftRoute?: Maybe<NftRouteResponse>;
  portfolios?: Maybe<Array<Maybe<Portfolio>>>;
  searchTokens?: Maybe<Array<Maybe<Token>>>;
  /**
   *  token consumes chain and address instead of contract because the apollo client request cache can only use
   * keys from the response, and the token response does not contain a contract, but does contain an unwrapped
   * contract: chain and address.
   */
  token?: Maybe<Token>;
  tokenProjects?: Maybe<Array<Maybe<TokenProject>>>;
  tokens?: Maybe<Array<Maybe<Token>>>;
  topCollections?: Maybe<NftCollectionConnection>;
  topTokens?: Maybe<Array<Maybe<Token>>>;
  /**   returns top v2 pairs sorted by total value locked in desc order */
  topV2Pairs?: Maybe<Array<V2Pair>>;
  /**   returns top v3 pools sorted by total value locked in desc order */
  topV3Pools?: Maybe<Array<V3Pool>>;
  topV4Pools?: Maybe<Array<V4Pool>>;
  transactionNotification?: Maybe<TransactionNotification>;
  v2Pair?: Maybe<V2Pair>;
  v2Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  v3Pool?: Maybe<V3Pool>;
  v3PoolsForTokenPair?: Maybe<Array<V3Pool>>;
  v3Transactions?: Maybe<Array<PoolTransaction>>;
  v4Pool?: Maybe<V4Pool>;
  v4PoolsForTokenPair?: Maybe<Array<V4Pool>>;
  v4Transactions?: Maybe<Array<PoolTransaction>>;
};


export type QueryConvertArgs = {
  fromAmount: CurrencyAmountInput;
  toCurrency: Currency;
};


export type QueryDailyProtocolTvlArgs = {
  chain: Chain;
  version: ProtocolVersion;
};


export type QueryHistoricalProtocolVolumeArgs = {
  chain: Chain;
  duration: HistoryDuration;
  version: ProtocolVersion;
};


export type QueryIsV3SubgraphStaleArgs = {
  chain: Chain;
};


export type QueryNftActivityArgs = {
  after?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftActivityFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryNftAssetsArgs = {
  address: Scalars['String'];
  after?: InputMaybe<Scalars['String']>;
  asc?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftAssetsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NftAssetSortableField>;
};


export type QueryNftBalancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  chains?: InputMaybe<Array<Chain>>;
  filter?: InputMaybe<NftBalancesFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  ownerAddress: Scalars['String'];
};


export type QueryNftCollectionBalancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  ownerAddress: Scalars['String'];
};


export type QueryNftCollectionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftCollectionsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryNftRouteArgs = {
  chain?: InputMaybe<Chain>;
  nftTrades: Array<NftTradeInput>;
  senderAddress: Scalars['String'];
  tokenTrades?: InputMaybe<Array<TokenTradeInput>>;
};


export type QueryPortfoliosArgs = {
  chains?: InputMaybe<Array<Chain>>;
  fungibleIds?: InputMaybe<Array<Scalars['String']>>;
  lookupTokens?: InputMaybe<Array<ContractInput>>;
  ownerAddresses: Array<Scalars['String']>;
  valueModifiers?: InputMaybe<Array<PortfolioValueModifier>>;
};


export type QuerySearchTokensArgs = {
  chains?: InputMaybe<Array<Chain>>;
  searchQuery: Scalars['String'];
  tokenSearchV2Enabled?: InputMaybe<Scalars['Boolean']>;
};


export type QueryTokenArgs = {
  address?: InputMaybe<Scalars['String']>;
  chain: Chain;
};


export type QueryTokenProjectsArgs = {
  contracts: Array<ContractInput>;
};


export type QueryTokensArgs = {
  contracts: Array<ContractInput>;
};


export type QueryTopCollectionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  chains?: InputMaybe<Array<Chain>>;
  cursor?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<HistoryDuration>;
  first?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollectionSortableField>;
};


export type QueryTopTokensArgs = {
  chain?: InputMaybe<Chain>;
  orderBy?: InputMaybe<TokenSortableField>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type QueryTopV2PairsArgs = {
  chain: Chain;
  debugMode?: InputMaybe<Scalars['Boolean']>;
  first: Scalars['Int'];
  tokenFilter?: InputMaybe<Scalars['String']>;
  tvlCursor?: InputMaybe<Scalars['Float']>;
};


export type QueryTopV3PoolsArgs = {
  chain: Chain;
  debugMode?: InputMaybe<Scalars['Boolean']>;
  first: Scalars['Int'];
  tokenFilter?: InputMaybe<Scalars['String']>;
  tvlCursor?: InputMaybe<Scalars['Float']>;
};


export type QueryTopV4PoolsArgs = {
  chain: Chain;
  debugMode?: InputMaybe<Scalars['Boolean']>;
  first: Scalars['Int'];
  tokenFilter?: InputMaybe<Scalars['String']>;
  tvlCursor?: InputMaybe<Scalars['Float']>;
};


export type QueryTransactionNotificationArgs = {
  address: Scalars['String'];
  chain: Chain;
  isBridging?: InputMaybe<Scalars['Boolean']>;
  transactionHash: Scalars['String'];
};


export type QueryV2PairArgs = {
  address: Scalars['String'];
  chain: Chain;
};


export type QueryV2TransactionsArgs = {
  chain: Chain;
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};


export type QueryV3PoolArgs = {
  address: Scalars['String'];
  chain: Chain;
};


export type QueryV3PoolsForTokenPairArgs = {
  chain: Chain;
  token0: Scalars['String'];
  token1: Scalars['String'];
};


export type QueryV3TransactionsArgs = {
  chain: Chain;
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};


export type QueryV4PoolArgs = {
  chain: Chain;
  poolId: Scalars['String'];
};


export type QueryV4PoolsForTokenPairArgs = {
  chain: Chain;
  token0: Scalars['String'];
  token1: Scalars['String'];
};


export type QueryV4TransactionsArgs = {
  chain: Chain;
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type RewardsCampaign = {
  __typename?: 'RewardsCampaign';
  boostedApr: Scalars['Float'];
  distributedRewards?: Maybe<Scalars['String']>;
  endTimestamp?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  startTimestamp?: Maybe<Scalars['Int']>;
  totalRewardAllocation?: Maybe<Scalars['String']>;
};

export enum SafetyLevel {
  Blocked = 'BLOCKED',
  MediumWarning = 'MEDIUM_WARNING',
  StrongWarning = 'STRONG_WARNING',
  Verified = 'VERIFIED'
}

export type Status = {
  __typename?: 'Status';
  success: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onAssetActivity?: Maybe<AssetActivity>;
};


export type SubscriptionOnAssetActivityArgs = {
  addresses: Array<Scalars['String']>;
  subscriptionId: Scalars['ID'];
};

export enum SubscriptionType {
  AssetActivity = 'ASSET_ACTIVITY'
}

export type SwapOrderDetails = {
  __typename?: 'SwapOrderDetails';
  encodedOrder: Scalars['String'];
  expiry: Scalars['Int'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  inputToken: Token;
  inputTokenQuantity: Scalars['String'];
  offerer: Scalars['String'];
  outputToken: Token;
  outputTokenQuantity: Scalars['String'];
  /** @deprecated use swapOrderStatus to disambiguate from transactionStatus */
  status: SwapOrderStatus;
  swapOrderStatus: SwapOrderStatus;
  swapOrderType: SwapOrderType;
};

export type SwapOrderDetailsInput = {
  encodedOrder: Scalars['String'];
  expiry: Scalars['Int'];
  hash: Scalars['String'];
  inputAmount: Scalars['String'];
  inputToken: TokenAssetInput;
  offerer: Scalars['String'];
  outputAmount: Scalars['String'];
  outputToken: TokenAssetInput;
  status?: InputMaybe<SwapOrderStatus>;
  swapOrderStatus: SwapOrderStatus;
  swapOrderType: SwapOrderType;
};

export enum SwapOrderStatus {
  Cancelled = 'CANCELLED',
  Error = 'ERROR',
  Expired = 'EXPIRED',
  Filled = 'FILLED',
  InsufficientFunds = 'INSUFFICIENT_FUNDS',
  Open = 'OPEN'
}

export enum SwapOrderType {
  Dutch = 'DUTCH',
  DutchV2 = 'DUTCH_V2',
  Limit = 'LIMIT',
  Priority = 'PRIORITY'
}

export type TimestampedAmount = IAmount & {
  __typename?: 'TimestampedAmount';
  currency?: Maybe<Currency>;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  value: Scalars['Float'];
};

export type TimestampedOhlc = {
  __typename?: 'TimestampedOhlc';
  close: Amount;
  high: Amount;
  id: Scalars['ID'];
  low: Amount;
  open: Amount;
  timestamp: Scalars['Int'];
};

export type TimestampedPoolPrice = {
  __typename?: 'TimestampedPoolPrice';
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  token0Price: Scalars['Float'];
  token1Price: Scalars['Float'];
};

export type Token = IContract & {
  __typename?: 'Token';
  address?: Maybe<Scalars['String']>;
  bridgedWithdrawalInfo?: Maybe<BridgedWithdrawalInfo>;
  chain: Chain;
  decimals?: Maybe<Scalars['Int']>;
  feeData?: Maybe<FeeData>;
  id: Scalars['ID'];
  isBridged?: Maybe<Scalars['Boolean']>;
  market?: Maybe<TokenMarket>;
  name?: Maybe<Scalars['String']>;
  project?: Maybe<TokenProject>;
  protectionInfo?: Maybe<ProtectionInfo>;
  source?: Maybe<TokenSource>;
  standard?: Maybe<TokenStandard>;
  symbol?: Maybe<Scalars['String']>;
  v2Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  v3Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  v4Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
};


export type TokenMarketArgs = {
  currency?: InputMaybe<Currency>;
};


export type TokenV2TransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};


export type TokenV3TransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};


export type TokenV4TransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type TokenAmount = {
  __typename?: 'TokenAmount';
  currency: Currency;
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type TokenAmountInput = {
  amount: Scalars['String'];
  token: TokenInput;
};

export type TokenApproval = {
  __typename?: 'TokenApproval';
  approvedAddress: Scalars['String'];
  /**   can be erc20 or native */
  asset: Token;
  id: Scalars['ID'];
  quantity: Scalars['String'];
  tokenStandard: TokenStandard;
};

export type TokenApprovalInput = {
  approvedAddress: Scalars['String'];
  asset: TokenAssetInput;
  quantity: Scalars['String'];
  tokenStandard: TokenStandard;
};

export type TokenAssetInput = {
  address?: InputMaybe<Scalars['String']>;
  chain: Chain;
  decimals?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  standard: TokenStandard;
  symbol?: InputMaybe<Scalars['String']>;
};

export type TokenBalance = {
  __typename?: 'TokenBalance';
  blockNumber?: Maybe<Scalars['Int']>;
  blockTimestamp?: Maybe<Scalars['Int']>;
  denominatedValue?: Maybe<Amount>;
  id: Scalars['ID'];
  isHidden?: Maybe<Scalars['Boolean']>;
  ownerAddress: Scalars['String'];
  quantity?: Maybe<Scalars['Float']>;
  token?: Maybe<Token>;
  tokenProjectMarket?: Maybe<TokenProjectMarket>;
};

export type TokenInput = {
  address: Scalars['String'];
  chainId: Scalars['Int'];
  decimals: Scalars['Int'];
  isNative: Scalars['Boolean'];
};

export type TokenMarket = {
  __typename?: 'TokenMarket';
  fullyDilutedValuation?: Maybe<Amount>;
  historicalTvl?: Maybe<Array<Maybe<TimestampedAmount>>>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID'];
  ohlc?: Maybe<Array<Maybe<TimestampedOhlc>>>;
  price?: Maybe<Amount>;
  priceHighLow?: Maybe<Amount>;
  priceHistory?: Maybe<Array<Maybe<TimestampedAmount>>>;
  pricePercentChange?: Maybe<Amount>;
  priceSource: PriceSource;
  token: Token;
  totalValueLocked?: Maybe<Amount>;
  /**   this volume is cumulative volume over the specified duration */
  volume?: Maybe<Amount>;
};


export type TokenMarketHistoricalTvlArgs = {
  duration: HistoryDuration;
};


export type TokenMarketHistoricalVolumeArgs = {
  duration: HistoryDuration;
};


export type TokenMarketOhlcArgs = {
  duration: HistoryDuration;
};


export type TokenMarketPriceHighLowArgs = {
  duration: HistoryDuration;
  highLow: HighLow;
};


export type TokenMarketPriceHistoryArgs = {
  duration: HistoryDuration;
  maxLength?: InputMaybe<Scalars['Int']>;
};


export type TokenMarketPricePercentChangeArgs = {
  duration: HistoryDuration;
};


export type TokenMarketVolumeArgs = {
  duration: HistoryDuration;
};

export type TokenProject = {
  __typename?: 'TokenProject';
  description?: Maybe<Scalars['String']>;
  descriptionTranslations?: Maybe<DescriptionTranslations>;
  homepageUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isSpam?: Maybe<Scalars['Boolean']>;
  logo?: Maybe<Image>;
  /** @deprecated use logo */
  logoUrl?: Maybe<Scalars['String']>;
  markets?: Maybe<Array<Maybe<TokenProjectMarket>>>;
  name?: Maybe<Scalars['String']>;
  safetyLevel?: Maybe<SafetyLevel>;
  /** @deprecated use logo */
  smallLogo?: Maybe<Image>;
  spamCode?: Maybe<Scalars['Int']>;
  tokens: Array<Token>;
  twitterName?: Maybe<Scalars['String']>;
};


export type TokenProjectMarketsArgs = {
  currencies: Array<Currency>;
};

export type TokenProjectMarket = {
  __typename?: 'TokenProjectMarket';
  currency: Currency;
  fullyDilutedValuation?: Maybe<Amount>;
  id: Scalars['ID'];
  marketCap?: Maybe<Amount>;
  price?: Maybe<Amount>;
  priceHigh52w?: Maybe<Amount>;
  priceHighLow?: Maybe<Amount>;
  priceHistory?: Maybe<Array<Maybe<TimestampedAmount>>>;
  priceLow52w?: Maybe<Amount>;
  pricePercentChange?: Maybe<Amount>;
  pricePercentChange24h?: Maybe<Amount>;
  tokenProject: TokenProject;
};


export type TokenProjectMarketPriceHighLowArgs = {
  duration: HistoryDuration;
  highLow: HighLow;
};


export type TokenProjectMarketPriceHistoryArgs = {
  duration: HistoryDuration;
  maxLength?: InputMaybe<Scalars['Int']>;
};


export type TokenProjectMarketPricePercentChangeArgs = {
  duration: HistoryDuration;
};

export enum TokenSortableField {
  MarketCap = 'MARKET_CAP',
  Popularity = 'POPULARITY',
  TotalValueLocked = 'TOTAL_VALUE_LOCKED',
  Volume = 'VOLUME'
}

export enum TokenSource {
  TokenFactory = 'TOKEN_FACTORY'
}

export enum TokenStandard {
  Erc20 = 'ERC20',
  Native = 'NATIVE',
  Spl = 'SPL'
}

export type TokenTradeInput = {
  permit?: InputMaybe<PermitInput>;
  routes?: InputMaybe<TokenTradeRoutesInput>;
  slippageToleranceBasisPoints?: InputMaybe<Scalars['Int']>;
  tokenAmount: TokenAmountInput;
};

export type TokenTradeRouteInput = {
  inputAmount: TokenAmountInput;
  outputAmount: TokenAmountInput;
  pools: Array<TradePoolInput>;
};

export type TokenTradeRoutesInput = {
  mixedRoutes?: InputMaybe<Array<TokenTradeRouteInput>>;
  tradeType: TokenTradeType;
  v2Routes?: InputMaybe<Array<TokenTradeRouteInput>>;
  v3Routes?: InputMaybe<Array<TokenTradeRouteInput>>;
};

export enum TokenTradeType {
  ExactInput = 'EXACT_INPUT',
  ExactOutput = 'EXACT_OUTPUT'
}

export type TokenTransfer = {
  __typename?: 'TokenTransfer';
  asset: Token;
  direction: TransactionDirection;
  id: Scalars['ID'];
  quantity: Scalars['String'];
  recipient: Scalars['String'];
  sender: Scalars['String'];
  tokenStandard: TokenStandard;
  transactedValue?: Maybe<Amount>;
};

export type TokenTransferInput = {
  asset: TokenAssetInput;
  direction: TransactionDirection;
  quantity: Scalars['String'];
  recipient: Scalars['String'];
  sender: Scalars['String'];
  tokenStandard: TokenStandard;
  transactedValue?: InputMaybe<AmountInput>;
};

export type TradePoolInput = {
  pair?: InputMaybe<PairInput>;
  pool?: InputMaybe<PoolInput>;
};

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['Int'];
  from: Scalars['String'];
  gasLimit?: Maybe<Scalars['Float']>;
  hash: Scalars['String'];
  id: Scalars['ID'];
  maxFeePerGas?: Maybe<Scalars['Float']>;
  nonce: Scalars['Int'];
  status: TransactionStatus;
  to: Scalars['String'];
};

export type TransactionDetails = {
  __typename?: 'TransactionDetails';
  application?: Maybe<ApplicationContract>;
  assetChanges: Array<Maybe<AssetChange>>;
  from: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  networkFee?: Maybe<NetworkFee>;
  nonce: Scalars['Int'];
  /** @deprecated use transactionStatus to disambiguate from swapOrderStatus */
  status: TransactionStatus;
  to: Scalars['String'];
  transactionStatus: TransactionStatus;
  type: TransactionType;
};

export type TransactionDetailsInput = {
  application?: InputMaybe<ApplicationContractInput>;
  assetChanges: Array<InputMaybe<AssetChangeInput>>;
  from: Scalars['String'];
  hash: Scalars['String'];
  nonce: Scalars['Int'];
  status?: InputMaybe<TransactionStatus>;
  to: Scalars['String'];
  transactionStatus: TransactionStatus;
  type: TransactionType;
};

export enum TransactionDirection {
  In = 'IN',
  Out = 'OUT',
  Self = 'SELF'
}

export type TransactionNotification = {
  __typename?: 'TransactionNotification';
  hash: Scalars['String'];
  id: Scalars['ID'];
  push: Array<PushNotification>;
};

export enum TransactionStatus {
  Confirmed = 'CONFIRMED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export enum TransactionType {
  Approve = 'APPROVE',
  Borrow = 'BORROW',
  Bridging = 'BRIDGING',
  Cancel = 'CANCEL',
  Claim = 'CLAIM',
  Deployment = 'DEPLOYMENT',
  Execute = 'EXECUTE',
  Lend = 'LEND',
  Mint = 'MINT',
  OffRamp = 'OFF_RAMP',
  OnRamp = 'ON_RAMP',
  Receive = 'RECEIVE',
  Repay = 'REPAY',
  Send = 'SEND',
  Stake = 'STAKE',
  Swap = 'SWAP',
  SwapOrder = 'SWAP_ORDER',
  Unknown = 'UNKNOWN',
  Unstake = 'UNSTAKE',
  Withdraw = 'WITHDRAW'
}

export type V2Pair = IPool & {
  __typename?: 'V2Pair';
  address: Scalars['String'];
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']>;
  cumulativeVolume?: Maybe<Amount>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']>;
};


export type V2PairCumulativeVolumeArgs = {
  duration: HistoryDuration;
};


export type V2PairHistoricalVolumeArgs = {
  duration: HistoryDuration;
};


export type V2PairPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type V2PairTransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type V3Pool = IPool & {
  __typename?: 'V3Pool';
  address: Scalars['String'];
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']>;
  cumulativeVolume?: Maybe<Amount>;
  feeTier?: Maybe<Scalars['Float']>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  ticks?: Maybe<Array<Maybe<V3PoolTick>>>;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']>;
};


export type V3PoolCumulativeVolumeArgs = {
  duration: HistoryDuration;
};


export type V3PoolHistoricalVolumeArgs = {
  duration: HistoryDuration;
};


export type V3PoolPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type V3PoolTicksArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type V3PoolTransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type V3PoolTick = {
  __typename?: 'V3PoolTick';
  id: Scalars['ID'];
  liquidityGross?: Maybe<Scalars['String']>;
  liquidityNet?: Maybe<Scalars['String']>;
  price0?: Maybe<Scalars['String']>;
  price1?: Maybe<Scalars['String']>;
  tickIdx?: Maybe<Scalars['Int']>;
};

export type V4Pool = {
  __typename?: 'V4Pool';
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']>;
  cumulativeVolume?: Maybe<Amount>;
  feeTier?: Maybe<Scalars['Float']>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  hook?: Maybe<V4PoolHook>;
  id: Scalars['ID'];
  isDynamicFee?: Maybe<Scalars['Boolean']>;
  poolId: Scalars['String'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  rewardsCampaign?: Maybe<RewardsCampaign>;
  tickSpacing?: Maybe<Scalars['Int']>;
  ticks?: Maybe<Array<Maybe<V4PoolTick>>>;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']>;
};


export type V4PoolCumulativeVolumeArgs = {
  duration: HistoryDuration;
};


export type V4PoolHistoricalVolumeArgs = {
  duration: HistoryDuration;
};


export type V4PoolPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type V4PoolTicksArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type V4PoolTransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type V4PoolHook = {
  __typename?: 'V4PoolHook';
  address: Scalars['String'];
  id: Scalars['ID'];
};

export type V4PoolTick = {
  __typename?: 'V4PoolTick';
  id: Scalars['ID'];
  liquidityGross?: Maybe<Scalars['String']>;
  liquidityNet?: Maybe<Scalars['String']>;
  price0?: Maybe<Scalars['String']>;
  price1?: Maybe<Scalars['String']>;
  tickIdx?: Maybe<Scalars['Int']>;
};
