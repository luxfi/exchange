import { Navigate, useParams } from 'react-router'
<<<<<<< HEAD
import { areCurrencyIdsEqual } from '@l.x/lx/src/utils/currencyId'
=======
import { areCurrencyIdsEqual } from 'uniswap/src/utils/currencyId'
>>>>>>> upstream/main

export default function AddLiquidityV2WithTokenRedirects() {
  const { currencyIdA, currencyIdB } = useParams<{ currencyIdA: string; currencyIdB: string }>()

  const url = new URL('/positions/create/v2', window.location.origin)
  if (currencyIdA) {
    url.searchParams.append('currencyA', currencyIdA)
  }
  if (currencyIdB && (!currencyIdA || !areCurrencyIdsEqual(currencyIdA, currencyIdB))) {
    url.searchParams.append('currencyB', currencyIdB)
  }
  return <Navigate to={url.pathname + url.search} replace />
}
