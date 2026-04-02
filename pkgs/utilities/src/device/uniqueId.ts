import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export async function getUniqueId(): Promise<string> {
  throw new PlatformSplitStubError('getUniqueId')
}
