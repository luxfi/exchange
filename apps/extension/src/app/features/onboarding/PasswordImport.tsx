import { useCallback, useEffect } from 'react'
import { useOnboardingSteps } from 'src/app/features/onboarding/OnboardingSteps'
import { Password } from 'src/app/features/onboarding/Password'
<<<<<<< HEAD
import { ExtensionOnboardingFlow } from '@l.x/lx/src/types/screens/extension'
import { logger } from '@l.x/utils/src/logger/logger'
import { useOnboardingContext } from '@luxfi/wallet/src/features/onboarding/OnboardingContext'
import { validateMnemonic } from '@luxfi/wallet/src/utils/mnemonics'
=======
import { ExtensionOnboardingFlow } from 'uniswap/src/types/screens/extension'
import { logger } from 'utilities/src/logger/logger'
import { useOnboardingContext } from 'wallet/src/features/onboarding/OnboardingContext'
import { validateMnemonic } from 'wallet/src/utils/mnemonics'
>>>>>>> upstream/main

export function PasswordImport({
  flow,
  allowBack = true,
}: {
  flow: ExtensionOnboardingFlow
  allowBack?: boolean
}): JSX.Element {
  const { goToNextStep, goToPreviousStep } = useOnboardingSteps()

  const { getOnboardingAccountMnemonicString, generateInitialAddresses, importMnemonicToKeychain } =
    useOnboardingContext()
  const mnemonicString = getOnboardingAccountMnemonicString()

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run once on component mount to generate addresses
=======
  // oxlint-disable-next-line react/exhaustive-deps -- Only run once on component mount to generate addresses
>>>>>>> upstream/main
  useEffect(() => {
    generateInitialAddresses().catch((error) => {
      logger.error(error, {
        tags: { file: 'PasswordImport.tsx', function: 'generateInitialAddresses' },
      })
    })
<<<<<<< HEAD
=======
    // oxlint-disable-next-line react/exhaustive-deps -- biome-parity: oxlint is stricter here
>>>>>>> upstream/main
  }, [])

  const onSubmit = useCallback(
    async (password: string) => {
      const { validMnemonic } = validateMnemonic(mnemonicString)

      if (!validMnemonic) {
        throw new Error('Mnemonic are invalid on PasswordImport screen')
      }

      goToNextStep()
      await importMnemonicToKeychain({ mnemonic: validMnemonic, password, allowOverwrite: true })
    },
    [mnemonicString, goToNextStep, importMnemonicToKeychain],
  )

  return <Password flow={flow} onBack={allowBack ? goToPreviousStep : undefined} onComplete={onSubmit} />
}
