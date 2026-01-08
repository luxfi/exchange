import { __awaiter } from "tslib";
import { ethers } from "ethers";
import { OrderType, PERMIT2_MAPPING, REACTOR_ADDRESS_MAPPING, UNISWAPX_ORDER_QUOTER_MAPPING, } from "../constants";
import { OrderQuoter__factory, RelayOrderReactor__factory, } from "../contracts";
import { MissingConfiguration } from "../errors";
import { parseExclusiveFillerData, ValidationType } from "../order/validation";
import { NonceManager } from "./NonceManager";
import { multicallSameContractManyFunctions, } from "./multicall";
export var OrderValidation;
(function (OrderValidation) {
    OrderValidation[OrderValidation["Expired"] = 0] = "Expired";
    OrderValidation[OrderValidation["NonceUsed"] = 1] = "NonceUsed";
    OrderValidation[OrderValidation["InsufficientFunds"] = 2] = "InsufficientFunds";
    OrderValidation[OrderValidation["InvalidSignature"] = 3] = "InvalidSignature";
    OrderValidation[OrderValidation["InvalidOrderFields"] = 4] = "InvalidOrderFields";
    OrderValidation[OrderValidation["UnknownError"] = 5] = "UnknownError";
    OrderValidation[OrderValidation["ValidationFailed"] = 6] = "ValidationFailed";
    OrderValidation[OrderValidation["ExclusivityPeriod"] = 7] = "ExclusivityPeriod";
    OrderValidation[OrderValidation["OrderNotFillableYet"] = 8] = "OrderNotFillableYet";
    OrderValidation[OrderValidation["InvalidGasPrice"] = 9] = "InvalidGasPrice";
    OrderValidation[OrderValidation["InvalidCosignature"] = 10] = "InvalidCosignature";
    OrderValidation[OrderValidation["OK"] = 11] = "OK";
})(OrderValidation || (OrderValidation = {}));
const BASIC_ERROR = "0x08c379a0";
const KNOWN_ERRORS = {
    "8baa579f": OrderValidation.InvalidSignature,
    "815e1d64": OrderValidation.InvalidSignature,
    "756688fe": OrderValidation.NonceUsed,
    // invalid dutch decay time
    "302e5b7c": OrderValidation.InvalidOrderFields,
    // invalid dutch decay time
    "773a6187": OrderValidation.InvalidOrderFields,
    // invalid reactor address
    "4ddf4a64": OrderValidation.InvalidOrderFields,
    // both input and output decay
    d303758b: OrderValidation.InvalidOrderFields,
    // Incorrect amounts
    "7c1f8113": OrderValidation.InvalidOrderFields,
    // invalid dutch decay time
    "43133453": OrderValidation.InvalidOrderFields,
    "48fee69c": OrderValidation.InvalidOrderFields,
    "70f65caa": OrderValidation.Expired,
    ee3b3d4b: OrderValidation.NonceUsed,
    "0a0b0d79": OrderValidation.ValidationFailed,
    b9ec1e96: OrderValidation.ExclusivityPeriod,
    "062dec56": OrderValidation.ExclusivityPeriod,
    "75c1bb14": OrderValidation.ExclusivityPeriod,
    // invalid cosigner output
    a305df82: OrderValidation.InvalidOrderFields,
    // invalid cosigner input
    ac9143e7: OrderValidation.InvalidOrderFields,
    // duplicate fee output
    fff08303: OrderValidation.InvalidOrderFields,
    // invalid cosignature
    d7815be1: OrderValidation.InvalidCosignature,
    TRANSFER_FROM_FAILED: OrderValidation.InsufficientFunds,
    // invalid fee escalation amounts
    d856fc5a: OrderValidation.InvalidOrderFields,
    // Signature expired
    cd21db4f: OrderValidation.Expired,
    // PriorityOrderReactor:InvalidDeadline() 
    "769d11e4": OrderValidation.Expired,
    // PriorityOrderReactor:OrderNotFillable()
    c6035520: OrderValidation.OrderNotFillableYet,
    // PriorityOrderReactor:InputOutputScaling()
    a6b844f5: OrderValidation.InvalidOrderFields,
    // PriorityOrderReactor:InvalidGasPrice()
    f3eb44e5: OrderValidation.InvalidGasPrice,
};
// Offchain orders have one quirk
// all reactors check expiry before anything else, so old but already filled orders will return as expired
// so this function takes orders in expired state and double checks them
function checkTerminalStates(provider, nonceManager, orders, validations) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.all(validations.map((validation, i) => __awaiter(this, void 0, void 0, function* () {
            const order = orders[i];
            if (validation === OrderValidation.Expired ||
                order.order.info.deadline < Math.floor(new Date().getTime() / 1000)) {
                const maker = order.order.getSigner(order.signature);
                const cancelled = yield nonceManager.isUsed(maker, order.order.info.nonce);
                return cancelled ? OrderValidation.NonceUsed : OrderValidation.Expired;
            }
            // if the order has block overrides AND order validation is OK, it is invalid if current block number is < block override
            else if (order.order.blockOverrides && order.order.blockOverrides.number && validation === OrderValidation.OK) {
                const blockNumber = yield provider.getBlockNumber();
                if (blockNumber < parseInt(order.order.blockOverrides.number, 16)) {
                    return OrderValidation.OrderNotFillableYet;
                }
            }
            return validation;
        })));
    });
}
/**
 * UniswapX order quoter
 */
