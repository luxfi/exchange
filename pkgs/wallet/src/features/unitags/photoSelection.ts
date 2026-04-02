import { PlatformSplitStubError } from '@luxfi/utilities/src/errors'

export async function selectPhotoFromLibrary(): Promise<string | undefined> {
  throw new PlatformSplitStubError('selectPhotoFromLibrary')
}
