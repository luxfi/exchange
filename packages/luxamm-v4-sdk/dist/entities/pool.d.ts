import { BigintIsh, Currency, CurrencyAmount, Price } from '@uniswap/sdk-core';
import { Tick, TickConstructorArgs, TickDataProvider } from '@uniswap/v3-sdk';
import JSBI from 'jsbi';
export declare const DYNAMIC_FEE_FLAG = 8388608;
export declare type PoolKey = {
    currency0: string;
    currency1: string;
    fee: number;
    tickSpacing: number;
    hooks: string;
};
/**
 * Represents a V4 pool
 */
export declare class Pool {
    readonly currency0: Currency;
    readonly currency1: Currency;
    readonly fee: number;
    readonly tickSpacing: number;
    readonly sqrtRatioX96: JSBI;
    readonly hooks: string;
    readonly liquidity: JSBI;
    readonly tickCurrent: number;
    readonly tickDataProvider: TickDataProvider;
    readonly poolKey: PoolKey;
    readonly poolId: string;
    private _currency0Price?;
    private _currency1Price?;
    static getPoolKey(currencyA: Currency, currencyB: Currency, fee: number, tickSpacing: number, hooks: string): PoolKey;
    static getPoolId(currencyA: Currency, currencyB: Currency, fee: number, tickSpacing: number, hooks: string): string;
    /**
     * Construct a pool
     * @param currencyA One of the currencys in the pool
     * @param currencyB The other currency in the pool
     * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the pool
     * @param tickSpacing The tickSpacing of the pool
     * @param hooks The address of the hook contract
     * @param sqrtRatioX96 The sqrt of the current ratio of amounts of currency1 to currency0
     * @param liquidity The current value of in range liquidity
     * @param tickCurrent The current tick of the pool
     */
    constructor(currencyA: Currency, currencyB: Currency, fee: number, tickSpacing: number, hooks: string, sqrtRatioX96: BigintIsh, liquidity: BigintIsh, tickCurrent: number, ticks?: TickDataProvider | (Tick | TickConstructorArgs)[]);
    /** backwards compatibility with v2/3 sdks */
    get token0(): Currency;
    get token1(): Currency;
    /**
     * Returns true if the currency is either currency0 or currency1
     * @param currency The currency to check
     * @returns True if currency is either currency0 or currency1
     */
    involvesCurrency(currency: Currency): boolean;
    /** backwards compatibility with v2/3 sdks */
    involvesToken(currency: Currency): boolean;
    /**
     * v4-only involvesToken convenience method, used for mixed route ETH <-> WETH connection only
     * @param currency
     */
    v4InvolvesToken(currency: Currency): boolean;
    /**
     * Returns the current mid price of the pool in terms of currency0, i.e. the ratio of currency1 over currency0
     */
    get currency0Price(): Price<Currency, Currency>;
    /** backwards compatibility with v2/3 sdks */
    get token0Price(): Price<Currency, Currency>;
    /**
     * Returns the current mid price of the pool in terms of currency1, i.e. the ratio of currency0 over currency1
     */
    get currency1Price(): Price<Currency, Currency>;
    /** backwards compatibility with v2/3 sdks */
    get token1Price(): Price<Currency, Currency>;
    /**
     * Return the price of the given currency in terms of the other currency in the pool.
     * @param currency The currency to return price of
     * @returns The price of the given currency, in terms of the other.
     */
    priceOf(currency: Currency): Price<Currency, Currency>;
    /**
     * Returns the chain ID of the currencies in the pool.
     */
    get chainId(): number;
    /** Works only for vanilla hookless v3 pools, otherwise throws an error */
    getOutputAmount(inputAmount: CurrencyAmount<Currency>, sqrtPriceLimitX96?: JSBI): Promise<[CurrencyAmount<Currency>, Pool]>;
    /**
     * Given a desired output amount of a currency, return the computed input amount and a pool with state updated after the trade
     * Works only for vanilla hookless v3 pools, otherwise throws an error
     * @param outputAmount the output amount for which to quote the input amount
     * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
     * @returns The input amount and the pool with updated state
     */
    getInputAmount(outputAmount: CurrencyAmount<Currency>, sqrtPriceLimitX96?: JSBI): Promise<[CurrencyAmount<Currency>, Pool]>;
    /**
     * Executes a swap
     * @param zeroForOne Whether the amount in is token0 or token1
     * @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)
     * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
     * @returns amountCalculated
     * @returns sqrtRatioX96
     * @returns liquidity
     * @returns tickCurrent
     */
    private swap;
    private hookImpactsSwap;
}
