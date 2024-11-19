import { ParentSize } from '@visx/responsive'
import { ChartContainer, LoadingChart } from 'components/Tokens/TokenDetails/Skeleton'
import { TokenPriceQuery } from 'graphql/data/TokenPrice'
import { isPricePoint, PricePoint } from 'graphql/data/util'
import { TimePeriod } from 'graphql/data/util'
import { useAtomValue } from 'jotai/utils'
import { pageTimePeriodAtom } from 'pages/TokenDetails'
import { startTransition, Suspense, useMemo } from 'react'

import { PriceChart } from './PriceChart'
import TimePeriodSelector from './TimeSelector'
import { ti } from 'make-plural'

function fillMissingTimestamps(priceHistory: any, interval: number, totalTime: number) {
  if (!Array.isArray(priceHistory) || priceHistory.length === 0) {
    return priceHistory; // Return the original array if invalid or empty
  }

  // Sort the array by timestamp to ensure proper filling
  priceHistory.sort((a, b) => a.timestamp - b.timestamp);
  const currentTimestamp = Date.now() / 1000
  const filledHistory = [];
  
  for (let i = 0; i < priceHistory.length - 1; i++) {
    const current = priceHistory[i];
    const next = priceHistory[i + 1];

    // Add the current object to the filled array
    if(next.timestamp + totalTime >= currentTimestamp) {
      if(current.timestamp + totalTime >= currentTimestamp) filledHistory.push(current);

      // Fill missing timestamps
      let timestamp = current.timestamp + interval;
      while (timestamp < next.timestamp) {
        if(timestamp + totalTime >= currentTimestamp)
          filledHistory.push({
            ...current, // Copy previous values
            timestamp,  // Update timestamp
          });
        timestamp += interval;
      }
    }
  }

  // Add the last object to the filled array
  filledHistory.push(priceHistory[priceHistory.length - 1]);
  return filledHistory;
}

function getTimeInterval(timePeriod:any) {
  switch(timePeriod) {
    case 0:
      return [300, 3600];
    case 1:
      return [600, 86400];
    case 2:
      return [3600, 604800];
    case 3:
      return [3600, 2592000];
    case 4:
      return [86400, 31536000];
  }
  return [86400, 0];
}

function usePriceHistory(tokenPriceData: TokenPriceQuery, timePeriod: any): PricePoint[] | undefined {
  
  const [timeInterval, totalTime] = getTimeInterval(timePeriod);
  // Appends the current price to the end of the priceHistory array
  const priceHistory = useMemo(() => {
    const market = tokenPriceData.token?.market
    const priceHistory = market?.priceHistory?.filter(isPricePoint)
    // const priceHistory = market?.priceHistory?.filter(isPricePoint)
    const currentPrice = market?.price?.value
    if (Array.isArray(priceHistory) && currentPrice !== undefined) {
      const timestamp = Date.now() / 1000
      return fillMissingTimestamps([...priceHistory, { timestamp, value: currentPrice }], timeInterval, totalTime)
    }
    return priceHistory
  }, [tokenPriceData])

  return priceHistory
}
export default function ChartSection({
  tokenPriceQuery,
  onChangeTimePeriod,
}: {
  tokenPriceQuery?: TokenPriceQuery
  onChangeTimePeriod: OnChangeTimePeriod
}) {
  if (!tokenPriceQuery) {
    return <LoadingChart />
  }

  return (
    <Suspense fallback={<LoadingChart />}>
      <ChartContainer>
        <Chart tokenPriceQuery={tokenPriceQuery} onChangeTimePeriod={onChangeTimePeriod} />
      </ChartContainer>
    </Suspense>
  )
}

export type OnChangeTimePeriod = (t: TimePeriod) => void
function Chart({
  tokenPriceQuery,
  onChangeTimePeriod,
}: {
  tokenPriceQuery: TokenPriceQuery
  onChangeTimePeriod: OnChangeTimePeriod
}) {
  // Initializes time period to global & maintain separate time period for subsequent changes
  const timePeriod = useAtomValue(pageTimePeriodAtom)
  const prices = usePriceHistory(tokenPriceQuery, timePeriod)

  return (
    <ChartContainer data-testid="chart-container">
      <ParentSize>
        {({ width }) => <PriceChart prices={prices ?? null} width={width} height={436} timePeriod={timePeriod} />}
      </ParentSize>
      <TimePeriodSelector
        currentTimePeriod={timePeriod}
        onTimeChange={(t: TimePeriod) => {
          startTransition(() => onChangeTimePeriod(t))
        }}
      />
    </ChartContainer>
  )
}