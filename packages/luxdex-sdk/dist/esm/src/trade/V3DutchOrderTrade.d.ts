import { Currency, CurrencyAmount, Price, TradeType } from "@uniswap/sdk-core";
import { UnsignedV3DutchOrder, UnsignedV3DutchOrderInfo } from "../order/V3DutchOrder";
export declare class V3DutchOrderTrade<TInput extends Currency, TOutput extends Currency, TTradeType extends TradeType> {
    readonly tradeType: TTradeType;
    readonly order: UnsignedV3DutchOrder;
    readonly expectedAmounts: {
        expectedAmountIn: string;
        expectedAmountOut: string;
    } | undefined;
    private _inputAmount;
    private _outputAmounts;
    private _currencyIn;
    private _currenciesOut;
    constructor({ currencyIn, currenciesOut, orderInfo, tradeType, expectedAmounts, }: {
        currencyIn: TInput;
        currenciesOut: TOutput[];
        orderInfo: UnsignedV3DutchOrderInfo;
        tradeType: TTradeType;
        expectedAmounts?: {
            expectedAmountIn: string;
            expectedAmountOut: string;
        };
    });
    get inputAmount(): CurrencyAmount<TInput>;
    get outputAmounts(): CurrencyAmount<TOutput>[];
    get outputAmount(): CurrencyAmount<TOutput>;
    minimumAmountOut(): CurrencyAmount<TOutput>;
    maximumAmountIn(): CurrencyAmount<TInput>;
    private _executionPrice;
    /**
     * The price expressed in terms of output amount/input amount.
     */
    get executionPrice(): Price<TInput, TOutput>;
    /**
     * Return the execution price after accounting for slippage tolerance
     * @returns The execution price
     */
    worstExecutionPrice(): Price<TInput, TOutput>;
    private getExpectedAmountIn;
    private getExpectedAmountOut;
}
