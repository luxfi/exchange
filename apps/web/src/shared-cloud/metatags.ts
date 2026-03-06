export type MetaTagInjectorInput = {
  title: string
  image?: string
  url: string
  description?: string
}

export function formatTokenMetatagTitleName(symbol: string | undefined, name: string | undefined) {
  if (symbol) {
    return 'Get ' + symbol + ' on Lux'
  }
  if (name) {
    return 'Get ' + name + ' on Lux'
  }
  return 'View Token on Lux'
}
