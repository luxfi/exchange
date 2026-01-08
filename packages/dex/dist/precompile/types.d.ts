/**
 * DEX Precompile Types
 * Native Uniswap v4-style AMM implementation
 */
import type { Address } from 'viem';
/**
 * Currency type - address(0) = native LUX
 */
export interface Currency {
    address: Address;
}
/**
 * Pool key uniquely identifies a pool
 */
export interface PoolKey {
    currency0: Address;
    currency1: Address;
    fee: number;
    tickSpacing: number;
    hooks: Address;
}
/**
 * Balance delta from swap/liquidity operations
 * Positive = user owes pool, Negative = pool owes user
 */
export interface BalanceDelta {
    amount0: bigint;
    amount1: bigint;
}
/**
 * Swap parameters
 */
export interface SwapParams {
    zeroForOne: boolean;
    amountSpecified: bigint;
    sqrtPriceLimitX96: bigint;
}
/**
 * Modify liquidity parameters
 */
export interface ModifyLiquidityParams {
    tickLower: number;
    tickUpper: number;
    liquidityDelta: bigint;
    salt: `0x${string}`;
}
/**
 * Pool state
 */
export interface PoolState {
    sqrtPriceX96: bigint;
    tick: number;
    protocolFee: number;
    lpFee: number;
}
/**
 * Position info
 */
export interface Position {
    liquidity: bigint;
    feeGrowthInside0LastX128: bigint;
    feeGrowthInside1LastX128: bigint;
}
/**
 * Native LUX currency constant
 */
export declare const NATIVE_LUX: Address;
/**
 * Sort currencies for pool key creation
 */
export declare function sortCurrencies(a: Address, b: Address): [Address, Address];
/**
 * Create a pool key from two currencies
 */
export declare function createPoolKey(tokenA: Address, tokenB: Address, fee?: number, tickSpacing?: number, hooks?: Address): PoolKey;
/**
 * Order time-in-force
 */
export declare enum TIF {
    GTC = 0,// Good-til-canceled (resting)
    IOC = 1,// Immediate-or-cancel
    ALO = 2
}
/**
 * Order kind
 */
export declare enum OrderKind {
    LIMIT = 0,
    MARKET = 1,
    STOP_MARKET = 2,
    STOP_LIMIT = 3,
    TAKE_MARKET = 4,
    TAKE_LIMIT = 5
}
/**
 * Order group type
 */
export declare enum GroupType {
    NONE = 0,
    OCO = 1,// One-cancels-other
    BRACKET = 2
}
/**
 * Action type for execute() endpoint
 */
export declare enum ActionType {
    PLACE = 0,
    CANCEL = 1,
    CANCEL_BY_CLOID = 2,
    MODIFY = 3,
    TWAP_CREATE = 4,
    TWAP_CANCEL = 5,
    SCHEDULE_CANCEL = 6,
    NOOP = 7,
    RESERVE_WEIGHT = 8
}
/**
 * LXBook Order (LP-9020)
 */
export interface LXOrder {
    marketId: number;
    isBuy: boolean;
    kind: OrderKind;
    sizeX18: bigint;
    limitPxX18: bigint;
    triggerPxX18: bigint;
    reduceOnly: boolean;
    tif: TIF;
    cloid: `0x${string}`;
    groupId: `0x${string}`;
    groupType: GroupType;
}
/**
 * LXBook Action (execute() payload)
 */
export interface LXAction {
    actionType: ActionType;
    nonce: bigint;
    expiresAfter: bigint;
    data: `0x${string}`;
}
/**
 * LXBook PlaceResult
 */
export interface LXPlaceResult {
    oid: bigint;
    status: number;
    filledSizeX18: bigint;
    avgPxX18: bigint;
}
/**
 * LXBook L1 (best bid/ask)
 */
export interface LXL1 {
    bestBidPxX18: bigint;
    bestBidSzX18: bigint;
    bestAskPxX18: bigint;
    bestAskSzX18: bigint;
    lastTradePxX18: bigint;
}
/**
 * Margin mode
 */
export declare enum MarginMode {
    CROSS = 0,
    ISOLATED = 1
}
/**
 * Position side
 */
export declare enum PositionSide {
    LONG = 0,
    SHORT = 1
}
/**
 * LXVault Account identifier
 */
export interface LXAccount {
    main: Address;
    subaccountId: number;
}
/**
 * LXVault Position (LP-9030)
 */
export interface LXPosition {
    marketId: number;
    side: PositionSide;
    sizeX18: bigint;
    entryPxX18: bigint;
    unrealizedPnlX18: bigint;
    accumulatedFundingX18: bigint;
    lastFundingTime: bigint;
}
/**
 * LXVault MarginInfo
 */
export interface LXMarginInfo {
    totalCollateralX18: bigint;
    usedMarginX18: bigint;
    freeMarginX18: bigint;
    marginRatioX18: bigint;
    maintenanceMarginX18: bigint;
    liquidatable: boolean;
}
/**
 * LXVault Settlement (LXBook → LXVault)
 */
export interface LXSettlement {
    maker: LXAccount;
    taker: LXAccount;
    marketId: number;
    takerIsBuy: boolean;
    sizeX18: bigint;
    priceX18: bigint;
    makerFeeX18: bigint;
    takerFeeX18: bigint;
}
/**
 * LXVault LiquidationResult
 */
export interface LXLiquidationResult {
    liquidated: LXAccount;
    liquidator: LXAccount;
    marketId: number;
    sizeX18: bigint;
    priceX18: bigint;
    penaltyX18: bigint;
    adlTriggered: boolean;
}
/**
 * LXFeed Mark price
 */
export interface LXMarkPrice {
    indexPxX18: bigint;
    markPxX18: bigint;
    premiumX18: bigint;
    timestamp: bigint;
}
/**
 * LXFeed Funding rate
 */
export interface LXFundingRate {
    rateX18: bigint;
    nextFundingTime: bigint;
}
//# sourceMappingURL=types.d.ts.map