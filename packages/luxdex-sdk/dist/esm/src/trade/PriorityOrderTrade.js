import { CurrencyAmount, Price } from "@uniswap/sdk-core";
import { UnsignedPriorityOrder } from "../order";
import { areCurrenciesEqual } from "./utils";
export class PriorityOrderTrade {
    constructor({ currencyIn, currenciesOut, orderInfo, tradeType, expectedAmounts, }) {
        this._currencyIn = currencyIn;
        this._currenciesOut = currenciesOut;
        this.tradeType = tradeType;
        this.expectedAmounts = expectedAmounts;
        // assume single-chain for now
        this.order = new UnsignedPriorityOrder(orderInfo, currencyIn.chainId);
    }
    get inputAmount() {
        var _a;
        if (this._inputAmount)
            return this._inputAmount;
        // If we have expected quote data use that, otherwise use the order input amount
        const amount = ((_a = this.expectedAmounts) === null || _a === void 0 ? void 0 : _a.expectedAmountIn)
            ? this.getExpectedAmountIn()
            : CurrencyAmount.fromRawAmount(this._currencyIn, this.order.info.input.amount.toString());
        this._inputAmount = amount;
        return amount;
    }
    get outputAmounts() {
        if (this._outputAmounts)
            return this._outputAmounts;
        const amounts = this.order.info.outputs.map((output) => {
            // assume single chain ids across all outputs for now
            const currencyOut = this._currenciesOut.find((currency) => areCurrenciesEqual(currency, output.token, currency.chainId));
            if (!currencyOut) {
                throw new Error("currency not found in output array");
            }
            return CurrencyAmount.fromRawAmount(currencyOut, output.amount.toString());
        });
        this._outputAmounts = amounts;
        return amounts;
    }
    getFirstNonFeeOutputAmount() {
        if (this._firstNonFeeOutputAmount)
            return this._firstNonFeeOutputAmount;
        if (this.order.info.outputs.length === 0) {
            throw new Error("there must be at least one output token");
        }
        const output = this.order.info.outputs[0];
        // assume single chain ids across all outputs for now
        const currencyOut = this._currenciesOut.find((currency) => areCurrenciesEqual(currency, output.token, currency.chainId));
        if (!currencyOut) {
            throw new Error("currency output from order must exist in currenciesOut list");
        }
        const amount = CurrencyAmount.fromRawAmount(currencyOut, output.amount.toString());
        this._firstNonFeeOutputAmount = amount;
        return amount;
    }
    // TODO: revise when there are actually multiple output amounts. for now, assume only one non-fee output at a time
    get outputAmount() {
        var _a;
        // If we have expected quote data use that, otherwise use the first non-fee output
        return ((_a = this.expectedAmounts) === null || _a === void 0 ? void 0 : _a.expectedAmountOut)
            ? this.getExpectedAmountOut()
            : this.getFirstNonFeeOutputAmount();
    }
    minimumAmountOut() {
        return this.getFirstNonFeeOutputAmount();
    }
    maximumAmountIn() {
        return CurrencyAmount.fromRawAmount(this._currencyIn, this.order.info.input.amount.toString());
    }
    /**
     * The price expressed in terms of output amount/input amount.
     */
    get executionPrice() {
        var _a;
        return ((_a = this._executionPrice) !== null && _a !== void 0 ? _a : (this._executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient)));
    }
    /**
     * Return the execution price after accounting for slippage tolerance
     * @returns The execution price
     */
    worstExecutionPrice() {
        return new Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn().quotient, this.minimumAmountOut().quotient);
    }
    getExpectedAmountIn() {
        var _a;
        if (!((_a = this.expectedAmounts) === null || _a === void 0 ? void 0 : _a.expectedAmountIn)) {
            throw new Error("expectedAmountIn not set");
        }
        return CurrencyAmount.fromRawAmount(this._currencyIn, this.expectedAmounts.expectedAmountIn);
    }
    getExpectedAmountOut() {
        var _a;
        if (!((_a = this.expectedAmounts) === null || _a === void 0 ? void 0 : _a.expectedAmountOut)) {
            throw new Error("expectedAmountOut not set");
        }
        return CurrencyAmount.fromRawAmount(this._currenciesOut[0], this.expectedAmounts.expectedAmountOut);
    }
}
//# sourceMappingURL=PriorityOrderTrade.js.map