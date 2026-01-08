import { createNativeStorageDriver } from '@luxfi/api/src/storage/createNativeStorageDriver'
import { type StorageDriver } from '@luxfi/api/src/storage/types'

export function getStorageDriver(): StorageDriver {
  return createNativeStorageDriver()
}
