import { render } from '@testing-library/react'
import OnboardingApp from 'src/app/core/OnboardingApp'
import { initializeReduxStore } from 'src/store/store'

<<<<<<< HEAD
jest.mock('wallet/src/features/transactions/contexts/WalletLuxContext', () => ({
  WalletLuxProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe('OnboardingApp', () => {
  // eslint-disable-next-line jest/expect-expect
=======
jest.mock('wallet/src/features/transactions/contexts/WalletUniswapContext', () => ({
  WalletUniswapProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe('OnboardingApp', () => {
  // oxlint-disable-next-line jest/expect-expect
>>>>>>> upstream/main
  it('renders without error', async () => {
    initializeReduxStore()
    render(<OnboardingApp />)
  })
})
