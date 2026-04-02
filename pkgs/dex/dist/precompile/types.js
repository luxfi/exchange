/**
 * Native LUX currency constant
 */
export const NATIVE_LUX = '0x0000000000000000000000000000000000000000';
/**
 * Sort currencies for pool key creation
 */
export function sortCurrencies(a, b) {
    return a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a];
}
/**
 * Create a pool key from two currencies
 */
export function createPoolKey(tokenA, tokenB, fee = 3000, tickSpacing = 60, hooks = '0x0000000000000000000000000000000000000000') {
    const [currency0, currency1] = sortCurrencies(tokenA, tokenB);
    return { currency0, currency1, fee, tickSpacing, hooks };
}
// ============================================================================
// LXBook Types (LP-9020) - CLOB Matching Engine
// ============================================================================
/**
 * Order time-in-force
 */
export var TIF;
(function (TIF) {
    TIF[TIF["GTC"] = 0] = "GTC";
    TIF[TIF["IOC"] = 1] = "IOC";
    TIF[TIF["ALO"] = 2] = "ALO";
})(TIF || (TIF = {}));
/**
 * Order kind
 */
export var OrderKind;
(function (OrderKind) {
    OrderKind[OrderKind["LIMIT"] = 0] = "LIMIT";
    OrderKind[OrderKind["MARKET"] = 1] = "MARKET";
    OrderKind[OrderKind["STOP_MARKET"] = 2] = "STOP_MARKET";
    OrderKind[OrderKind["STOP_LIMIT"] = 3] = "STOP_LIMIT";
    OrderKind[OrderKind["TAKE_MARKET"] = 4] = "TAKE_MARKET";
    OrderKind[OrderKind["TAKE_LIMIT"] = 5] = "TAKE_LIMIT";
})(OrderKind || (OrderKind = {}));
/**
 * Order group type
 */
export var GroupType;
(function (GroupType) {
    GroupType[GroupType["NONE"] = 0] = "NONE";
    GroupType[GroupType["OCO"] = 1] = "OCO";
    GroupType[GroupType["BRACKET"] = 2] = "BRACKET";
})(GroupType || (GroupType = {}));
/**
 * Action type for execute() endpoint
 */
export var ActionType;
(function (ActionType) {
    ActionType[ActionType["PLACE"] = 0] = "PLACE";
    ActionType[ActionType["CANCEL"] = 1] = "CANCEL";
    ActionType[ActionType["CANCEL_BY_CLOID"] = 2] = "CANCEL_BY_CLOID";
    ActionType[ActionType["MODIFY"] = 3] = "MODIFY";
    ActionType[ActionType["TWAP_CREATE"] = 4] = "TWAP_CREATE";
    ActionType[ActionType["TWAP_CANCEL"] = 5] = "TWAP_CANCEL";
    ActionType[ActionType["SCHEDULE_CANCEL"] = 6] = "SCHEDULE_CANCEL";
    ActionType[ActionType["NOOP"] = 7] = "NOOP";
    ActionType[ActionType["RESERVE_WEIGHT"] = 8] = "RESERVE_WEIGHT";
})(ActionType || (ActionType = {}));
// ============================================================================
// LXVault Types (LP-9030) - Custody and Risk Engine
// ============================================================================
/**
 * Margin mode
 */
export var MarginMode;
(function (MarginMode) {
    MarginMode[MarginMode["CROSS"] = 0] = "CROSS";
    MarginMode[MarginMode["ISOLATED"] = 1] = "ISOLATED";
})(MarginMode || (MarginMode = {}));
/**
 * Position side
 */
export var PositionSide;
(function (PositionSide) {
    PositionSide[PositionSide["LONG"] = 0] = "LONG";
    PositionSide[PositionSide["SHORT"] = 1] = "SHORT";
})(PositionSide || (PositionSide = {}));
