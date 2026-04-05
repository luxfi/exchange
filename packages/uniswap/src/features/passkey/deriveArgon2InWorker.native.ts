import { PlatformSplitStubError } from 'utilities/src/errors'

// TODO: Implement when/if PIN recovery ships on mobile.
export function deriveArgon2InWorker(_pin: string, _salt1: Uint8Array): Promise<Uint8Array> {
  throw new PlatformSplitStubError('deriveArgon2InWorker')
}
