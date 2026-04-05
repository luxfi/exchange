import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
<<<<<<< HEAD
import { SharedQueryClient } from '@l.x/api'
import { type PropsWithChildren } from 'react'
import { sharedDehydrateOptions } from '@l.x/lx/src/data/apiClients/sharedDehydrateOptions'
import { MAX_REACT_QUERY_CACHE_TIME_MS } from '@l.x/utils/src/time/time'
=======
import { SharedQueryClient } from '@universe/api'
import { type PropsWithChildren } from 'react'
import { sharedDehydrateOptions } from 'uniswap/src/data/apiClients/sharedDehydrateOptions'
import { MAX_REACT_QUERY_CACHE_TIME_MS } from 'utilities/src/time/time'
>>>>>>> upstream/main

const persistOptions: React.ComponentProps<typeof PersistQueryClientProvider>['persistOptions'] = {
  // Change this unique string whenever we want to bust the entire cache.
  buster: 'v0',
  maxAge: MAX_REACT_QUERY_CACHE_TIME_MS,
  persister: createSyncStoragePersister({ storage: localStorage }),
  dehydrateOptions: sharedDehydrateOptions,
}

export function QueryClientPersistProvider({ children }: PropsWithChildren): JSX.Element {
  return (
    <PersistQueryClientProvider client={SharedQueryClient} persistOptions={persistOptions}>
      {children}
    </PersistQueryClientProvider>
  )
}
