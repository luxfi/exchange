import type { LuxIdentifierService } from '@luxfi/sessions/src/lux-identifier/types'

function createLuxIdentifierService(ctx: {
  getLuxIdentifier: () => Promise<string | null>
  setLuxIdentifier: (identifier: string) => Promise<void>
  removeLuxIdentifier: () => Promise<void>
}): LuxIdentifierService {
  const getLuxIdentifier = ctx.getLuxIdentifier
  const setLuxIdentifier = ctx.setLuxIdentifier
  const removeLuxIdentifier = ctx.removeLuxIdentifier

  return {
    getLuxIdentifier,
    setLuxIdentifier,
    removeLuxIdentifier,
  }
}

export { createLuxIdentifierService }
