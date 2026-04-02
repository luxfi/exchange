import type { DeviceIdService } from '@l.x/sessions/src/device-id/types'
import type { SessionRepository } from '@l.x/sessions/src/session-repository/types'
import type {
  ChallengeRequest,
  ChallengeResponse,
  InitSessionResponse,
  SessionService,
  VerifySessionRequest,
  VerifySessionResponse,
} from '@l.x/sessions/src/session-service/types'
import type { SessionStorage } from '@l.x/sessions/src/session-storage/types'
import type { LxIdentifierService } from '@l.x/sessions/src/lx-identifier/types'

/**
 * Creates a Session Service instance.
 * Orchestrates usage of the Session Repository (remote) and Session Storage (local).
 */
export function createSessionService(ctx: {
  sessionStorage: SessionStorage
  deviceIdService: DeviceIdService
  lxIdentifierService: LxIdentifierService
  sessionRepository: SessionRepository
}): SessionService {
  async function initSession(): Promise<InitSessionResponse> {
    const result = await ctx.sessionRepository.initSession()
    if (result.sessionId) {
      await ctx.sessionStorage.set({ sessionId: result.sessionId })
    }
    if (result.deviceId) {
      await ctx.deviceIdService.setDeviceId(result.deviceId)
    }
    if (result.extra['lxIdentifier']) {
      await ctx.lxIdentifierService.setLxIdentifier(result.extra['lxIdentifier'])
    }
    return result
  }

  async function requestChallenge(request?: ChallengeRequest): Promise<ChallengeResponse> {
    return ctx.sessionRepository.challenge(request ?? {})
  }

  async function verifySession(input: VerifySessionRequest): Promise<VerifySessionResponse> {
    return ctx.sessionRepository.verifySession(input)
  }

  async function removeSession(): Promise<void> {
    await ctx.sessionStorage.clear()
  }

  async function getSessionState(): Promise<{ sessionId: string } | null> {
    return ctx.sessionStorage.get()
  }

  return {
    initSession,
    requestChallenge,
    verifySession,
    removeSession,
    getSessionState,
  }
}
