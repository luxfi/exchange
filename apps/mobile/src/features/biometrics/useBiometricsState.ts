import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiometricAuthenticationStatus } from 'src/features/biometrics/biometrics-utils'
import {
  selectAuthenticationStatus,
  selectDeviceSupportsBiometrics,
  isBiometricsDisabledInOSSettings: boolean | undefined
}

export function useBiometricsState(): UseBiometricsStateResult {
  const dispatch = useDispatch()
  const authenticationStatus = useSelector(selectAuthenticationStatus)
  const deviceSupportsBiometrics = useSelector(selectDeviceSupportsBiometrics)
    isBiometricsDisabledInOSSettings,
  }
}
