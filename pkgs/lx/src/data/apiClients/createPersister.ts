import { type Persister } from '@tanstack/react-query-persist-client'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function createPersister(_key?: string): Persister {
  throw new PlatformSplitStubError('createPersister')
}
