/** biome-ignore-all assist/source/organizeImports: we want to manually group exports by category */

/**
 * @l.x/sessions
 *
 * This is the ONLY public entry point for the Sessions package.
 * All exports must be explicitly listed here.
 * Deep imports are forbidden and will be blocked by ESLint.
 */

// Device ID
export { createDeviceIdService } from '@l.x/sessions/src/device-id/createDeviceIdService'
export type { DeviceIdService } from '@l.x/sessions/src/device-id/types'
// Lx Identifier
export { createLxIdentifierService } from '@l.x/sessions/src/lx-identifier/createLxIdentifierService'
export { lxIdentifierQuery } from '@l.x/sessions/src/lx-identifier/lxIdentifierQuery'
export type { LxIdentifierService } from '@l.x/sessions/src/lx-identifier/types'
// Session Repository
export { createSessionRepository } from '@l.x/sessions/src/session-repository/createSessionRepository'
export { ChallengeRejectedError } from '@l.x/sessions/src/session-repository/errors'
export { ChallengeFailureReason, VerifyFailureReason } from '@l.x/sessions/src/session-repository/types'
export type {
  SessionRepository,
  ChallengeTypeConfig,
  TypedChallengeData,
  TurnstileChallengeData,
  HashCashChallengeData,
  GitHubChallengeData,
} from '@l.x/sessions/src/session-repository/types'

// Session Service
export { createNoopSessionService } from '@l.x/sessions/src/session-service/createNoopSessionService'
export { createSessionService } from '@l.x/sessions/src/session-service/createSessionService'
export type {
  SessionService,
  InitSessionResponse,
  ChallengeRequest,
  ChallengeResponse,
  VerifySessionRequest,
  VerifySessionResponse,
} from '@l.x/sessions/src/session-service/types'

// Session Storage
export { createSessionStorage } from '@l.x/sessions/src/session-storage/createSessionStorage'
export type { SessionStorage, SessionState } from '@l.x/sessions/src/session-storage/types'

// Session Client
export { createSessionClient } from '@l.x/sessions/src/session-repository/createSessionClient'
export type { SessionServiceClient } from '@l.x/sessions/src/session-repository/createSessionClient'

// Session Initialization
export { createSessionInitializationService } from '@l.x/sessions/src/session-initialization/createSessionInitializationService'
export {
  SessionError,
  MaxChallengeRetriesError,
  NoSolverAvailableError,
} from '@l.x/sessions/src/session-initialization/sessionErrors'
export type {
  SessionInitializationService,
  SessionInitOptions,
  SessionInitResult,
  SessionInitAnalytics,
} from '@l.x/sessions/src/session-initialization/createSessionInitializationService'

// Challenge Solvers
export { createChallengeSolverService } from '@l.x/sessions/src/challenge-solvers/createChallengeSolverService'
export { createTurnstileMockSolver } from '@l.x/sessions/src/challenge-solvers/createTurnstileMockSolver'
export { createHashcashMockSolver } from '@l.x/sessions/src/challenge-solvers/createHashcashMockSolver'
export { createNoneMockSolver } from '@l.x/sessions/src/challenge-solvers/createNoneMockSolver'
export { createTurnstileSolver } from '@l.x/sessions/src/challenge-solvers/createTurnstileSolver'
export { createHashcashSolver } from '@l.x/sessions/src/challenge-solvers/createHashcashSolver'
export { createWorkerHashcashSolver } from '@l.x/sessions/src/challenge-solvers/hashcash/createWorkerHashcashSolver'
export {
  TurnstileScriptLoadError,
  TurnstileApiNotAvailableError,
  TurnstileTimeoutError,
  TurnstileError,
  TurnstileTokenExpiredError,
} from '@l.x/sessions/src/challenge-solvers/turnstileErrors'
export type {
  ChallengeSolver,
  ChallengeSolverService,
  ChallengeData,
  TurnstileScriptOptions,
} from '@l.x/sessions/src/challenge-solvers/types'
export type {
  CreateTurnstileSolverContext,
  TurnstileSolveAnalytics,
} from '@l.x/sessions/src/challenge-solvers/createTurnstileSolver'
export type {
  CreateHashcashWorkerChannelContext,
  HashcashWorkerChannel,
  HashcashWorkerChannelFactory,
} from '@l.x/sessions/src/challenge-solvers/hashcash/worker/types'
export { createHashcashWorkerChannel } from '@l.x/sessions/src/challenge-solvers/hashcash/worker/createHashcashWorkerChannel'
export { createHashcashMultiWorkerChannel } from '@l.x/sessions/src/challenge-solvers/hashcash/worker/createHashcashMultiWorkerChannel'
export type { MultiWorkerConfig } from '@l.x/sessions/src/challenge-solvers/hashcash/worker/createHashcashMultiWorkerChannel'
export type { CreateWorkerHashcashSolverContext } from '@l.x/sessions/src/challenge-solvers/hashcash/createWorkerHashcashSolver'
export type {
  CreateHashcashSolverContext,
  HashcashSolveAnalytics,
} from '@l.x/sessions/src/challenge-solvers/createHashcashSolver'

export { ChallengeType } from '@l.x/sessions/src/session-service/types'

// OAuth Service
export { createOAuthService } from '@l.x/sessions/src/oauth-service/createOAuthService'
export type { CreateOAuthServiceContext } from '@l.x/sessions/src/oauth-service/createOAuthService'
export type {
  OAuthService,
  OAuthInitiationResult,
  OAuthCallbackParams,
  OAuthVerificationResult,
  OAuthInitiateParams,
  OAuthVerifyParams,
  OAuthUserInfo,
} from '@l.x/sessions/src/oauth-service/types'

// Performance Tracking
export type { PerformanceTracker } from '@l.x/sessions/src/performance/types'
export {
  createPerformanceTracker,
  PERFORMANCE_TRACKING_DISABLED,
} from '@l.x/sessions/src/performance/createPerformanceTracker'
export type { CreatePerformanceTrackerContext } from '@l.x/sessions/src/performance/createPerformanceTracker'
export { createNoopPerformanceTracker } from '@l.x/sessions/src/performance/createNoopPerformanceTracker'

// Test utilities (for integration testing)
export {
  InMemorySessionStorage,
  InMemoryDeviceIdService,
  InMemoryLxIdentifierService,
} from '@l.x/sessions/src/test-utils'
export {
  createCookieJar,
  createLocalCookieTransport,
} from '@l.x/sessions/src/test-utils/createLocalCookieTransport'

export const luxIdentifierQuery = lxIdentifierQuery
