import { brand } from '@l.x/config'

export type MetaTagInjectorInput = {
  title: string
  image?: string
  url: string
  description?: string
}

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
}
