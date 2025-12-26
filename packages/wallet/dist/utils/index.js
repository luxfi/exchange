/**
 * Format address to short form
 */
export function formatAddress(address, chars = 4) {
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
/**
 * Format balance with decimals
 */
export function formatBalance(value, decimals, displayDecimals = 4) {
    const divisor = 10n ** BigInt(decimals);
    const whole = value / divisor;
    const fraction = value % divisor;
    const fractionStr = fraction.toString().padStart(decimals, '0').slice(0, displayDecimals);
    const result = `${whole}.${fractionStr}`.replace(/\.?0+$/, '');
    return result || '0';
}
/**
 * Parse amount string to bigint
 */
export function parseAmount(value, decimals) {
    const [whole, fraction = ''] = value.split('.');
    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(whole + paddedFraction);
}
/**
 * Format USD value
 */
export function formatUSD(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}
/**
 * Check if address is valid
 */
export function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
/**
 * Calculate price impact
 */
export function calculatePriceImpact(inputAmount, outputAmount, marketRate, decimalsIn, decimalsOut) {
    if (inputAmount === 0n || marketRate === 0n)
        return 0;
    const normalizedInput = inputAmount * 10n ** BigInt(18 - decimalsIn);
    const normalizedOutput = outputAmount * 10n ** BigInt(18 - decimalsOut);
    const expectedOutput = (normalizedInput * marketRate) / 10n ** 18n;
    const impact = ((expectedOutput - normalizedOutput) * 10000n) / expectedOutput;
    return Number(impact) / 100;
}
