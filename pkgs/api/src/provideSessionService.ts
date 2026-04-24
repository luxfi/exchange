import type { SessionService, LXIdentifierService } from '@l.x/sessions'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'
import type { Logger } from '@l.x/utils/src/logger/logger'

export function provideSessionService(_ctx: {
  getBaseUrl: () => string
  getIsSessionServiceEnabled: () => boolean
  getLogger?: () => Logger
  /** Optional custom LXIdentifierService. If not provided, uses default localStorage-based service. */
  lxIdentifierService?: LXIdentifierService
}): SessionService {
  throw new PlatformSplitStubError('provideSessionService')
}
