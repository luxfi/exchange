import { StorageDriver } from '@l.x/api/src/storage/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function getStorageDriver(): StorageDriver {
  throw new PlatformSplitStubError('getStorageDriver')
}

export type { StorageDriver } from '@l.x/api/src/storage/types'
