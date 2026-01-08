/**
 * CLOB Client
 * WebSocket client for lux/dex order book
 */
import type { ICLOBClient, OrderRequest, Order, OrderBook, Trade, Position, Balance } from './types';
interface CLOBClientOptions {
    url: string;
    debug?: boolean;
    reconnect?: boolean;
    reconnectInterval?: number;
}
/**
 * Central Limit Order Book client
 * Connects to lux/dex WebSocket server
 */
export declare class CLOBClient implements ICLOBClient {
    private ws;
    private url;
    private debug;
    private reconnect;
    private reconnectInterval;
    private connected;
    private authenticated;
    private requestId;
    private pendingRequests;
    private subscriptions;
    constructor(options: CLOBClientOptions);
    private log;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    private handleMessage;
    private request;
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
/**
 * Create a CLOB client
 */
export declare function createCLOBClient(url: string, debug?: boolean): ICLOBClient;
export {};
//# sourceMappingURL=clob.d.ts.map