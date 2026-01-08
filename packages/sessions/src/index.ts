/** biome-ignore-all assist/source/organizeImports: we want to manually group exports by category */

/**
 * @luxfi/sessions
 *
 * This is the ONLY public entry point for the Sessions package.
 * All exports must be explicitly listed here.
 * Deep imports are forbidden and will be blocked by ESLint.
 */

// Device ID
export { createDeviceIdService } from '@luxfi/sessions/src/device-id/createDeviceIdService'
export type { DeviceIdService } from '@luxfi/sessions/src/device-id/types'
// Uniswap Identifier
export { createUniswapIdentifierService } from '@luxfi/sessions/src/uniswap-identifier/createUniswapIdentifierService'
export type { UniswapIdentifierService } from '@luxfi/sessions/src/uniswap-identifier/types'
// Session Repository
export { createSessionRepository } from '@luxfi/sessions/src/session-repository/createSessionRepository'
export type { SessionRepository } from '@luxfi/sessions/src/session-repository/types'

// Session Service
export { createNoopSessionService } from '@luxfi/sessions/src/session-service/createNoopSessionService'
export { createSessionService } from '@luxfi/sessions/src/session-service/createSessionService'
export type {
  SessionService,
  InitSessionResponse,
  ChallengeResponse,
  UpgradeSessionRequest,
  UpgradeSessionResponse,
} from '@luxfi/sessions/src/session-service/types'

// Session Storage
export { createSessionStorage } from '@luxfi/sessions/src/session-storage/createSessionStorage'
export type { SessionStorage, SessionState } from '@luxfi/sessions/src/session-storage/types'

// Session Client
export { createSessionClient } from '@luxfi/sessions/src/session-repository/createSessionClient'
export type { SessionServiceClient } from '@luxfi/sessions/src/session-repository/createSessionClient'

// Session Initialization
export { createSessionInitializationService } from '@luxfi/sessions/src/session-initialization/createSessionInitializationService'
export {
  SessionError,
  MaxChallengeRetriesError,
  NoSolverAvailableError,
} from '@luxfi/sessions/src/session-initialization/sessionErrors'
export type {
  SessionInitializationService,
  SessionInitResult,
} from '@luxfi/sessions/src/session-initialization/createSessionInitializationService'

// Challenge Solvers
export { createChallengeSolverService } from '@luxfi/sessions/src/challenge-solvers/createChallengeSolverService'
export { createTurnstileMockSolver } from '@luxfi/sessions/src/challenge-solvers/createTurnstileMockSolver'
export { createHashcashMockSolver } from '@luxfi/sessions/src/challenge-solvers/createHashcashMockSolver'
export { createNoneMockSolver } from '@luxfi/sessions/src/challenge-solvers/createNoneMockSolver'
export { createTurnstileSolver } from '@luxfi/sessions/src/challenge-solvers/createTurnstileSolver'
export { createHashcashSolver } from '@luxfi/sessions/src/challenge-solvers/createHashcashSolver'
export type {
  ChallengeSolver,
  ChallengeSolverService,
  ChallengeData,
} from '@luxfi/sessions/src/challenge-solvers/types'

export { ChallengeType } from '@luxfi/sessions/src/session-service/types'
