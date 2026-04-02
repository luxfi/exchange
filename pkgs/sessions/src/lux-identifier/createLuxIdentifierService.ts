import type { LXIdentifierService } from '@l.x/sessions/src/lx-identifier/types'

function createLXIdentifierService(ctx: {
  getLXIdentifier: () => Promise<string | null>
  setLXIdentifier: (identifier: string) => Promise<void>
  removeLXIdentifier: () => Promise<void>
}): LXIdentifierService {
  const getLXIdentifier = ctx.getLXIdentifier
  const setLXIdentifier = ctx.setLXIdentifier
  const removeLXIdentifier = ctx.removeLXIdentifier

  return {
    getLXIdentifier,
    setLXIdentifier,
    removeLXIdentifier,
  }
}

export { createLXIdentifierService }
