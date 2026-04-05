<<<<<<< HEAD
import { Currency } from '@luxamm/sdk-core'
import { useNavigate } from 'react-router'
import { toGraphQLChain } from '@l.x/lx/src/features/chains/utils'
import { useEvent } from '@l.x/utils/src/react/hooks'
=======
import { Currency } from '@uniswap/sdk-core'
import { useNavigate } from 'react-router'
import { toGraphQLChain } from 'uniswap/src/features/chains/utils'
import { useEvent } from 'utilities/src/react/hooks'
>>>>>>> upstream/main
import { getTokenDetailsURL } from '~/appGraphql/data/util'

export function useNavigateToTokenDetails(): (currency: Maybe<Currency>) => void {
  const navigate = useNavigate()

  return useEvent((currency: Maybe<Currency>) => {
    if (!currency) {
      return
    }

    const url = getTokenDetailsURL({
      address: currency.isNative ? null : currency.address,
      chain: toGraphQLChain(currency.chainId),
    })
    navigate(url)
  })
}
