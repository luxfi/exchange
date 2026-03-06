// Stub for @uniswap/conedison/format — package not available
export enum NumberType {
  SwapTradeAmount = 'SwapTradeAmount',
  FiatTokenPrice = 'FiatTokenPrice',
  FiatTokenQuantity = 'FiatTokenQuantity',
  FiatTokenStats = 'FiatTokenStats',
  FiatGasPrice = 'FiatGasPrice',
  WholeNumber = 'WholeNumber',
  TokenTx = 'TokenTx',
  TokenNonTx = 'TokenNonTx',
  Percentage = 'Percentage',
  NFTToken = 'NFTToken',
}

export function formatNumber(
  input: number | null | undefined,
  type: NumberType = NumberType.TokenNonTx,
): string {
  if (input === null || input === undefined) return '-'
  if (type === NumberType.FiatTokenPrice || type === NumberType.FiatTokenStats) {
    return `$${input.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  if (type === NumberType.Percentage) {
    return `${input.toFixed(2)}%`
  }
  return input.toLocaleString()
}

export function formatUSDPrice(
  price: number | null | undefined,
): string {
  if (price === null || price === undefined) return '-'
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
