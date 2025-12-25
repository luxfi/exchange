import { WARNING_LEVEL } from 'constants/tokenSafety'
import { renderHook } from 'test-utils'
import { darkTheme } from 'theme/colors'

import { useTokenWarningColor, useTokenWarningTextColor } from './useTokenWarningColor'

describe('Token Warning Colors', () => {
  describe('useTokenWarningColor', () => {
    it('medium', () => {
      const { result } = renderHook(() => useTokenWarningColor(WARNING_LEVEL.MEDIUM))
      expect(result.current).toEqual(darkTheme.accentWarningSoft)
    })

    it('strong', () => {
      const { result } = renderHook(() => useTokenWarningColor(WARNING_LEVEL.UNKNOWN))
      expect(result.current).toEqual(darkTheme.accentFailureSoft)
    })

    it('blocked', () => {
      const { result } = renderHook(() => useTokenWarningColor(WARNING_LEVEL.BLOCKED))
      expect(result.current).toEqual(darkTheme.backgroundFloating)
    })
  })

  describe('useTokenWarningTextColor', () => {
    it('medium', () => {
      const { result } = renderHook(() => useTokenWarningTextColor(WARNING_LEVEL.MEDIUM))
      expect(result.current).toEqual(darkTheme.accentWarning)
    })

    it('strong', () => {
      const { result } = renderHook(() => useTokenWarningTextColor(WARNING_LEVEL.UNKNOWN))
      expect(result.current).toEqual(darkTheme.accentFailure)
    })

    it('blocked', () => {
      const { result } = renderHook(() => useTokenWarningTextColor(WARNING_LEVEL.BLOCKED))
      expect(result.current).toEqual(darkTheme.textSecondary)
    })
  })
})
