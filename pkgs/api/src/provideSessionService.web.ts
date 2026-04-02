import { provideDeviceIdService } from '@luxexchange/api/src/provideDeviceIdService'
import { provideSessionStorage } from '@luxexchange/api/src/provideSessionStorage'
import { provideLxIdentifierService } from '@luxexchange/api/src/provideLxIdentifierService'
import { getTransport } from '@luxexchange/api/src/transport'
import {
  createNoopSessionService,
  createSessionClient,
  createSessionRepository,
  createSessionService,
  type SessionService,
  type LxIdentifierService,
} from '@luxexchange/sessions'
import type { Logger } from 'utilities/src/logger/logger'
import { isWebApp } from 'utilities/src/platform'
import { REQUEST_SOURCE } from 'utilities/src/platform/requestSource'

function provideSessionService(ctx: {
  getBaseUrl: () => string
  getIsSessionServiceEnabled: () => boolean
  getLogger?: () => Logger
  /** Optional custom LxIdentifierService. If not provided, uses default localStorage-based service. */
  lxIdentifierService?: LxIdentifierService
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
  lxIdentifierService?: LxIdentifierService
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
    lxIdentifierService: ctx.lxIdentifierService ?? provideLxIdentifierService(),
    sessionRepository,
  })
}

function getExtensionSessionService(ctx: {
  getBaseUrl: () => string
  getLogger?: () => Logger
  lxIdentifierService?: LxIdentifierService
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
    lxIdentifierService: ctx.lxIdentifierService ?? provideLxIdentifierService(),
    sessionRepository,
  })
}

export { provideSessionService }
