/** biome-ignore-all assist/source/organizeImports: we want to manually group exports by category */

/**
 * @luxexchange/sessions
 *
 * This is the ONLY public entry point for the Sessions package.
 * All exports must be explicitly listed here.
 * Deep imports are forbidden and will be blocked by ESLint.
 */

// Device ID
export { createDeviceIdService } from '@luxexchange/sessions/src/device-id/createDeviceIdService'
export type { DeviceIdService } from '@luxexchange/sessions/src/device-id/types'
// Lx Identifier
export { createLxIdentifierService } from '@luxexchange/sessions/src/lx-identifier/createLxIdentifierService'
export { lxIdentifierQuery } from '@luxexchange/sessions/src/lx-identifier/lxIdentifierQuery'
export type { LxIdentifierService } from '@luxexchange/sessions/src/lx-identifier/types'
// Session Repository
export { createSessionRepository } from '@luxexchange/sessions/src/session-repository/createSessionRepository'
export { ChallengeRejectedError } from '@luxexchange/sessions/src/session-repository/errors'
export { ChallengeFailureReason, VerifyFailureReason } from '@luxexchange/sessions/src/session-repository/types'
export type {
  SessionRepository,
  ChallengeTypeConfig,
  TypedChallengeData,
  TurnstileChallengeData,
  HashCashChallengeData,
  GitHubChallengeData,
} from '@luxexchange/sessions/src/session-repository/types'

// Session Service
export { createNoopSessionService } from '@luxexchange/sessions/src/session-service/createNoopSessionService'
export { createSessionService } from '@luxexchange/sessions/src/session-service/createSessionService'
export type {
  SessionService,
  InitSessionResponse,
  ChallengeRequest,
  ChallengeResponse,
  VerifySessionRequest,
  VerifySessionResponse,
} from '@luxexchange/sessions/src/session-service/types'

// Session Storage
export { createSessionStorage } from '@luxexchange/sessions/src/session-storage/createSessionStorage'
export type { SessionStorage, SessionState } from '@luxexchange/sessions/src/session-storage/types'

// Session Client
export { createSessionClient } from '@luxexchange/sessions/src/session-repository/createSessionClient'
export type { SessionServiceClient } from '@luxexchange/sessions/src/session-repository/createSessionClient'

// Session Initialization
export { createSessionInitializationService } from '@luxexchange/sessions/src/session-initialization/createSessionInitializationService'
export {
  SessionError,
  MaxChallengeRetriesError,
  NoSolverAvailableError,
} from '@luxexchange/sessions/src/session-initialization/sessionErrors'
export type {
  SessionInitializationService,
  SessionInitOptions,
  SessionInitResult,
  SessionInitAnalytics,
} from '@luxexchange/sessions/src/session-initialization/createSessionInitializationService'

// Challenge Solvers
export { createChallengeSolverService } from '@luxexchange/sessions/src/challenge-solvers/createChallengeSolverService'
export { createTurnstileMockSolver } from '@luxexchange/sessions/src/challenge-solvers/createTurnstileMockSolver'
export { createHashcashMockSolver } from '@luxexchange/sessions/src/challenge-solvers/createHashcashMockSolver'
export { createNoneMockSolver } from '@luxexchange/sessions/src/challenge-solvers/createNoneMockSolver'
export { createTurnstileSolver } from '@luxexchange/sessions/src/challenge-solvers/createTurnstileSolver'
export { createHashcashSolver } from '@luxexchange/sessions/src/challenge-solvers/createHashcashSolver'
export { createWorkerHashcashSolver } from '@luxexchange/sessions/src/challenge-solvers/hashcash/createWorkerHashcashSolver'
export {
  TurnstileScriptLoadError,
  TurnstileApiNotAvailableError,
  TurnstileTimeoutError,
  TurnstileError,
  TurnstileTokenExpiredError,
} from '@luxexchange/sessions/src/challenge-solvers/turnstileErrors'
export type {
  ChallengeSolver,
  ChallengeSolverService,
  ChallengeData,
  TurnstileScriptOptions,
} from '@luxexchange/sessions/src/challenge-solvers/types'
export type {
  CreateTurnstileSolverContext,
  TurnstileSolveAnalytics,
} from '@luxexchange/sessions/src/challenge-solvers/createTurnstileSolver'
export type {
  CreateHashcashWorkerChannelContext,
  HashcashWorkerChannel,
  HashcashWorkerChannelFactory,
} from '@luxexchange/sessions/src/challenge-solvers/hashcash/worker/types'
export { createHashcashWorkerChannel } from '@luxexchange/sessions/src/challenge-solvers/hashcash/worker/createHashcashWorkerChannel'
export { createHashcashMultiWorkerChannel } from '@luxexchange/sessions/src/challenge-solvers/hashcash/worker/createHashcashMultiWorkerChannel'
export type { MultiWorkerConfig } from '@luxexchange/sessions/src/challenge-solvers/hashcash/worker/createHashcashMultiWorkerChannel'
export type { CreateWorkerHashcashSolverContext } from '@luxexchange/sessions/src/challenge-solvers/hashcash/createWorkerHashcashSolver'
export type {
  CreateHashcashSolverContext,
  HashcashSolveAnalytics,
} from '@luxexchange/sessions/src/challenge-solvers/createHashcashSolver'

export { ChallengeType } from '@luxexchange/sessions/src/session-service/types'

// OAuth Service
export { createOAuthService } from '@luxexchange/sessions/src/oauth-service/createOAuthService'
export type { CreateOAuthServiceContext } from '@luxexchange/sessions/src/oauth-service/createOAuthService'
export type {
  OAuthService,
  OAuthInitiationResult,
  OAuthCallbackParams,
  OAuthVerificationResult,
  OAuthInitiateParams,
  OAuthVerifyParams,
  OAuthUserInfo,
} from '@luxexchange/sessions/src/oauth-service/types'

// Performance Tracking
export type { PerformanceTracker } from '@luxexchange/sessions/src/performance/types'
export {
  createPerformanceTracker,
  PERFORMANCE_TRACKING_DISABLED,
} from '@luxexchange/sessions/src/performance/createPerformanceTracker'
export type { CreatePerformanceTrackerContext } from '@luxexchange/sessions/src/performance/createPerformanceTracker'
export { createNoopPerformanceTracker } from '@luxexchange/sessions/src/performance/createNoopPerformanceTracker'

// Test utilities (for integration testing)
export {
  InMemorySessionStorage,
  InMemoryDeviceIdService,
  InMemoryLxIdentifierService,
} from '@luxexchange/sessions/src/test-utils'
export {
  createCookieJar,
  createLocalCookieTransport,
} from '@luxexchange/sessions/src/test-utils/createLocalCookieTransport'

export const luxIdentifierQuery = lxIdentifierQuery
