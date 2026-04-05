>>>>>>> upstream/main
export type MetaTagInjectorInput = {
  title: string
  image?: string
  url: string
  description?: string
}

<<<<<<< HEAD
function getBrandShort(): string {
  return brand.shortName || 'Exchange'
}

export function formatTokenMetatagTitleName(symbol: string | undefined, name: string | undefined) {
  const b = getBrandShort()
  if (symbol) {
    return 'Get ' + symbol + ' on ' + b
  }
  if (name) {
    return 'Get ' + name + ' on ' + b
  }
  return 'View Token on ' + b
=======
export function formatTokenMetatagTitleName(symbol: string | undefined, name: string | undefined) {
  if (symbol) {
    return 'Get ' + symbol + ' on Uniswap'
  }
  if (name) {
    return 'Get ' + name + ' on Uniswap'
  }
  return 'View Token on Uniswap'
}
