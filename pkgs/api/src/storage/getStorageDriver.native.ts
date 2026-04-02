import { createNativeStorageDriver } from '@l.x/api/src/storage/createNativeStorageDriver'
import { type StorageDriver } from '@l.x/api/src/storage/types'

export function getStorageDriver(): StorageDriver {
  return createNativeStorageDriver()
}
