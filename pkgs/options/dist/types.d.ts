export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    address: string | null;
    logoUri: string;
    chainId: number;
    isNative?: boolean;
    isWrappedNative?: boolean;
    balance?: string;
}
export interface OptionQuote {
    bid: number | null;
    ask: number | null;
    last: number | null;
    volume: number;
    openInterest: number;
    iv: number | null;
    delta: number | null;
}
export interface OptionStrike {
    strike: number;
    call: OptionQuote;
    put: OptionQuote;
}
export interface OptionPosition {
    id: string;
    underlying: string;
    strike: number;
    side: "call" | "put";
    direction: "long" | "short";
    quantity: number;
    avgEntry: number;
    markPrice: number;
    expiration: string;
    pnl: number;
    pnlPercent: number;
}
export interface StrategyLeg {
    id: string;
    side: "buy" | "sell";
    optionType: "call" | "put";
    strike: number | null;
    quantity: number;
    ratio: number;
    expiration?: string | null;
}
export interface StrategyTemplate {
    name: string;
    description: string;
    legCount: 1 | 2 | 3 | 4;
    legs: Omit<StrategyLeg, "id" | "strike" | "expiration">[];
}
export interface StrategyOrder {
    underlying: string;
    expiration: string;
    legs: StrategyLeg[];
    type: "net_debit" | "net_credit" | "even";
    limitPrice?: number;
    timeInForce: "day" | "gtc" | "ioc";
}
export type MarginType = "cash" | "reg_t" | "portfolio";
export interface MarginRequirement {
    initialMargin: number;
    maintenanceMargin: number;
    buyingPower: number;
    maxQuantity: number;
    marginType: MarginType;
}
export interface AccountMargin {
    equity: number;
    cashBalance: number;
    buyingPower: number;
    dayTradingBuyingPower: number;
    regtBuyingPower: number;
    initialMargin: number;
    maintenanceMargin: number;
    marginMultiplier: number;
    patternDayTrader: boolean;
}
export interface OptionsApprovalLevel {
    level: 1 | 2 | 3 | 4;
    description: string;
    allowedStrategies: string[];
}
export interface Greeks {
    delta: number | null;
    gamma: number | null;
    theta: number | null;
    vega: number | null;
    rho: number | null;
    iv: number | null;
}
export interface OptionContract {
    symbol: string;
    underlying: string;
    contractType: "call" | "put";
    strike: number;
    expiration: string;
    style: "american" | "european";
    tradable: boolean;
    bid: number;
    ask: number;
    last: number;
    volume: number;
    openInterest: number;
    greeks: Greeks;
}
export type OptionAction = "buy_to_open" | "buy_to_close" | "sell_to_open" | "sell_to_close";
export interface OptionLeg {
    contractSymbol?: string;
    contractType: "call" | "put";
    strike: number;
    expiration: string;
    action: OptionAction;
    quantity: number;
}
export interface MultiLegOrderRequest {
    symbol: string;
    strategyType: "vertical" | "iron_condor" | "straddle" | "strangle" | "calendar" | "butterfly" | "custom";
    legs: OptionLeg[];
    orderType: "limit" | "market";
    limitPrice?: number;
    timeInForce: "day" | "gtc" | "ioc";
}
export interface MultiLegOrderResult {
    strategyOrderId: string;
    legOrders?: Array<{
        id: string;
        status: string;
    }>;
    netPremium?: number;
    status: string;
}
export interface FuturesContract {
    symbol: string;
    underlying: string;
    name: string;
    expiration: string;
    exchange: string;
    tickSize: number;
    pointValue: number;
    marginInitial: number;
    marginMaintenance: number;
    last: number;
    bid: number;
    ask: number;
    volume: number;
    openInterest: number;
    settlementPrice: number;
    change: number;
    changePercent: number;
}
export interface FuturesPosition {
    id: string;
    symbol: string;
    underlying: string;
    side: "long" | "short";
    quantity: number;
    avgEntry: number;
    markPrice: number;
    unrealizedPnl: number;
    marginUsed: number;
    expiration: string;
}
export interface FuturesOrderRequest {
    symbol: string;
    side: "buy" | "sell";
    quantity: number;
    orderType: "limit" | "market" | "stop" | "stop_limit";
    limitPrice?: number;
    stopPrice?: number;
    timeInForce: "day" | "gtc" | "ioc";
}
export interface FXPair {
    symbol: string;
    base: string;
    quote: string;
    bid: number;
    ask: number;
    spread: number;
    high24h: number;
    low24h: number;
    volume24h: number;
    change24h: number;
    changePercent24h: number;
    pipSize: number;
    maxLeverage: number;
}
export interface FXPosition {
    id: string;
    symbol: string;
    side: "long" | "short";
    quantity: number;
    avgEntry: number;
    markPrice: number;
    unrealizedPnl: number;
    marginUsed: number;
    leverage: number;
    swapRate: number;
}
export interface FXOrderRequest {
    symbol: string;
    side: "buy" | "sell";
    quantity: number;
    orderType: "limit" | "market" | "stop" | "stop_limit";
    limitPrice?: number;
    stopPrice?: number;
    takeProfit?: number;
    stopLoss?: number;
    timeInForce: "day" | "gtc" | "ioc";
}
export interface Bond {
    cusip: string;
    isin?: string;
    name: string;
    issuer: string;
    coupon: number;
    maturityDate: string;
    yieldToMaturity: number;
    price: number;
    accrued: number;
    dirtyPrice: number;
    faceValue: number;
    rating: string;
    sector: string;
    frequency: "annual" | "semi_annual" | "quarterly" | "monthly";
    callable: boolean;
    callDate?: string;
}
export interface BondPosition {
    id: string;
    cusip: string;
    name: string;
    faceValue: number;
    quantity: number;
    avgPrice: number;
    markPrice: number;
    coupon: number;
    yieldAtPurchase: number;
    currentYield: number;
    unrealizedPnl: number;
    accruedInterest: number;
    maturityDate: string;
    nextCouponDate: string;
}
export type InstrumentClass = "equity" | "option" | "future" | "fx" | "crypto" | "bond";
export interface Instrument {
    symbol: string;
    name: string;
    class: InstrumentClass;
    exchange?: string;
    tradable: boolean;
    marginable: boolean;
    shortable: boolean;
    fractionable: boolean;
}
export declare const OPTIONS_APPROVAL_LEVELS: OptionsApprovalLevel[];
export declare const STRATEGY_TEMPLATES: StrategyTemplate[];
//# sourceMappingURL=types.d.ts.map