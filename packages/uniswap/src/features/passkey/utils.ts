import { PlatformSplitStubError } from 'utilities/src/errors'

// oxlint-disable-next-line no-unused-vars -- biome-parity: oxlint is stricter here
export async function exportSeedPhrase(walletId?: string): Promise<string | undefined> {
  throw new PlatformSplitStubError('exportSeedPhrase')
}
