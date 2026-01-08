"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayOrderValidator = exports.OrderValidator = void 0;
const tslib_1 = require("tslib");
const OrderQuoter_1 = require("./OrderQuoter");
/**
 * UniswapX order validator
 */
class OrderValidator extends OrderQuoter_1.UniswapXOrderQuoter {
    validate(order) {
        const _super = Object.create(null, {
            quote: { get: () => super.quote }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield _super.quote.call(this, order)).validation;
        });
    }
    validateBatch(orders) {
        const _super = Object.create(null, {
            quoteBatch: { get: () => super.quoteBatch }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield _super.quoteBatch.call(this, orders)).map((order) => order.validation);
        });
    }
}
exports.OrderValidator = OrderValidator;
class RelayOrderValidator extends OrderQuoter_1.RelayOrderQuoter {
    validate(order) {
        const _super = Object.create(null, {
            quote: { get: () => super.quote }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield _super.quote.call(this, order)).validation;
        });
    }
    validateBatch(orders) {
        const _super = Object.create(null, {
            quoteBatch: { get: () => super.quoteBatch }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield _super.quoteBatch.call(this, orders)).map((order) => order.validation);
        });
    }
}
exports.RelayOrderValidator = RelayOrderValidator;
//# sourceMappingURL=OrderValidator.js.map