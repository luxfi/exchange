import { checkBalanceDiffWithinRange } from 'lx/src/features/portfolio/checkBalanceDiffWithinRange'

export function usePortfolioChartBalanceMismatch({
  lastChartValue,
  portfolioTotalBalanceUSD,
}: {
  lastChartValue?: number
  portfolioTotalBalanceUSD?: number
}): { isTotalValueMatch: boolean } {
  if (lastChartValue === undefined || portfolioTotalBalanceUSD === undefined) {
    return { isTotalValueMatch: false }
  }

  const isTotalValueMatch = checkBalanceDiffWithinRange({
    chartTotalBalanceUSD: lastChartValue,
    portfolioTotalBalanceUSD,
  })

  return { isTotalValueMatch }
}
