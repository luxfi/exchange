import { provideDeviceIdService } from '@l.x/api/src/provideDeviceIdService'
import { provideSessionStorage } from '@l.x/api/src/provideSessionStorage'
import { provideLXIdentifierService } from '@l.x/api/src/provideLXIdentifierService'
import { getTransport } from '@l.x/api/src/transport'
import {
  createNoopSessionService,
  createSessionClient,
  createSessionRepository,
  createSessionService,
  type SessionService,
  type LXIdentifierService,
} from '@l.x/sessions'
import type { Logger } from '@l.x/utils/src/logger/logger'
import { isWebApp } from '@l.x/utils/src/platform'
import { REQUEST_SOURCE } from '@l.x/utils/src/platform/requestSource'

function provideSessionService(ctx: {
  getBaseUrl: () => string
  getIsSessionServiceEnabled: () => boolean
  getLogger?: () => Logger
  /** Optional custom LXIdentifierService. If not provided, uses default localStorage-based service. */
  lxIdentifierService?: LXIdentifierService
}): SessionService {
  if (!ctx.getIsSessionServiceEnabled()) {
    return createNoopSessionService()
  }
  if (isWebApp) {
    return getWebAppSessionService(ctx)
  }
  return getExtensionSessionService(ctx)
}

/**
 * In production, web won't need an explicit session service since cookies are automatically handled by the backend+browser.
 *
 * For testing, we need this since SessionService is the only backend service that has CORS configured to handle the credentials header.
 *
 * When more services are added to the Entry Gateway, we can remove this and rely on those typical requests to instantiate the cookie.
 */
function getWebAppSessionService(ctx: {
  getBaseUrl: () => string
  getLogger?: () => Logger
  lxIdentifierService?: LXIdentifierService
}): SessionService {
  const sessionClient = createSessionClient({
    transport: getTransport({
      getBaseUrl: ctx.getBaseUrl,
      getHeaders: () => ({ 'x-request-source': REQUEST_SOURCE }),
      options: {
        credentials: 'include',
      },
    }),
  })

  const sessionRepository = createSessionRepository({ client: sessionClient, getLogger: ctx.getLogger })

  return createSessionService({
    sessionStorage: provideSessionStorage(),
    deviceIdService: provideDeviceIdService(),
    lxIdentifierService: ctx.lxIdentifierService ?? provideLXIdentifierService(),
    sessionRepository,
  })
}

function getExtensionSessionService(ctx: {
  getBaseUrl: () => string
  getLogger?: () => Logger
  lxIdentifierService?: LXIdentifierService
}): SessionService {
  const sessionClient = createSessionClient({
    transport: getTransport({
      getBaseUrl: ctx.getBaseUrl,
      getHeaders: () => ({ 'x-request-source': REQUEST_SOURCE }),
    }),
  })

  const sessionRepository = createSessionRepository({ client: sessionClient, getLogger: ctx.getLogger })

  return createSessionService({
    sessionStorage: provideSessionStorage(),
    deviceIdService: provideDeviceIdService(),
    lxIdentifierService: ctx.lxIdentifierService ?? provideLXIdentifierService(),
    sessionRepository,
  })
}

export { provideSessionService }
