import { createNativeStorageDriver } from '@luxexchange/api/src/storage/createNativeStorageDriver'
import { type StorageDriver } from '@luxexchange/api/src/storage/types'

export function getStorageDriver(): StorageDriver {
  return createNativeStorageDriver()
}
