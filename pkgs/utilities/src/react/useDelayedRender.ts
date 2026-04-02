import { useState } from 'react'
import { useEvent } from '@l.x/utils/src/react/hooks'
import { useTimeout } from '@l.x/utils/src/time/timing'

export function useDelayedRender(delay: number): { isContentHidden: boolean } {
  const [isContentHidden, setIsContentHidden] = useState(true)
  const setVisible = useEvent(() => setIsContentHidden(false))
  useTimeout(setVisible, delay)

  return { isContentHidden }
}