export class UniswapXOrderQuoter {
    constructor(provider, chainId, orderQuoterAddress) {
        this.provider = provider;
        this.chainId = chainId;
        if (orderQuoterAddress) {
            this.quoter = OrderQuoter__factory.connect(orderQuoterAddress, provider);
        }
        else if (UNISWAPX_ORDER_QUOTER_MAPPING[chainId]) {
            this.quoter = OrderQuoter__factory.connect(UNISWAPX_ORDER_QUOTER_MAPPING[chainId], this.provider);
        }
        else {
            throw new MissingConfiguration("quoter", chainId.toString());
        }
    }
    quote(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.quoteBatch([order]))[0];
        });
    }
    quoteBatch(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.getMulticallResults("quote", orders);
            const validations = yield this.getValidations(orders, results);
            const quotes = results.map(({ success, returnData }) => {
                if (!success) {
                    return undefined;
                }
                return this.quoter.interface.decodeFunctionResult("quote", returnData)
                    .result;
            });
            return validations.map((validation, i) => {
                return {
                    validation,
                    quote: quotes[i],
                };
            });
        });
    }
    getValidations(orders, results) {
        return __awaiter(this, void 0, void 0, function* () {
            const validations = results.map((result, idx) => {
                if (result.success) {
                    return OrderValidation.OK;
                }
                else {
                    let returnData = result.returnData;
                    // Parse traditional string error messages
                    if (returnData.startsWith(BASIC_ERROR)) {
                        returnData = new ethers.utils.AbiCoder().decode(["string"], "0x" + returnData.slice(10))[0];
                    }
                    for (const key of Object.keys(KNOWN_ERRORS)) {
                        if (returnData.includes(key)) {
                            if (key === "0a0b0d79") {
                                const fillerValidation = parseExclusiveFillerData(orders[idx].order.info.additionalValidationData);
                                if (fillerValidation.type === ValidationType.ExclusiveFiller &&
                                    fillerValidation.data.filler !== ethers.constants.AddressZero) {
                                    return OrderValidation.ExclusivityPeriod;
                                }
                                return OrderValidation.ValidationFailed;
                            }
                            return KNOWN_ERRORS[key];
                        }
                    }
                    return OrderValidation.UnknownError;
                }
            });
            return yield checkTerminalStates(this.provider, new NonceManager(this.provider, this.chainId, PERMIT2_MAPPING[this.chainId]), orders, validations);
        });
    }
    /// Get the results of a multicall for a given function
    /// Each order with a blockOverride is multicalled separately
    getMulticallResults(functionName, orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordersWithBlockOverrides = orders.filter((order) => order.order.blockOverrides);
            const promises = [];
            ordersWithBlockOverrides.map((order) => {
                promises.push(multicallSameContractManyFunctions(this.provider, {
                    address: this.quoter.address,
                    contractInterface: this.quoter.interface,
                    functionName: functionName,
                    functionParams: [[order.order.serialize(), order.signature]],
                }, undefined, order.order.blockOverrides));
            });
            const ordersWithoutBlockOverrides = orders.filter((order) => !order.order.blockOverrides);
            const calls = ordersWithoutBlockOverrides.map((order) => {
                return [order.order.serialize(), order.signature];
            });
            promises.push(multicallSameContractManyFunctions(this.provider, {
                address: this.quoter.address,
                contractInterface: this.quoter.interface,
                functionName: functionName,
                functionParams: calls,
            }));
            const results = yield Promise.all(promises);
            return results.flat();
        });
    }
    get orderQuoterAddress() {
        return this.quoter.address;
    }
}
/**
 * Relay order quoter
 */
