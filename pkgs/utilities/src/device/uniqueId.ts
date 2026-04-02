import { PlatformSplitStubError } from '@luxfi/utilities/src/errors'

export async function getUniqueId(): Promise<string> {
  throw new PlatformSplitStubError('getUniqueId')
}
