/**
 * Fee tiers (in hundredths of a bip)
 */
export const FEE_TIERS = {
    LOWEST: 100, // 0.01%
    LOW: 500, // 0.05%
    MEDIUM: 3000, // 0.30%
    HIGH: 10000, // 1.00%
};
/**
 * Tick spacing for fee tiers
 */
export const TICK_SPACINGS = {
    100: 1,
    500: 10,
    3000: 60,
    10000: 200,
};
/**
 * Native currency constant
 */
export const NATIVE_CURRENCY = '0x0000000000000000000000000000000000000000';
/**
 * Check if currency is native
 */
export function isNativeCurrency(currency) {
    return currency === NATIVE_CURRENCY;
}
