import { memo, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { getCurrentPageFromLocation } from '~/utils/urlRoutes'

export const ResetPageScrollEffect = memo(function ResetPageScrollEffect() {
  const location = useLocation()
  const { pathname } = location
  const currentPage = getCurrentPageFromLocation(pathname)
  const [hasChangedOnce, setHasChangedOnce] = useState(false)

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run when currentPage is changed
=======
  // oxlint-disable-next-line react/exhaustive-deps -- Only run when currentPage is changed
>>>>>>> upstream/main
  useEffect(() => {
    if (!hasChangedOnce) {
      // avoid setting scroll to top on initial load
      setHasChangedOnce(true)
    } else {
      // URL may change without page changing (e.g. when switching chains), and we only want to reset scroll to top if the page changes
      window.scrollTo(0, 0)
    }
    // we don't want this to re-run on change of hasChangedOnce! or else it defeats the point of the fix
<<<<<<< HEAD
=======
    // oxlint-disable-next-line react/exhaustive-deps -- biome-parity: oxlint is stricter here
>>>>>>> upstream/main
  }, [currentPage])

  return null
})
