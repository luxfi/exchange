import { BigintIsh, CurrencyAmount, Price, Token } from '@uniswap/sdk-core';
export declare const computePairAddress: ({ factoryAddress, tokenA, tokenB, }: {
    factoryAddress: string;
    tokenA: Token;
    tokenB: Token;
}) => string;
export declare class Pair {
    readonly liquidityToken: Token;
    private readonly tokenAmounts;
    static getAddress(tokenA: Token, tokenB: Token): string;
    constructor(currencyAmountA: CurrencyAmount<Token>, tokenAmountB: CurrencyAmount<Token>);
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    /**
     * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
     */
    get token0Price(): Price<Token, Token>;
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */
    get token1Price(): Price<Token, Token>;
    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    priceOf(token: Token): Price<Token, Token>;
    /**
     * Returns the chain ID of the tokens in the pair.
     */
    get chainId(): number;
    get token0(): Token;
    get token1(): Token;
    get reserve0(): CurrencyAmount<Token>;
    get reserve1(): CurrencyAmount<Token>;
    reserveOf(token: Token): CurrencyAmount<Token>;
    /**
     * getAmountOut is the linear algebra of reserve ratio against amountIn:amountOut.
     * https://ethereum.stackexchange.com/questions/101629/what-is-math-for-uniswap-calculates-the-amountout-and-amountin-why-997-and-1000
     * has the math deduction for the reserve calculation without fee-on-transfer fees.
     *
     * With fee-on-transfer tax, intuitively it's just:
     * inputAmountWithFeeAndTax = 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn
     *                          = (1 - amountIn.sellFeesBips / 10000) * amountInWithFee
     * where amountInWithFee is the amountIn after taking out the LP fees
     * outputAmountWithTax = amountOut * (1 - amountOut.buyFeesBips / 10000)
     *
     * But we are illustrating the math deduction below to ensure that's the case.
     *
     * before swap A * B = K where A = reserveIn B = reserveOut
     *
     * after swap A' * B' = K where only k is a constant value
     *
     * getAmountOut
     *
     * A' = A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn # here 0.3% is deducted
     * B' = B - amountOut * (1 - amountOut.buyFeesBips / 10000)
     * amountOut = (B - B') / (1 - amountOut.buyFeesBips / 10000) # where A' * B' still is k
     *           = (B - K/(A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn))
     *             /
     *             (1 - amountOut.buyFeesBips / 10000)
     *           = (B - AB/(A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn))
     *             /
     *             (1 - amountOut.buyFeesBips / 10000)
     *           = ((BA + B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn - AB)/(A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn))
     *             /
     *             (1 - amountOut.buyFeesBips / 10000)
     *           = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn / (A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn)
     *             /
     *             (1 - amountOut.buyFeesBips / 10000)
     * amountOut * (1 - amountOut.buyFeesBips / 10000) = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn
     *                                                    /
     *                                                    (A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn)
     *
     * outputAmountWithTax = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn
     *                       /
     *                       (A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn)
     *                       = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn * 1000
     *                       /
     *                       ((A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn) * 1000)
     *                     = (B * (1 - amountIn.sellFeesBips / 10000) 997 * * amountIn
     *                       /
     *                       (1000 * A + (1 - amountIn.sellFeesBips / 10000) * 997 * amountIn)
     *                     = (B * (1 - amountIn.sellFeesBips / 10000) * inputAmountWithFee)
     *                       /
     *                       (1000 * A + (1 - amountIn.sellFeesBips / 10000) * inputAmountWithFee)
     *                     = (B * inputAmountWithFeeAndTax)
     *                       /
     *                       (1000 * A + inputAmountWithFeeAndTax)
     *
     * inputAmountWithFeeAndTax = (1 - amountIn.sellFeesBips / 10000) * inputAmountWithFee
     * outputAmountWithTax = amountOut * (1 - amountOut.buyFeesBips / 10000)
     *
     * @param inputAmount
     * @param calculateFotFees
     */
    getOutputAmount(inputAmount: CurrencyAmount<Token>, calculateFotFees?: boolean): [CurrencyAmount<Token>, Pair];
    /**
     * getAmountIn is the linear algebra of reserve ratio against amountIn:amountOut.
     * https://ethereum.stackexchange.com/questions/101629/what-is-math-for-uniswap-calculates-the-amountout-and-amountin-why-997-and-1000
     * has the math deduction for the reserve calculation without fee-on-transfer fees.
     *
     * With fee-on-transfer fees, intuitively it's just:
     * outputAmountWithTax = amountOut / (1 - amountOut.buyFeesBips / 10000)
     * inputAmountWithTax = amountIn / (1 - amountIn.sellFeesBips / 10000) / 0.997
     *
     * But we are illustrating the math deduction below to ensure that's the case.
     *
     * before swap A * B = K where A = reserveIn B = reserveOut
     *
     * after swap A' * B' = K where only k is a constant value
     *
     * getAmountIn
     *
     * B' = B - amountOut * (1 - amountOut.buyFeesBips / 10000)
     * A' = A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn # here 0.3% is deducted
     * amountIn = (A' - A) / (0.997 * (1 - amountIn.sellFeesBips / 10000))
     *          = (K / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)) - A)
     *            /
     *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
     *          = (AB / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)) - A)
     *            /
     *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
     *          = ((AB - AB + A * amountOut / (1 - amountOut.buyFeesBips / 10000)) / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)))
     *            /
     *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
     *          = ((A * amountOut / (1 - amountOut.buyFeesBips / 10000)) / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)))
     *            /
     *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
     *          = ((A * 1000 * amountOut / (1 - amountOut.buyFeesBips / 10000)) / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)))
     *            /
     *            (997 * (1 - amountIn.sellFeesBips / 10000))
     *
     * outputAmountWithTax = amountOut / (1 - amountOut.buyFeesBips / 10000)
     * inputAmountWithTax = amountIn / (997 * (1 - amountIn.sellFeesBips / 10000))
     *                    = (A * outputAmountWithTax * 1000) / ((B - outputAmountWithTax) * 997)
     *
     * @param outputAmount
     */
    getInputAmount(outputAmount: CurrencyAmount<Token>, calculateFotFees?: boolean): [CurrencyAmount<Token>, Pair];
    getLiquidityMinted(totalSupply: CurrencyAmount<Token>, tokenAmountA: CurrencyAmount<Token>, tokenAmountB: CurrencyAmount<Token>): CurrencyAmount<Token>;
    getLiquidityValue(token: Token, totalSupply: CurrencyAmount<Token>, liquidity: CurrencyAmount<Token>, feeOn?: boolean, kLast?: BigintIsh): CurrencyAmount<Token>;
    private derivePercentAfterSellFees;
    private derivePercentAfterBuyFees;
}
