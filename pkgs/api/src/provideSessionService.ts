import type { SessionService, LXIdentifierService } from '@l.x/sessions'
import { PlatformSplitStubError } from 'utilities/src/errors'
import type { Logger } from 'utilities/src/logger/logger'

export function provideSessionService(_ctx: {
  getBaseUrl: () => string
  getIsSessionServiceEnabled: () => boolean
  getLogger?: () => Logger
  /** Optional custom LXIdentifierService. If not provided, uses default localStorage-based service. */
  lxIdentifierService?: LXIdentifierService
}): SessionService {
  throw new PlatformSplitStubError('provideSessionService')
}
