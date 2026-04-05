export enum ProfitLossPeriod {
  DAY = '1D',
  WEEK = '1W',
  MONTH = '1M',
  YEAR = '1Y',
  ALL = 'ALL',
}

export const PROFIT_LOSS_PERIODS: ProfitLossPeriod[] = [
  ProfitLossPeriod.DAY,
  ProfitLossPeriod.WEEK,
  ProfitLossPeriod.MONTH,
  ProfitLossPeriod.YEAR,
  ProfitLossPeriod.ALL,
]

export function getProfitLossPeriodLabel(period: ProfitLossPeriod, t: (key: string) => string): string {
  switch (period) {
    case ProfitLossPeriod.DAY:
      return t('token.priceExplorer.timeRangeLabel.day')
    case ProfitLossPeriod.WEEK:
      return t('token.priceExplorer.timeRangeLabel.week')
    case ProfitLossPeriod.MONTH:
      return t('token.priceExplorer.timeRangeLabel.month')
    case ProfitLossPeriod.YEAR:
      return t('token.priceExplorer.timeRangeLabel.year')
    case ProfitLossPeriod.ALL:
      return t('common.all')
    default:
      return period as string
  }
}

const SECONDS_PER_DAY = 86400

const PERIOD_OFFSETS: Record<Exclude<ProfitLossPeriod, ProfitLossPeriod.ALL>, number> = {
  [ProfitLossPeriod.DAY]: SECONDS_PER_DAY,
  [ProfitLossPeriod.WEEK]: 7 * SECONDS_PER_DAY,
  [ProfitLossPeriod.MONTH]: 30 * SECONDS_PER_DAY,
  [ProfitLossPeriod.YEAR]: 365 * SECONDS_PER_DAY,
}

export function getProfitLossSince(period: ProfitLossPeriod): bigint | undefined {
  if (period === ProfitLossPeriod.ALL) {
    return undefined
  }
  const now = Math.floor(Date.now() / 1000)
  return BigInt(now - PERIOD_OFFSETS[period])
}
