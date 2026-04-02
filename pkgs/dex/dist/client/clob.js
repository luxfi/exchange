/**
 * Central Limit Order Book client
 * Connects to lux/dex WebSocket server
 */
export class CLOBClient {
    ws = null;
    url;
    debug;
    reconnect;
    reconnectInterval;
    connected = false;
    authenticated = false;
    requestId = 0;
    pendingRequests = new Map();
    subscriptions = new Map();
    constructor(options) {
        this.url = options.url;
        this.debug = options.debug ?? false;
        this.reconnect = options.reconnect ?? true;
        this.reconnectInterval = options.reconnectInterval ?? 5000;
    }
    log(...args) {
        if (this.debug) {
            console.log('[CLOBClient]', ...args);
        }
    }
    async connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);
                this.ws.onopen = () => {
                    this.connected = true;
                    this.log('Connected to', this.url);
                    resolve();
                };
                this.ws.onclose = () => {
                    this.connected = false;
                    this.authenticated = false;
                    this.log('Disconnected');
                    if (this.reconnect) {
                        setTimeout(() => this.connect(), this.reconnectInterval);
                    }
                };
                this.ws.onerror = (error) => {
                    this.log('Error:', error);
                    reject(error);
                };
                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data);
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async disconnect() {
        this.reconnect = false;
        this.ws?.close();
        this.ws = null;
        this.connected = false;
        this.authenticated = false;
    }
    isConnected() {
        return this.connected;
    }
    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            this.log('Received:', message);
            // Handle response to request
            if (message.id && this.pendingRequests.has(message.id)) {
                const { resolve, reject } = this.pendingRequests.get(message.id);
                this.pendingRequests.delete(message.id);
                if (message.error) {
                    reject(new Error(message.error));
                }
                else {
                    resolve(message.result || message);
                }
                return;
            }
            // Handle subscription updates
            const type = message.type || message.channel;
            if (type && this.subscriptions.has(type)) {
                this.subscriptions.get(type).forEach(handler => handler(message));
            }
        }
        catch (error) {
            this.log('Parse error:', error);
        }
    }
    async request(method, params) {
        if (!this.connected) {
            throw new Error('Not connected');
        }
        const id = ++this.requestId;
        const message = {
            jsonrpc: '2.0',
            id,
            method,
            params,
        };
        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, { resolve, reject });
            this.ws.send(JSON.stringify(message));
            this.log('Sent:', message);
            // Timeout after 30 seconds
            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error('Request timeout'));
                }
            }, 30000);
        });
    }
    async authenticate(apiKey, apiSecret) {
        await this.request('authenticate', { apiKey, apiSecret });
        this.authenticated = true;
    }
    async placeOrder(order) {
        return this.request('placeOrder', order);
    }
    async cancelOrder(orderId) {
        await this.request('cancelOrder', { orderId });
    }
    async getOrder(orderId) {
        return this.request('getOrder', { orderId });
    }
    async getOrders(symbol) {
        return this.request('getOrders', { symbol });
    }
    async getOrderBook(symbol, depth = 20) {
        return this.request('getOrderBook', { symbol, depth });
    }
    async getTrades(symbol, limit = 100) {
        return this.request('getTrades', { symbol, limit });
    }
    async getPositions() {
        return this.request('getPositions', {});
    }
    async getBalances() {
        return this.request('getBalances', {});
    }
    subscribeOrderBook(symbol, callback) {
        const channel = `orderbook:${symbol}`;
        if (!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, new Set());
            this.request('subscribe', { channel: 'orderbook', symbol }).catch(console.error);
        }
        this.subscriptions.get(channel).add(callback);
        return () => {
            this.subscriptions.get(channel)?.delete(callback);
            if (this.subscriptions.get(channel)?.size === 0) {
                this.subscriptions.delete(channel);
                this.request('unsubscribe', { channel: 'orderbook', symbol }).catch(console.error);
            }
        };
    }
    subscribeTrades(symbol, callback) {
        const channel = `trades:${symbol}`;
        if (!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, new Set());
            this.request('subscribe', { channel: 'trades', symbol }).catch(console.error);
        }
        this.subscriptions.get(channel).add(callback);
        return () => {
            this.subscriptions.get(channel)?.delete(callback);
            if (this.subscriptions.get(channel)?.size === 0) {
                this.subscriptions.delete(channel);
                this.request('unsubscribe', { channel: 'trades', symbol }).catch(console.error);
            }
        };
    }
    subscribeOrders(callback) {
        const channel = 'orders';
        if (!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, new Set());
            this.request('subscribe', { channel: 'orders' }).catch(console.error);
        }
        this.subscriptions.get(channel).add(callback);
        return () => {
            this.subscriptions.get(channel)?.delete(callback);
            if (this.subscriptions.get(channel)?.size === 0) {
                this.subscriptions.delete(channel);
                this.request('unsubscribe', { channel: 'orders' }).catch(console.error);
            }
        };
    }
}
/**
 * Create a CLOB client
 */
export function createCLOBClient(url, debug = false) {
    return new CLOBClient({ url, debug });
}