export class RelayOrderQuoter {
    constructor(provider, chainId, reactorAddress) {
        this.provider = provider;
        this.chainId = chainId;
        this.quoteFunctionSelector = "0x3f62192e"; // function execute((bytes, bytes))
        if (reactorAddress) {
            this.quoter = RelayOrderReactor__factory.connect(reactorAddress, provider);
        }
        else if (REACTOR_ADDRESS_MAPPING[chainId][OrderType.Relay]) {
            this.quoter = RelayOrderReactor__factory.connect(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            REACTOR_ADDRESS_MAPPING[chainId][OrderType.Relay], this.provider);
        }
        else {
            throw new MissingConfiguration("quoter", chainId.toString());
        }
    }
    quote(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.quoteBatch([order]))[0];
        });
    }
    quoteBatch(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.getMulticallResults(this.quoteFunctionSelector, orders);
            const validations = yield this.getValidations(orders, results);
            const quotes = results.map(
            // no return data
            ({ success }, idx) => {
                if (!success) {
                    return undefined;
                }
                // TODO:
                return orders[idx].order.resolve({
                    timestamp: Math.floor(new Date().getTime() / 1000),
                });
            });
            return validations.map((validation, i) => {
                return {
                    validation,
                    quote: quotes[i],
                };
            });
        });
    }
    /// Get the results of a multicall for a given function
    /// Each order with a blockOverride is multicalled separately
    getMulticallResults(functionName, orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordersWithBlockOverrides = orders.filter((order) => order.order.blockOverrides);
            const promises = [];
            ordersWithBlockOverrides.map((order) => {
                promises.push(multicallSameContractManyFunctions(this.provider, {
                    address: this.quoter.address,
                    contractInterface: this.quoter.interface,
                    functionName: functionName,
                    functionParams: [
                        [
                            {
                                order: order.order.serialize(),
                                sig: order.signature,
                            },
                        ],
                    ],
                }, undefined, order.order.blockOverrides));
            });
            const ordersWithoutBlockOverrides = orders.filter((order) => !order.order.blockOverrides);
            const calls = ordersWithoutBlockOverrides.map((order) => {
                return [
                    {
                        order: order.order.serialize(),
                        sig: order.signature,
                    },
                ];
            });
            promises.push(multicallSameContractManyFunctions(this.provider, {
                address: this.quoter.address,
                contractInterface: this.quoter.interface,
                functionName: functionName,
                functionParams: calls,
            }));
            const results = yield Promise.all(promises);
            return results.flat();
        });
    }
    getValidations(orders, results) {
        return __awaiter(this, void 0, void 0, function* () {
            const validations = results.map((result) => {
                if (result.success) {
                    return OrderValidation.OK;
                }
                else {
                    let returnData = result.returnData;
                    // Parse traditional string error messages
                    if (returnData.startsWith(BASIC_ERROR)) {
                        returnData = new ethers.utils.AbiCoder().decode(["string"], "0x" + returnData.slice(10))[0];
                    }
                    for (const key of Object.keys(KNOWN_ERRORS)) {
                        if (returnData.includes(key)) {
                            return KNOWN_ERRORS[key];
                        }
                    }
                    return OrderValidation.UnknownError;
                }
            });
            return yield checkTerminalStates(this.provider, new NonceManager(this.provider, this.chainId, PERMIT2_MAPPING[this.chainId]), orders, validations);
        });
    }
    get orderQuoterAddress() {
        return this.quoter.address;
    }
}
//# sourceMappingURL=OrderQuoter.js.map