import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { setHasShownMismatchToast } from '@l.x/lx/src/features/behaviorHistory/slice'
import { isExtensionApp } from '@l.x/utils/src/platform'
import { useEvent } from '@l.x/utils/src/react/hooks'
import { useAccountEffect } from 'wagmi'

export function useOnDisconnectEffectWeb(): void {
  const dispatch = useDispatch()

  const handleResetToastState = useEvent(() => {
    dispatch(setHasShownMismatchToast(false))
  })

  const value = useMemo(() => {
    return {
      onConnect: handleResetToastState,
      onDisconnect: handleResetToastState,
    }
  }, [handleResetToastState])

  useAccountEffect(value)
}

// the extension doesn't have access to wagmi, so we need to use a noop effect
export const useOnDisconnectEffect = !isExtensionApp ? useOnDisconnectEffectWeb : (): void => {}
