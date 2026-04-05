import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiometricAuthenticationStatus } from 'src/features/biometrics/biometrics-utils'
import {
  selectAuthenticationStatus,
  selectDeviceSupportsBiometrics,
<<<<<<< HEAD
=======
  selectIsBiometricsDisabledInOSSettings,
>>>>>>> upstream/main
  setAuthenticationStatus as setAuthenticationStatusAction,
} from 'src/features/biometrics/biometricsSlice'

interface UseBiometricsStateResult {
  authenticationStatus: BiometricAuthenticationStatus
  setAuthenticationStatus: (value: BiometricAuthenticationStatus) => void
  deviceSupportsBiometrics: boolean | undefined
<<<<<<< HEAD
=======
  isBiometricsDisabledInOSSettings: boolean | undefined
>>>>>>> upstream/main
}

export function useBiometricsState(): UseBiometricsStateResult {
  const dispatch = useDispatch()
  const authenticationStatus = useSelector(selectAuthenticationStatus)
  const deviceSupportsBiometrics = useSelector(selectDeviceSupportsBiometrics)
<<<<<<< HEAD
=======
  const isBiometricsDisabledInOSSettings = useSelector(selectIsBiometricsDisabledInOSSettings)
>>>>>>> upstream/main

  const setAuthenticationStatus = useCallback(
    (value: BiometricAuthenticationStatus): void => {
      dispatch(setAuthenticationStatusAction(value))
    },
    [dispatch],
  )

  return {
    authenticationStatus,
    setAuthenticationStatus,
    deviceSupportsBiometrics,
<<<<<<< HEAD
=======
    isBiometricsDisabledInOSSettings,
>>>>>>> upstream/main
  }
}
