/**
 * CLOB Client Types
 * Interfaces for Central Limit Order Book operations
 */
/**
 * Order side
 */
export type OrderSide = 'buy' | 'sell';
/**
 * Order type
 */
export type OrderType = 'limit' | 'market' | 'stop' | 'stop_limit';
/**
 * Order status
 */
export type OrderStatus = 'pending' | 'open' | 'partial' | 'filled' | 'cancelled' | 'rejected';
/**
 * Time in force
 */
export type TimeInForce = 'GTC' | 'IOC' | 'FOK' | 'GTD';
/**
 * Order request
 */
export interface OrderRequest {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    price?: number;
    size: number;
    timeInForce?: TimeInForce;
    clientOrderId?: string;
    reduceOnly?: boolean;
    postOnly?: boolean;
}
/**
 * Order response
 */
export interface Order {
    orderId: string;
    clientOrderId?: string;
    symbol: string;
    side: OrderSide;
    type: OrderType;
    price: number;
    size: number;
    filledSize: number;
    remainingSize: number;
    status: OrderStatus;
    timeInForce: TimeInForce;
    createdAt: number;
    updatedAt: number;
}
/**
 * Order book entry
 */
export interface OrderBookEntry {
    price: number;
    size: number;
    count: number;
}
/**
 * Order book
 */
export interface OrderBook {
    symbol: string;
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
    timestamp: number;
}
/**
 * Trade
 */
export interface Trade {
    tradeId: string;
    symbol: string;
    side: OrderSide;
    price: number;
    size: number;
    timestamp: number;
    makerOrderId: string;
    takerOrderId: string;
}
/**
 * Position
 */
export interface Position {
    symbol: string;
    side: 'long' | 'short';
    size: number;
    entryPrice: number;
    markPrice: number;
    liquidationPrice: number;
    unrealizedPnl: number;
    margin: number;
    leverage: number;
}
/**
 * Balance
 */
export interface Balance {
    currency: string;
    available: number;
    locked: number;
    total: number;
}
/**
 * CLOB client interface
 */
export interface ICLOBClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    authenticate(apiKey: string, apiSecret: string): Promise<void>;
    placeOrder(order: OrderRequest): Promise<Order>;
    cancelOrder(orderId: string): Promise<void>;
    getOrder(orderId: string): Promise<Order>;
    getOrders(symbol?: string): Promise<Order[]>;
    getOrderBook(symbol: string, depth?: number): Promise<OrderBook>;
    getTrades(symbol: string, limit?: number): Promise<Trade[]>;
    getPositions(): Promise<Position[]>;
    getBalances(): Promise<Balance[]>;
    subscribeOrderBook(symbol: string, callback: (book: OrderBook) => void): () => void;
    subscribeTrades(symbol: string, callback: (trade: Trade) => void): () => void;
    subscribeOrders(callback: (order: Order) => void): () => void;
}
//# sourceMappingURL=types.d.ts.map