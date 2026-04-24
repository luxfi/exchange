import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function initializeDatadog(_appName: string): Promise<void> {
  throw new PlatformSplitStubError('initializeDatadog')
}
