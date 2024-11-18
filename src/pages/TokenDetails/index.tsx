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
import { luxClient } from 'graphql/thegraph/apollo'
import { Chain, TokenQuery, Currency, TokenQueryData } from 'graphql/data/Token'
import { TokenPriceQuery } from 'graphql/data/TokenPrice'

const GetTokenInfo = gql`
query GetTokenInfo($tokenAddress: String!) {
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
    tokenDayData(first: 365, orderBy: date, orderDirection: asc) {
      id
      date
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

export default function TokenDetailsPage() {
  const { tokenAddress, chainName } = useParams<{ tokenAddress: string; chainName?: string }>()
  const chain = validateUrlChainParam(chainName)
  const isNative = tokenAddress === NATIVE_CHAIN_ID
  const [timePeriod, setTimePeriod] = useAtom(pageTimePeriodAtom)
  const [address, duration] = useMemo(
    /* tokenAddress will always be defined in the path for for this page to render, but useParams will always
      return optional arguments; nullish coalescing operator is present here to appease typechecker */
    () => [isNative ? getNativeTokenDBAddress(chain) : tokenAddress ?? '', toHistoryDuration(timePeriod)],
    [chain, isNative, timePeriod, tokenAddress]
  )
  const { data: tokenQuery } = useTokenQuery({
    variables: {
      address,
      chain,
    },
  })

  const { data: tokenPriceQuery } = useTokenPriceQuery({
    variables: {
      address,
      chain,
      duration,
    },
  })

  const { data: luxData, loading: luxLoading } = useQuery(GetTokenInfo, {
    client: luxClient,
    variables: {
      tokenAddress: address,
    },
  })
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

  // Now, you can assign the JSON data to a variable of type TokenQuery
const transformedTokenDetail: TokenQuery = tokenPriceQuery??{
  token: {
    id: "VG9rZW46RVRIRVJFVU1fMHhhMGI4Njk5MWM2MjE4YjM2YzFkMTlkNGEyZTllYjBjZTM2MDZlYjQ4",
    decimals: 18,
    name: token?.name,
    chain: Chain.Lux,
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

const transformedTokenPriceHistory:TokenPriceQuery = {
  token: {
    __typename: "Token",
    id: "VG9rZW46RVRIRVJFVU1fMHhhMGI4Njk5MWM2MjE4YjM2YzFkMTlkNGEyZTllYjBjZTM2MDZlYjQ4", // Encoded version of the token ID
    address: luxData?.token?.id,
    chain: Chain.Lux,
    market: {
      __typename: "TokenMarket",
      id: "VG9rZW5NYXJrZXQ6RVRIRVJFVU1fMHhhMGI4Njk5MWM2MjE4YjM2YzFkMTlkNGEyZTllYjBjZTM2MDZlYjQ4X1VTRA==", // Encoded ID for the market
      price: {
        __typename: "Amount",
        id: "QW1vdW50OjFfVVNE", // Encoded amount ID
        value: parseFloat(ethPriceUSD) * parseFloat(ethPrice),
      },
      priceHistory: luxData?.token?.tokenDayData.filter((data: any) => parseFloat(data.priceUSD) !== 0)
      .map((data: any) => ({
        __typename: "TimestampedAmount",
        id: `VGltZXN0YW1wZWRBbW91bnQ6MV8x${data.date}_VVNE`, // Encoded version of the timestamped amount
        timestamp: data.date,
        value: parseFloat(data.priceUSD),
      })),
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
    else if(chain == "LUX" || chain == "ZOO") setCurrentPriceQuery(transformedTokenPriceHistory)
  }, [luxData, tokenPriceQuery])
  if (!tokenQuery && !transformedTokenDetail) return <TokenDetailsPageSkeleton />
  if(chain == "LUX" || chain == "ZOO") {
    return renderTokenDetail(tokenAddress, chain, transformedTokenDetail)
  }
  if (!tokenQuery) return <TokenDetailsPageSkeleton />
  return renderTokenDetail(tokenAddress, chain, tokenQuery)
}
