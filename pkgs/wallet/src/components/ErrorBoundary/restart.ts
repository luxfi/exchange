import { PlatformSplitStubError } from '@luxfi/utilities/src/errors'

export const restart = (): void => {
  throw new PlatformSplitStubError('restart')
}
