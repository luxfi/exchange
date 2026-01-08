import { Currency, Price } from '@uniswap/sdk-core';
import { Pool } from './pool';
/**
 * Represents a list of pools through which a swap can occur
 * @template TInput The input currency
 * @template TOutput The output currency
 */
export declare class Route<TInput extends Currency, TOutput extends Currency> {
    readonly pools: Pool[];
    readonly currencyPath: Currency[];
    readonly input: TInput;
    readonly output: TOutput;
    readonly pathInput: Currency;
    readonly pathOutput: Currency;
    private _midPrice;
    /**
     * Creates an instance of route.
     * @param pools An array of `Pool` objects, ordered by the route the swap will take
     * @param input The input currency
     * @param output The output currency
     */
    constructor(pools: Pool[], input: TInput, output: TOutput);
    get chainId(): number;
    /**
     * Returns the mid price of the route
     */
    get midPrice(): Price<TInput, TOutput>;
}
