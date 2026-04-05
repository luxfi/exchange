import { useDispatch } from 'react-redux'
import { dismissSplashScreen } from 'src/features/splashScreen/splashScreenSlice'
<<<<<<< HEAD
import { useEvent } from '@l.x/utils/src/react/hooks'
=======
import { useEvent } from 'utilities/src/react/hooks'
>>>>>>> upstream/main

/**
 * Custom wrapped function to hide the splash screen.
 * We need this so that we can hide any errors that may occur (e.g. unhandled promise rejection when FaceID is unlocking)
 */
export function useHideSplashScreen(): () => void {
  const dispatch = useDispatch()

  return useEvent(() => {
    dispatch(dismissSplashScreen())
  })
}
