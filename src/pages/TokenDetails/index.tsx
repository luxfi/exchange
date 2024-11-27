import TokenDetails from 'components/Tokens/TokenDetails'
import { TokenDetailsPageSkeleton } from 'components/Tokens/TokenDetails/Skeleton'
import { NATIVE_CHAIN_ID } from 'constants/tokens'
import { useTokenPriceQuery, useTokenQuery } from 'graphql/data/__generated__/types-and-hooks'
import { TimePeriod, toHistoryDuration, validateUrlChainParam } from 'graphql/data/util'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getNativeTokenDBAddress } from 'utils/nativeTokens'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { apolloClient } from 'graphql/thegraph/apollo'
import { Chain, TokenQuery, Currency, TokenQueryData } from 'graphql/data/Token'
import { TokenPriceQuery } from 'graphql/data/TokenPrice'
import { luxNetClient } from 'graphql/thegraph/apollo'
import { zooNetClient } from 'graphql/thegraph/apollo'

const GetTokenInfo = gql`
query GetTokenInfo($tokenAddress: String!, $days: Int, $hours: Int, $mins: Int) {
  bundles(first: 10) {
    ethPriceUSD
  }
  token(id: $tokenAddress) {
    id
    decimals
    name
    symbol
    totalValueLockedUSD  # The USD value locked in pools for this token
    volumeUSD  # Lifetime trading volume in USD for this token
    derivedETH

    # Get daily data for more detailed metrics
    tokenDayData(first: $days, orderBy: date, orderDirection: desc) {
      id
      date
      priceUSD  # The price of the token in USD for the day
      totalValueLockedUSD
      volumeUSD
    }

    tokenHourData(first: $hours, orderBy: periodStartUnix, orderDirection: desc) {
      id
      periodStartUnix
      priceUSD  # The price of the token in USD for the day
      totalValueLockedUSD
      volumeUSD
    }

    token5MinData(first: $mins, orderBy: periodStartUnix, orderDirection: desc) {
      id
      periodStartUnix
      priceUSD  # The price of the token in USD for the day
      totalValueLockedUSD
      volumeUSD
    }

    # Get all pools involving this token for liquidity details
    whitelistPools {
      id
      totalValueLockedUSD
      volumeUSD
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
}
`

export const pageTimePeriodAtom = atomWithStorage<TimePeriod>('tokenDetailsTimePeriod', TimePeriod.DAY)

function getQueryParams(timePeriod: any) {
  switch (timePeriod) {
    case 0:
      return [2, 2, 12];
    case 1:
      return [2, 30, 2];
    case 2:
      return [2, 168, 2];
    case 3:
      return [2, 720, 2];
    case 4:
      return [365, 2, 2];
  }
  return [2, 2];
}


