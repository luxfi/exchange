import type { LxIdentifierService } from '@luxexchange/sessions/src/lx-identifier/types'

function createLxIdentifierService(ctx: {
  getLxIdentifier: () => Promise<string | null>
  setLxIdentifier: (identifier: string) => Promise<void>
  removeLxIdentifier: () => Promise<void>
}): LxIdentifierService {
  const getLxIdentifier = ctx.getLxIdentifier
  const setLxIdentifier = ctx.setLxIdentifier
  const removeLxIdentifier = ctx.removeLxIdentifier

  return {
    getLxIdentifier,
    setLxIdentifier,
    removeLxIdentifier,
  }
}

export { createLxIdentifierService }
