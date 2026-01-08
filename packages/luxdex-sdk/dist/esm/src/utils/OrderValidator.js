import { __awaiter } from "tslib";
import { RelayOrderQuoter, UniswapXOrderQuoter, } from "./OrderQuoter";
/**
 * UniswapX order validator
 */
export class OrderValidator extends UniswapXOrderQuoter {
    validate(order) {
        const _super = Object.create(null, {
            quote: { get: () => super.quote }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return (yield _super.quote.call(this, order)).validation;
        });
    }
    validateBatch(orders) {
        const _super = Object.create(null, {
            quoteBatch: { get: () => super.quoteBatch }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return (yield _super.quoteBatch.call(this, orders)).map((order) => order.validation);
        });
    }
}
export class RelayOrderValidator extends RelayOrderQuoter {
    validate(order) {
        const _super = Object.create(null, {
            quote: { get: () => super.quote }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return (yield _super.quote.call(this, order)).validation;
        });
    }
    validateBatch(orders) {
        const _super = Object.create(null, {
            quoteBatch: { get: () => super.quoteBatch }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return (yield _super.quoteBatch.call(this, orders)).map((order) => order.validation);
        });
    }
}
//# sourceMappingURL=OrderValidator.js.map