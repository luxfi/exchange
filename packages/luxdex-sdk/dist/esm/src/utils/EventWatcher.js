import { __awaiter } from "tslib";
import { utils } from "ethers";
import MockERC20Abi from "../../abis/MockERC20.json";
import { ExclusiveDutchOrderReactor__factory, RelayOrderReactor__factory, } from "../contracts";
const TRANSFER = "Transfer";
/**
 * Helper for watching events
 */
class EventWatcher {
    constructor(reactor) {
        this.reactor = reactor;
    }
    getFillEvents(fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            const logs = yield this.getFillLogs(fromBlock, toBlock);
            return logs.map((log) => log.args);
        });
    }
    getFillInfo(fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            const logs = yield this.getFillLogs(fromBlock, toBlock);
            const events = logs.map((log) => log.args);
            // TODO: deal with batch fills for orders with the same swapper and outToken
            const txs = logs.reduce((acc, log) => acc.add(this.reactor.provider.getTransactionReceipt(log.transactionHash)), new Set());
            const txReceipts = yield Promise.all(txs);
            const fills = events.map((e, i) => {
                return {
                    orderHash: e.orderHash,
                    swapper: e.swapper,
                    filler: e.filler,
                    nonce: e.nonce,
                    txLogs: txReceipts[i].logs,
                    blockNumber: txReceipts[i].blockNumber,
                    txHash: txReceipts[i].transactionHash,
                };
            });
            return fills.map((fill) => {
                const outputs = this.getTokenTransfers(fill.txLogs, fill.swapper);
                const inputs = this.getTokenTransfers(fill.txLogs, fill.filler);
                return {
                    orderHash: fill.orderHash,
                    swapper: fill.swapper,
                    filler: fill.filler,
                    nonce: fill.nonce,
                    blockNumber: fill.blockNumber,
                    txHash: fill.txHash,
                    inputs: inputs,
                    outputs: outputs,
                };
            });
        });
    }
    getTokenTransfers(logs, recipient) {
        const ERC20Interface = new utils.Interface(MockERC20Abi.abi);
        return logs.reduce((logAcc, log) => {
            try {
                const parsedLog = ERC20Interface.parseLog(log);
                if (parsedLog.name === TRANSFER && parsedLog.args.to === recipient) {
                    logAcc.push({
                        token: log.address,
                        amount: parsedLog.args.amount,
                    });
                }
                return logAcc;
            }
            catch (e) {
                return logAcc;
            }
        }, []);
    }
}
export class UniswapXEventWatcher extends EventWatcher {
    constructor(provider, reactorAddress) {
        const reactor = ExclusiveDutchOrderReactor__factory.connect(reactorAddress, provider);
        super(reactor);
    }
    getFillLogs(fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reactor.queryFilter(this.reactor.filters.Fill(), fromBlock, toBlock);
        });
    }
    onFill(callback) {
        this.reactor.on(this.reactor.filters.Fill(), (orderHash, filler, swapper, nonce, event) => {
            callback({
                orderHash,
                filler,
                nonce,
                swapper,
            }, event);
        });
    }
}
export class RelayEventWatcher extends EventWatcher {
    constructor(provider, reactorAddress) {
        const reactor = RelayOrderReactor__factory.connect(reactorAddress, provider);
        super(reactor);
    }
    getFillLogs(fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reactor.queryFilter(this.reactor.filters.Relay(), fromBlock, toBlock);
        });
    }
    onFill(callback) {
        this.reactor.on(this.reactor.filters.Relay(), (orderHash, filler, swapper, nonce, event) => {
            callback({
                orderHash,
                filler,
                nonce,
                swapper,
            }, event);
        });
    }
}
//# sourceMappingURL=EventWatcher.js.map