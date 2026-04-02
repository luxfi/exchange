import type { ChallengeData, ChallengeSolver } from '@l.x/sessions/src/challenge-solvers/types'

function createNoneMockSolver(): ChallengeSolver {
  async function solve(_challengeData: ChallengeData): Promise<string> {
    return ''
  }

  return { solve }
}

export { createNoneMockSolver }
