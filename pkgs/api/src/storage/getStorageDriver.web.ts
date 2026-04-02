import { createExtensionStorageDriver } from '@l.x/api/src/storage/createExtensionStorageDriver'
import { createWebStorageDriver } from '@l.x/api/src/storage/createWebStorageDriver'
import { type StorageDriver } from '@l.x/api/src/storage/types'
import { isExtensionApp } from 'utilities/src/platform'

export function getStorageDriver(): StorageDriver {
  if (isExtensionApp) {
    return createExtensionStorageDriver()
  }
  return createWebStorageDriver()
}
