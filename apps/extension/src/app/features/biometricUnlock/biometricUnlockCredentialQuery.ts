import {
  BiometricUnlockStorage,
  BiometricUnlockStorageData,
} from 'src/app/features/biometricUnlock/BiometricUnlockStorage'
<<<<<<< HEAD
import { ReactQueryCacheKey } from '@l.x/utils/src/reactQuery/cache'
import type { QueryOptionsResult } from '@l.x/utils/src/reactQuery/queryOptions'
import { queryWithoutCache } from '@l.x/utils/src/reactQuery/queryOptions'
=======
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'
import type { QueryOptionsResult } from 'utilities/src/reactQuery/queryOptions'
import { queryWithoutCache } from 'utilities/src/reactQuery/queryOptions'
>>>>>>> upstream/main

type BiometricUnlockCredentialQueryOptions = QueryOptionsResult<
  Awaited<BiometricUnlockStorageData | null>,
  Error,
  Awaited<BiometricUnlockStorageData | null>,
  [ReactQueryCacheKey.ExtensionBiometricUnlockCredential]
>

export function biometricUnlockCredentialQuery(): BiometricUnlockCredentialQueryOptions {
  return queryWithoutCache({
    queryKey: [ReactQueryCacheKey.ExtensionBiometricUnlockCredential],
    queryFn: async () => await BiometricUnlockStorage.get(),
  })
}
