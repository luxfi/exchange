import { Price, Currency } from '@uniswap/sdk-core';
/**
 * This library is the almost the same as v3-sdk priceTickConversion except
 * that it accepts a Currency type instead of a Token type,
 * and thus uses some helper functions defined for the Currency type over the Token type.
 */
/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */
export declare function tickToPrice(baseCurrency: Currency, quoteCurrency: Currency, tick: number): Price<Currency, Currency>;
/**
 * Returns the first tick for which the given price is greater than or equal to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 */
export declare function priceToClosestTick(price: Price<Currency, Currency>): number;
