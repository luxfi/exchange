import type { SessionService, LuxIdentifierService } from '@universe/sessions'
import { PlatformSplitStubError } from 'utilities/src/errors'
import type { Logger } from 'utilities/src/logger/logger'

export function provideSessionService(_ctx: {
  getBaseUrl: () => string
  getIsSessionServiceEnabled: () => boolean
  getLogger?: () => Logger
  /** Optional custom LuxIdentifierService. If not provided, uses default localStorage-based service. */
  luxIdentifierService?: LuxIdentifierService
}): SessionService {
  throw new PlatformSplitStubError('provideSessionService')
}
