import {
  BiometricUnlockStorage,
  BiometricUnlockStorageData,
} from 'src/app/features/biometricUnlock/BiometricUnlockStorage'
import { ReactQueryCacheKey } from '@luxfi/utilities/src/reactQuery/cache'
import type { QueryOptionsResult } from '@luxfi/utilities/src/reactQuery/queryOptions'
import { queryWithoutCache } from '@luxfi/utilities/src/reactQuery/queryOptions'

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
