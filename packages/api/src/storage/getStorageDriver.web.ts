import { createExtensionStorageDriver } from '@luxfi/api/src/storage/createExtensionStorageDriver'
import { createWebStorageDriver } from '@luxfi/api/src/storage/createWebStorageDriver'
import { type StorageDriver } from '@luxfi/api/src/storage/types'
import { isExtensionApp } from 'utilities/src/platform'

export function getStorageDriver(): StorageDriver {
  if (isExtensionApp) {
    return createExtensionStorageDriver()
  }
  return createWebStorageDriver()
}
