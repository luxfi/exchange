import { isAndroid } from '@l.x/utils/src/platform'

export function getCloudProviderName(): string {
  if (isAndroid) {
    return 'Google Drive'
  }
  return 'iCloud'
}
