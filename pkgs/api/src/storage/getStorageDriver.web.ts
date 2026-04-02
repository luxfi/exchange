import { createExtensionStorageDriver } from '@luxexchange/api/src/storage/createExtensionStorageDriver'
import { createWebStorageDriver } from '@luxexchange/api/src/storage/createWebStorageDriver'
import { type StorageDriver } from '@luxexchange/api/src/storage/types'
import { isExtensionApp } from 'utilities/src/platform'

export function getStorageDriver(): StorageDriver {
  if (isExtensionApp) {
    return createExtensionStorageDriver()
  }
  return createWebStorageDriver()
}
