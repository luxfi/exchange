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
} from '@luxexchange/sessions'
import type { Logger } from 'utilities/src/logger/logger'
import { REQUEST_SOURCE } from 'utilities/src/platform/requestSource'

function provideSessionService(ctx: {
  getBaseUrl: () => string
  getIsSessionServiceEnabled: () => boolean
  getLogger?: () => Logger
}): SessionService {
  if (!ctx.getIsSessionServiceEnabled()) {
    return createNoopSessionService()
  }
  return getMobileSessionService(ctx)
}

function getMobileSessionService(ctx: { getBaseUrl: () => string; getLogger?: () => Logger }): SessionService {
  const sessionClient = createSessionClient({
    transport: getTransport({
      getBaseUrl: ctx.getBaseUrl,
      getHeaders: () => ({ 'x-request-source': REQUEST_SOURCE }),
    }),
  })

  const sessionStorage = provideSessionStorage()
  const deviceIdService = provideDeviceIdService()
  const lxIdentifierService = provideLxIdentifierService()
  const sessionRepository = createSessionRepository({ client: sessionClient, getLogger: ctx.getLogger })
  return createSessionService({
    sessionStorage,
    deviceIdService,
    lxIdentifierService,
    sessionRepository,
  })
}

export { provideSessionService }
