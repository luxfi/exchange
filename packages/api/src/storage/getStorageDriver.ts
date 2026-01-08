import { StorageDriver } from '@luxfi/api/src/storage/types'
import { PlatformSplitStubError } from 'utilities/src/errors'

export function getStorageDriver(): StorageDriver {
  throw new PlatformSplitStubError('getStorageDriver')
}

export type { StorageDriver } from '@luxfi/api/src/storage/types'
