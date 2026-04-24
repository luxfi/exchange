import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { createSwapReviewStore } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewStore/createSwapReviewStore'
import { SwapReviewStoreContext } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewStore/SwapReviewContext'
import { useHasValueChanged } from '@l.x/utils/src/react/useHasValueChanged'

type InitialState = Parameters<typeof createSwapReviewStore>[0]

export const SwapReviewStoreContextProvider = ({
  children,
  hideContent,
}: PropsWithChildren<InitialState>): JSX.Element => {
  const [store] = useState(() => createSwapReviewStore({ hideContent }))

  const hasHideContentChanged = useHasValueChanged(hideContent)

  useEffect(() => {
    if (hasHideContentChanged) {
      store.setState({ hideContent })
    }
  }, [hasHideContentChanged, hideContent, store])

  return <SwapReviewStoreContext.Provider value={store}>{children}</SwapReviewStoreContext.Provider>
}