export default function TokenDetailsPage() {
  const { tokenAddress, chainName } = useParams<{ tokenAddress: string; chainName?: string }>()
  const chain = validateUrlChainParam(chainName)
  const isNative = tokenAddress === NATIVE_CHAIN_ID
  const [timePeriod, setTimePeriod] = useAtom(pageTimePeriodAtom)
  const [totalDays, totalHours, total5Mins] = getQueryParams(timePeriod);
  const [address, duration] = useMemo(
    /* tokenAddress will always be defined in the path for for this page to render, but useParams will always
      return optional arguments; nullish coalescing operator is present here to appease typechecker */
    () => [isNative ? getNativeTokenDBAddress(chain) : tokenAddress ?? '', toHistoryDuration(timePeriod)],
    [chain, isNative, timePeriod, tokenAddress]
  )
  const { data: tokenQuery, refetch: refetchTokenQuery } = useTokenQuery({
    variables: {
      address,
      chain,
    },
    pollInterval: 12000, // 12 seconds
  })

  const { data: tokenPriceQuery, refetch: refetchTokenPriceQuery } = useTokenPriceQuery({
    variables: {
      address,
      chain,
      duration,
    },
    pollInterval: 12000, // 12 seconds
  })

  const { data: luxData, loading: luxLoading, refetch: refetchLuxData } = useQuery(GetTokenInfo, {
    client: chainName == 'lux' ? luxNetClient : zooNetClient,
    variables: {
      tokenAddress: address,
      days: totalDays,
      hours: totalHours,
      mins: total5Mins,
    },
    pollInterval: 12000, // 12 seconds
  })

  // Use effect to handle periodic refetching
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchTokenQuery()
      refetchTokenPriceQuery()
      if (chainName === 'lux' || chainName === 'zoo') {
        refetchLuxData()
      }
    }, 12000) // 12 seconds interval

    // Clear interval on component unmount
    return () => clearInterval(intervalId)
  }, [refetchTokenQuery, refetchTokenPriceQuery, refetchLuxData, chainName])

  if (luxLoading) {
    console.log("Loading data...");
  } else {
    console.log("Data loaded:", luxData);
  }

  // Extract daily prices from the response
  const dailyPrices = luxData?.token?.tokenDayData
    ?.map((day: any) => parseFloat(day.priceUSD))
    .filter((price: any) => price !== 0);

  // Calculate the 52-week high and low
  const priceHigh52W = dailyPrices && Math.max(...dailyPrices);
  const priceLow52W = dailyPrices && Math.min(...dailyPrices);
  const token = luxData?.token;

  // Use effect to handle periodic refetching
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchTokenQuery()
      refetchTokenPriceQuery()
      if (chainName === 'lux' || chainName === 'zoo') {
        refetchLuxData()
      }
    }, 12000) // 12 seconds interval

    // Clear interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Now, you can assign the JSON data to a variable of type TokenQuery
  const transformedTokenDetail: TokenQuery = tokenPriceQuery ?? {
    token: {
      id: "VG9rZW46RVRIRVJFVU1fMHhhMGI4Njk5MWM2MjE4YjM2YzFkMTlkNGEyZTllYjBjZTM2MDZlYjQ4",
      decimals: 18,
      name: token?.name,
      chain: chain == "LUX" ? Chain.Lux : Chain.Zoo,
      address: token?.id,
      symbol: token?.symbol,
      market: {
        id: "VG9rZW5NYXJrZXQ6RVRIRVJFVU1fMHhhMGI4Njk5MWM2MjE4YjM2YzFkMTlkNGEyZTllYjBjZTM2MDZlYjQ4X1VTRA==",
        totalValueLocked: {
          id: "QW1vdW50OjM0MDUwMDg5OS41NTQyMzk5X1VTRA==",
          value: token?.totalValueLockedUSD,
          currency: Currency.Usd
        },
        price: {
          id: "QW1vdW50OjFfVVNE",
          value: 1,
          currency: Currency.Usd
        },
        volume24H: {
          id: "QW1vdW50OjY5MzIwODE3Ny45NDM0MDUyX1VTRA==",
          value: token?.volumeUSD,
          currency: Currency.Usd
        },
        priceHigh52W: {
          id: "QW1vdW50OjEuMDAwMDAwMDAwMDAwMDAwMl9VU0Q=",
          value: priceHigh52W
        },
        priceLow52W: {
          id: "QW1vdW50OjFfVVNE",
          value: priceLow52W
        }
      },
      project: {
        id: "VG9rZW5Qcm9qZWN0OkVUSEVSRVVNXzB4YTBiODY5OTFjNjIxOGIzNmMxZDE5ZDRhMmU5ZWIwY2UzNjA2ZWI0OF9VU0RD",
        description: token?.name + " - " + token?.id,
        homepageUrl: "https://www.circle.com/en/usdc",
        twitterName: "circle",
        logoUrl: "",
        tokens: []
      }
    }
  };
  const ethPriceUSD = luxData?.bundles[0]?.ethPriceUSD;
  const ethPrice = luxData?.token?.derivedETH;
  const tokenDayData = luxData?.token?.tokenDayData.filter((data: any) => parseFloat(data.priceUSD) !== 0).map((data: any) => ({
    id: `VGltZXN0YW1wZWRBbW91bnQ6MV8x${data.date}_VVNE`, // Encoded version of the timestamped amount
    timestamp: data.date,
    value: parseFloat(data.priceUSD),
  }))
  const tokenHourData = luxData?.token?.tokenHourData.filter((data: any) => parseFloat(data.priceUSD) !== 0).map((data: any) => ({
    id: `VGltZXN0YW1wZWRBbW91bnQ6MV8x${data.periodStartUnix}_VVNE`, // Encoded version of the timestamped amount
    timestamp: data.periodStartUnix,
    value: parseFloat(data.priceUSD),
  }))
  const token5MinData = luxData?.token?.token5MinData.filter((data: any) => parseFloat(data.priceUSD) !== 0).map((data: any) => ({
    id: `VGltZXN0YW1wZWRBbW91bnQ6MV8x${data.periodStartUnix}_VVNE`, // Encoded version of the timestamped amount
    timestamp: data.periodStartUnix,
    value: parseFloat(data.priceUSD),
  }))

  const transformedTokenPriceHistory: TokenPriceQuery = {
    token: {
      id: "VG9rZW46RVRIRVJFVU1fMHhhMGI4Njk5MWM2MjE4YjM2YzFkMTlkNGEyZTllYjBjZTM2MDZlYjQ4", // Encoded version of the token ID
      address: luxData?.token?.id,
      chain: chain == "LUX" ? Chain.Lux : Chain.Zoo,
      market: {
        id: "VG9rZW5NYXJrZXQ6RVRIRVJFVU1fMHhhMGI4Njk5MWM2MjE4YjM2YzFkMTlkNGEyZTllYjBjZTM2MDZlYjQ4X1VTRA==", // Encoded ID for the market
        price: {
          id: "QW1vdW50OjFfVVNE", // Encoded amount ID
          value: parseFloat(ethPriceUSD) * parseFloat(ethPrice),
        },
        priceHistory: timePeriod < 1 ? token5MinData : timePeriod < 4 ? tokenHourData : tokenDayData,
      },
    },
  };

  const renderTokenDetail = (tokenAddress: any, chain: any, tokenQuery: any) => (
    <TokenDetails
      urlAddress={tokenAddress}
      chain={chain}
      tokenQuery={tokenQuery}
      tokenPriceQuery={currentPriceQuery}
      onChangeTimePeriod={setTimePeriod}
    />
  );

  // Saves already-loaded chart data into state to display while tokenPriceQuery is undefined timePeriod input changes
  const [currentPriceQuery, setCurrentPriceQuery] = useState(tokenPriceQuery)
  useEffect(() => {
    if (tokenPriceQuery) setCurrentPriceQuery(tokenPriceQuery)
    else if (chain == "LUX" || chain == "ZOO") setCurrentPriceQuery(transformedTokenPriceHistory)
  }, [luxData, tokenPriceQuery])
  if (!tokenQuery && !transformedTokenDetail) return <TokenDetailsPageSkeleton />
  if (chain == "LUX" || chain == "ZOO") {
    return renderTokenDetail(tokenAddress, chain, transformedTokenDetail)
  }
  if (!tokenQuery) return <TokenDetailsPageSkeleton />
  return renderTokenDetail(tokenAddress, chain, tokenQuery)
}